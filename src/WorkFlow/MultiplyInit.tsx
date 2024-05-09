import { Connection, Position } from "reactflow";
import CustomHandle from "./CustomHandle";
import { useState } from "react";
import '../defaultStyle.css';

export default function MultiplyInit({ id, data, isConnectable }) {

    const [GlobalMessageObj] = useState(data.GlobalMessageObj);

    const onConnectionChanges = (connection: Connection) => {
        GlobalMessageObj.ConnectionMade(connection.source, connection.target);
    }

    return (
        <div className="compBoxTop">
            <div className="compBoxMiddle">
                <div className="compBoxLabel">
                    x Multiply
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
