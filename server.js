const dotenv = require('dotenv');
const cors = require('cors');

const express = require('express')
const bodyParser = require('body-parser')
const port = 3210

dotenv.config();
const Employee = require('./model/controllers/Employee');
const Auth = require('./model/auth/Auth');

var apiRouterEmployee = require('./routes/employee');
var apiRouterCatalog = require('./routes/catalog');

const app = express()
app.use(bodyParser.json())
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(cors())
app.use(function(request, response, next) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, x-Requested-With, Content-Type, Accept");
	next();
});
app.use('/api/employee', Auth.verifyToken, apiRouterEmployee);
app.use('/api/catalog', Auth.verifyToken, apiRouterCatalog);

app.get('/api/checkToken', Auth.checkToken	);
app.get('/', (request, response) => {
	response.status(200).send({ info: 'Check Time React API' })
})

app.listen(port, () => {
	console.log(`Check Time React App app listening on port ${port}!`)
})