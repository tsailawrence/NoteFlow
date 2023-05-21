import { MarkerType } from 'reactflow';

export const nodes = [
  {
    id: '1',
    type: 'input',
    data: {
      label: 'Note 1',
    },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: {
      label: 'Note 2',
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    type: 'output',
    data: {
      label: 'Note 3',
    },
    position: { x: 400, y: 100 },
  },
];

export const edges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3', animated: true },
];
