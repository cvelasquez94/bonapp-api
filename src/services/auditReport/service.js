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
    Branches,
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
      attributes: ['Role.id', 'Role.name'],
      include: [{ model: Role, as: 'Role', required: true }],
      where: { checklist_id: arrayIdChecklist },
      group: ['Role.id', 'Role.name'],
    });

    //get mails
    const usersRolesDb = await User.findAll({
      attributes: ['email'],
      where: {
        role_id: rolesList.map((item) => item.dataValues.Role.dataValues.id),
      },
    });
    const emails = usersRolesDb.map((item) => item.dataValues.email).join(',');
    const destinatarios = rolesList
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
  async function setScoringReport(doc, checkList) {
    const colorText = '#13375B';
    const colorLine = '#F6BE61';
    let sumScore = 0;
    let maxScore = 0;
    checkList.forEach((check) => {
      check.dataValues.mainTasks.forEach((main) => {
        main.dataValues.subTasks.forEach((sub) => {
          sub.dataValues.sTaskInstances.forEach((stack) => {
            sumScore += stack.dataValues.score || 0;
            maxScore++;
          });
        });
      });
    });
    doc
      .font('Helvetica')
      .fontSize(13)
      .text(`Puntaje \n Obtenido:`, doc.x, 260, {
        align: 'left',
      });
    doc
      .font('Helvetica-Bold')
      .fontSize(40)
      .fillColor(colorLine)
      .text(sumScore, doc.x, 300, {
        align: 'left',
      });
    doc
      .font('Helvetica')
      .fontSize(13)
      .fillColor(colorText)
      .text(`Puntaje \n Máximo aplicable:`, doc.x, 260, {
        align: 'center',
      });
    doc
      .font('Helvetica-Bold')
      .fontSize(40)
      .fillColor(colorLine)
      .text(`${maxScore * 2}`, doc.x, 300, {
        align: 'center',
      });
    doc
      .font('Helvetica')
      .fontSize(13)
      .fillColor(colorText)
      .text(`Porcentaje \n Final:`, doc.x, 260, {
        align: 'right',
      });
    doc
      .font('Helvetica-Bold')
      .fontSize(40)
      .fillColor(colorLine)
      .text(`${parseInt((sumScore / (maxScore * 2)) * 100)}%`, doc.x, 300, {
        align: 'right',
      });
  }
  async function createPdfReport(userId, checkList, branchId, destinatarios) {
    const colorText = '#13375B';
    const colorLine = '#F6BE61';

    const nomUser = await User.findOne({ where: { id: userId } });
    const nameBranch = await Branches.findOne({ where: { id: branchId } });

    const pdfBuffer = await new Promise(async (resolve, reject) => {
      const doc = new PDFDocument({
        bufferPages: true,
        margin: 50,
        size: 'A4',
      });
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
      const today = new Date();
      doc
        .fontSize(10)
        .fillColor(colorText)
        .text(`Fecha : ${today.toLocaleDateString()}`, doc.x, 50, {
          align: 'left',
        });
      doc.image(
        'static/images/logoBonApp.png',
        (doc.page.width - 220) / 2,
        50,
        {
          width: 220,
          height: 80,
          //align: 'center',
        }
      );
      doc
        .fontSize(10)
        .text(`Hora : ${today.getHours()}:${today.getMinutes()}`, doc.x, 50, {
          align: 'right',
        });
      doc.moveDown(7);

      for (const task of checkList) {
        doc.moveDown();
        doc
          .font('Helvetica-Bold')
          .fontSize(25)
          .fillColor(colorText)
          .text(task.dataValues.name, {
            align: 'center',
          });
        doc
          .font('Helvetica')
          .fontSize(18)
          .fillColor(colorText)
          .text(`${nameBranch.dataValues.name}`, {
            align: 'center',
          });
        doc
          .font('Helvetica')
          .fontSize(15)
          .fillColor(colorText)
          .text(
            `${nomUser.dataValues.firstName} ${nomUser.dataValues.lastName} `,
            {
              align: 'center',
            }
          );

        await setScoringReport(doc, checkList);

        doc
          .fillColor(colorText)
          .fontSize(14)
          .text(`DESTINATARIOS : ${destinatarios.destinatarios}`, {
            width: 410,
            align: 'left',
          });
        doc.moveDown();

        //doc.moveDown();
        let listMain = 1;
        let listSub = 1;
        for (const mainTask of task.mainTasks) {
          doc
            .lineCap('round')
            .moveTo(doc.page.margins.left, doc.y)
            .lineTo(doc.page.width - doc.page.margins.left, doc.y)
            .stroke(colorLine);
          doc.moveDown();

          doc
            .fontSize(13)
            .fillColor(colorText)
            .text(`${mainTask.dataValues.name}`, {
              align: 'left',
            });
          listMain++;
          listSub = 1;
          doc.moveDown();

          for (const subTask of mainTask.subTasks) {
            doc
              .font('Helvetica')
              .fontSize(13)
              .fillColor(colorText)
              .text(`${listSub}) ${subTask.dataValues.name}`, {
                align: 'left',
                // indent: 20,
                // textIndent: 20,
              });

            listSub++;
            const comment =
              subTask.sTaskInstances?.length > 0
                ? subTask.sTaskInstances[0].comment
                : '';
            doc.moveDown();
            if (comment)
              doc
                .fontSize(13)
                .text(`Comentario: ${comment}`, { align: 'left', indent: 20 });

            const score =
              subTask.sTaskInstances?.length > 0
                ? subTask.sTaskInstances[0].score
                : 0;
            scoreAcum += score;
            scoreCant++;
            doc
              .font('Helvetica-Bold')
              .fontSize(13)
              .text(`Score: ${score}`, { align: 'left', indent: 20 });
            doc.moveDown();

            const imageName = imageMap[subTask.id];
            if (imageName) {
              const ociImageUrl = `https://swiftobjectstorage.sa-santiago-1.oraclecloud.com/v1/axmlczc5ez0w/bucket-bonapp/${imageName}`; // subTask.dataValues.imageUrl; // Reemplazar con la propiedad real donde almacenas la URL de la imagen
              // Obtener la imagen como un buffer
              const imageBuffer = await getOCIBufferedImage(ociImageUrl);

              // Agregar la imagen al PDF

              // logica para agregar salto de pagina cuando supere el alto de pagina
              if (doc.page.height - doc.y - doc.page.margins.bottom < 200)
                doc.addPage();
              doc
                .image(
                  imageBuffer,
                  (doc.page.width - doc.page.margins.bottom * 2 - 200) / 2,
                  doc.y,
                  {
                    //fit: [200, 200],
                    align: 'center',
                    valign: 'center',
                    width: 300,
                    height: 200,
                  }
                )
                .stroke();
              doc.moveDown();
            }
          }
        }
      }
      doc.moveDown();

      // FOOTER
      // see the range of buffered pages
      const range = doc.bufferedPageRange(); // => { start: 0, count: 2 }

      for (
        i = range.start, end = range.start + range.count, range.start <= end;
        i < end;
        i++
      ) {
        doc.switchToPage(i);
        doc
          .fontSize(10)
          .text(
            `Página ${i + 1} de ${range.count}`,
            doc.page.width / 2 - 40,
            doc.page.height - 50,
            {
              lineBreak: false,
              //align: 'justify',
            }
          );
      }

      // manually flush pages that have been buffered
      doc.flushPages();

      doc.end();
    });
    return pdfBuffer;
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
    const { userId, branchId, checkListId } = data;
    const checkList = await Checklist.findAll({
      where: {
        id: checkListId,
      },
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

    if (checkList.length == 0) throw new Error('checkList no encontrados');

    const arrayIdChecklist = checkList.map((item) => item.dataValues.id); // UNIQUE ID CHECKLIST
    const destinatarios = await getDestinatarioAndMails(arrayIdChecklist);
    const pdfReport = await createPdfReport(
      userId,
      checkList,
      branchId,
      destinatarios
    );

    const mailAuditor = await getMailAuditor(userId); //TODO: agregar el mail auditor al envio
    console.log('mailAuditor:', mailAuditor);

    destinatarios.emails+=',' + mailAuditor

    const mailOptions = {
      from: fastify.config.email.user,
      to: destinatarios.emails,
      //to: fastify.config.email.audit,
      subject: 'Informe PDF',
      text: 'Aquí está tu informe.',
      attachments: [
        {
          filename: 'informe.pdf',
          content: pdfReport,
        },
      ],
    };

    console.log(
      '----------- Send mail ------------- FROM ',
      fastify.config.email.user,
      'Destintarios',
      destinatarios
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
