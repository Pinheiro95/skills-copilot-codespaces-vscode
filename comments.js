// Create web server

// Load modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// Create web server
var server = http.createServer(function(request, response) {
    var path = url.parse(request.url).pathname;
    console.log("Request for " + path + " received.");

    // Handle GET requests
    if (request.method === 'GET') {
        if (path === '/') {
            fs.readFile(__dirname + '/public/index.html', function(error, data) {
                if (error) {
                    response.writeHead(404);
                    response.end(JSON.stringify(error));
                    return;
                }
                response.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                response.write(data);
                response.end();
            });
        } else if (path === '/comments') {
            var comments = fs.readFileSync(__dirname + '/data/comments.json', 'utf8');
            response.writeHead(200, {
                'Content-Type': 'application/json'
            });
            response.write(comments);
            response.end();
        } else {
            fs.readFile(__dirname + '/public' + path, function(error, data) {
                if (error) {
                    response.writeHead(404);
                    response.end(JSON.stringify(error));
                    return;
                }
                response.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                response.write(data);
                response.end();
            });
        }
    }

    // Handle POST requests
    else if (request.method === 'POST') {
        if (path === '/comments') {
            var body = '';
            request.on('data', function(data) {
                body += data;
            });
            request.on('end', function() {
                var newComment = qs.parse(body);
                var comments = JSON.parse(fs.readFileSync(__dirname + '/data/comments.json', 'utf8'));
                comments.push(newComment);
                fs.writeFileSync(__dirname + '/data/comments.json', JSON.stringify(comments));
                response.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                response.write(JSON.stringify(newComment));
                response.end();
            });
        }
    }
});

// Start web server
server.listen(8080);
console.log('Server running at http://