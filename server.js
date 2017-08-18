let url = require('url');
let fs = require('fs');
let http = require('http');

module.exports = http.createServer(function (req, res) {

    let pathname = decodeURI(url.parse(req.url).pathname);
    console.log(pathname);
    switch (req.method) {
        case "GET":
            if (pathname === "/") {
                sendFile(res, '/public/index.html');
            } else {
                sendFile(res, '/files' + pathname);
            }
            break;
        case "POST":
            receiveFile(req, res, pathname);
            break;
        case "DELETE":
            deleteFile(res, pathname);
            break;
    }

});

function sendFile(res, pathname) {
    let file = fs.createReadStream(__dirname + pathname);
    file.
    on('error', (err) => {
        if (err.code === "ENOENT") {
            res.statusCode = 404;
            res.end("Not Found");
        } else {
            res.statusCode = 500;
            res.end('Server error');
        }
    })
        .pipe(res)
        .on('close', () => {
            file.destroy();
        })
}

function receiveFile(req, res, pathname) {
    let filePath = __dirname + '/files' + pathname;
    let newFile = fs.createWriteStream(filePath, {flags: 'wx'});
    let size = 0;

    req
        .on('data', (chunk) => {
            size += chunk.length;
        })
        .on('close', () => {
            newFile.destroy();
            fs.unlinkSync(filePath);
        })
        .pipe(newFile);

    newFile
        .on('error', (err) => {
            if (err.code = 'EEXIST') {
                res.statusCode = 504;
                res.end('File already exist');
            } else {
                err.statusCode = 413;
                res.end('Internal Error');
            }
        })
        .on('close', () => {
            res.end('OK')
        });

    res.on('finish', () => {
        console.log('The file was uploaded to the new place')
    });
}

function deleteFile(res, pathname){
    let deleteFilePath = __dirname + '/files' + pathname;
    fs.unlink(deleteFilePath, (err) => {
        if (err.code === "ENOENT"){
            err.statusCode = 404;
            res.end('Not Found');
        } else {
            err.statusCode = 513;
            err.end('Internal Error');
        }
    });
}
