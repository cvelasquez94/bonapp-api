const cron = require('node-cron');
const notificationService = require('../services/notifications/notificationService');
// const databaseService = require('../services/databaseService'); 

async function runCronJob() {

    console.log('ejecute el crons')
//   const schedules = await databaseService.getUpcomingSchedules();
  const schedules = [{scheduleTime: '20:21', deviceToken: 'euUkxyotR0CIUlX-ZizrBQ:APA91bEUrESWKnT-bBlrx89MV8c-ZWVr6qx4TNbCZ7Exd7iV-T8ju6Saq-kI42dBKtMFxZfLDrrQUrCIagAk_DEb9LGWpzIqpVIWBIL3vnAE3994q8euPB9jD28dPqhb5dp3Jbck6zVE'}]
  schedules.forEach(async (schedule) => {
    const { scheduleTime, deviceToken } = schedule;
    // const shouldNotify = notificationService.shouldSendNotification(scheduleTime);
    console.log(schedules)
    // if (shouldNotify) {
    try {
      await notificationService.sendNotification(deviceToken);
    } catch (error) {
      console.log('Error la enviar la notificacion', error)
    }
    // }
  });   

}
cron.schedule('*/10 * * * *', runCronJob);

module.exports = { runCronJob };
