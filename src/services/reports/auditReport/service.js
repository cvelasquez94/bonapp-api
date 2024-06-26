const PDFDocument = require('pdfkit');
const fetch = require('node-fetch');
const imageSize = require('image-size')
const { Op } = require('sequelize');
const { mail } = require('../../../utils');
let nameBranch;

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
    ReportInstance,
    ChecklistBranch,
  } = fastify.db;


  const { getMailBody } = require('../getMailBody/service')(fastify);

const getImageFromBucket = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: fastify.config.storage.auth
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  return response.buffer()
}

const putFileToBucket = async (url, contentType, data) => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: fastify.config.storage.auth,
      'Content-Type': contentType
  },
   body: data
  });

  if (!response.ok) {
    throw new Error(`Failed to put file: ${response.statusText}`);
  }

  return response.status
}

const getAllDocuments = async (docs) => {
  const peticiones = docs.map( async (docs) => {
    const url = `${fastify.config.storage.url}${docs.dataValues.name}`
    return  await getImageFromBucket(url)
     .then((ret) => {
      return {docs, buff: ret}
      })
  })
  return await Promise.all(peticiones)
}


  async function getMailAuditor(userId) {
    const userAudit = await User.findOne({ where: { id: userId } });
    //console.log('mail user audit: ', userAudit.dataValues.email);
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
            if(stack.dataValues.score != -1){ //BON-191
              sumScore += ( stack.dataValues.score || 0 ) * sub.dataValues.scoreMultiplier;
              maxScore += 2 * sub.dataValues.scoreMultiplier;
              }
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
      .text(`${Math.round((sumScore / ( (maxScore===0)? 1: maxScore )) * 100)}%`, doc.x, 300, {
        align: 'right',
      });
  }

  async function createPdfReport(userId, checkList, branchId, destinatarios, dateTimeStr, docBuffers, finalComment, flagPreview) {
    const colorText = '#13375B';
    const colorLine = '#F6BE61';
    const colorLineComment = '#4EDF45';

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

//  let fs = require('fs')
//  doc.pipe(fs.createWriteStream('./bonApp_apifile.pdf'));

     
      now = new Date();
      const offset = 240 * 60000; //queda con 180, porque las apis server ejecutan en UTC //now.getTimezoneOffset() * 60000; // Obtener el desplazamiento de la zona horaria en milisegundos
      const today = new Date(now - offset); // Ajustar la hora al tiempo local
      // console.log('offset: '+offset+' now: '+now)
      // console.log('today: ' +today)
      // console.log(`Hora UTC ${today.getUTCHours().toString().padStart(2, '0')}:${today.getUTCMinutes().toString().padStart(2, '0')}`)
      // console.log(`Hora get ${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`)

//resize de la imagen para que no se deforme:
const maxWidth = 90
const maxHeight = 90

const logoImage = await getImageFromBucket(nameBranch.dataValues.patent_url);

const dimension = imageSize(logoImage)

const ratio = Math.min(maxWidth / dimension.width, maxHeight / dimension.height);

      doc
        .fontSize(10)
        .fillColor(colorText)
        .text(`Fecha: ${dateTimeStr}`, doc.x, 30, {
          align: 'left',
        });
      doc.image(
        logoImage,
        (doc.page.width - 90) / 2,
        30,
        {
          fit: [90, 90],
          align: 'center',
          valign: 'center',
          width: dimension.width*ratio,
          height: dimension.height*ratio,
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
          .text(task.dataValues.desc, {
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

        if(finalComment){
          doc
            .lineCap('round')
            .moveTo(doc.page.margins.left, doc.y)
            .lineTo(doc.page.width - doc.page.margins.left, doc.y)
            .stroke(colorLineComment);
          doc.moveDown();

          doc
          .fillColor(colorText)
          .fontSize(14)
          .text(`Resumen de la visita:`, {
            align: 'left',
          });

          doc
            .fontSize(13)
            .font('Helvetica')
            .fillColor(colorText)
            .text(`${finalComment}`, {
              align: 'left', indent: 50
            });
            
          doc.moveDown();

          doc
            .lineCap('round')
            .moveTo(doc.page.margins.left, doc.y)
            .lineTo(doc.page.width - doc.page.margins.left, doc.y)
            .stroke(colorLineComment);
          doc.moveDown();

        }
        else {
          doc
            .lineCap('round')
            .moveTo(doc.page.margins.left, doc.y)
            .lineTo(doc.page.width - doc.page.margins.left, doc.y)
            .stroke(colorLine);
          doc.moveDown();
        }

        //doc.moveDown();
        let listMain = 1;
        let listSub = 1;
        for (const mainTask of task.mainTasks) {
          doc
            .font('Helvetica-Bold')
            .fontSize(13)
            .fillColor(colorText)
            .text(`${mainTask.dataValues.name}`, {
              align: 'left',
            });
          
          listSub = 1;
          doc.moveDown();

          for (const subTask of mainTask.subTasks) {
            if(subTask.dataValues.scoreMultiplier == 3){ //BON-189
            doc
              .font('Helvetica')
              .fontSize(13)
              .fillColor(colorText)
              .text(`${listMain}) ${subTask.dataValues.name}*`, {
                align: 'left',
                // indent: 20,
                // textIndent: 20,
              });
            }else{
              doc
                .font('Helvetica')
                .fontSize(13)
                .fillColor(colorText)
                .text(`${listMain}) ${subTask.dataValues.name}`, {
                  align: 'left',
                  // indent: 20,
                  // textIndent: 20,
                });

            }

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
                ? subTask.sTaskInstances[0].score //* subTask.dataValues.scoreMultiplier //#BON-49
                : 0;
            
            const scoreShow = (score==-1) ? 'N/A' : score;
                
            doc
              .font('Helvetica-Bold')
              .fontSize(13)
              .text(`Score: ${scoreShow}`, { align: 'left', indent: 20 });
            doc.moveDown();

            let enter = 0;
            let cantImg = subTask.sTaskInstances[0].documents.length;
            let counterImage = 0;
            let imagey = doc.y;
            for (const image of subTask.sTaskInstances[0].documents) {
              // Obtener la imagen como un buffer

              //console.log(image.name+ '; '+image.staskInstance_id)
              const findDoc = docBuffers.find(dc => dc.docs.dataValues.name === image.name);

              const imageBuffer = findDoc.buff

              //resize de la imagen para que no se deforme:
              const maxWidth = 250
              const maxHeight = 235

              const dimension = imageSize(imageBuffer)

              const ratio = Math.min(maxWidth / dimension.width, maxHeight / dimension.height);
              //console.log(dimension.width+' x '+ dimension.height +' = ratio = '+ratio)


              // Agregar la imagen al PDF

              // logica para agregar salto de pagina cuando supere el alto de pagina
              if (enter == 0 && (doc.page.height - imagey - doc.page.margins.bottom - 40) < maxHeight)
                {
                  doc.addPage();
                  imagey = doc.y;
                }

              //Tamaño de a4 en pixeles es: 595.28 x 841.89. Con margen sup e inf 30, queda centrado y entran 6 por pag.  
              doc.image(
                  imageBuffer,
                  40+(enter * 260), //(doc.page.width - dimension.width*ratio) / 2,
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

      if(i==end-1){
        doc
          .fontSize(8)
          .font('Helvetica')
          .text(
            `Los items marcados con * corresponden a puntos críticos o factores de riesgo por lo que tienen una ponderación mayor en el puntaje final`,
            10,
            doc.page.height - 35,
            {
              lineBreak: false,
              oblique: true,
              //align: 'justify',
            }
          );
        
      }
      
      if(flagPreview){
          doc.image(
            './preview1.png',
            0,
            100,
            {
            //cover: [doc.page.width - 100, doc.page.height - 100],
            fit: [595, 840],
            align: 'center',
            valign: 'center',
            lineBreak: false,
          }
          );
        }
      
        doc
          .fontSize(10)
          .font('Helvetica')
          .fillColor(colorText)
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
    const { userId, branchId, checkListId, dateNow, comment, flagPreview } = data;

    let dateTimeStr = '';
      //dateNow ahora viene del front dd-mm-yyyy
      if (dateNow) {
        dateTimeStr = dateNow
        //console.log('dateNow: ', dateTimeStr);
      } else {
        //TODO quitar esto dsp de release apk
        now = new Date();
        const offset = 240 * 60000; //queda con 180, porque las apis server ejecutan en UTC //now.getTimezoneOffset() * 60000; // Obtener el desplazamiento de la zona horaria en milisegundos
        const localDateTime = new Date(now - offset); // Ajustar la hora al tiempo local
        //console.log('localDateTime: ', localDateTime, ' offset: ', offset);
        dateTimeStr = `${localDateTime.getUTCDate().toString().padStart(2, '0')}-${(localDateTime.getUTCMonth()+1).toString().padStart(2, '0')}-${localDateTime.getUTCFullYear()}`;
      }

      //console.log('dateTimeStr: ', dateTimeStr);

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
                      { user_id: userId, branch_id: branchId },
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
        {
              model: ChecklistBranch.unscoped(),
              as: 'ChecklistBranch',
              required: true,
              where: { branch_id: branchId },
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
      comment,
      flagPreview,
    );
    
    const mailAuditor = await getMailAuditor(userId);     

    destinatarios.emails+=',' + mailAuditor.dataValues.email

    //console.log('destinatiariosPREV: '+destinatarios.emails)
    

    const dateTimeSplit = dateTimeStr.split('-');

    const fechaYYYYmmDD = `${dateTimeSplit[2]}-${dateTimeSplit[1]}-${dateTimeSplit[0]}`


    const auditDesc = checkList.map((item) => item.dataValues.desc);
    
    const subject = auditDesc + ' - ' + 
                    //nameBranch.dataValues.Restaurant.name + ' - ' + 
                    nameBranch.dataValues.short_name + ' - ' + 
                    fechaYYYYmmDD //dateTimeStr.replaceAll('-','/')
    
    const attachFileName = `${subject.replaceAll('-','_').replaceAll(' _ ','_').replaceAll('/','').replaceAll('\\','').replaceAll(' ','_')}.pdf` //`${subject.replace(//|_/g, ' ')}.pdf`

    const contentType = 'application/pdf'
        

    if(flagPreview)
    {
      const Preview_attachFileName = 'P_' + attachFileName;

      const dataInsert = {
        name: Preview_attachFileName,
        url: '',
        comment: comment,
        subject: '',
        mailTo: '',
        size: pdfReport.length,
        dateNow: dateTimeStr,
        checklist_id: checkListId,
        branch_id: branchId,
        user_id: userId,
        flagPreview: flagPreview,
        contentType: contentType,

      }
      //console.log(dataInsert)

      const instance = await ReportInstance.create(dataInsert);
      if (!instance) {
        //console.log(dataInsert)
        throw new Error('Error insertando ReportInstance, Preview OK');
      }

      return {
      message: 'ok',
      fileName: Preview_attachFileName,
      contentType: contentType,
      base64: pdfReport.toString('base64'),
      }
    }
    else
    {
      let mailBodyR;
      try{
        mailBodyR = await getMailBody('AuditReport');
      }catch{console.log(`No existe: getMailBody('AuditReport')`)}

      const mailBody = mailBodyR ? mailBodyR.text : undefined;
      
      const mailOptions = {
        to: destinatarios.emails,
        subject: subject,
        secure: true,
        attachments: [
          {
            filename: attachFileName,
            content: pdfReport,
          },
        ],
      };
  

      //CASE STREAT JIR BON-235
      let mailBodyTmp = mailBody;

      if(arrayIdChecklist == 162){
        mailBodyTmp =
`<!DOCTYPE html>
<html>
<p><strong>Buenos días.<br><br>

Se comparte el resultado de la Auditoría de Seguridad Alimentaria realizada el día de hoy en el local.<br><br>

Por favor imprimir este documento y guardarlo en la carpeta correspondiente. <br><br>

Enviar dentro de las 72 horas siguientes los planes de acción a ejecutar. <br><br>

Muchas gracias.
</strong></p>
</html>`
      }
      else if(arrayIdChecklist == 161){
        mailBodyTmp =
`<!DOCTYPE html>
<html>
<p><strong>Buenos dias.<br><br>

Se comparte el resultado de la Auditoría de Prevencion de Riesgos realizada el día de hoy en el local.<br><br>

Por favor imprimir este documento y guardarlo en la carpeta de Prevención de Riesgos.<br><br>

Revisar las oportunidades de mejora para resolver a la brevedad posible.<br><br>

Saludos cordiales<br><br><br>



Nicolas Contreras Aguirre.<br><br>

Prevención de Riesgos Streat Burger.
</strong></p>
</html>`
      }

      await mail.sendAuditEmail(mailOptions, mailAuditor.dataValues.firstName, mailBodyTmp)

      //await mail.sendAuditEmail(mailOptions, mailAuditor.dataValues.firstName, mailBody)
      

      const urlPut = `${fastify.config.storage.url}Reports/user_${userId}/${attachFileName}` //`${fastify.config.storage.url}${fastify.config.storage.environment}/${attachFileName.replaceAll('/','_')}`.replaceAll(' ','_')

      const responsePut = await putFileToBucket(urlPut, contentType, pdfReport)
      
      const dataInsert = {
        name: attachFileName,
        url: `Reports/user_${userId}/${attachFileName}`,
        comment: comment,
        subject: subject,
        mailTo: destinatarios.emails,
        size: pdfReport.length,
        dateNow: dateTimeStr,
        checklist_id: checkListId,
        branch_id: branchId,
        user_id: userId,
        flagPreview: flagPreview,
        contentType: contentType,

      }
      //console.log(dataInsert)

      const instance = await ReportInstance.create(dataInsert);
      if (!instance) {
        //console.log(dataInsert)
        throw new Error('Error insertando ReportInstance, Mail OK');
      }

      return {
      message: 'ok',
      fileName: attachFileName,
      contentType: contentType,
      base64: urlPut,
      }   
    }
    

  }

  return {
    createPDFAndSendEmail,
  };
};
