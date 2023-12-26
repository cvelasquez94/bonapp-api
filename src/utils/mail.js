const nodemailer = require('nodemailer')
const { mail: { user, pass } } = require('../../config/variables')

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass
    }
  })
  const mailOptions = {
    from: user,
    to,
    subject,
    text
  }
  console.log('mailOptions', mailOptions)
  console.log('transporter ==>>', transporter)
  return await transporter.sendMail(mailOptions);

}

exports.signUpMail = async (email, code) => {
  const mail = {
    to: email,
    subject: '[NHQ] Registro',
    bcc: email,
    text: `
      Has sido registrado en NHQ, 
      
      Codigo de acceso: ${code}
  
      Saludos!
    `
  }
  console.log(`Codigo de acceso en email ============>`, email, code)
  return await sendEmail(mail)
}

exports.sendCodeEmail = (email, code) => {
  const mail = {
    to: email,
    subject: '[NHQ] Registro',
    bcc: email,
    text: `
      Has solicitado cambiar el password en NHQ, 
      
      Codigo: ${code}
  
      Saludos!
    `
  }
  return sendEmail(mail)
}

exports.changePassEmail = (email) => {
  const mail = {
    to: email,
    subject: '[NHQ] Password Changed',
    text: `
      Has cambiado el password en NHQ
  
      Saludos!
    `
  }
  return sendEmail(mail)
}
