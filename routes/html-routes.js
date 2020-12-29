// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
const path = require('path');

// Routes
// =============================================================
module.exports = function (app) {
  // Each of the below routes just handles the HTML page that the user gets sent to.

  // THIS IS THE START-UP ROUTING
  // index route loads view.html
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/meal-manager.html'));
  });

  // subsegment route loads subsegment.html
  // app.get('/subsegment', function (req, res) {
  //   res.sendFile(path.join(__dirname, '../public/subsegment.html'));
  // });

  // segments route loads meal-manager.html
  app.get('/meals', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/meal-manager.html'));
  });
};
