/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
// import Node from './Node.js';
import { getMongoClient } from '../../mongoClient.js';

class Library {
  constructor() {}

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

  static async fetchNodes(user) {
    const mongoClient = getMongoClient();
    // 不需要 try：有問題 controller 層會 catch

    const database = mongoClient.db('noteflow');
    let collection = database.collection('library');

    let result = await collection.findOne({ user });

    if (!result) {
      await Library.genLibraryProfile(user);
      return [];
    }

    const requestMapper = {};
    result.nodes.forEach((element) => {
      const owner = element.id.split('-')[0];
      if (!(owner in requestMapper)) {
        requestMapper[owner] = [];
      }
      requestMapper[owner].push(element.id);
    });

    collection = database.collection('nodeRepository');

    result = [];
    for (const key of Object.keys(requestMapper)) {
      const resolved = await collection
        .aggregate([
          { $match: { user: key } },
          { $limit: 1 },
          { $unwind: '$nodes' },
          { $match: { 'nodes.id': { $in: requestMapper[key] } } },
          { $replaceRoot: { newRoot: '$nodes' } },
        ])
        .toArray();
      result = result.concat(resolved);
    }

    return result;
  }

  static async isFavorite(user, nodeId) {
    const mongoClient = getMongoClient();
    // 不需要 try：有問題 controller 層會 catch

    const database = mongoClient.db('noteflow');
    const collection = database.collection('library');

    // 先拿到 { userId: ..., nodes: ...}
    const result = await collection.findOne({ user, 'nodes.id': nodeId });

    return !!result;
  }

  static async addNode(id, email) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('library');

    const result = await collection.findOneAndUpdate(
      {
        user: email,
      },
      {
        $addToSet: { nodes: { id, addTime: Date.now() } },
      },
    );

    return result.lastErrorObject.updatedExisting;
  }

  static async removeNode(id, email) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('library');

    const res = await collection.findOneAndUpdate(
      { user: email },
      { $pull: { nodes: { id } } },
    );

    return res.lastErrorObject.updatedExisting;
  }
}

export default Library;
