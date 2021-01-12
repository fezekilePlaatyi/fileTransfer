const app = require('express')();
const http = require('http').Server(app);

app.get('/', (req, res) => {
  res.send("Hello World");
});


http.listen(50505, () => {
  console.log('listening on *:3000');
});