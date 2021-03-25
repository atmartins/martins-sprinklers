import { API_LOCATION } from "./constants";
import { ZoneInfo } from "./zoneInfo";

export const persistZoneState = async (zoneInfo: ZoneInfo):Promise<ZoneInfo> => fetch(`${API_LOCATION}/channel/${zoneInfo.id}/${zoneInfo.state}`).then(rsp => rsp.json());
