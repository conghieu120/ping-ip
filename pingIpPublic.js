import axios from "axios";
import {networkInterfaces} from "os";
import { sendMessageToTelegram } from "./telegram.js";

async function getIpPublic() {
  try {
    const { data } = await axios.get('https://ipv4.canhazip.com/')  
    return data
  } catch (error) {
    return null;
  }
}


function getLocalIPv4() {
  const interfaces = networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interfaceItem of interfaces[name]) {
      if (interfaceItem.family === 'IPv4' && interfaceItem.address.includes('192.168.')) {
        return interfaceItem.address;
      }
    }
  }
  return null;
}

let ip = ''
let ipLocal = ''
const getAndCheckIp = async function () {
  const bot_token = process.env.TELEGRAM_BOT_TOKEN
  const chat_id = process.env.TELEGRAM_CHAT_ID
  const newIp = await getIpPublic()
  const newIpLocal = getLocalIPv4()
  if (newIp !== ip || newIpLocal !== ipLocal) {
    ip = newIp;
    ipLocal = newIpLocal;
    sendMessageToTelegram({
      bot_token,
      chat_id,
      text: `IP public: ${ip?.trim()}, IP local: ${newIpLocal?.trim()}`,
    })
  }
}

export function pingIpPublic() {
  getAndCheckIp()
  setInterval(getAndCheckIp, 300000)
}
