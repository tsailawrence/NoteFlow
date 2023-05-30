/* eslint-disable no-await-in-loop */
/* eslint-disable no-lonely-if */
/* eslint-disable import/no-extraneous-dependencies */
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import json1 from 'ot-json1';
import sharedb from '../../sharedb.js';
import { getMongoClient } from '../../mongoClient.js';
import FlowList from './FlowList.js';
import Flows from './Flows.js';

class Flow {
  constructor(
    flowId,
    flowName,
    owner,
    colaborators = null,
    thumbnail = '',
    nodes = [],
    edges = [],
  ) {
    // if(content instanceof ...) throw NotContentError...;
    this.id = flowId;
    this.name = flowName;
    this.thumbnail = thumbnail;
    this.owner = owner;
    this.nodes = nodes;
    this.edges = edges;
    this.colaborators = Array.isArray(colaborators)
      ? colaborators
      : [this.owner];

    if (!this.name || !this.name === '') {
      this.name = 'Untitled';
    }
  }

  // 會順便連 flow preview 也一起存起來

  async newify() {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('flows');

    const is = await collection.findOneAndUpdate(
      {
        user: this.owner,
      },
      {
        $addToSet: {
          flows: _.omit({ ...this, updateAt: Date.now() }, [
            'owner',
            'edges',
            'nodes',
          ]),
        },
      },
    );
    if (!is.lastErrorObject.updatedExisting) {
      await Flows.genFlowsProfile(this.owner);
      await collection.findOneAndUpdate(
        {
          user: this.owner,
        },
        {
          $addToSet: {
            flows: _.omit({ ...this, updateAt: Date.now() }, [
              'owner',
              'edges',
              'nodes',
            ]),
          },
        },
      );
    }

    const flowList = new FlowList(this.owner);
    await flowList.addSomebodyToFlowList(this.owner, this.id);
    await this.newify_sharedb();
  }

  async newify_sharedb() {
    const connection = sharedb.connect();
    const doc = connection.get('flow-sharedb', this.id);
    doc.fetch((err) => {
      if (err) throw err;
      if (doc.type === null) {
        doc.create({ nodes: {}, edges: {}, name: 'Undefined' }, json1.type.uri);
      }
    });
  }

  static async CanUserEdit(flowId, owner, target) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('flows');
    const resolved = await collection
      .aggregate([
        { $match: { user: owner } },
        { $limit: 1 },
        { $unwind: '$flows' },
        { $match: { 'flows.id': flowId } },
      ])
      .toArray();

    return resolved && resolved[0]
      ? resolved[0].flows.colaborators.includes(target)
      : false;
  }

  static async generateFlowId(owner) {
    const mongoClient = getMongoClient();

    let resolved = false;
    let newUuid;
    while (!resolved) {
      newUuid = `${owner}-flow-${uuidv4()}`;

      const database = mongoClient.db('noteflow');
      const collection = database.collection('flows');

      const result = await collection.findOne({
        user: owner,
        flows: { $elemMatch: { flowId: newUuid } },
      });
      if (!result) {
        resolved = true;
      }
    }

    return newUuid;
  }

  static async refreshColabs(flowId, add = [], remove = []) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('flows');

    const owner = flowId.split('-')[0];
    if (add.length !== 0) {
      await collection.findOneAndUpdate(
        {
          user: owner,
          'flows.id': flowId,
        },
        {
          $addToSet: { 'flows.$.colaborators': { $each: add } },
        },
      );
    }

    await collection.findOneAndUpdate(
      {
        user: owner,
        'flows.id': flowId,
      },
      {
        $pull: { 'flows.$.colaborators': { $in: remove } },
      },
    );
  }
}

export default Flow;
