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


export function pingIpPublic() {
  const bot_token = process.env.TELEGRAM_BOT_TOKEN
  const chat_id = process.env.TELEGRAM_CHAT_ID
  console.log({bot_token, chat_id});

  let ip = ''
  setInterval(async () => {
    const newIp = await getIpPublic()
    if (newIp !== ip) {
      ip = newIp;
      sendMessageToTelegram({
        bot_token,
        chat_id,
        text: `Địa chỉ IP mới: ${ip}`,
      })
    }
  }, 60000)
}
