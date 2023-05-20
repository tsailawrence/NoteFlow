// import Node from './Node.js';
import { getMongoClient } from '../../mongoClient.js';
import NodeRepo from './NodeRepo.js';

class Library {
  constructor(user) {
    this.user = user;
    this.nodes = [];
  }

  static async genLibraryProfile(email) {
    const result = {
      user: email,
      nodes: [],
    };

    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('library');

    if (await collection.findOne({ user: result.user })) {
      return; // We have created for this user.
    }
    await collection.insertOne(result);
  }

  async fetchNodes(query = { user: this.user }, options = {}) {
    const { user } = query;
    const mongoClient = getMongoClient();
    // 不需要 try：有問題 controller 層會 catch

    const database = mongoClient.db('noteflow');
    const collection = database.collection('library');

    // 先拿到 { userId: ..., nodes: ...}
    const result = await collection.findOne(query, options);

    const nodeRepo = new NodeRepo(user);
    await nodeRepo.fetchNodes();

    console.log(nodeRepo.nodes);
    console.log(result);

    this.nodes = new Array(result.nodes.length);
    result.nodes.forEach((element, index) => {
      this.nodes.push(element);
    });
  }

  static async addNode(id, email) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('library');

    await collection.findOneAndUpdate(
      {
        user: email,
      },
      {
        $addToSet: { nodes: { id } },
      },
    );
  }

  static async removeNode(id, email) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('library');

    await collection.findOneAndDelete({
      user: email,
      'nodes.id': id,
    });
  }
}

export default Library;
