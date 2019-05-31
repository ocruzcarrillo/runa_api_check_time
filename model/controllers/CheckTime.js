const moment = require('moment');
const uuidv4 = require('uuid/v4');
const db = require('../db');

const CheckTime = {
  /**
   * Check Time
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object 
   */
  async checkTime(req, res) {
    if (!req.body.id_type_check || !req.body.date) {
      var missing_values = new Array();
	  if (!req.body.id_type_check) {
		  missing_values.push('id_type_check');
	  }
	  if (!req.body.date) {
		  missing_values.push('date');
	  }
      return res.status(400).send({'message': 'Some values are missing: ' + JSON.stringify(missing_values)});
    }
    
    const text = `INSERT INTO
      employee_check_time(id_time_clock, id_employee, date, id_type_check)
      VALUES($1, $2, $3, $4)
      returning *`;
    const values = [
      uuidv4(),
	  req.params.id,
      req.body.date,
      req.body.id_type_check
    ];

    try {
      const { rows } = await db.query(text, values);
      return res.status(201).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  /**
   * Get A CheckTime Check Time Registers
   * @param {object} req 
   * @param {object} res
   * @returns {object} employee object
   */
  async checkTimeUser(req, res) {
    const text = 'SELECT * FROM employee_check_time WHERE id_employee = $1';
    try {
      const { rows } = await db.query(text, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).send({'message': 'employee_check_time not found'});
      }
      return res.status(200).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error)
    }
  },
  /**
   * Get All Check Time Registers
   * @param {object} req 
   * @param {object} res
   * @returns {object} employee object
   */
  async checkTimeAll(req, res) {
    const text = 'SELECT * FROM employee_check_time';
    try {
      const { rows } = await db.query(text);
      return res.status(200).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error)
    }
  },
}

module.exports = CheckTime;
