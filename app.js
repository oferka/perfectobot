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
  //preventing loop of boot responding to boot:
  if (userName !== 'slackbot') {
    //the text that was posted into the slack channel:
    var triggerText = req.body.text;
    var requestToApiai = apiaiapp.textRequest(triggerText);
    requestToApiai.on('response', function(response) {
      console.log(response);
      intentName = response.result.metadata.intentName;
      if(intentName == 'get_tests_report') {
        speech = response.result.fulfillment.speech;
        if(speech == 'Here is a detailed report of all tests executed in:') {
          var url = 'https://demo.reporting-01.perfectomobile.com/';
          timeframe = response.result.parameters.timeframe;
          if(timeframe !== '') {
            url = url + '?startExecutionTime[0]=' + timeframe;
          }
          status = response.result.parameters.status;
          if(status !== '' && status !== 'all') {
              var statusUrlParam = 'FAILED';
              if(status == 'Passed') {
                  var statusUrlParam = 'PASSED';
              }
              if(status == 'Unknown') {
                  var statusUrlParam = 'UNKNOWN';
              }
              url = url + '&status[0]=' + statusUrlParam;
          }
          browser = response.result.parameters.browser;
          if(browser !== '') {
            var browserUrlParam = 'CHROME';
            if(browser == 'Firefox') {
                var browserUrlParam = 'FIREFOX';
            }
            if(browser == 'Internet Explorer') {
                var browserUrlParam = 'INTERNET_EXPLORER';
            }
            url = url + '&browserType[0]=' + browserUrlParam;
          }
          device = response.result.parameters.device;
          //todo - handle device
          device_type = response.result.parameters.device_type;
          if(device_type !== '') {
            var device_typeUrlParam = 'MOBILE';
            if(device_type == 'Desktop') {
                var device_typeUrlParam = 'DESKTOP';
            }
            url = url + '&deviceType[0]=' + device_typeUrlParam;
          }
          operating_system = response.result.parameters.operating_system;
          if(operating_system !== '') {
            var operating_systemUrlParam = 'ANDROID';
            if(operating_system == 'Blackberry') {
                var operating_systemrlParam = 'BLACKBERRY';
            }
            if(operating_system == 'Windows') {
                var operating_systemUrlParam = 'WINDOWS';
            }
            if(operating_system == 'iOS') {
                var operating_systemUrlParam = 'IOS';
            }
            if(operating_system == 'MacOS') {
                var operating_systemUrlParam = 'MAC';
            }
            url = url + '&os[0]=' + operating_systemUrlParam;
          }
          var botPayload = {
            text : speech + ' ' + url
          };
          return res.status(200).json(botPayload);
        }
        else {
          if(speech == 'For which timeframe do you want to get a report (for example last day)?') {
            var botPayload = {
              text : speech
            };
            return res.status(200).json(botPayload);
          }
          else {
            resolvedQuery = response.result.resolvedQuery;
            var botPayload = {
              text : resolvedQuery
            };
            return res.status(200).json(botPayload);
          }
        }
      }
    });
    requestToApiai.on('error', function(error) {
        console.log(error);
    });
    requestToApiai.end();
  }

      //id = response.id;
      //timestamp = response.timestamp;
      //source = response.result.source;
      //resolvedQuery = response.result.resolvedQuery;
      //action = response.result.action;
      //actionIncomplete = response.result.actionIncomplete;
      //contexts = response.result.contexts;
      //console.log('number of contexts: ' + contexts.length);
      //if(contexts.length > 0) {
        //console.log('context[1] name: ' + contexts[0].name);
      //}
      //intentId = response.result.metadata.intentId;
      //webhookUsed = response.result.metadata.webhookUsed;
      //intentName = response.result.metadata.intentName;
      //speech = response.result.fulfillment.speech;
      //score = response.result.score;
      //statusCode = response.status.code;
      //statusErrorType = response.status.errorType;
      //sessionId = response.sessionId;
      //var botPayload = {
      //  text : speech
      //};
});
