const PDFDocument = require('pdfkit');
const { ReadableStreamBuffer } = require('stream-buffers');
const nodemailer = require('nodemailer');

module.exports = (fastify) => {
  const { SubTask, STaskInstance, MainTask, Checklist } = fastify.db;

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

    const pdfBuffer = await new Promise((resolve, reject) => {
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
      checkList.forEach((task) => {
        doc.fontSize(25).text(task.dataValues.name, {
          width: 410,
          align: 'center',
        });
        doc.moveDown();

        task.mainTasks.forEach((mainTask) => {
          doc.fontSize(15).text(mainTask.dataValues.name, {
            width: 410,
            align: 'left',
          });
          doc.moveDown();

          mainTask.subTasks.forEach((subTask) => {
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

            doc.moveDown();
            doc.moveDown();
          });
        });
      });
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

    // Enviar correo
    await transporter.sendMail(mailOptions);
  }

  return {
    createPDFAndSendEmail,
  };
};
