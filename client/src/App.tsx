import produce from 'immer';
import React from 'react';
import './App.css';
import { NUM_ZONES, WS_LOCATION } from './constants';
import { CoopDoor } from './CoopDoor';
import { Zone } from './Zone';
import { initialZoneInfo, ZoneInfo } from './zoneInfo';

let initialInfos: ZoneInfo[] = [];

for (let i = 1; i <= NUM_ZONES; i++) {
    initialInfos.push(produce(initialZoneInfo, draft => { draft.id = i }));
}

enum WsStatus {
    CONNECTING = 'connecting',
    OPEN = 'open',
    CLOSED = 'closed',
    ERROR = 'error',
}

let ws: WebSocket;

function App() {
    const [zoneInfos, setZoneInfos] = React.useState<ZoneInfo[]>(initialInfos);
    const [wsStatus, setWsStatus] = React.useState<WsStatus>(WsStatus.CONNECTING);

    React.useEffect(() => {
        if (wsStatus === WsStatus.ERROR || ws) return;

        ws = new WebSocket(WS_LOCATION);
        ws.onopen = () => {
            ws.send(JSON.stringify({ id: undefined, msg: 'Client connected!' }));
            setWsStatus(WsStatus.OPEN);
        };

        ws.onmessage = (message: any) => {
            if (!(message || message.data)) {
                console.log('Error receving ws message or message data', message);
            }
            let zoneInfo: ZoneInfo;
            try {
                zoneInfo = JSON.parse(message.data);
            } catch (e) {
                console.log('Error parsing message.data from websockets');
                throw new Error(e);
            }

            const updatedZoneInfos = produce(zoneInfos, draft => { draft[zoneInfo.id - 1] = zoneInfo });
            setZoneInfos(updatedZoneInfos);
        };
        ws.onclose = () => setWsStatus(WsStatus.CLOSED);
        ws.onerror = () => {
            ws.close();
            setWsStatus(WsStatus.ERROR);
        }
    }, [wsStatus, zoneInfos])

    return (
        <div className="App">
            <header className="App-header">
                <h1 className="title">Martins' Sprinklers</h1>
            </header>
            
            <div className="controls">
                <CoopDoor name="Chickens" zoneInfos={[zoneInfos[6], zoneInfos[5] ]} />
                <CoopDoor name="Ducks" zoneInfos={[zoneInfos[7], zoneInfos[8]]} />
                {
                    zoneInfos
                        .filter((z: ZoneInfo) => z.id <= 4) // zones 5-8 are for coop doors
                        .map((z: ZoneInfo) => <Zone key={z.id} zoneInfo={z} />)
                }
            </div>
            
            <div className="ws-status">ws: {wsStatus}</div>
        </div>
    );
}

export default App;
