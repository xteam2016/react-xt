'use strict';
// Learn more on how to config.
// - https://github.com/dora-js/dora-plugin-proxy#规则定义
var http = require('http');
var path = require('path');
var fs= require('fs');
var nodeUrl = require('url');
// req 和 res 的设计类 express，http://expressjs.com/en/api.html
//
// req 能取到：
//   1. params
//   2. query
//   3. body
// 
// res 有以下方法：
//   1. set(object|key, value)
//   2. type(json|html|text|png|...)
//   3. status(200|404|304)
//   4. json(jsonData)
//   5. jsonp(jsonData[, callbackQueryName])
//   6. end(string|object)
//    

module.exports = {
  // // Forward 到另一个服务器
  // 'GET https://assets.daily/*': 'https://assets.online/',

  // // Forward 到另一个服务器，并指定路径
  // 'GET https://assets.daily/*': 'https://assets.online/v2/',
  
  // // Forward 到另一个服务器，不指定来源服务器
 // 'GET /assets/*': 'https://assets.online/',
    // 'GET /api/(.*)'    : 'http://10.8.8.93:5000/',
    // 'POST /api/(.*)'   : 'http://10.8.8.93:5000/',
    'GET /jquery.js'   : './src/static/jquery.js',
    'GET /lib.js'   : './src/static/lib.js',
    // 'GET /api/.*'   : 'http://172.18.12.65:5000/api/',
    '/aj/*': function(req, res) {
      // console.log(req);
        var json_path = req.url.replace('/aj/', '');
        json_path = json_path.replace(/\?.*/,'')

        setTimeout(function(){
          var p = path.join(__dirname, 'api', json_path+ '.js');
          console.log(p);
          delete require.cache[p] ;
          try{
            console.log(require(p));
            res.json(require(p));
          }catch(error){
            res.json({
              code:1,
              msg:error.message,
              data:{}
            })
          }
        },200)
    },
    '/api/*': function(req, res) {
     //console.log(req);
      let sres = res;
      let url = '172.18.12.65';
      let headers = req.headers;
      //headers.host = 'http://172.18.12.65:5000'
      // let treq  = req;
      // treq.host = url;
      // treq.port = 5000;

      var options = { 
        host: '10.8.8.93', 
        port: 5000, 
        path: req.url, 
        method: req.method,
        headers: req.headers
      }; 
      const urlObject = nodeUrl.parse(req.url);
      const fileName  = urlObject.pathname.replace(/\//g,'_');
      var timeoutEvent;
      var req1 = http.request(options, function (serverFeedback) {  
        
         if (serverFeedback.statusCode == 200) {  
            var body = "";  

            serverFeedback.on('data', function (data) { body += data;})  
                          .on('end', function () {
                            clearTimeout(timeoutEvent);
                            let json = JSON.parse(body);
                            if(json.code == 0){
                              //写入文件
                              
                              //console.log(fileName);
                              //return

                              const filepath = path.join(__dirname,'api','cache', fileName+ '.js');
                              fs.writeFileSync(filepath, body);
                            }
                            sres.json(JSON.parse(body));  

                          });  
        }else {
          //请求问题读取缓存
          console.log('借口问题，调用缓存')
          setTimeout(function(){
      
            var p = path.join(__dirname, 'api','cache', fileName+ '.js');
            if(fs.existsSync(p)){
              res.json(JSON.parse(fs.readFileSync(p)));
            }else{
              res.json({
                code:1,
                msg:'借口错误',
                data:{}
              })
            }
          },200)
        }    
      }); 
      timeoutEvent = setTimeout(function() {
        req1.emit("timeout");
        //超时
        setTimeout(function(){
      
            var p = path.join(__dirname, 'api','cache', fileName+ '.js');
            if(fs.existsSync(p)){
              res.json(JSON.parse(fs.readFileSync(p)));
            }else{
              res.json({
                code:1,
                msg:'借口错误',
                data:{}
              })
            }
          },200)
            
      }, 3000); 
      req1.write(req.body);  
      req1.end();  
      
    }
};
