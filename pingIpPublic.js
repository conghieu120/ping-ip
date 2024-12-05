import axios from "axios";
import { fileURLToPath } from 'url';
import { join, dirname } from "path";
import { networkInterfaces } from "os";
import { readFileSync, writeFileSync } from "fs";

import { sendMessageToTelegram } from "./telegram.js";
import { updateDnsRecord } from "./updateDnsRecord.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getIpPublic() {
  try {
    const { data } = await axios.get('https://ipv4.canhazip.com/')
    if (typeof data === 'string') {
      return data.trim()
    } 
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
        return interfaceItem.address?.trim();
      }
    }
  }
  return null;
}

const filePath = join(__dirname, 'ip.txt')
const content = readFileSync(filePath, { encoding: 'utf8' }) ?? ''
const [ip, ipLocal] = content.split('|')

export const getAndCheckIp = async function () {
  const bot_token = process.env.TELEGRAM_BOT_TOKEN
  const chat_id = process.env.TELEGRAM_CHAT_ID
  const newIp = await getIpPublic()
  const newIpLocal = getLocalIPv4()
  if (newIp !== ip || newIpLocal !== ipLocal) {
    writeFileSync(filePath, newIp + '|' + newIpLocal)
    await Promise.all([
      sendMessageToTelegram({
        bot_token,
        chat_id,
        text: `IP public: ${newIp?.trim()}, IP local: ${newIpLocal?.trim()}`,
      }),
      updateDnsRecord(newIp?.trim()),
    ])
  }
}
