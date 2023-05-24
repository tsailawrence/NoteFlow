/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import mongoClient from '../mongoClient.js';

const owner = 'admin@gmail.com';
const nodeId = {
    n1: `${owner}-node-${uuidv4()}`,
    n2: `${owner}-node-${uuidv4()}`,
};
const flowId = `${owner}-flow-${uuidv4()}`;

const nodeRepoData = [
    // 裡面先放 node 就好
    {
        // 這是一個文件
        user: owner,
        nodes: [
            {
                nodeId: nodeId.n1,
                type: 'CustomNode',
                editor: {
                    title: 'Editor Title1',
                    content: 'Editor Content1',
                },
            },
            {
                nodeId: nodeId.n2,
                type: 'CustomNode',
                editor: {
                    title: 'Presentation for ikala 0424',
                    content: 'Model for popularity prediction: ...',
                },
            },
        ],
    },
];

const nodeRefData = [
    {
        nodeId: nodeId.n2,
        position: '',
        positionAbsolute: '',
        sourcePosition: '',
        targetPosition: '',
        width: 100,
        height: 50,
        style: '',
        data: {
            label: 'My Title',
            toolBarPosition: 'top',
        },
    },
];

const edgeData = [
    {
        edgeId: `${uuidv4()}`,
        source: nodeRefData[0],
        sourceHandle: 'left',
        target: nodeRefData[0],
        targetHandle: 'right',
        style: '',
    },
];

const flowData = [
    {
        user: owner,
        flows: [
            {
                flowId,
                flowName: 'template flow',
                src: 'https://th.bing.com/th/id/R.fec70e3ffdf97ad56fdeac8b5b2c45a1?rik=ANrSnQB%2bW5vsSw&pid=ImgRaw&r=0',
                owner,
                nodes: nodeRefData,
                edges: edgeData,
            },
        ],
    },
];

const flowListData = [
    {
        user: owner,
        flowList: {
            owner: [flowId],
        },
    },
];

async function seed() {
    try {
        const seeder = [
            ['nodeRepository', nodeRepoData],
            ['flows', flowData],
            ['flowList', flowListData],
        ];

        seeder.forEach(async (element) => {
            await mongoClient.connect();
            const database = mongoClient.db('noteflow');

            const [place, data] = element;
            console.log(`insert into collection ${place}...`);

            const collection = database.collection(place);

            const result = await collection.findOne({
                user: owner,
            });
            if (!result) {
                await collection.insertMany(data);
            }
            await mongoClient.close();
        });
    } catch (err) {
        console.log(err);
    } finally {
        console.log('種子都已經放入 mongodb 裡了！');
    }
}

await seed();
