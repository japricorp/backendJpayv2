// whatsappSender.js

const axios = require('axios');

class WhatsappSender {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://app.watbiz.com/api/whatsapp/send';
  }

  async sendMessage(number, message) {
    try {
      const data = JSON.stringify({
        "contact": [
          {
            "number": number,
            "message": message
          }
        ]
      });

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: this.baseUrl,
        headers: { 
          'Api-key': this.apiKey, 
          'Content-Type': 'application/json'
        },
        data: data
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = WhatsappSender;
