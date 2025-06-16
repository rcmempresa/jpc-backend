const nodemailer = require('nodemailer');
require('dotenv').config();

const transporterGmail = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const transporterConfirmacao = nodemailer.createTransport({
  host: 'webdomain03.dnscpanel.com', // seu servidor SMTP
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.CONFIRMATION_EMAIL_USER,
    pass: process.env.CONFIRMATION_EMAIL_PASS,
  },
});

const gerarTemplateConfirmacao = (name, subject, message) => `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <title>Confirmação de Mensagem</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .email-container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .email-header { background-color: #0000CD; color: #fff; padding: 20px; text-align: center; }
    .email-body { padding: 30px; color: #333; line-height: 1.6; }
    .email-footer { background-color: #f0f0f0; text-align: center; padding: 20px; font-size: 13px; color: #888; }
    .brand { font-weight: bold; color: #0000CD; }
    .button { display: inline-block; padding: 10px 20px; background-color: #0000CD; color: #fff !important; text-decoration: none; border-radius: 4px; margin-top: 20px; }
    .message-box { background-color: #f9f9f9; border-left: 4px solid #0000CD; padding: 15px; font-style: italic; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>JPCRodrigues</h1>
      <p>Recebemos a sua mensagem!</p>
    </div>
    <div class="email-body">
      <p>Olá <strong>${name}</strong>,</p>
      <p>Obrigado por entrar em contacto com a <span class="brand">JPC Rodrigues</span>. A sua mensagem foi recebida com sucesso e será analisada pela nossa equipa.</p>
      <p><strong>Assunto:</strong> ${subject}</p>
      <p>Entretanto, aqui está um resumo do que nos enviou:</p>
      <div class="message-box">${message.replace(/\n/g, '<br/>')}</div>
      <p>Responderemos o mais brevemente possível. Agradecemos a sua confiança!</p>
      <a href="https://www.jpcrodrigues.pt" class="button">Visitar o nosso site</a>
    </div>
    <div class="email-footer">© ${new Date().getFullYear()} JPC Rodrigues • Todos os direitos reservados</div>
  </div>
</body>
</html>
`;

const sendContactMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Por favor, preencha todos os campos.' });
  }

  try {
    // Enviar email para o proprietário
    await transporterGmail.sendMail({
      from: '"JPC Rodrigues Website" <no-reply@jpcrodrigues.pt>',
      to: process.env.EMAIL_RECEIVER,
      subject: `📩 Nova mensagem de contacto: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html lang="pt">
        <head>
        <meta charset="UTF-8" />
        <title>Nova mensagem de contacto</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f7f9fc; margin: 0; padding: 0; color: #333; }
          .container { max-width: 600px; background: #fff; margin: 30px auto; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #e0e0e0; }
          .header { background-color: #0000CD; color: #fff; padding: 20px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
          .content { padding: 30px; }
          .label { font-weight: 600; color: #555; }
          .message-box { background: #f9f9f9; border-left: 5px solid #0000CD; padding: 15px 20px; margin: 20px 0; font-style: italic; white-space: pre-wrap; color: #444; border-radius: 4px; }
          .footer { background: #f0f0f0; padding: 15px 30px; text-align: center; font-size: 13px; color: #888; border-top: 1px solid #ddd; }
          a.button { display: inline-block; margin-top: 20px; padding: 12px 25px; background: #0000CD; color: #fff !important; text-decoration: none; font-weight: 600; border-radius: 5px; }
          a.button:hover { background: #0000CD; }
        </style>
        </head>
        <body>
        <div class="container">
          <div class="header">
            <h1>Nova mensagem de contacto</h1>
          </div>
          <div class="content">
            <p><span class="label">Nome:</span> ${name}</p>
            <p><span class="label">Email:</span> <a href="mailto:${email}">${email}</a></p>
            <p><span class="label">Assunto:</span> ${subject}</p>
            <p><span class="label">Mensagem:</span></p>
            <div class="message-box">${message.replace(/\n/g, '<br/>')}</div>
            <a href="mailto:${email}" class="button">Responder ao cliente</a>
          </div>
          <div class="footer">© ${new Date().getFullYear()} JPCRodrigues • Todos os direitos reservados</div>
        </div>
        </body>
        </html>
      `,
    });

    // Email de confirmação ao cliente
    const htmlConfirmacao = gerarTemplateConfirmacao(name, subject, message);
    await transporterConfirmacao.sendMail({
      from: `"JPCRodrigues" <${process.env.CONFIRMATION_EMAIL_USER}>`,
      to: email,
      subject: 'Recebemos a sua mensagem!',
      html: htmlConfirmacao,
    });

    res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso.' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao enviar a mensagem.' });
  }
};

module.exports = { sendContactMessage };
