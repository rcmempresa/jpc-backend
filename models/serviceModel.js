const pool = require('../config/db'); // ou o caminho para o teu pool

const getServicesByCategory = async (category) => {
  const query = 'SELECT * FROM services WHERE category = $1 ORDER BY id';
  const { rows } = await pool.query(query, [category]);
  return rows;
};

const getMainServices = () => getServicesByCategory('principal');

const getAdditionalServices = () => getServicesByCategory('complementar');

const getCertifications = async () => {
  const query = 'SELECT * FROM certifications ORDER BY id';
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = {
  getMainServices,
  getAdditionalServices,
  getCertifications,
};
