const logger = require('heroku-logger');

const API_AI_TOKEN = process.env.API_AI_TOKEN;
const apiAiClient = require('apiai')(API_AI_TOKEN);
const FACEBOOK_ACCESS_TOKEN = process.env.FB_BOT_API;
const request = require('request');
const sendTextMessage = (senderId, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: FACEBOOK_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: {
                text
            },
        }
    });
};
module.exports = (event) => {
        const senderId = event.sender.id;
        const message = event.message.text;
        logger.info("AI request message >> ", message);
        const apiaiSession = apiAiClient.textRequest(message, {
                    sessionId: 'crowdbotics_bot'});
                    apiaiSession.on('response', (response) => {
                        const result = response.result.fulfillment.speech; 
                        logger.info("AI response result >> ", result);
                        sendTextMessage(senderId, result);
                    }); 
                    apiaiSession.on('error', error => logger.info("ERROR: AI request >> ", error));
                    apiaiSession.end();
                };