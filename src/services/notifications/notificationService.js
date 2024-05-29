const moment = require('moment-timezone');
const admin = require('../../config/firebaseConfig');
const fetch = require('node-fetch');
const variables = require('../../../config/variables');

async function sendNotification(
  {
    deviceToken,
    nameChecklist,
    userId,
    branchName,
    interval,
    jwt,
    userFrom
  }
) {
  console.log(`Mock send notification to ${jwt}`);
  let bodyMenssage
  if(userFrom){
    bodyMenssage = `${userFrom} te asigno la ${nameChecklist} `;
  } else {
    bodyMenssage = `Tu checklist ${nameChecklist} en ${branchName} termina en ${interval} minutos.`;
  }
  const message = {
    notification: {
      title: `${nameChecklist}`,
      body: bodyMenssage,

    },
    android: {
      notification: {
        sound: "default",
        //defaultSound: true,
        lightSettings: {
          color: "#0033FF",
          lightOffDurationMillis: 1000,
          lightOnDurationMillis: 1000,
        },
         visibility: "public",
         priority: "max",
      },
    },
    token: deviceToken,
  };

  const res = await admin.messaging().send(message);
  const noti = await createNotification({
    userId,
    nameChecklist,
    messageId: res,
    bodyMenssage,
    jwt
  });
  // return noti
}

function shouldSendNotification(scheduleTime) {
  //console.log(scheduleTime);
  const scheduleDate = new Date(scheduleTime);
  const currentDate = new Date();
  const difference = scheduleDate.getTime() - currentDate.getTime();

  return difference <= 600000 && difference > 0;
}

async function createNotification(noti) {
  const timeInChile = moment.tz('America/Santiago');
  const { userId, nameChecklist, messageId, bodyMenssage, jwt } = noti;
  const apisUrl = variables.apiUrl;
  const url = apisUrl +'createNotification';
  const data = {
    userId: userId,
    messageId: messageId,
    title: nameChecklist,
    body: bodyMenssage,
    dataCustom: 'string',
    type: 'warnning',
    from: 'cron',
    device: 'string',
    statusId: 0,
    obs: 'string',
    sentTime: timeInChile,
  };

  try {
    const response = await fetch(url, {
      method: 'POST', // Método HTTP
      headers: {
        'Content-Type': 'application/json', // Tipo de contenido
        accept: 'application/json', // Qué tipo de respuesta esperas
        'Authorization': jwt
      },
      body: JSON.stringify(data), // Convertimos el objeto de datos a un string JSON
    });
    if (!response.ok) {
      // Verifica si la respuesta fue exitosa (status 200-299)
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonResponse = await response.json(); // Obtiene la respuesta JSON
    //console.log(jsonResponse); // Muestra la respuesta
    // return jsonResponse
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

module.exports = {
  sendNotification,
  shouldSendNotification,
};
