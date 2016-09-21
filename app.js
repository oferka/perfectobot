var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 1337;
var apiai = require('apiai');
var apiaiapp = apiai("d0fd96f7a6b84f628cb20b9118cb88df");

// body parser middleware
app.use(bodyParser.urlencoded({
  extended: true
}));

// test route
app.get('/', function (req, res) {
  res.status(200).send('Hello Perfecto Bot');
});

app.listen(port, function () {
  console.log('Perfecto bot is listening on port ' + port);
});
var speech = null;
var id = null;
var timestamp = null;
var source = null;
var resolvedQuery = null;
var action = null;
var actionIncomplete = null;
var browser = null;
var device = null;
var device_type = null;
var operating_system = null;
var status = null;
var timeframe = null;
var contexts = null;
var intentId = null;
var webhookUsed = null;
var intentName = null;
var score = null;
var statusCode = null;
var statusErrorType = null;
var sessionId = null;
app.post('/general', function (req, res, next) {
  //the slack userName of the user who posted the message into the slack channel:
  var userName = req.body.user_name;
  //the text that was posted into the slack channel:
  var triggerText = req.body.text;
  //the trigger word that invoked the webhook (optional when connection the webhook to a specific channel):
  //var triggerWord = req.body.trigger_word;
  var requestToApiai = apiaiapp.textRequest(triggerText);
  requestToApiai.on('response', function(response) {
      console.log(response);
      id = response.id;
      timestamp = response.timestamp;
      source = response.result.source;
      resolvedQuery = response.result.resolvedQuery;
      action = response.result.action;
      actionIncomplete = response.result.actionIncomplete;
      browser = response.result.parameters.browser;
      device = response.result.parameters.device;
      device_type = response.result.parameters.device_type;
      operating_system = response.result.parameters.operating_system;
      status = response.result.parameters.status;
      timeframe = response.result.parameters.timeframe;
      contexts = response.result.contexts;
      intentId = response.result.metadata.intentId;
      webhookUsed = response.result.metadata.webhookUsed;
      intentName = response.result.metadata.intentName;
      speech = response.result.fulfillment.speech;
      score = response.result.score;
      statusCode = response.status.code;
      statusErrorType = response.status.errorType;
      sessionId = response.sessionId;
      var botPayload = {
        //text : userName + ' *said*: ' + triggerText + '\nsee the details here: https://www.perfectomobile.com'
        text : speech
      };
      //preventing loop of boot responding to boot:
      if (userName !== 'slackbot') {
        if(intentName == 'get_tests_report') {
          speech = null;
          return res.status(200).json(botPayload);
        }
      }
      return res.status(200).end();
  });
  requestToApiai.on('error', function(error) {
      console.log(error);
  });
  requestToApiai.end();
});
