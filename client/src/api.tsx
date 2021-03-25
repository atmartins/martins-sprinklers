import { API_LOCATION } from "./constants";
import { ZoneInfo } from "./zoneInfo";

export const persistZoneState = async (zoneInfo: ZoneInfo):Promise<ZoneInfo> => {
    console.log('Would have called', zoneInfo, `fetch(${API_LOCATION}/channel/${zoneInfo.id}/${zoneInfo.state}).then(rsp => rsp.json());`);
    // return Promise.resolve(zoneInfo)
    return fetch(`${API_LOCATION}/channel/${zoneInfo.id}/${zoneInfo.state}`).then(rsp => rsp.json());
}
