export enum ZoneState {
    ON = 'on',
    OFF = 'off',
}

export const toggleZoneState = (zoneState: ZoneState): ZoneState => {
    return zoneState === ZoneState.ON ? ZoneState.OFF : ZoneState.ON
}