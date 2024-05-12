import ReactFlow, {
    addEdge,
    Background,
    Connection,
    Controls,
    Edge,
    MiniMap,
    Node,
    ReactFlowInstance,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCallback, useRef, useState } from 'react';
import { initialEdges, initialNodes } from "./Workflow.constants";
import AdditionInit from "./AdditionInit";
import SubtractInit from "./SubtractInit"
import MultiplyInit from "./MultiplyInit"
import DivideInit from "./DivideInit";
import OutputInit from "./OutputInit";
import InputNode from "./InputNode"
import CustomEdge from "./CustomEdge";
import MessageBroadCast from "../Interface/MessagingInterface";

import Sidebar from './Sidebar';
import { Box } from "@chakra-ui/react";
import '../defaultStyle.css';

const nodeTypes = {
    additionInit: AdditionInit,
    subtractInit: SubtractInit,
    multiplyInit: MultiplyInit,
    divideInit: DivideInit,
    outputInit: OutputInit,
    inputNode: InputNode,
};

const edgeTypes = {
    customEdge: CustomEdge,
};

const getNodeId = () => `${String(+new Date()).slice(6)}`;
const getChildLastUpdated = () => `${String(+new Date())}`;
const getMessageBroadCast = () => (new MessageBroadCast());

let count = 0;

export const Workflow = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const onConnect = useCallback(
        (connection: Connection) => {
            const edge = {
                ...connection,
                animated: true,
                id: getNodeId(),
                type: "customEdge",
                con: connection,
            };
            setEdges((prevEdges) => addEdge(edge, prevEdges));
        },
        [edges]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
            // and you don't need to subtract the reactFlowBounds.left/top anymore
            // details: https://reactflow.dev/whats-new/2023-11-10
            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            let id = getNodeId();
            let messanger = getMessageBroadCast();
            let childId = getChildLastUpdated();
            const newNode = {
                id: id,
                type,
                position,
                data: { value: 0, childId: null, childLastUpdated: childId, GlobalMessageObj: messanger, id: id },
            };
            newNode.data.GlobalMessageObj.addEventListener('connectionMade', (e: Event) => {
                if (isCustomEvent(e)) {
                    if (!isEditingChild) {
                        isEditingChild = true;
                        //Update parent node for Addition, Multiplication, Divition and subtraction
                        onEditNodeChild(e.detail.targetId, e.detail.sourceId);
                        console.log("ConnectionChanged" + JSON.stringify(e));
                        console.log("Target Id: " + e.detail.targetId + " Source id: " + e.detail.sourceId);
                        isEditingChild = false;
                    }
                }
            });

            if (type !== "outputInit") {
                newNode.data.GlobalMessageObj.addEventListener('myValueChanged', (e: Event) => {
                    if (isCustomEvent(e)) {
                        if (!isEditing) {
                            isEditing = true;
                            let node = getNode(e.detail.sourceId) as Node;
                            console.log("Node " + JSON.stringify(node));
                            onEdit(node.data.childId, node.id, e.detail.payload);
                            console.log("PayloadChanged" + node.data.childId + " " + node.id + " " + e.detail.payload);
                            isEditing = false;
                        }
                    }
                });
            }
            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance],
    );

    const onChange = useCallback((e) => {
        //setNodeValue(e.target.value);
        //console.log("Changed" + e.target.value);
    }, []);

    //Messaging Handle
    //====================================================================================
    let isEditing = false;
    let isEditingChild = false;

    const isCustomEvent = (event: Event): event is CustomEvent => {
        return 'detail' in event;
    };

    const getNode = (id: string): Node | null => {
        let n = null;
        let lastId = "";
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id && node.id !== lastId) {
                    n = node;
                    lastId = node.id;
                }
                return node;
            })
        );

        return n;
    }
    //=======================================================================================

    const onEditNodeChild = (targetid: string | null, sourceid: string | null) => {
        let lastId = "";
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === sourceid && node.id !== lastId) {
                    //Update child
                    node.data.childId = targetid;
                    node.data.childLastUpdated = getChildLastUpdated();
                    console.log("Child Id: " + targetid);
                    lastId = node.id;
                    Calc(targetid);
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    //node.data = { ...node.data, value: node.data.value, childId: node.data.childId, childLastUpdated: node.data.childLastUpdated, GlobalMessageObj: node.data.GlobalMessageObj, id: node.data.id };
                }
                return node;
            })
        );

        // if (lastId !== "") {
        //     Calc(targetid);
        // }
    }

    const onEdit = (targetid: string | null, sourceid: string | null, value: number): string => {
        let lastId = "-1";
        console.log("Edit called");
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === sourceid && node.id !== lastId) {
                    node.data.value = value;
                    lastId = node.id;
                    console.log("Value changed: " + value);
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    //node.data = { ...node.data, value: node.data.value, childId: node.data.childId, childLastUpdated: node.data.childLastUpdated, GlobalMessageObj: node.data.GlobalMessageObj, id: node.data.id };
                    lastId = node.id;
                    console.log("Calc called");
                    Calc(targetid);
                }
                return node;
            })
        );

        return lastId;
    };



    const Calc = (targetid: string | null) => {
        let lastId = "-1";
        let type = "";
        let child = "";
        setNodes((nds) =>
            nds.map((node) => {
                console.log("Looking for target: " + targetid + " found: " + node.id);
                if (node.id === targetid && node.id !== lastId) {
                    type = node.type as string;
                    child = node.data.childId;
                    lastId = node.id;
                    if (type === "additionInit") {
                        let val = SumValues(targetid);
                        GenerateOutPut(child, targetid, val)
                    }
                    if (type === "subtractInit") {
                        let val = SubtractValues(targetid);
                        GenerateOutPut(child, targetid, val)
                    }
                    if (type === "multiplyInit") {
                        let val = MultiplyValues(targetid);
                        GenerateOutPut(child, targetid, val)
                    }
                    if (type === "divideInit") {
                        let val = DivideValues(targetid);
                        GenerateOutPut(child, targetid, val)
                    }
                    console.log("Target found:  type: " + type + " child: " + child + " lastId: " + lastId);
                }
                return node;
            })
        );
    };

    const GenerateOutPut = (targetid: string | null, sourceid: string | null, value: number) => {
        console.log("Generating output target: " + targetid);
        let lastId = "";
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === targetid && node.id !== lastId) {
                    if (node.type === "outputInit") {
                        node.data.value = value;
                        node.data.GlobalMessageObj.GenerateOutput(sourceid, targetid, value);;
                        console.log("Output found");
                    }
                    lastId = node.id;
                }
                return node;
            })
        );
    };

    const SumValues = (addNodeId: string | null): number => {
        //Get all nodes whos child is the above id
        let total = 0;
        let lastId = "";
        getSortedNodes().forEach((node) => {
            if (node.data.childId === addNodeId && node.id !== lastId) {
                let val = parseFloat(node.data.value);
                if (!isNaN(val)) {
                    total = (total + val);
                    console.log("Value " + val + "Total: " + total);
                }
                lastId = node.id;
            }
        })

        return total;
    }

    const MultiplyValues = (addNodeId: string | null): number => {
        //Get all nodes whos child is the above id
        let total = 0;
        let lastId = "";
        let c = 0;
        getSortedNodes().forEach((node) => {
            if (node.data.childId === addNodeId && node.id !== lastId) {
                let val = parseFloat(node.data.value);
                if (!isNaN(val)) {
                    if (total === 0) {
                        total = val;
                    }
                    else {
                        total = total * val;
                    }
                }
                lastId = node.id;
            }
            c++;
        })
        if (c < 2) {
            total = 0;
        }
        return total;
    }

    const SubtractValues = (addNodeId: string | null): number => {
        //Get all nodes whos child is the above id
        let total = 0;
        let lastId = "";
        getSortedNodes().forEach((node) => {
            if (node.data.childId === addNodeId && node.id !== lastId) {
                let val = parseFloat(node.data.value);
                if (!isNaN(val)) {
                    if (total === 0) {
                        total = val;
                    }
                    else if (total > 0) {
                        total = total - val;
                    }
                }
                lastId = node.id;
            }
        })

        return total;
    }

    const DivideValues = (addNodeId: string | null): number => {
        //Get all nodes whos child is the above id
        let total = 0;
        let lastId = "";
        getSortedNodes().forEach((node) => {
            if (node.data.childId === addNodeId && node.id !== lastId) {
                let val = parseFloat(node.data.value);
                if (!isNaN(val)) {
                    if (total === 0) {
                        total = val;
                    }
                    else if (total > 0) {
                        total = total / val;
                    }
                }
                lastId = node.id;
            }
        })

        return total;
    }

    const getSortedNodes = (): Node[] => {
        let sorted = (reactFlowInstance as ReactFlowInstance).getNodes();
        sorted = sorted.sort((n1, n2) => {
            if (n1.data.childLastUpdated > n2.data.childLastUpdated) {
                return 1;
            }
            else {
                return -1;
            }
        })
        console.log("Sorted " + JSON.stringify(sorted));
        return sorted;
    }

    return (
        <div className="dndflow">
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <Box width="85%" height="700px">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onChange={onChange}
                            onConnect={onConnect}
                            nodeTypes={nodeTypes}
                            edgeTypes={edgeTypes}
                            onInit={setReactFlowInstance}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            fitView>
                            <Background />
                            <Controls />
                        </ReactFlow>
                    </Box>
                </div>
                <Sidebar />
            </ReactFlowProvider>
        </div>
    );
};

