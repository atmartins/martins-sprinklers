const WS_PORT = 1337;
const REST_PORT = 3217;

// export const SERVER_ADDRESS = 'localhost';
export const SERVER_ADDRESS = '10.0.0.28';
export const API_LOCATION = `http://${SERVER_ADDRESS}:${REST_PORT}`;
export const WS_LOCATION = `ws://${SERVER_ADDRESS}:${WS_PORT}`;
export const NUM_ZONES = 8;

const ONE_SEC_IN_MS = 1000;
export const DOOR_MOVE_DURATION_MS = 20 * ONE_SEC_IN_MS;
