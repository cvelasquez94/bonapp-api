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
  const { SubTask, STaskInstance, MainTask, Checklist, Document } = fastify.db;

  async function getAllDocuments(userId) {
    // Aquí obtendrías todos los registros de la tabla Documents
    // Por ejemplo:
    return await Document.findAll({ where: { user_id: userId } });
  }
  async function createPdfReport(userId, checkList) {
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
      console.log(JSON.stringify(imageMap));

      // const posX = doc.page.margins.left;
      // doc.fontSize(15).text(`Puntaje Obtenido: \n 51`, posX, 50, {
      //   align: 'left',
      // });
      // doc.fontSize(15).text(`Puntaje Máximo aplicable: \n 54`, posX + 100, 50, {
      //   align: 'left',
      // });
      // doc.fontSize(12).text(`Porcentaje Final: 94.4%`, posX + 100, 50, {
      //   align: 'right',
      // });
      //doc.restore;

      // these examples are easier to see with a large line width
      //doc.lineWidth(2);

      for (const task of checkList) {
        doc.moveDown();
        doc.fontSize(25).fillColor('#0B1193').text(task.dataValues.name, {
          width: 410,
          align: 'center',
        });
        doc.moveDown();

        for (const mainTask of task.mainTasks) {
          doc
            .lineCap('round')
            .moveTo(doc.page.margins.left, doc.y)
            .lineTo(doc.page.width - doc.page.margins.left, doc.y)
            .stroke('#FFB833');
          doc.moveDown();
          doc
            .fontSize(15)
            .text(mainTask.dataValues.name, {
              width: 410,
              align: 'left',
            })
            .fillColor('#0B1193');
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
            doc.moveDown();
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

            doc.moveDown();
            const imageName = imageMap[subTask.id];
            if (imageName) {
              const ociImageUrl = `https://swiftobjectstorage.sa-santiago-1.oraclecloud.com/v1/axmlczc5ez0w/bucket-bonapp/${imageName}`; // subTask.dataValues.imageUrl; // Reemplazar con la propiedad real donde almacenas la URL de la imagen
              // Obtener la imagen como un buffer
              const imageBuffer = await getOCIBufferedImage(ociImageUrl);

              // Agregar la imagen al PDF
              doc.image(imageBuffer, (doc.page.width - 200) / 2, doc.y, {
                //fit: [250, 300], // Ajustar según el tamaño deseado
                align: 'right',
                valign: 'center',
                width: 200,
                height: 100,
              });
              doc.moveDown();
            }

            // Asumiendo que quieres un espacio después de la imagen
            // doc.moveDown(2);

            // doc.moveDown();
            // doc.moveDown();
          }
        }
      }
      doc.moveDown();

      // const sizeColumnPts = doc.page.width / 3 - doc.page.margins.left * 2;
      // console.log(
      //   sizeColumnPts,
      //   ' total ',
      //   doc.page.width,
      //   doc.page.margins.left
      // );
      // doc
      //   .fontSize(13)
      //   .text(`PUNTAJE OBTENIDO : \n ${scoreAcum} `, doc.page.margins, 20, {
      //     width: sizeColumnPts,
      //   })
      //   .text(
      //     `PUNTAJE MAXIMO APLICABLE : \n ${scoreCant * 2}`,
      //     sizeColumnPts,
      //     20,
      //     { width: sizeColumnPts }
      //   )
      //   .text(
      //     `PORCENTAJE FINAL : \n ${(scoreAcum / (scoreCant * 2)) * 100}%`,
      //     sizeColumnPts * 2,
      //     20,
      //     { width: sizeColumnPts }
      //   );
      // doc.fontSize(12).text(`PUNTAJE OBTENIDO : ${scoreAcum}`, {
      //   width: 410,
      //   align: 'left',
      // });
      // doc.fontSize(12).text(`PUNTAJE MAXIMO APLICABLE : ${scoreCant * 2}`, {
      //   width: 410,
      //   align: 'left',
      // });
      // doc
      //   .fontSize(12)
      //   .text(`PORCENTAJE FINAL : ${(scoreAcum / (scoreCant * 2)) * 100}%`, {
      //     width: 410,
      //     align: 'left',
      //   });

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
            `Pagina ${i + 1} de ${range.count}`,
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

    const pdfReport = await createPdfReport(userId, checkList);

    console.log('fastify.config ', fastify.config.email.user);

    // Configuración de nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: fastify.config.email.user,
        pass: fastify.config.email.pass,
      },
    });

    const mailOptions = {
      from: fastify.config.email.user,
      to: fastify.config.email.audit,
      subject: 'Informe PDF',
      text: 'Aquí está tu informe.',
      attachments: [
        {
          filename: 'informe.pdf',
          content: pdfReport,
        },
      ],
    };
    console.log('mailOptions');
    // Enviar correo
    await transporter.sendMail(mailOptions);
  }

  return {
    createPDFAndSendEmail,
  };
};
