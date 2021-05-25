const path = require('path');
const express = require('express');
const app = express();

// Serve static files
app.use(express.static(__dirname + '/dist'));

// Send all requests to index.html
app.get('/*', function(req, res) {
  console.log('__dirname')
  console.log(__dirname)
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// default Heroku port
console.log('hello! in port ' + process.env.PORT)
app.listen(process.env.PORT || 5000);

/*   "homepage": "https://demos.creative-tim.com/black-dashboard-angular/#/dashboard", */