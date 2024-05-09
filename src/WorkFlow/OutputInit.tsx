import { useState } from "react";
import { Connection, Position } from "reactflow";
import CustomHandle from "./CustomHandle";
import MessageBroadCast from "../Interface/MessagingInterface";
import '../defaultStyle.css';

let ids: { [id: string]: { id: string, GlobalMessageObj: MessageBroadCast, isInit: boolean, nodeCount: number } } = {};

export default function OutputInit({ id, data, isConnectable }) {

    const [textChanged, setTextChanged] = useState(data.value);
    const [GlobalMessageObj] = useState(data.GlobalMessageObj);

    if (!ids[id]) {
        ids[id] = { id: id, GlobalMessageObj: data.GlobalMessageObj, isInit: false, nodeCount: 0 };
    }

    ids[id].nodeCount++;

    function isCustomEvent(event: Event): event is CustomEvent {
        return 'detail' in event;
    };

    //this function gets called 4 times before it is rendered.
    //I'm not sure why, could be TypScript issue.
    if (ids[id].nodeCount == 4) {
        GlobalMessageObj.addEventListener('generateOutput', (e: Event) => {
            if (isCustomEvent(e)) {
                setTextChanged(parseFloat(e.detail.payload));
                console.log("Output received" + e.detail.payload);
            }
        });
    }

    const onConnectionChanges = (connection: Connection) => {
        GlobalMessageObj.ConnectionMade(connection.source, connection.target);
    }

    return (
        <div className="compBoxTop">
            <div className="compBoxMiddle">
                <div className="compBoxLabel">
                    Output
                </div>
            </div>
            <div>
                <div className="compBoxValue">
                    {textChanged}
                </div>
            </div>
            <CustomHandle type="target" position={Position.Top}
                onConnect={(params) => {
                    console.log('handle onConnect', params);
                    onConnectionChanges(params);
                }}
                isConnectable={isConnectable} />
            <CustomHandle type="source" position={Position.Bottom}
                onConnect={(params) => {
                    console.log('handle onConnect', params);
                    onConnectionChanges(params);
                }}
                isConnectable={isConnectable} />
        </div>
    );
}
