/* eslint-disable indent */
import { v4 as uuidv4 } from 'uuid';
import { getMongoClient } from '../../mongoClient.js';
import Node from './Node.js';

class NodeRepo {
  static async genNodeRepoProfile(userEmail) {
    const result = {
      user: userEmail,
      nodes: [],
    };

    const mongoClient = await getMongoClient().connect();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('nodeRepository');
    if (await collection.findOne({ user: result.user })) {
      return; // We have created for this user.
    }

    await collection.insertOne(result);
  }

  static async fetchNodes(user, nodeIds) {
    const mongoClient = getMongoClient();
    // 不需要 try：有問題 controller 層會 catch

    const database = mongoClient.db('noteflow');
    const collection = database.collection('nodeRepository');

    const result = await collection.findOne(
      {
        user,
      },
      nodeIds
        ? {
            projection: {
              nodes: {
                $elemMatch: { id: { $in: nodeIds } },
              },
            },
          }
        : {},
    );

    return result.nodes;
  }

  static async newNode(user) {
    /**
     * journey:
     *  1. In flow: create new node
     *  2. Get permission from here
     *  3. Produce a ref to the flow
     */
    const nodeId = await NodeRepo.generateNodeId(user);
    const node = new Node(nodeId, 'CustomNode', user);

    const mongoClient = getMongoClient();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('nodeRepository');

    const found = await collection.findOne({
      user,
    });
    if (!found) {
      NodeRepo.genNodeRepoProfile(user);
    }

    await collection.findOneAndUpdate(
      {
        user,
      },
      {
        $addToSet: { nodes: { ...node } },
      },
    );

    node.addEditor();

    return nodeId;
  }

  static async generateNodeId(user) {
    let resolved = false;
    let newUuid;
    const mongoClient = getMongoClient();

    while (!resolved) {
      newUuid = `${user}-node-${uuidv4()}`;

      const database = mongoClient.db('noteflow');
      const collection = database.collection('nodeRepository');
      // eslint-disable-next-line no-await-in-loop

      const result = await collection.findOne({
        user: user,
        nodes: { $elemMatch: { nodeId: newUuid } },
      });
      if (!result) {
        resolved = true;
      }
    }

    return newUuid;
  }

  static async refreshColabs(nodeId, add = [], remove = []) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('nodeRepository');

    const owner = nodeId.split('-')[0];
    if (add.length !== 0) {
      await collection.findOneAndUpdate(
        {
          user: owner,
          'nodes.id': nodeId,
        },
        {
          $addToSet: { 'nodes.$.colaborators': { $each: add } },
        },
      );
    }

    await collection.findOneAndUpdate(
      {
        user: owner,
        'nodes.id': nodeId,
      },
      {
        $pull: { 'nodes.$.colaborators': { $in: remove } },
      },
    );
  }

  static async setTitle(nodeId, newTitle) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('nodeRepository');

    const owner = nodeId.split('-')[0];

    const result = await collection.findOneAndUpdate(
      {
        user: owner,
        'nodes.id': nodeId,
      },
      {
        $set: { 'nodes.$.name': newTitle },
      },
    );

    return result.lastErrorObject.updatedExisting;
  }

  static async getTitle(nodeId) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('nodeRepository');

    const owner = nodeId.split('-')[0];
    const resolved = await collection
      .aggregate([
        { $match: { user: owner } },
        { $limit: 1 },
        { $unwind: '$nodes' },
        { $match: { 'nodes.id': nodeId } },
      ])
      .toArray();

    return resolved[0].nodes ? resolved[0].nodes.name : null;
  }
}

export default NodeRepo;
