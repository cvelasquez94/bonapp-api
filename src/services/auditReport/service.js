const PDFDocument = require('pdfkit');
const { ReadableStreamBuffer } = require('stream-buffers');
const nodemailer = require('nodemailer');

module.exports = (fastify) => {
    async function createPDFAndSendEmail(data, email) {
        const pdfBuffer = await new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
    
            // Agregar contenido al PDF
            doc.fontSize(25).text('Informe', 100, 80);
            doc.fontSize(15).text(`Fecha: ${new Date().toLocaleDateString()}`, 100, 120);
            doc.text(`Datos: ${data}`, 100, 150);
            doc.end();
        });
    

        console.log('fastify.config ', fastify.config.email.user)
    
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
            to: 'carlosbrunotbc@gmail.com',
            subject: 'Informe PDF',
            text: 'Aquí está tu informe.',
            attachments: [
                {
                    filename: 'informe.pdf',
                    content: pdfBuffer
                }
            ]
        };
    
        // Enviar correo
        await transporter.sendMail(mailOptions);
    }

    return {
        createPDFAndSendEmail
    }
}
