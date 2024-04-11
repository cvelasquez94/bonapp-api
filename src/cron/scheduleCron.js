const cron = require('node-cron');
const notificationService = require('../services/notifications/notificationService');
const moment = require('moment-timezone');
const fetch = require('node-fetch');

const getTimeChile = () => {
  const timeInChile = moment.tz('America/Santiago');
  return timeInChile.format('HH:mm');
}

const getExpirationList = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch expiration list: ${response.statusText}`);
  }
  return response.json();
}

async function runCronJob() {
  // const {getCheckListDue} = require('../services/checkList/getCheckListDue/service')(fastify)
  console.log('ejecute el crons')
  const timeZone = getTimeChile()
  const interval = 60;
  console.log(timeZone, interval)
  // const schedules = await getCheckListDue(10, timeZone)
  const schedules = await getExpirationList(`https://bonapp-api.onrender.com/base/v1/getCheckListDue?interval=${interval}&time=${timeZone}`)
  // const schedules = []
  console.log(schedules)
  schedules.forEach(async (schedule) => {
  const { token, name, user_id } = schedule;
    // const shouldNotify = notificationService.shouldSendNotification(scheduleTime);
    console.log(schedule)
    // if (shouldNotify) {
    try {
      await notificationService.sendNotification(token, name, user_id);
    } catch (error) {
      console.log('Error la enviar la notificacion', error)
    }
    // }
  });   

}
cron.schedule('*/10 0-1,8-23 * * *', runCronJob, { scheduled: true, timezone: 'America/Santiago'});

module.exports = { runCronJob };
