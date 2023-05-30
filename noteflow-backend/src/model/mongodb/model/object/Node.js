import sharedb from '../../sharedb.js';
import { getMongoClient } from '../../mongoClient.js';

class Node {
  constructor(id, type, owner, colaborators) {
    this.id = id;
    this.name = 'Untitled';
    this.type = type;
    this.owner = owner;
    this.colaborators = Array.isArray(colaborators)
      ? colaborators
      : [this.owner];
    this.updateAt = Date.now();
  }

  addEditor() {
    const connection = sharedb.connect();
    const doc = connection.get('editor', this.id);
    doc.fetch((err) => {
      if (err) throw err;
      if (doc.type === null) {
        doc.create([{ insert: '' }], 'rich-text');
      }
    });
  }

  static async CanUserEdit(nodeId, owner, target) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('nodeRepository');

    const resolved = await collection
      .aggregate([
        { $match: { user: owner } },
        { $limit: 1 },
        { $unwind: '$nodes' },
        { $match: { 'nodes.id': nodeId } },
      ])
      .toArray();

    return resolved && resolved[0]
      ? resolved[0].nodes.colaborators.includes(target)
      : false;
  }

  static async fetchColaborators(owner, nodeId) {
    const mongoClient = getMongoClient();

    const database = mongoClient.db('noteflow');
    const collection = database.collection('nodeRepository');

    const resolved = await collection
      .aggregate([
        { $match: { user: owner } },
        { $limit: 1 },
        { $unwind: '$nodes' },
        { $match: { 'nodes.id': { $eq: nodeId } } },
        { $replaceRoot: { newRoot: '$nodes' } },
      ])
      .toArray();

    console.log(resolved);

    return resolved[0].colaborators;
  }
}

export default Node;
