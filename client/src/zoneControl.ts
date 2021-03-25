import { persistZoneState } from "./api";
import { milliseconds } from "./shared/time";
import { off, on, ZoneInfo } from "./zoneInfo";

export const runZone = (zone: ZoneInfo, duration: milliseconds, stepCallback: (remaining: milliseconds) => void, step: milliseconds = 1000) => {
    let msRemaining = duration;
    persistZoneState(on(zone));
    setTimeout(() => {
        persistZoneState(off(zone));
    }, duration);
    
    stepCallback(msRemaining);
    const interval = setInterval(() => {
        if (msRemaining <= 0) {
            clearInterval(interval);
        } else {
            msRemaining = msRemaining - step;
            stepCallback(msRemaining);
        }
    }, step);
}