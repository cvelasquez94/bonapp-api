const nodemailer = require('nodemailer');
const {
  mail: { user, pass },
} = require('../../config/variables');

const sendEmail = async ({ user, pass, mailOptions }) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.dreamhost.com',
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
  });

  const options = {
    ...mailOptions,
  };
  console.log('SEND MAIL', options);
  //console.log('transporter ==>>', transporter);
  return await transporter.sendMail(options);
};

exports.sendAuditEmail = (options, nomAuditor) => {
  const mailBody = `
  Estimado equipo,

    Espero que este correo le encuentre bien. Como se acordó previamente, he completado nuestra auditoría programada en su restaurante hoy dia. 
    Quisiera agradecerles por su cooperación y disposición durante este proceso.
    Quedo a su disposición para discutir cualquier aspecto de nuestra auditoría en mayor detalle o para brindar asistencia adicional según sea necesario.
    
  Saludos cordiales, ${nomAuditor}.`;

  const mailOptions = {
    ...options,
    text: mailBody,
    from: {
      name: 'Audit BonApp',
      address: user
          },
  };
  return sendEmail({ user, pass, mailOptions });
};

exports.changePassEmail = (email) => {
  const mailOptions = {
    to: email,
    subject: 'Password Changed',
    text: `
Has cambiado el password en BonApp.
  
Saludos!
    `,
    from: {
      name: 'Users BonApp',
      address: 'no-reply@bonapp.tech'
          },
  };
  return sendEmail({ user, pass, mailOptions });
};
exports.ForgetPassEmail = (email, password) => {
  const mailOptions = {
    to: email,
    subject: 'Forget Password',
    text: `
Has solicitado cambiar la password. Enviamos una password provisoria.

      Passord: ${password}
  
Saludos!
    `,
    from: {
      name: 'Users BonApp',
      address: 'no-reply@bonapp.tech'
          },
  };

  return sendEmail({ user, pass, mailOptions });
};
exports.CreateUserEmail = (email, password) => {
  const mailOptions = {
    to: email,
    subject: 'Usuario registrado en BonApp',
    text: `
Estimado,

    Se le está enviando en este correo una contraseña temporal.
    Por favor ingrese a la brevedad y deberá cambiarla.

    La misma es: ${password}

    Descarga para Android: https://app.bonapp.tech/download/latest
    Descarga para iOS:     https://testflight.apple.com/join/mIhLRqcH
  
Saludos!
    `,
    from: {
      name: 'Users BonApp',
      address: 'no-reply@bonapp.tech'
          },
  };

  return sendEmail({ user, pass, mailOptions });
};
