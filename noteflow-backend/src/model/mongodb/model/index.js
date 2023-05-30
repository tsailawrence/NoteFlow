import Flows from './object/Flows.js';
import Flow from './object/Flow.js';
import Library from './object/Library.js';
import NodeRepo from './object/NodeRepo.js';
import Node from './object/Node.js';
import FlowList from './object/FlowList.js';

const createUserBucket = async (userEmail) => {
  await Library.genLibraryProfile(userEmail);
  await NodeRepo.genNodeRepoProfile(userEmail);
  await Flows.genFlowsProfile(userEmail);
  await FlowList.genFlowListProfile(userEmail);
};

export {
  Library,
  NodeRepo,
  Node,
  Flows,
  Flow,
  FlowList,
  createUserBucket,
};
