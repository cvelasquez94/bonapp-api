const PDFDocument = require('pdfkit');
const { ReadableStreamBuffer } = require('stream-buffers');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
const Jimp = require('jimp');
async function getOCIBufferedImage(imageUrl) {
  const response = await fetch(imageUrl, {
    method: 'GET',
    headers: {
      Authorization: 'Basic U1JWX2JvbmFwcDo3SVZKdW4xNC48TH1URVBJaEIzKQ==', // Asegúrate de incluir la autorización correcta
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  // Convertir a ArrayBuffer y luego a Buffer
  return response.buffer();
}

module.exports = (fastify) => {
  const {
    SubTask,
    STaskInstance,
    MainTask,
    Checklist,
    Document,
    User,
    ReportTo,
    Role,
  } = fastify.db;

  async function getMailAuditor(userId) {
    const userAudit = await User.findOne({ where: { id: userId } });
    console.log('mail user audit: ', userAudit.dataValues.email);
    return userAudit.dataValues.email;
  }
  async function getDestinatarioAndMails(arrayIdChecklist) {
    // obtenemos todo los roles con el array de id checklist
    const rolesList = await ReportTo.findAll({
      include: [{ model: Role, as: 'Role', required: true }],
      where: { checklist_id: arrayIdChecklist },
    });
    // distintc de roles con sus name (destinatarios)
    const arrayUniqueRoles = [
      ...new Map(rolesList.map((item) => [item['role_id'], item])).values(),
    ];

    //get mails
    const usersRolesDb = await User.findAll({
      attributes: ['email'],
      where: {
        role_id: arrayUniqueRoles.map(
          (item) => item.dataValues.Role.dataValues.id
        ),
      },
    });
    const emails = usersRolesDb.map((item) => item.dataValues.email).join(',');
    const destinatarios = arrayUniqueRoles
      .map((item) => item.dataValues.Role.dataValues.name)
      .join(',');
    return {
      emails,
      destinatarios,
    };
  }

  async function getAllDocuments(userId) {
    // Aquí obtendrías todos los registros de la tabla Documents
    // Por ejemplo:
    return await Document.findAll({ where: { user_id: userId } });
  }

  // Función para mapear los nombres de las imágenes a los IDs de las subtasks
  function mapImagesToSubtasks(documents) {
    const imageMap = {};
    documents.forEach((doc) => {
      const parts = doc.name.split('_'); // Esto asume que el nombre sigue el formato "item_ID_user_USERID_TIMESTAMP"
      const subtaskId = parts[1]; // Obtener el ID de la subtask
      imageMap[subtaskId] = doc.name; // Asociar el nombre de la imagen con el ID de la subtask
    });
    return imageMap;
  } // to do validar que las imagenes sean del dia/today

  async function createPDFAndSendEmail(data, email) {
    const { userId } = data;
    const checkList = await Checklist.findAll({
      include: [
        {
          model: MainTask,
          as: 'mainTasks',
          required: true,
          include: [
            {
              model: SubTask,
              as: 'subTasks',
              required: true,
              include: [
                {
                  // Incluye el modelo STaskInstance aquí
                  model: STaskInstance,
                  as: 'sTaskInstances',
                  where: {
                    user_id: userId,
                  },
                  required: true, // Esto hace que la inclusión sea una left outer join
                },
              ],
            },
          ],
        },
      ],
    });
    let destinatarios;
    const pdfBuffer = await new Promise(async (resolve, reject) => {
      const doc = new PDFDocument();
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Agregar contenido al PDF
      let scoreAcum = 0;
      let scoreCant = 0;
      const documents = await getAllDocuments(userId);
      const imageMap = mapImagesToSubtasks(documents);

      const arrayIdChecklist = checkList.map((item) => item.dataValues.id); // UNIQUE ID CHECKLIST
      destinatarios = await getDestinatarioAndMails(arrayIdChecklist);

      doc.fontSize(20).text(`DESTINATARIOS : ${destinatarios.destinatarios}`, {
        width: 410,
        align: 'left',
      });
      doc.moveDown();

      for (const task of checkList) {
        doc.fontSize(25).text(task.dataValues.name, {
          width: 410,
          align: 'center',
        });
        doc.moveDown();

        for (const mainTask of task.mainTasks) {
          doc.fontSize(15).text(mainTask.dataValues.name, {
            width: 410,
            align: 'left',
          });
          doc.moveDown();

          for (const subTask of mainTask.subTasks) {
            doc.fontSize(10).text(subTask.dataValues.name, {
              width: 410,
              align: 'left',
            });
            const comment =
              subTask.sTaskInstances?.length > 0
                ? subTask.sTaskInstances[0].comment
                : '';
            doc.fontSize(10).text(`Comentario: ${comment}`, {
              width: 410,
              align: 'left',
            });
            const score =
              subTask.sTaskInstances?.length > 0
                ? subTask.sTaskInstances[0].score
                : 0;
            scoreAcum += score;
            scoreCant++;
            //doc.moveDown();
            doc.fontSize(10).text(`Score: ${score}`, {
              width: 410,
              align: 'left',
            });

            const imageName = imageMap[subTask.id];
            if (imageName) {
              const ociImageUrl = `https://swiftobjectstorage.sa-santiago-1.oraclecloud.com/v1/axmlczc5ez0w/bucket-bonapp/${imageName}`; // subTask.dataValues.imageUrl; // Reemplazar con la propiedad real donde almacenas la URL de la imagen
              // Obtener la imagen como un buffer
              const imageBuffer = await getOCIBufferedImage(ociImageUrl);

              // Agregar la imagen al PDF
              doc.image(imageBuffer, {
                fit: [250, 300], // Ajustar según el tamaño deseado
                align: 'center',
                valign: 'center',
              });
            }

            // Asumiendo que quieres un espacio después de la imagen
            doc.moveDown(2);

            doc.moveDown();
            doc.moveDown();
          }
        }
      }
      doc.moveDown();

      doc.fontSize(12).text(`PUNTAJE OBTENIDO : ${scoreAcum}`, {
        width: 410,
        align: 'left',
      });
      doc.fontSize(12).text(`PUNTAJE MAXIMO APLICABLE : ${scoreCant * 2}`, {
        width: 410,
        align: 'left',
      });
      doc
        .fontSize(12)
        .text(`PORCENTAJE FINAL : ${(scoreAcum / (scoreCant * 2)) * 100}%`, {
          width: 410,
          align: 'left',
        });
      doc.end();
    });

    const mailAuditor = await getMailAuditor(userId); //TODO: agregar el mail auditor al envio
    console.log('destinatarios: ', destinatarios);
    console.log('mailAuditor:', mailAuditor);
    const mailOptions = {
      from: fastify.config.email.user,
      to: destinatarios.emails,
      subject: 'Informe PDF',
      text: 'Aquí está tu informe.',
      attachments: [
        {
          filename: 'informe.pdf',
          content: pdfBuffer,
        },
      ],
    };

    console.log(
      '----------- Send mail ------------- FROM ',
      fastify.config.email.user
    );

    // Configuración de nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: fastify.config.email.user,
        pass: fastify.config.email.pass,
      },
    });
    // Enviar correo
    await transporter.sendMail(mailOptions);
  }

  return {
    createPDFAndSendEmail,
  };
};
