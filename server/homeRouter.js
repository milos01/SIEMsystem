var path = require('path');

module.exports = function(app, express){
	var homeRouter = express.Router();
	homeRouter
	.get('/', function(req, res) {
	 	res.sendFile(path.join(__dirname + '/public/index.html'));
	 })

	 return homeRouter;
}