var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 1337;

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
  var botPayload = {
    text : userName + ' *said*: ' + triggerText + '\nsee the details here: https://www.facebook.com/'
  };
  //preventing loop of boot responding to boot:
  if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
});
