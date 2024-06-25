const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
async function sendFCM(token,type,invoice,title,data) {
  const message = {
    token: token,
    data: {
      type: type,
      invoice: invoice
    },
    notification: {
      title: title,
      body: bocy
    },
    android: {
      priority: "high"
    }
  };

  admin.messaging().send(message)
    .then(response => {
      console.log('Successfully sent message:', response);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });

}

module.exports = {sendFCM}