import axios from "axios";

export const sendMessageToTelegram = async ({ text, bot_token, chat_id }) => {
  try {
    const body = {
      text,
      chat_id,
    }
    await axios.post(`https://api.telegram.org/bot${bot_token}/sendMessage`,body);
    console.log('Tin nhắn đã được gửi thành công: ', text);
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn:', error);
  }
}
