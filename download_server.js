const http = require('http');

const hostname = '0.0.0.0';
const port = process.env.PORT;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.write('<p style="text-align: center;"><strong>El link de descarga es <br /></strong></p>')
  res.write(`<p style="text-align: center;"> <a href=""> ${process.env.DOWNLOAD_LINK} </a></p>`);
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`El servidor se está ejecutando en http://${hostname}:${port}/`);
});
