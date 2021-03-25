import { persistZoneState } from './api';
import { ZoneInfo } from './zoneInfo';
import { toggleState } from './zoneInfo';
import './zone.css';

export const Zone = ({zoneInfo}: {zoneInfo: ZoneInfo}) => {
    return <div
        className={`zone btn ${zoneInfo.state}`}
        onClick={() => persistZoneState(toggleState(zoneInfo))}
    >
        Zone {zoneInfo.id}
    </div>
}