import { toggleZoneState, ZoneState } from "./shared/zoneState";

export const toggleState = (zoneInfo: ZoneInfo): ZoneInfo => {
    return {
        ...zoneInfo,
        state: toggleZoneState(zoneInfo.state),
    };
}

export const on = (zoneInfo: ZoneInfo): ZoneInfo => {
    return {
        ...zoneInfo,
        state: ZoneState.ON,
    };
}

export const off = (zoneInfo: ZoneInfo): ZoneInfo => {
    return {
        ...zoneInfo,
        state: ZoneState.OFF,
    };
}

export interface ZoneInfo {
    id: number,
    state: ZoneState,
}

export const initialZoneInfo: ZoneInfo = {
    id: 0,
    state: ZoneState.OFF,
}

