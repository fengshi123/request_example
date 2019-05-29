const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const multiparty = require('multiparty');
const formidable = require('formidable');

const util = require('util');
const fs = require('fs');
const path = require('path');
app.use('/static', express.static(path.join(__dirname, 'static')));

// 1、application/x-www-form-unlencoded 数据类型
app.post('/urlencoded', bodyParser.urlencoded({extend:true}), function (req, res) {
    var result = {
        name: req.body.name,
        sex: '男',
        age: 15
    };
    res.send(result);
});

// 2.1、multipart/form-data 数据类型  formidable 进行解析
app.post('/formData1', function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = "upload/";
    form.parse(req, function (err, fields, files) {
        var obj = {};
        Object.keys(fields).forEach(function (name) {  //文本
            obj[name] = fields[name];
        });
        Object.keys(files).forEach(function (name) {
            if (files[name] && files[name].name) {
                obj[name] = files[name];
                fs.renameSync(files[name].path, form.uploadDir + files[name].name);
            }
        });
        res.send(obj);
    });
});

// 2.2、multipart/form-data 数据类型  multiparty 进行解析
app.post('/formData2', function (req, res) {
    // 解析一个文件上传
    var form = new multiparty.Form();
    //设置编辑
    form.encoding = 'utf-8';
    //设置文件存储路径
    form.uploadDir = "upload/";
    //设置单文件大小限制
    form.maxFilesSize = 2000 * 1024 * 1024;
    form.parse(req, function (err, fields, files) {
        var obj = {};
        Object.keys(fields).forEach(function (name) {  //文本
            obj[name] = fields[name];
        });
        Object.keys(files).forEach(function (name) {
            if (files[name] && files[name][0] && files[name][0].originalFilename) {
                obj[name] = files[name];
                fs.renameSync(files[name][0].path, form.uploadDir + files[name][0].originalFilename);
            }
        });
        res.send(obj);
    });
});

// 3、application/json 数据类型
app.post('/applicationJson', bodyParser.json(), function (req, res) {
    var result = {
        name: req.body.name,
        sex: '男',
        age: 15
    };
    res.send(result);
});

// 4、text/xml 数据类型
app.post('/textXml',  bodyParser.urlencoded({extend:true}), function (req, res) {
    var result = ''; // 添加接收变量
    req.on('data', function (chunk) {
        result += chunk;
    });
    req.on('end', function () {
        res.send(result);
    });
});


app.get('/', function (req, res) {
    res.sendfile(`${__dirname}/index.html`)
});

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

});
