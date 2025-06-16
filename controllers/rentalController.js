// controllers/rentalController.js
const db = require('../config/db'); // Importa o pool de conexão do PostgreSQL
const nodemailer = require('nodemailer');
require('dotenv').config(); // Garante que as variáveis de ambiente estão carregadas

// Configuração do Nodemailer para enviar o e-mail de pedido de aluguer à empresa
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

const sendRentalRequest = async (req, res) => {
    // Extrai os dados do corpo da requisição (enviados pelo formulário do React)
    const { name, email, phone, company, startDate, endDate, location, message, machineId } = req.body;

    // --- 1. Validação dos Dados ---
    if (!name || !email || !phone || !startDate || !endDate || !location || !machineId) {
        return res.status(400).json({ success: false, message: 'Por favor, preencha todos os campos obrigatórios.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Formato de e-mail inválido.' });
    }

    if (new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({ success: false, message: 'A data de início não pode ser posterior à data de fim.' });
    }

    try {
        // --- 2. Salvar na Base de Dados (Interação com o "Model") ---
        // A query SQL para inserir um novo pedido na tabela RentalRequests
        const insertQuery = `
            INSERT INTO RentalRequests (machineId, name, email, phone, company, startDate, endDate, location, message)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, createdat; -- ALTERADO: "createdAt" para createdat (minúsculas, sem aspas)
        `;
        const values = [machineId, name, email, phone, company, startDate, endDate, location, message];

        const result = await db.query(insertQuery, values);
        const newRentalId = result.rows[0].id;
        console.log(`Pedido de aluguer ID ${newRentalId} salvo no DB.`);
        console.log('Valor de EMAIL_RECEIVER:', process.env.EMAIL_RECEIVER);
        // --- 3. Enviar E-mail à Empresa ---
       const mailOptions = {
    from: '"JPC Rodrigues Website" <no-reply@jpcrodrigues.pt>',
    to: process.env.EMAIL_RECEIVER,
    subject: `Novo Pedido de Aluguer de Máquina: ${name} (${company || 'Individual'})`,
    html: `
        <!DOCTYPE html>
        <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Novo Pedido de Aluguer - JPC Rodrigues</title>
            <style>
                body {
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .header {
                    background-color: #0d47a1; /* Azul escuro da JPC */
                    color: #ffffff;
                    padding: 20px 30px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: bold;
                }
                .header img {
                    max-width: 150px; /* Tamanho máximo do logotipo */
                    height: auto;
                    margin-bottom: 10px; /* Espaço entre o logo e o texto, se houver */
                }
                .content {
                    padding: 30px;
                }
                .content h2 {
                    color: #0d47a1;
                    font-size: 22px;
                    margin-top: 0;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #e0e0e0;
                    padding-bottom: 10px;
                }
                .detail-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                .detail-table th, .detail-table td {
                    text-align: left;
                    padding: 10px;
                    border-bottom: 1px solid #eeeeee;
                }
                .detail-table th {
                    background-color: #f9f9f9;
                    font-weight: bold;
                    width: 30%;
                }
                .highlight {
                    background-color: #e3f2fd;
                }
                .footer {
                    background-color: #eeeeee;
                    color: #777777;
                    text-align: center;
                    padding: 20px 30px;
                    font-size: 12px;
                    border-top: 1px solid #e0e0e0;
                }
                .button-link {
                    display: inline-block;
                    background-color: #1565c0; /* Azul do botão */
                    color: #ffffff !important; /* Letras brancas */
                    padding: 12px 25px;
                    border-radius: 5px;
                    text-decoration: none;
                    font-weight: bold;
                    margin-top: 25px;
                    border: 1px solid #1565c0; /* Para garantir a cor da borda */
                }
                .button-link:hover {
                    background-color: #0d47a1;
                    border-color: #0d47a1;
                }
                .note {
                    background-color: #fff3e0;
                    border-left: 5px solid #ff9800;
                    padding: 15px;
                    margin-top: 25px;
                    margin-bottom: 25px;
                    font-style: italic;
                    color: #555555;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Novo Pedido de Aluguer</h1>
                </div>
                <div class="content">
                    <h2>Detalhes do Pedido</h2>

                    <div class="note">
                        Por favor, entre em contacto com o cliente o mais breve possível para prosseguir com o pedido.
                    </div>

                    <table class="detail-table">
                        <tr class="highlight">
                            <th>ID do Pedido:</th>
                            <td>${newRentalId}</td>
                        </tr>
                        <tr>
                            <th>Máquina:</th>
                            <td>Geradora Trifásica SDMO R44C3-65 A (ID: ${machineId})</td>
                        </tr>
                        <tr class="highlight">
                            <th>Nome do Cliente:</th>
                            <td>${name}</td>
                        </tr>
                        <tr>
                            <th>Empresa:</th>
                            <td>${company || 'Não informada'}</td>
                        </tr>
                        <tr class="highlight">
                            <th>Email:</th>
                            <td><a href="mailto:${email}" style="color:#1565c0; text-decoration:none;">${email}</a></td>
                        </tr>
                        <tr>
                            <th>Telefone:</th>
                            <td><a href="tel:${phone}" style="color:#1565c0; text-decoration:none;">${phone}</a></td>
                        </tr>
                        <tr class="highlight">
                            <th>Período de Aluguer:</th>
                            <td>De ${new Date(startDate).toLocaleDateString('pt-PT')} a ${new Date(endDate).toLocaleDateString('pt-PT')}</td>
                        </tr>
                        <tr>
                            <th>Local da Obra:</th>
                            <td>${location}</td>
                        </tr>
                        <tr class="highlight">
                            <th>Observações:</th>
                            <td>${message || 'N/A'}</td>
                        </tr>
                    </table>

                    <p style="text-align: center; margin-top: 30px;">
                        <a href="mailto:${email}" class="button-link">Responder ao Cliente Agora</a>
                    </p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} JPC Rodrigues. Todos os direitos reservados.</p>
                    <p>Este email foi enviado automaticamente pelo website.</p>
                </div>
            </div>
        </body>
        </html>
    `,
};

        await transporter.sendMail(mailOptions);
        console.log(`E-mail de pedido de aluguer enviado para: ${process.env.EMAIL_RECEIVER}`);

        // --- 4. Responder ao Frontend ---
        res.status(200).json({ success: true, message: 'Pedido de aluguer enviado com sucesso! Entraremos em contacto consigo brevemente.' });

    } catch (error) {
        console.error('Erro ao processar pedido de aluguer:', error);
        if (error.code === 'ECONNREFUSED' || error.severity === 'FATAL') {
            return res.status(500).json({ success: false, message: 'Erro de conexão com a base de dados. Por favor, verifique a configuração do seu PostgreSQL e tente novamente mais tarde.' });
        }
        res.status(500).json({ success: false, message: 'Ocorreu um erro interno ao enviar o pedido. Tente novamente mais tarde.' });
    }
};

module.exports = {
    sendRentalRequest,
};