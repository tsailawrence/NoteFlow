/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { getMongoClient } from '../../mongoClient.js';

class Flows {
  constructor() {}

  static async genFlowsProfile(userEmail) {
    const result = {
      user: userEmail,
      flows: [],
    };

    const mongoClient = getMongoClient();
    const database = mongoClient.db('noteflow');
    const collection = database.collection('flows');
    if (await collection.findOne({ user: result.user })) {
      return; // We have created for this user.
    }
    await collection.insertOne(result);
  }

  static async fetchFlowsByFlowList(flowList, page) {
    const requestMapper = {};
    flowList.forEach((element) => {
      if (!(element.owner in requestMapper)) {
        requestMapper[element.owner] = [];
      }
      requestMapper[element.owner].push(element.flowId);
    });

    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('flows');

    let result = [];
    for (const key of Object.keys(requestMapper)) {
      const resolved = await collection
        .aggregate([
          { $match: { user: key } },
          { $limit: 1 },
          { $unwind: '$flows' },
          { $match: { 'flows.id': { $in: requestMapper[key] } } },
          { $skip: 20 * page },
          { $limit: 20 },
          // 篩選
          {
            $project: {
              'flows.id': 1,
              'flows.name': 1,
              'flows.thumbnail': 1,
              'flows.updateAt': 1,
            },
          },
          { $replaceRoot: { newRoot: '$flows' } },
        ])
        .toArray();
      result = result.concat(resolved);
    }

    return result;
  }

  static async fetchColaborators(owner, flowId) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('flows');

    const resolved = await collection
      .aggregate([
        { $match: { user: owner } },
        { $limit: 1 },
        { $unwind: '$flows' },
        { $match: { 'flows.id': { $eq: flowId } } },
        { $replaceRoot: { newRoot: '$flows' } },
      ])
      .toArray();

    return resolved[0].colaborators;
  }

  static async setTitle(flowId, newTitle) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('flows');

    const owner = flowId.split('-')[0];

    const result = await collection.findOneAndUpdate(
      {
        user: owner,
        'flows.id': flowId,
      },
      {
        $set: { 'flows.$.name': newTitle },
      },
    );

    return result.lastErrorObject.updatedExisting;
  }

  static async getTitle(flowId) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('flows');

    const owner = flowId.split('-')[0];
    const resolved = await collection
      .aggregate([
        { $match: { user: owner } },
        { $limit: 1 },
        { $unwind: '$flows' },
        { $match: { 'flows.id': flowId } },
      ])
      .toArray();

    return resolved[0].flows ? resolved[0].flows.name : null;
  }

  static async deleteFlow(flowId) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('flows');

    const owner = flowId.split('-')[0];

    // const result = await collection.findOneAndDelete({
    //   user: owner,
    //   'flows.id': flowId,
    // });
    // console.log(result.lastErrorObject.updatedExisting);
    const result = await collection.updateOne(
      { user: owner },
      { $pull: { flows: { id: flowId } } },
    );
    // 搜集他的相關人士

    return result.modifiedCount;
  }
}

export default Flows;
