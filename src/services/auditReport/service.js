const PDFDocument = require('pdfkit');
const { ReadableStreamBuffer } = require('stream-buffers');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
const Jimp = require('jimp');
async function getOCIBufferedImage(imageUrl) {
  console.log('getOCIBufferedImage')
  // Realizar la petición GET para la imagen
  const response = await fetch(imageUrl, {
    method: 'GET',
    headers: {
      'Authorization': 'Basic U1JWX2JvbmFwcDo3SVZKdW4xNC48TH1URVBJaEIzKQ==' // Asegúrate de incluir la autorización correcta
    }
  });

  console.log('response', JSON.stringify(response))
  
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  // Convertir la respuesta en un buffer de imagen
  const imageBuffer = await response.buffer();
  console.log('imageBuffer')
  // Leer la imagen con Jimp
  const image = await Jimp.read(imageBuffer);

  // Cambiar el tamaño de la imagen a un ancho de 250 px manteniendo la proporción
  image.resize(250, Jimp.AUTO);

  // Reducir la calidad de la imagen al 60%
  image.quality(100);
  console.log('getOCIBufferedImage end')

  // Obtener el buffer de la imagen procesada
  return await image.getBufferAsync(Jimp.MIME_JPEG);
}


module.exports = (fastify) => {
  const { SubTask, STaskInstance, MainTask, Checklist, Document } = fastify.db;

  async function getAllDocuments(userId) {
    // Aquí obtendrías todos los registros de la tabla Documents
    // Por ejemplo:
    return await Document.findAll({where: { user_id: userId }});
  }

  // Función para mapear los nombres de las imágenes a los IDs de las subtasks
  function mapImagesToSubtasks(documents) {
    const imageMap = {};
    documents.forEach(doc => {
      const parts = doc.name.split('_'); // Esto asume que el nombre sigue el formato "item_ID_user_USERID_TIMESTAMP"
      const subtaskId = parts[1]; // Obtener el ID de la subtask
      imageMap[subtaskId] = doc.name; // Asociar el nombre de la imagen con el ID de la subtask
    });
    return imageMap;
  }  // to do validar que las imagenes sean del dia/today
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
      console.log(JSON.stringify(imageMap))
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
            
            const imageName = imageMap[subTask.id]
          if(imageName) {    
            const ociImageUrl = `https://swiftobjectstorage.sa-santiago-1.oraclecloud.com/v1/axmlczc5ez0w/bucket-bonapp/${imageName}` // subTask.dataValues.imageUrl; // Reemplazar con la propiedad real donde almacenas la URL de la imagen
            // Obtener la imagen como un buffer
            const imageBuffer = await getOCIBufferedImage(ociImageUrl);
            
            // Agregar la imagen al PDF
            doc.image(imageBuffer, {
              fit: [250, 300], // Ajustar según el tamaño deseado
              align: 'center',
              valign: 'center'
            });
          }
            
            // Asumiendo que quieres un espacio después de la imagen
            doc.moveDown(2);

            doc.moveDown();
            doc.moveDown();
          };
        };
      };
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
      //   console.log(
      //     scoreAcum,
      //     'cz',
      //     scoreCant,
      //     (scoreAcum / (scoreCant * 2)) * 100
      //   );
      //   doc
      //     .fontSize(15)
      //     .text(`Fecha: ${new Date().toLocaleDateString()}`, 100, 120);
      //   doc.text(`Datos: ${data}`, 100, 150);
      doc.end();
    });

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
          content: pdfBuffer,
        },
      ],
    };
    console.log('mailOptions')
    // Enviar correo
    await transporter.sendMail(mailOptions);
  }

  return {
    createPDFAndSendEmail,
  };
};
