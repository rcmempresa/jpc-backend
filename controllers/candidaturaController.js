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
        from: process.env.CONFIRMATION_EMAIL_USER,
        to: email,
        subject: `Confirmação de Candidatura Recebida - ${jobTitle} - J. P. Rodrigues`,
        html: `
          <p>Olá ${name},</p>
          <p>Agradecemos a sua candidatura à vaga de <b>${jobTitle}</b> na J. P. Rodrigues.</p>
          <p>Recebemos os seus dados e o seu CV com sucesso. A sua candidatura está a ser revista pela nossa equipa de recrutamento.</p>
          <p>Entraremos em contacto consigo caso o seu perfil se adeque aos nossos requisitos.</p>
          <p>Com os melhores cumprimentos,</p>
          <p>A Equipa de Recrutamento J. P. Rodrigues</p>
          <hr/>
          <p><small>Este é um e-mail automático, por favor não responda.</small></p>
        `,
      });
      console.log('E-mail de confirmação enviado ao candidato:', infoCandidato.messageId);
    } catch (emailErrorCandidato) {
      console.error('Erro ao enviar e-mail de confirmação ao candidato:', emailErrorCandidato);
    }

    // --- ENVIAR E-MAIL AO DONO/ADMIN DA EMPRESA ---
    try {
      const infoDono = await transporterGmail.sendMail({
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: `Nova Candidatura para a vaga: ${jobTitle}`,
        html: `
          <p>Prezado(a) responsável,</p>
          <p>Foi submetida uma nova candidatura através do website:</p>
          <ul>
            <li><b>Nome:</b> ${name}</li>
            <li><b>Email:</b> ${email}</li>
            <li><b>Telefone:</b> ${phone}</li>
            <li><b>Vaga Candidatada:</b> ${jobTitle}</li>
            <li><b>Mensagem do Candidato:</b> ${message || 'Não fornecida'}</li>
          </ul>
          <p>Por favor, verifique a candidatura e o CV em anexo no servidor (pasta 'uploads/cvs').</p>
          <p>Atenciosamente,</p>
          <p>Sistema de Candidaturas J. P. Rodrigues</p>
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