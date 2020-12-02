const fs = require('fs');
const url = require('url');
const http = require('http');
const path = require('path');
const { CropFont } = require('../../src/index');

http.createServer(function (request, response) {
  // html请求
  if (request.url === '/') {
    // response.writeHead(响应状态码，响应头对象): 发送一个响应头给请求。
    response.writeHead(200, { 'Content-Type': 'text/html' });
    // 如果url=‘/’ ,读取指定文件下的html文件，渲染到页面。
    fs.readFile(path.join(__dirname, './server.html'), 'utf-8', function (err, data) {
      if (err) {
        throw err;
      }
      response.end(data);
    });
    return;
  }

  // 字体文件请求
  if (request.url.startsWith('/font')) {
    const params = url.parse(request.url, true).query;
    const crop = new CropFont({
      fontCode: params.fontCode,
    });
    const buffer = crop.font2buffer(params.text);

    // 发送 HTTP 头部
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write(buffer, 'binary');
    response.end();
  }
}).listen(8888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');
