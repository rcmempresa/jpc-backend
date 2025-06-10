const pool = require('../config/db'); 


const createJobApplication = async ({ name, email, phone, message, jobId, cvPath }) => {
  const query = `
    INSERT INTO job_applications (name, email, phone, message, job_id, cv_path, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING id, name, email, phone, message, job_id, cv_path, created_at;
  `;
  const values = [name, email, phone, message, jobId, cvPath]; 

  try {
    const { rows } = await pool.query(query, values);
    return rows[0]; 
  } catch (error) {
    console.error('Erro ao criar candidatura na base de dados:', error);
    throw error; 
  }
};


module.exports = {
  createJobApplication,
};