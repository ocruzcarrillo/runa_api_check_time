const jwt = require('jsonwebtoken');
const db = require('../db');

const Auth = {
  /**
   * Verify Token
   * @param {object} req 
   * @param {object} res 
   * @param {object} next
   * @returns {object|void} response object 
   */
  async verifyToken(req, res, next) {
	if (req.originalUrl == '/api/employee/login') {
		next();
	} else {
		const token = req.headers['x-access-token'];
		if(!token) {
		  return res.status(400).send({ 'message': 'Token is not provided' });
		}
		try {
		  const decoded = await jwt.verify(token, process.env.SECRET);
		  const text = 'SELECT * FROM employee WHERE id_employee = $1';
		  const { rows } = await db.query(text, [decoded.id_employee]);
		  if(!rows[0]) {
			return res.status(400).send({ 'message': 'The token you provided is invalid', 'obj': req });
		  }
		  req.employee = { id_employee: decoded.id_employee };
		  next();
		} catch(error) {
		  return res.status(400).send(error);
		}
	}
  }, 
  /**
   * Check Token
   * @param {object} req 
   * @param {object} res 
   * @param {object} next
   * @returns {object|void} response object 
   */
  async checkToken(req, res, next) {
	const token = req.headers['x-access-token'];
	if(!token) {
	  return res.status(400).send({ 'message': 'Token is not provided' });
	}
	try {
	  const decoded = await jwt.verify(token, process.env.SECRET);
	  const text = 'SELECT * FROM employee WHERE id_employee = $1';
	  const { rows } = await db.query(text, [decoded.id_employee]);
	  if(!rows[0]) {
		return res.status(400).send({ 'message': 'The token you provided is invalid', 'obj': req });
	  }
	  req.employee = { id_employee: decoded.id_employee };
	  
	  return res.status(200).send(req.employee);
	} catch(error) {
	  return res.status(400).send(error);
	}
  }
}

module.exports = Auth;