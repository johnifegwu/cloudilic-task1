import { Connection, Position } from "reactflow";
import CustomHandle from "./CustomHandle";
import { useState, useCallback } from "react";
import '../defaultStyle.css';

export default function InputNode({ id, data, isConnectable }) {
    const [textChanged, setTextChanged] = useState("");
    const [myID] = useState(id);
    const [GlobalMessageObj] = useState(data.GlobalMessageObj);

    const onChange = useCallback((e) => {
        setTextChanged(e.target.value);
        if (!isNaN(parseFloat(e.target.value))) {
            GlobalMessageObj.MyValueChanged(myID, "", e.target.value);
        }
        else {
            GlobalMessageObj.MyValueChanged(myID, "", 0);
        }
    }, []);

    const onConnectionChanges = (connection: Connection) => {
        GlobalMessageObj.ConnectionMade(connection.source, connection.target);
    }

    return (
        <div className="compBoxTop">
            <div className="compBoxMiddle">
                <div className="compBoxLabel">
                    Input
                </div>
            </div>
            <div>
                <div className="compBoxValue">
                    <input id="text" className="inputBox" name="text" type="text" onChange={onChange} placeholder="123" value={textChanged} width="48px" />
                </div>
            </div>
            <CustomHandle type="source" position={Position.Bottom} id="a"
                onConnect={(params) => {
                    console.log('handle onConnect', params);
                    onConnectionChanges(params);
                }}
                isConnectable={isConnectable} />
        </div>
    );
}
