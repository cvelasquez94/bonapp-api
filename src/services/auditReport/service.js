const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
const imageSize = require('image-size')
const { Op } = require('sequelize');
let nameBranch;

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
  return response.buffer()
}

const getImageFromBucket = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Basic U1JWX2JvbmFwcDo3SVZKdW4xNC48TH1URVBJaEIzKQ==', // Asegúrate de incluir la autorización correcta
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  return response.buffer()
}

const getAllDocuments = async (docs) => {
  const peticiones = docs.map( async (docs) => {
    const url = `https://swiftobjectstorage.sa-santiago-1.oraclecloud.com/v1/axmlczc5ez0w/bucket-bonapp/${docs.dataValues.name}`
    return  await getImageFromBucket(url)
     .then((ret) => {
      return {docs, buff: ret}
      })
  })
  return await Promise.all(peticiones)
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
    RoleUser,
    user_branches,
    Restaurant,
  } = fastify.db;

  async function getMailAuditor(userId) {
    const userAudit = await User.findOne({ where: { id: userId } });
    console.log('mail user audit: ', userAudit.dataValues.email);
    return userAudit;
  }
  async function getDestinatarioAndMails(arrayIdChecklist, branchId) {
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
      include: [
        {
          model: RoleUser,
          as: 'roleUser',
          required: true,
          where: {
            role_id: rolesList.map((item) => item.dataValues.Role.dataValues.id),
                 },         
        },
                    {
                      model: user_branches,
                      as: 'user_branches',
                      required: true,
                      where: { branch_id: branchId },
                    }
        ]
      
    });
    const emails = usersRolesDb.map((item) => item.dataValues.email).join(',');
    const destinatarios = rolesList
      .map((item) => item.dataValues.Role.dataValues.name)
      .join(", ");
    return {
      emails,
      destinatarios,
    };
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
            sumScore += ( stack.dataValues.score || 0 ) * sub.dataValues.scoreMultiplier;
            maxScore += 2 * sub.dataValues.scoreMultiplier;
          });
        });
      });
    });
    doc
      .font('Helvetica')
      .fontSize(13)
      .text(`Puntaje \nObtenido:`, doc.x, 260, {
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
      .text(`${maxScore}`, doc.x, 300, {
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
      .text(`${parseInt((sumScore / (maxScore)) * 100)}%`, doc.x, 300, {
        align: 'right',
      });
  }

  async function createPdfReport(userId, checkList, branchId, destinatarios, dateTimeStr,docBuffers) {
    const colorText = '#13375B';
    const colorLine = '#F6BE61';

    const nomUser = await User.findOne({ where: { id: userId } });
    nameBranch = await Branches.findOne({ where: { id: branchId }, include: [{ model: Restaurant, as: 'Restaurant', required: true}] });
    
    const pdfBuffer = await new Promise(async (resolve, reject) => {
      const doc = new PDFDocument({
        bufferPages: true,
        margin: 30,
        size: 'A4',
      });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

//let fs = require('fs')
//doc.pipe(fs.createWriteStream('./bonApp_apifile.pdf'));
      
      now = new Date();
      const offset = 180 * 60000; //queda con 180, porque las apis server ejecutan en UTC //now.getTimezoneOffset() * 60000; // Obtener el desplazamiento de la zona horaria en milisegundos
      const today = new Date(now - offset); // Ajustar la hora al tiempo local
      console.log('offset: '+offset+' now: '+now)
      console.log('today: ' +today)
      console.log(`Hora UTC ${today.getUTCHours().toString().padStart(2, '0')}:${today.getUTCMinutes().toString().padStart(2, '0')}`)
      console.log(`Hora get ${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`)

      doc
        .fontSize(10)
        .fillColor(colorText)
        .text(`Fecha: ${dateTimeStr}`, doc.x, 30, {
          align: 'left',
        });
      doc.image(
        await getOCIBufferedImage(nameBranch.dataValues.patent_url),
        (doc.page.width - 90) / 2,
        30,
        {
          width: 90,
          height: 90,
          //align: 'center',
        }
      );
      
      doc
        .fontSize(10)
        .text(`Hora: ${today.getUTCHours().toString().padStart(2, '0')}:${today.getUTCMinutes().toString().padStart(2, '0')}`, doc.x, 30, {
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
          .text(`${nameBranch.dataValues.short_name}`, {
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
          .text(`DESTINATARIOS: ${destinatarios.destinatarios.replace(", SYSTEM","")}`, {
            //width: 410,
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
          
          listSub = 1;
          doc.moveDown();

          for (const subTask of mainTask.subTasks) {
            doc
              .font('Helvetica')
              .fontSize(13)
              .fillColor(colorText)
              .text(`${listMain}) ${subTask.dataValues.name} (${subTask.dataValues.scoreMultiplier})`, {
                align: 'left',
                // indent: 20,
                // textIndent: 20,
              });

            listSub++;
            listMain++;
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
                ? subTask.sTaskInstances[0].score * subTask.dataValues.scoreMultiplier
                : 0;
                
            doc
              .font('Helvetica-Bold')
              .fontSize(13)
              .text(`Score: ${score}`, { align: 'left', indent: 20 });
            doc.moveDown();

            let enter = 0;
            let cantImg = subTask.sTaskInstances[0].documents.length;
            let counterImage = 0;
            let imagey = doc.y;
            for (const image of subTask.sTaskInstances[0].documents) {
              //const ociImageUrl = `https://swiftobjectstorage.sa-santiago-1.oraclecloud.com/v1/axmlczc5ez0w/bucket-bonapp/${image.name}`; // subTask.dataValues.imageUrl; // Reemplazar con la propiedad real donde almacenas la URL de la imagen
              // Obtener la imagen como un buffer
              //const imageBuffer = await getOCIBufferedImage(ociImageUrl);

              console.log(image.name+ '; '+image.staskInstance_id)
              const findDoc = docBuffers.find(dc => dc.docs.dataValues.name === image.name);

              const imageBuffer = findDoc.buff

              //resize de la imagen para que no se deforme:
              const maxWidth = 250
              const maxHeight = 235

              const dimension = imageSize(imageBuffer)

              const ratio = Math.min(maxWidth / dimension.width, maxHeight / dimension.height);
              console.log(dimension.width+' x '+ dimension.height +' = ratio = '+ratio)


              // Agregar la imagen al PDF

              // logica para agregar salto de pagina cuando supere el alto de pagina
              if (enter == 0 && (doc.page.height - doc.y - doc.page.margins.bottom) < dimension.height*ratio)
                {
                  doc.addPage();
                  imagey = doc.y;
                }

              //Tamaño de a4 en pixeles es: 595.28 x 841.89. Con margen sup e inf 30, queda centrado y entran 6 por pag.  
              doc.image(
                  imageBuffer,
                  40+(enter * 250), //(doc.page.width - dimension.width*ratio) / 2,
                  imagey,
                  {
                    fit: [250, 250],
                    align: 'center',
                    valign: 'center',
                    width: dimension.width*ratio,
                    height: dimension.height*ratio,
                  }
                )
                .stroke();

              doc.y = imagey +250;

              enter++;
              counterImage++;
              if(enter > 1 || cantImg == counterImage){
                enter = 0;
                doc.moveDown();
                imagey = doc.y;
                
              }
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
            doc.page.height - 20,
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


  async function createPDFAndSendEmail(data) {
    const { userId, branchId, checkListId, dateNow } = data;

    let dateTimeStr = '';
      //dateNow ahora viene del front dd-mm-yyyy
      if (dateNow) {
        dateTimeStr = dateNow
        console.log('dateNow: ', dateTimeStr);
      } else {
        //TODO quitar esto dsp de release apk
        now = new Date();
        const offset = 180 * 60000; //queda con 180, porque las apis server ejecutan en UTC //now.getTimezoneOffset() * 60000; // Obtener el desplazamiento de la zona horaria en milisegundos
        const localDateTime = new Date(now - offset); // Ajustar la hora al tiempo local
        console.log('localDateTime: ', localDateTime, ' offset: ', offset);
        dateTimeStr = `${localDateTime.getUTCDate().toString().padStart(2, '0')}-${(localDateTime.getUTCMonth()+1).toString().padStart(2, '0')}-${localDateTime.getUTCFullYear()}`;
      }

      console.log('dateTimeStr: ', dateTimeStr);

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
                    [Op.and]: [
                      { user_id: userId },
                      STaskInstance.sequelize.where(
                        STaskInstance.sequelize.fn(
                          'DATE_FORMAT',
                          STaskInstance.sequelize.col('dateTime'),
                          '%d-%m-%Y'
                        ),
                        dateTimeStr
                      ),
                    ],
                  },
                  required: true, // Esto hace que la inclusión sea una left outer join
                  include: [
                    {
                      model: Document,
                      as: 'documents',
                      required: false, // Esto hace que la inclusión sea una left outer join
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      order: [[SubTask.sequelize.col('mainTasks.orden'), 'ASC'],[SubTask.sequelize.col('mainTasks.subTasks.orden'), 'ASC']]
    });

    if (checkList.length == 0) throw new Error('checkList no encontrados');

    let docs = [];
    checkList.forEach((check) => {
      check.dataValues.mainTasks.forEach((main) => {
        main.dataValues.subTasks.forEach((sub) => {
          sub.dataValues.sTaskInstances.forEach((stask) => {
            if (stask.documents.length > 0 )
              stask.documents.forEach((doc) => {
                docs.push(doc)
              });
          });
        });
      });
    });
    
    const docBuffers = await getAllDocuments(docs)


    const arrayIdChecklist = checkList.map((item) => item.dataValues.id); // UNIQUE ID CHECKLIST
    const destinatarios = await getDestinatarioAndMails(arrayIdChecklist, branchId);
    const pdfReport = await createPdfReport(
      userId,
      checkList,
      branchId,
      destinatarios,
      dateTimeStr,
      docBuffers,
    );
    
    const mailAuditor = await getMailAuditor(userId);     

    destinatarios.emails+=',' + mailAuditor.dataValues.email

    console.log('destinatiariosPREV: '+destinatarios.emails)


    

    const dateTimeSplit = dateTimeStr.split('-');

    const fechaYYYYmmDD = `${dateTimeSplit[2]}-${dateTimeSplit[1]}-${dateTimeSplit[0]}`


    const auditDesc = checkList.map((item) => item.dataValues.desc);
    
    const subject = auditDesc + ' - ' + 
                    //nameBranch.dataValues.Restaurant.name + ' - ' + 
                    nameBranch.dataValues.short_name + ' - ' + 
                    fechaYYYYmmDD //dateTimeStr.replaceAll('-','/')
    
    const attachFileName = `${subject.replaceAll('-','_').replaceAll(' _ ','_')}.pdf`

    const mailBody = `Estimado equipo,

    Espero que este correo le encuentre bien. Como se acordó previamente, he completado nuestra auditoría programada en su restaurante hoy dia. 
    Quisiera agradecerles por su cooperación y disposición durante este proceso.
    Quedo a su disposición para discutir cualquier aspecto de nuestra auditoría en mayor detalle o para brindar asistencia adicional según sea necesario.
    
Saludos cordiales, ${mailAuditor.dataValues.firstName}.`


    const mailOptions = {
      from: {
        name: 'Audit Bon App',
        address: fastify.config.email.user
            },
      to: destinatarios.emails,
      //to: fastify.config.email.audit,
      subject: subject,
      text: mailBody,
      attachments: [
        {
          filename: attachFileName, //'informe.pdf',
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
      host: "smtp.dreamhost.com",
      port: 465,
      secure: true,
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
