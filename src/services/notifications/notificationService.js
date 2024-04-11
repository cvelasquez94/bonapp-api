const admin = require('../../config/firebaseConfig');

async function sendNotification(deviceToken, nameChecklist) {
  console.log(`Mock send notification to ${deviceToken}`);
  const message = {
    notification: {
      title: `${nameChecklist}`,
      body: `Tu checklist ${nameChecklist} termina en 10 minutos.`
    },
    token: deviceToken,
  };

  const res = await admin.messaging().send(message);
  console.log(res)
}

function shouldSendNotification(scheduleTime) {
  console.log(scheduleTime)
  const scheduleDate = new Date(scheduleTime);
  const currentDate = new Date();
  const difference = scheduleDate.getTime() - currentDate.getTime();

  return difference <= 600000 && difference > 0;
}

module.exports = {
  sendNotification,
  shouldSendNotification,
};