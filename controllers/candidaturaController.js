// controllers/candidaturaController.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const jobApplicationModel = require('../models/jobApplicationModel');
require('dotenv').config();

// --- Configuração do Multer (mantida como antes) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve('uploads/cvs');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Apenas ficheiros PDF são permitidos!'), false);
  }
};

const MY_MULTER_FILE_LIMIT_MB = 10;
const MY_MULTER_FILE_LIMIT_BYTES = MY_MULTER_FILE_LIMIT_MB * 1024 * 1024;

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: MY_MULTER_FILE_LIMIT_BYTES }
});

exports.upload = upload;

// --- Mapeamento de Vagas (ADICIONADO PARA O TITULO) ---
// Idealmente, isto viria de uma base de dados de vagas.
// Para agora, espelha as vagas hardcoded do frontend.
const jobsData = [
  { id: 1, title: 'Operador de Corte de Betão' },
  { id: 2, title: 'Técnico de Furação' },
  { id: 3, title: 'Coordenador de Obra' },
  { id: 4, title: 'Comercial Júnior' },
  // Adiciona mais vagas aqui se tiveres mais no frontend
];

// Cria um objeto para mapeamento rápido de ID para Título
const jobTitleMap = jobsData.reduce((map, job) => {
    map[job.id] = job.title;
    return map;
}, {});

// --- Configuração dos Transporters de E-mail (mantida como antes) ---
const transporterGmail = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const transporterConfirmacao = nodemailer.createTransport({
  host: process.env.CONFIRMATION_EMAIL_HOST || 'webdomain03.dnscpanel.com',
  port: process.env.CONFIRMATION_EMAIL_PORT ? parseInt(process.env.CONFIRMATION_EMAIL_PORT, 10) : 465,
  secure: true,
  auth: {
    user: process.env.CONFIRMATION_EMAIL_USER,
    pass: process.env.CONFIRMATION_EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false }
});

// --- Função Principal do Controller para Enviar Candidatura ---
exports.sendCandidatura = async (req, res) => {
  const cvPath = req.file ? req.file.path : null;

  try {
    const { name, email, phone, message, jobId } = req.body;

    // Validação básica dos dados obrigatórios
    const parsedJobId = parseInt(jobId, 10);
    if (!name || !email || !phone || !jobId || parsedJobId <= 0) {
      if (cvPath) { fs.unlink(cvPath, (err) => { if (err) console.error('Erro ao apagar CV inválido:', err); }); }
      return res.status(400).json({ message: 'Campos obrigatórios (Nome, Email, Telefone, ID da Vaga) em falta ou ID da vaga inválido.' });
    }

    // Validação de formato para email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        if (cvPath) { fs.unlink(cvPath, (err) => { if (err) console.error('Erro ao apagar CV com email inválido:', err); }); }
        return res.status(400).json({ message: 'Formato de email inválido.' });
    }

    // --- OBTER O TÍTULO DA VAGA A PARTIR DO ID ---
    const jobTitle = jobTitleMap[parsedJobId] || `Vaga com ID ${parsedJobId} (Desconhecida)`;


    // --- GUARDAR A CANDIDATURA NA BASE DE DADOS ---
    const newApplication = await jobApplicationModel.createJobApplication({
      name,
      email,
      phone,
      message,
      jobId: parsedJobId,
      cvPath,
      // Se o teu modelo de DB puder guardar o título da vaga, adiciona-o aqui:
      // jobTitle: jobTitle,
    });

    // Adiciona o jobTitle ao objeto newApplication em memória para os emails
    newApplication.jobTitle = jobTitle;

    console.log('Candidatura guardada na DB:', newApplication);

    // --- ENVIAR E-MAIL DE CONFIRMAÇÃO AO CANDIDATO ---
    try {
      const infoCandidato = await transporterConfirmacao.sendMail({
      from: `"JPC Rodrigues Website" <${process.env.CONFIRMATION_EMAIL_USER}>`,
      to: email,
      subject: `Confirmação de Candidatura Recebida - ${jobTitle} - J. P. Rodrigues`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0d47a1; padding: 20px; text-align: center;">
          </div>

          <div style="padding: 25px;">
            <p style="font-size: 16px;">Olá ${name},</p>

            <p style="font-size: 16px;">Agradecemos a sua candidatura à vaga de <strong>${jobTitle}</strong> na J. P. Rodrigues.</p>

            <p style="font-size: 16px;">Recebemos os seus dados e o seu CV com sucesso. A sua candidatura está a ser revista pela nossa equipa de recrutamento.</p>

            <p style="font-size: 16px;">Entraremos em contacto consigo caso o seu perfil se adeque aos nossos requisitos. Pedimos a sua compreensão, pois apenas os candidatos selecionados para a próxima fase serão contactados.</p>

            <p style="font-size: 16px; margin-top: 25px;">Com os melhores cumprimentos,</p>
            <p style="font-size: 16px; margin-bottom: 5px;">A Equipa de Recrutamento J. P. Rodrigues</p>
          </div>

          <div style="border-top: 1px solid #eee; padding: 20px; text-align: center; background-color: #f9f9f9; font-size: 12px; color: #777;">
            <p style="margin: 0;"><small>Este é um e-mail automático, por favor não responda.</small></p>
            <p style="margin: 5px 0 0;">© 2025 JPC Rodrigues. Todos os direitos reservados.</p>
            <p style="margin: 5px 0 0;">Desenvolvido por <a href="https://1way.pt" target="_blank" rel="noopener noreferrer" style="color: #0d47a1; text-decoration: none;">1way.pt</a></p>
          </div>
        </div>
        `,
    });
      console.log('E-mail de confirmação enviado ao candidato:', infoCandidato.messageId);
    } catch (emailErrorCandidato) {
      console.error('Erro ao enviar e-mail de confirmação ao candidato:', emailErrorCandidato);
    }

    // --- ENVIAR E-MAIL AO DONO/ADMIN DA EMPRESA ---
    try {
      const infoDono = await transporterGmail.sendMail({
        from: `"JPC Rodrigues Website" <no-reply@jpcrodrigues.pt>`,
        to: process.env.EMAIL_RECEIVER, // Certifique-se que EMAIL_RECEIVER está configurado no .env
        subject: `Nova Candidatura para a vaga: ${jobTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #0d47a1; padding: 20px; text-align: center; color: #ffffff;">
              <h2 style="margin: 0; font-size: 24px;">Nova Candidatura Recebida</h2>
              <p style="margin: 5px 0 0; font-size: 16px;">J. P. Rodrigues - Sistema de Candidaturas</p>
            </div>

            <div style="padding: 25px;">
              <p style="font-size: 16px;">Prezado(a) responsável,</p>
              <p style="font-size: 16px;">Foi submetida uma nova candidatura através do website para a seguinte vaga:</p>

              <h3 style="color: #0d47a1; margin-top: 25px; margin-bottom: 10px; font-size: 18px;">Detalhes da Candidatura:</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 8px;"><strong style="color: #0d47a1;">Vaga Candidatada:</strong> <span style="color: #555;">${jobTitle}</span></li>
                <li style="margin-bottom: 8px;"><strong style="color: #0d47a1;">Nome:</strong> <span style="color: #555;">${name}</span></li>
                <li style="margin-bottom: 8px;"><strong style="color: #0d47a1;">Email:</strong> <a href="mailto:${email}" style="color: #0d47a1; text-decoration: none;">${email}</a></li>
                <li style="margin-bottom: 8px;"><strong style="color: #0d47a1;">Telefone:</strong> <a href="tel:${phone}" style="color: #0d47a1; text-decoration: none;">${phone}</a></li>
              </ul>

              <h3 style="color: #0d47a1; margin-top: 25px; margin-bottom: 10px; font-size: 18px;">Mensagem do Candidato:</h3>
              <div style="background-color: #f0f0f0; border-left: 4px solid #0d47a1; padding: 15px; margin-bottom: 20px; font-style: italic; color: #555; border-radius: 4px;">
                <p style="margin: 0;">${message || 'Não fornecida'}</p>
              </div>

              <p style="font-size: 16px;">O CV do candidato está em anexo a este email e também foi guardado no servidor, na pasta <code>uploads/cvs</code>.</p>

              <p style="font-size: 16px; margin-top: 25px;">Atenciosamente,</p>
              <p style="font-size: 16px; margin-bottom: 5px;">Sistema de Candidaturas J. P. Rodrigues</p>
            </div>

            <div style="border-top: 1px solid #eee; padding: 20px; text-align: center; background-color: #f9f9f9; font-size: 12px; color: #777;">
              <p style="margin: 0;">Este é um e-mail de notificação automática.</p>
              <p style="margin: 5px 0 0;">© 2025 JPC Rodrigues. Todos os direitos reservados.</p>
            </div>
          </div>
        `,
        attachments: cvPath ? [
          {
            filename: path.basename(cvPath),
            path: cvPath,
            contentType: 'application/pdf'
          }
        ] : [],
      });
      console.log('E-mail de notificação enviado ao dono:', infoDono.messageId);
    } catch (emailErrorDono) {
      console.error('Erro ao enviar e-mail de notificação ao dono:', emailErrorDono);
    }

    res.status(201).json({
      message: 'Candidatura enviada e guardada com sucesso! E-mail de confirmação enviado.',
      applicationId: newApplication.id,
    });

  } catch (error) {
    console.error('Erro ao processar candidatura:', error);
    if (cvPath && fs.existsSync(cvPath)) {
      fs.unlink(cvPath, (err) => {
        if (err) console.error('Erro ao apagar CV após erro de candidatura:', err);
      });
    }

    if (error.code === '23502' || error.name === 'Error') {
        return res.status(400).json({ message: 'Erro na base de dados: Verifique os campos obrigatórios.', error: error.message });
    }
    res.status(500).json({ message: 'Erro interno do servidor ao enviar candidatura.', error: error.message });
  }
};