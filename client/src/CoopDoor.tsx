import React from 'react';
import { DOOR_MOVE_DURATION_MS } from './constants';
import { milliseconds } from "./shared/time";
import './coopDoor.css';
import { Countdown } from './Countdown';
import { runZone } from './zoneControl';
import { ZoneInfo } from './zoneInfo';


export const CoopDoor = ({name, zoneInfos}: {name: string, zoneInfos: [ZoneInfo, ZoneInfo]}) => {
    const openZoneInfo: ZoneInfo = zoneInfos[0];
    const closeZoneInfo: ZoneInfo = zoneInfos[1];
    const [remaining, setRemaining] = React.useState<milliseconds|undefined>(undefined);
    const [oc, setOc] = React.useState<'opening' | 'closing' | undefined>(undefined);

    const run = (zoneInfo: ZoneInfo) => {
        if (!(remaining && remaining > 0)) {
            runZone(zoneInfo, DOOR_MOVE_DURATION_MS, handleRemaining);
        }
    }

    const handleRemaining = (remaining: milliseconds) => {
        if (remaining && remaining > 0) {
            setRemaining(remaining);
        } else {
            setRemaining(undefined);
            setOc(undefined);
        }
    }

    return <div className="coop-door">
        <div className="coop-door_open btn" onClick={() => { setOc('opening'); run(openZoneInfo); }}>
            {remaining && oc === 'opening' ? <Countdown initial={DOOR_MOVE_DURATION_MS} remaining={remaining} dir="up"><div>Open {openZoneInfo.id}</div></Countdown> : `Open ${openZoneInfo.id}`}
        </div>
        {name} {remaining ? `${remaining/1000}s`: null}
        <div className="coop-door_close btn" onClick={() => { setOc('closing'); run(closeZoneInfo); }}>
            {remaining && oc === 'closing' ? <Countdown initial={DOOR_MOVE_DURATION_MS} remaining={remaining}><div>Close {closeZoneInfo.id}</div></Countdown> : `Close ${closeZoneInfo.id}`}
        </div>
    </div>
}