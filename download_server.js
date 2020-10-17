const http = require('http');
const fs = require('fs');

const hostname = '0.0.0.0';
const port = process.env.PORT;

var download_link = ""

function get_download_link() {
  if (download_link)
    return
  return fs.readFile('./app.link', 'utf8', function (err,data) {
    if (err) {
      return
    }
    download_link = data;
  });
}

const server = http.createServer((req, res) => {
  get_download_link()
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.write('<p style="text-align: center;"><strong>El link de descarga es <br /></strong></p>')
  if (download_link) {
    res.write(`<p style="text-align: center;"> Todavía está buildeando :( </p>`);
  } else {
    res.write(`<p style="text-align: center;"> <a href=""> ${download_link} </a></p>`);
  }
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`El servidor se está ejecutando en http://${hostname}:${port}/`);
});
