// controllers/candidaturaController.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jobApplicationModel = require('../models/jobApplicationModel'); // Importa o teu novo modelo

// --- Configuração do Multer (mantém-se a mesma) ---
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

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limite
});

// --- Função do Controller para Enviar Candidatura ---
exports.sendCandidatura = upload.single('cv'), async (req, res) => {
  try {
    const { name, email, phone, message, jobId } = req.body;
    const cvPath = req.file ? req.file.path : null; // Caminho completo do ficheiro guardado no servidor

    // Validação básica dos dados do formulário
    if (!name || !email || !phone || !jobId) {
      if (cvPath) { // Se o CV foi carregado mas os dados obrigatórios estão em falta, apaga o CV
        fs.unlink(cvPath, (err) => {
          if (err) console.error('Erro ao apagar CV inválido:', err);
        });
      }
      return res.status(400).json({ message: 'Campos obrigatórios (Nome, Email, Telefone, ID da Vaga) em falta.' });
    }

    // Validação de formato para email (exemplo simples, podes usar uma biblioteca para mais robustez)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        if (cvPath) { fs.unlink(cvPath, (err) => { if (err) console.error('Erro ao apagar CV com email inválido:', err); }); }
        return res.status(400).json({ message: 'Formato de email inválido.' });
    }

    // --- GUARDAR A CANDIDATURA NA BASE DE DADOS USANDO O MODELO ---
    const newApplication = await jobApplicationModel.createJobApplication({
      name,
      email,
      phone,
      message,
      jobId: parseInt(jobId, 10), // Garante que jobId é um número inteiro
      cvPath,
    });

    console.log('Candidatura guardada na DB:', newApplication);
    res.status(201).json({
      message: 'Candidatura enviada e guardada com sucesso!',
      application: newApplication,
      cvPath: cvPath // Opcional: envia o caminho do CV de volta para o frontend
    });

  } catch (error) {
    console.error('Erro ao processar candidatura:', error);
    // Em caso de erro, apaga o ficheiro CV se já foi guardado
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Erro ao apagar CV após erro de candidatura:', err);
      });
    }

    // Diferencia erros de base de dados de outros erros
    if (error.code === '23502' || error.name === 'Error') { // Exemplo para erros de NOT NULL no PostgreSQL
        return res.status(400).json({ message: 'Erro na base de dados: Verifique os campos obrigatórios.', error: error.message });
    }
    res.status(500).json({ message: 'Erro interno do servidor ao enviar candidatura.', error: error.message });
  }
};