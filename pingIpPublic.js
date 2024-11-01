import axios from "axios";
import { sendMessageToTelegram } from "./telegram.js";

async function getIpPublic() {
  try {
    const { data } = await axios.get('https://ipv4.canhazip.com/')  
    return data
  } catch (error) {
    return null;
  }
}

let ip = ''
const getAndCheckIpPublic = async function () {
  const bot_token = process.env.TELEGRAM_BOT_TOKEN
  const chat_id = process.env.TELEGRAM_CHAT_ID
  const newIp = await getIpPublic()
  if (newIp !== ip) {
    ip = newIp;
    sendMessageToTelegram({
      bot_token,
      chat_id,
      text: `Địa chỉ IP mới: ${ip}`,
    })
  }
}

export function pingIpPublic() {
  getAndCheckIpPublic()
  setInterval(getAndCheckIpPublic, 120000)
}
