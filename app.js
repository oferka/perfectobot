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
      console.log('id: ' + response.id);
      console.log('timestamp: ' + response.timestamp);
      console.log('source: ' + response.result.source);
      console.log('resolvedQuery: ' + response.result.resolvedQuery);
      console.log('action: ' + response.result.action);
      console.log('actionIncomplete: ' + response.result.actionIncomplete);
      console.log('browser: ' + response.result.parameters.browser);
      console.log('device: ' + response.result.parameters.device);
      console.log('device_type: ' + response.result.parameters.device_type);
      console.log('operating_system: ' + response.result.parameters.operating_system);
      console.log('status: ' + response.result.parameters.status);
      console.log('timeframe: ' + response.result.parameters.timeframe);
      console.log('contexts: ' + response.result.contexts);
      console.log('intentId: ' + response.result.metadata.intentId);
      console.log('webhookUsed: ' + response.result.metadata.webhookUsed);
      console.log('intentName: ' + response.result.metadata.intentName);
      console.log('speech: ' + response.result.fulfillment.speech);
      console.log('score: ' + response.result.score);
      console.log('statusCode: ' + response.status.code);
      console.log('statusErrorType: ' + response.status.errorType);
      console.log('sessionId: ' + response.sessionId);
  });
  requestToApiai.on('error', function(error) {
      console.log(error);
  });
  requestToApiai.end()
  var botPayload = {
    text : userName + ' *said*: ' + triggerText + '\nsee the details here: https://www.perfectomobile.com'
  };

  //preventing loop of boot responding to boot:
  if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
});
