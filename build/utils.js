import { writeFile } from 'fs';
import { promisify } from 'util';
import { Socket } from 'net';
import JSHandle from './api/JSHandle';
export const pWriteFile = promisify(writeFile);
export const MOUSE_BUTTON = {
  left: 0,
  middle: 1,
  right: 2
};
export const mapEvaluateArgs = args => args.map(arg => {
  if (arg instanceof JSHandle) {
    return arg._handleId;
  }

  return arg;
});
export const getElementId = JSHandleId => Object.values(JSHandleId)[0];
export function hasKey(obj, key) {
  return key in obj;
}
const CHECK_PORT_TIMEOUT = 200;
export const checkPort = (host, port) => {
  return new Promise(resolve => {
    const socket = new Socket();
    let isAvailablePort = false;
    socket.setTimeout(CHECK_PORT_TIMEOUT).once('connect', () => {
      isAvailablePort = true;
      socket.destroy();
    }).once('timeout', () => {
      socket.destroy();
    }).once('error', () => {
      resolve(false);
    }).once('close', () => {
      if (isAvailablePort) {
        resolve(true);
      } else {
        resolve(false);
      }
    }).connect(port, host);
  });
};
export const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout));
export const waitForPort = async (host, port) => {
  while (!(await checkPort(host, port))) {
    await sleep(CHECK_PORT_TIMEOUT);
  }
};