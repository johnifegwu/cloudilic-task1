import { Edge, Node } from "reactflow";
import MessageBroadCast from "../Interface/MessagingInterface";

const getChildLastUpdated = () => `${String(+new Date())}`;

export const initialEdges: Edge[] = [];

export const initialNodes: Node[] = [];
// {
//     id: "1",
//     position: { x: 100, y: 100 },
//     data: { value: 0, childId: null, childLastUpdated: getChildLastUpdated, GlobalMessageObj: new MessageBroadCast(), id: 1 },
//     type: "additionInit",
// },
// {
//     id: "2",
//     data: { value: 0, childId: null, childLastUpdated: getChildLastUpdated, GlobalMessageObj: new MessageBroadCast(), id: 2 },
//     position: { x: 300, y: 20 },
//     type: "outputInit",
// },
// {
//     id: '3',
//     type: 'inputNode',
//     position: { x: 0, y: 0 },
//     data: { value: 0, childId: null, childLastUpdated: getChildLastUpdated, GlobalMessageObj: new MessageBroadCast(), id: 3 },
// }, {
//     id: '4',
//     type: 'inputNode',
//     position: { x: 3, y: 10 },
//     data: { value: 0, childId: null, childLastUpdated: getChildLastUpdated, GlobalMessageObj: new MessageBroadCast(), id: 4 },
// },
// {
//     id: "5",
//     data: { value: 0, childId: null, childLastUpdated: getChildLastUpdated, GlobalMessageObj: new MessageBroadCast(), id: 5 },
//     position: { x: 300, y: 20 },
//     type: "outputInit",
// },
// {
//     id: "6",
//     position: { x: 40, y: 40 },
//     data: { value: 0, childId: null, childLastUpdated: getChildLastUpdated, GlobalMessageObj: new MessageBroadCast(), id: 6 },
//     type: "multiplyInit",
// },
// {
//     id: "7",
//     position: { x: 50, y: 50 },
//     data: { value: 0, childId: null, childLastUpdated: getChildLastUpdated, GlobalMessageObj: new MessageBroadCast(), id: 7 },
//     type: "divideInit",
// },
// {
//     id: "8",
//     position: { x: 70, y: 60 },
//     data: { value: 0, childId: null, childLastUpdated: getChildLastUpdated, GlobalMessageObj: new MessageBroadCast(), id: 8 },
//     type: "subtractInit",
// },
// {
//     id: "9",
//     data: { value: 0, childId: null, childLastUpdated: getChildLastUpdated, GlobalMessageObj: new MessageBroadCast(), id: 9 },
//     position: { x: 310, y: 20 },
//     type: "inputNode",
// }];
