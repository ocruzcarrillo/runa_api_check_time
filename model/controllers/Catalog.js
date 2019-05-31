const moment = require('moment');
const uuidv4 = require('uuid/v4');
const db = require('../db');
const Helper = require('./Helper');

const Catalog = {
  /**
   * Create 
   * @param {object} req 
   * @param {object} res
   * @returns {object} object 
   */
  async create(req, res) {	
    var text = '';
	var values = [];
	
	if (req.params.catalog == 'type_check') {
		text = `INSERT INTO
		  ${req.params.catalog}(id_type_check, type_check)
		  VALUES($1, $2)
		  returning *`;
		values = [
		  uuidv4(),
		  req.body.type_check
		];
	}
	
	if (req.params.catalog == 'type_info') {
		text = `INSERT INTO
		  ${req.params.catalog}(id_type_info, type_info, active, required, data_type)
		  VALUES($1, $2, $3, $4, $5)
		  returning *`;
		values = [
		  uuidv4(),
		  req.body.type_info,
		  true,
		  req.body.required,
		  req.body.data_type
		];
	}

    try {
      const { rows } = await db.query(text, values);
      return res.status(201).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  /**
   * Get All
   * @param {object} req 
   * @param {object} res 
   * @returns {object} array
   */
  async getAll(req, res) {
    const findAllQuery = 'SELECT * FROM ' + req.params.catalog;
	
    try {
      const { rows, rowCount } = await db.query(findAllQuery);
      return res.status(200).send({ rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  /**
   * Get by ID
   * @param {object} req 
   * @param {object} res
   * @returns {object} object
   */
  async getOne(req, res) {
    const text = 'SELECT * FROM ' + req.params.catalog + ' WHERE id_' + req.params.catalog + ' = $1';
	
    try {
      const { rows } = await db.query(text, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).send({'message': req.body.catalog + ' not found'});
      }
      return res.status(200).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error)
    }
  },
  /**
   * Update One
   * @param {object} req 
   * @param {object} res 
   * @returns {object} updated 
   */
  async update(req, res) {
    const findOneQuery = 'SELECT * FROM ' + req.params.catalog + ' WHERE id_' + req.params.catalog + ' = $1';
    var updateOneQuery = "";
	var values = [];
	
    try {
      const { rows } = await db.query(findOneQuery, [req.params.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': req.params.catalog + ' not found'});
      }
	  
	  if (req.params.catalog == 'type_check') {
			updateOneQuery =`UPDATE ${req.params.catalog}
			  SET type_check=$1
			  WHERE id_${req.params.catalog}=$2 returning *`;
			values = [
				req.body.type_check || rows[0].type_check,
				req.params.id
			  ];
		}
		
		if (req.params.catalog == 'type_info') {
			updateOneQuery =`UPDATE ${req.params.catalog}
			  SET type_info=$1,active=$2,required=$3,data_type=$4
			  WHERE id_${req.params.catalog}=$5 returning *`;
			values = [
				req.body.type_info || rows[0].type_info,
				req.body.active || rows[0].active,
				req.body.required || rows[0].required,
				req.body.data_type || rows[0].data_type,
				req.params.id
			  ];
		}
      
      const response = await db.query(updateOneQuery, values);
      return res.status(200).send(response.rows[0]);
    } catch(err) {
      return res.status(400).send(err);
    }
  },
  /**
   * Delete One
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
  }
}

module.exports = Catalog;