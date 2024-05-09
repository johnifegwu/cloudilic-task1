
export interface MessageArgs {
    sourceId: string;
    targetId: string;
    payload: string;
}

export default class MessageBroadCast extends EventTarget {
    constructor() {
        super()
    }

    public ConnectionMade(sourceId: string | null, targetId: string | null): void {
        this.dispatchEvent(
            new CustomEvent('connectionMade', { detail: { sourceId: sourceId, targetId: targetId, payload: "" } })
        )
    }

    public MyValueChanged(sourceId: string | null, targetId: string | null, payload: string): void {
        this.dispatchEvent(
            new CustomEvent('myValueChanged', { detail: { sourceId: sourceId, targetId: targetId, payload: payload } })
        )
    }

    public GenerateOutput(sourceId: string | null, targetId: string | null, payload: number): void {
        this.dispatchEvent(
            new CustomEvent('generateOutput', { detail: { sourceId: sourceId, targetId: targetId, payload: payload } })
        )
    }

    public PerformCalc(sourceId: string | null, targetId: string | null, payload: Map<string, string>): void {
        this.dispatchEvent(
            new CustomEvent('performCalc', { detail: { sourceId: sourceId, targetId: targetId, payload: payload } })
        )
    }
}

export interface AdditionData {
    [x: string]: any;
    sourceid: string;
    value: string;
}