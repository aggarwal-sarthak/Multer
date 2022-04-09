const multer = require('multer')
const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
const directoryPath = path.join("C:/Users/sarth/OneDrive/Desktop/", 'saved');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, directoryPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({
    storage: storage,
}).single("filetoupload");

let dir;

app.use("/fileupload", function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.end();
        }
        else {
            res.write("Success, File Uploaded!")
            res.send()
        }
    })
})

app.use("/display", function (req, res) {
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        files.forEach(function (file) {
            dir = directoryPath + "/" + file;

            let item = fs.statSync(dir, function (err, stats) { })
            function formatBytes(bytes, decimals = 2) {
                if (bytes === 0) return '0 Bytes';
                const k = 1024;
                const dm = decimals < 0 ? 0 : decimals;
                const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
            }
            function creation(date) {
                const time = String(date).split(" ")[1] + " " + String(date).split(" ")[2] + ", " + String(date).split(" ")[3];
                return time;
            }
            res.write(`<a href = "/files/${file}"` +  ">" + file + "</a>" + " " + formatBytes(item.size) + " " + creation(item.birthtime) + "<br>")
        });
        res.end()
    });
})

app.use('/files', express.static(directoryPath));

app.use("/", function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
})

app.listen(3000);