const moment = require('moment');
const uuidv4 = require('uuid/v4');
const db = require('../db');
const Helper = require('./Helper');

const Employee = {
  /**
   * Create A Employee
   * @param {object} req 
   * @param {object} res
   * @returns {object} employee object 
   */
  async create(req, res) {
	if (!req.body.username || !req.body.password) {
	  var missing_values = new Array();
	  if (!req.body.username) {
		  missing_values.push('username');
	  }
	  if (!req.body.password) {
		  missing_values.push('password');
	  }
      return res.status(400).send({'message': 'Some values are missing: ' + JSON.stringify(missing_values)});
    }
    if (!Helper.isValidEmail(req.body.username)) {
      return res.status(400).send({ 'message': 'Please enter a valid username in email format' });
    }
	
    const text = `INSERT INTO
      employee(id_employee, init_date, finish_date, active, username, password_hash, administrator)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      returning *`;
    const values = [
      uuidv4(),
      moment(new Date()),
      null,
      true,
      req.body.username,
      Helper.hashPassword(req.body.password),
	  req.body.administrator
    ];

    try {
      const { rows } = await db.query(text, values);
      return res.status(201).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  /**
   * Get All Employee
   * @param {object} req 
   * @param {object} res 
   * @returns {object} employee array
   */
  async getAll(req, res) {
    const findAllQuery = 'SELECT * FROM employee';
    try {
      const { rows, rowCount } = await db.query(findAllQuery);
      return res.status(200).send({ rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  /**
   * Get A Employee
   * @param {object} req 
   * @param {object} res
   * @returns {object} employee object
   */
  async getOne(req, res) {
    const text = 'SELECT * FROM employee WHERE id_employee = $1';
    try {
      const { rows } = await db.query(text, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).send({'message': 'employee not found'});
      }
      return res.status(200).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error)
    }
  },
  /**
   * Update A Employee
   * @param {object} req 
   * @param {object} res 
   * @returns {object} updated employee
   */
  async update(req, res) {
    const findOneQuery = 'SELECT * FROM employee WHERE id_employee=$1';
    const updateOneQuery =`UPDATE employee
      SET finish_date=$1,active=$2,username=$3,password_hash=$4,administrator=$5
      WHERE id=$6 returning *`;
    try {
      const { rows } = await db.query(findOneQuery, [req.params.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'employee not found'});
      }
      const values = [
        req.body.finish_date || rows[0].finish_date,
        req.body.active || rows[0].active,
        req.body.username || rows[0].username,
		Helper.hashPassword(req.body.password) || rows[0].password_hash,
        req.body.administrator || rows[0].administrator,
        req.params.id
      ];
      const response = await db.query(updateOneQuery, values);
      return res.status(200).send(response.rows[0]);
    } catch(err) {
      return res.status(400).send(err);
    }
  },
  /**
   * Delete A Employee
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return statuc code 204 
   */
  async delete(req, res) {
    const deleteQuery = 'DELETE FROM employee WHERE id_employee=$1 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.params.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'employee not found'});
      }
      return res.status(204).send({ 'message': 'deleted' });
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  /**
   * Login
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object 
   */
  async login(req, res) {
    if (!req.body.username || !req.body.password) {
      var missing_values = new Array();
	  if (!req.body.username) {
		  missing_values.push('username');
	  }
	  if (!req.body.password) {
		  missing_values.push('password');
	  }
      return res.status(400).send({'message': 'Some values are missing: ' + JSON.stringify(missing_values)});
    }
    if (!Helper.isValidEmail(req.body.username)) {
      return res.status(400).send({ 'message': 'Please enter a valid email address' });
    }
    const text = 'SELECT * FROM employee WHERE username = $1';
    try {
      const { rows } = await db.query(text, [req.body.username]);
      if (!rows[0]) {
        return res.status(400).send({'message': 'The credentials you provided is incorrect'});
      }
      if(!Helper.comparePassword(rows[0].password_hash, req.body.password)) {
        return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
      }
	  
      const _token = Helper.generateToken(rows[0].id_employee);
	  
	  var token = {
		  'active': rows[0].active,
		  'administrator': rows[0].administrator,
		  'finish_date': rows[0].finish_date,
		  'init_date': rows[0].init_date,
		  'username': rows[0].username,
		  'token': _token
	  }
	  
      return res.status(200).send(token);
    } catch(error) {
      return res.status(400).send(error)
    }
  }
}

module.exports = Employee;
