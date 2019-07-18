const express = require('express');
const router = express.Router();
const axios = require('axios');
var parser = require('xml2json');

router.get('/', function(req, res, next) {
	res.status(200).send({
      		data: "Node.js backbone! haha :)"
    }) 
})

router.get('/book/list/:title/:pageNumber', function(req, res, next) {
	axios.get('https://www.goodreads.com/search/index.xml?key=RDfV4oPehM6jNhxfNQzzQ&q='+ req.params.title +'&page='+ req.params.pageNumber)
	  .then(response => {
	  	var result = parser.toJson(response.data);
	  	res.setHeader('Content-Type', 'application/json');
	  	res.send(result)
	  })
	  .catch(error => {
	    console.log(error);
	});  
})
module.exports = router;