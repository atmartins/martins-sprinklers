import produce from 'immer';
import React from 'react';
import './App.css';
import { NUM_ZONES, WS_PORT } from './constants';
import { CoopDoor } from './CoopDoor';
import { Zone } from './Zone';
import { initialZoneInfo, ZoneInfo } from './zoneInfo';

let initialInfos: ZoneInfo[] = [];

for (let i = 1; i <= NUM_ZONES; i++) {
    const init = produce(initialZoneInfo, (draft: ZoneInfo)=> { draft.id = i })
    initialInfos.push(init);
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

    const getZone = (id: ZoneInfo['id']): ZoneInfo | undefined => {
        let foundZone: ZoneInfo | undefined;
        zoneInfos.forEach((z: ZoneInfo) => {
            if (z.id === id) {
                foundZone = z;
            }
        });
        return foundZone;
    }

    React.useEffect(() => {
        if (wsStatus === WsStatus.ERROR || ws) return;

        ws = new WebSocket(`ws://${window.location.hostname}:${WS_PORT}`);
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
                zoneInfo.id = parseInt(zoneInfo.id as unknown as string, 10);
            } catch (err) {
                console.log('Error parsing message.data from websockets');
                throw err;
            }
            console.log('message from server', zoneInfo)
            const updatedZoneInfos = produce(zoneInfos, draft => { draft[zoneInfo.id - 1] = zoneInfo });
            setZoneInfos(updatedZoneInfos);
        };
        ws.onclose = () => setWsStatus(WsStatus.CLOSED);
        ws.onerror = () => {
            ws.close();
            setWsStatus(WsStatus.ERROR);
        }
    }, [wsStatus, zoneInfos])

    const z5 = getZone(5);
    const z6 = getZone(6);
    const z7 = getZone(7);
    const z8 = getZone(8);

    return (
        <div className="App">
            <header className="App-header">
                <h1 className="title">Martins' Sprinklers</h1>
                <div className="ws-status">connection: {wsStatus}</div>
            </header>
            
            <div className="controls">
                { z5 && z6 ? <CoopDoor name="Chickens" zoneInfos={[ z6, z5 ]} /> : null }
                { z7 && z8 ? <CoopDoor name="Ducks" zoneInfos={[ z7, z8 ]} /> : null }
                {
                    zoneInfos
                        .filter((z: ZoneInfo) => z.id <= 8) // zones 5-8 are for coop doors
                        .map((z: ZoneInfo) => <Zone key={z.id} zoneInfo={z} />)
                }
            </div>
            
            
        </div>
    );
}

export default App;
