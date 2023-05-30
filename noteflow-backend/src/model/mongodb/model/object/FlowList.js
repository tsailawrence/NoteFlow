/* eslint-disable no-lonely-if */
import { getMongoClient } from '../../mongoClient.js';

class FlowList {
  constructor(user) {
    this.user = user;
    this.flowList = [];
  }

  static async genFlowListProfile(userEmail) {
    const result = {
      user: userEmail,
      flowList: [],
    };

    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('flowList');
    if (await collection.findOne({ user: result.user })) {
      return; // We have created for this user.
    }
    await collection.insertOne(result);
  }

  static async fetchFlowList(user) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('flowList');

    const result = await collection.findOne({
      user
    });

    if (!result) {
      FlowList.genFlowListProfile(user);
      return [];
    }
    return result.flowList;
  }

  async addSomebodyToFlowList(userEmail, flowId) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('flowList');
    await collection.findOneAndUpdate(
      {
        user: userEmail,
      },
      {
        $addToSet: { flowList: { owner: this.user, flowId } },
      },
    );
  }

  // eslint-disable-next-line class-methods-use-this
  async removeSomebodyFromFlowList(userEmail, flowId) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('flowList');

    await collection.findOneAndUpdate(
      {
        user: userEmail,
      },
      {
        $pull: { flowList: { flowId: { $eq: flowId } } },
      },
    );
  }
}

export default FlowList;
