const cron = require('node-cron');
const notificationService = require('../services/notifications/notificationService');
const moment = require('moment-timezone');
const fetch = require('node-fetch');
const variables = require('../../config/variables')

const getTimeChile = () => {
  //TODO: agregar time zone en branches
  const timeInChile = moment.tz('America/Santiago');
  return timeInChile.format('DD/MM/YYYY HH:mm');
};

const getExpirationList = async (url, jwt) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: jwt
    }
  });
  if (!response.ok) {
    console.log(`Failed to Fetch expiration list: ${response.statusText}`)
    throw new Error(`Failed to fetch expiration list: ${response.statusText}`);
  }
  return response.json();
};

// const getSignIn = async (url) => {
//   const response = await fetch(url, {
//     method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//     body: JSON.stringify({
//               email: "carlos@gmail.com",
//               pwd: "1234"
//              })
//   });
//   if (!response.ok) {
//     throw new Error(`Failed to fetch expiration list: ${response.statusText}`);
//   }
//   return response.json();
// };

async function runCronJob() {
  // const {getCheckListDue} = require('../services/checkList/getCheckListDue/service')(fastify)
  //console.log('ejecute el crons');
  const timeZone = getTimeChile();
  const interval = 10;
  console.log('timeZone crons', timeZone, interval);
  const apisUrl = variables.apiUrl
  //const signIn = await getSignIn(apisUrl+'signIn')
  // const schedules = await getCheckListDue(10, timeZone)
  const jwt = 'Bearer ' + signIn.token;
  const schedules = await getExpirationList(
    `${apisUrl}getCheckListDue?interval=${interval}&time=${timeZone}`
    ,jwt
  );
  // const schedules = []
  //console.log(schedules);
  schedules.forEach(async (schedule) => {
    const { token, name, user_id, branch_name } = schedule;
    // const shouldNotify = notificationService.shouldSendNotification(scheduleTime);
    //console.log(schedule);
    // if (shouldNotify) {
    try {
      await notificationService.sendNotification(
        {
          deviceToken: token,
          nameChecklist: name,
          userId: user_id,
          branchName: branch_name,
          interval,
          jwt
        }
      );
    } catch (error) {
      console.log('Error la enviar la notificacion', error);
    }
    // }
  });
}
cron.schedule('*/10 0-1,8-23 * * *', runCronJob, {
  scheduled: true,
  timezone: 'America/Santiago',
});

module.exports = { runCronJob };
