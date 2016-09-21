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
  var userName = req.body.user_name;
  var triggerText = req.body.text;
  var triggerWord = req.body.trigger_word;
  var botPayload = {
    text : userName + ' said: ' + triggerText
  };
  // Loop otherwise..
  if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
});
