import { ZoneInfo } from "./zoneInfo";

export const persistZoneState = async (zoneInfo: ZoneInfo):Promise<ZoneInfo> => fetch(`http://${location.host}/channel/${zoneInfo.id}/${zoneInfo.state}`).then(rsp => rsp.json());
