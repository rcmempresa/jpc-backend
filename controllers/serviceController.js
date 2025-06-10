const servicesModel = require('../models/serviceModel');

const getMainServices = async (req, res) => {
  try {
    const services = await servicesModel.getMainServices();
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao obter serviços principais' });
  }
};

const getAdditionalServices = async (req, res) => {
  try {
    const services = await servicesModel.getAdditionalServices();
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao obter serviços complementares' });
  }
};

const getCertifications = async (req, res) => {
  try {
    const certifications = await servicesModel.getCertifications();
    res.json(certifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao obter certificações' });
  }
};

module.exports = {
  getMainServices,
  getAdditionalServices,
  getCertifications,
};
