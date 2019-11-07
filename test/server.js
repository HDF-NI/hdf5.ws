var os = require("os");
var net = require('net')
var http = require('http')
var Transform = require('stream').Transform
var url = require('url')
var fs = require('fs')
var path = require('path')
var zlib = require('zlib');

var hdf5 = require('hdf5').hdf5;
var Access = require('hdf5/lib/globals').Access;

var H5 = require('../api/h5.js');
var H5Datasets = require('../api/h5datasets.js');
var H5Images = require('../api/h5images.js');

  global.currentH5Path="newone.h5";
  if(global.currentH5Path.length>0 && !fs.existsSync(global.currentH5Path)){
      var file = new hdf5.File(global.currentH5Path, Access.ACC_TRUNC);
            //const group=file.createGroup('pmcservices/x-ray/refinement');
            //group.close();
      file.close();
  }
  let h5=new H5();
  let h5datasets=new H5Datasets(h5, 9700);
  let h5images=new H5Images(h5, 9700);

  var theServer=http.createServer(function (request, response) {
     try {
       var requestUrl = url.parse(request.url);
           //console.dir("requestUrl "+requestUrl);

       var resourcePath=path.normalize(requestUrl.pathname);
           //console.dir("resourcePath "+resourcePath);
       if(resourcePath.startsWith("/make_dataset/")){
         h5datasets.makeDataset(resourcePath);
         response.writeHead(200);
         //response.write("hoe");
             response.end("");
       }
       else if(resourcePath.startsWith("/read_dataset/")){
         h5datasets.readDataset(resourcePath);
         response.writeHead(200);
         //response.write("hoe");
             response.end("");
       }
       else if(resourcePath.startsWith("/get_image_info/")){
         response.writeHead(200);
         response.write(h5images.getInfo(resourcePath));
             response.end("");
       }
       else if(resourcePath.startsWith("/make_image/")){
         h5images.make(resourcePath.substring(12));
         response.writeHead(200);
         //response.write("hoe");
             response.end("something");
       }
       else if(resourcePath.startsWith("/read_image/")){
         h5images.read(resourcePath.substring(12), function(metaData){
           //response.write(JSON.stringify(metaData));
         });
         response.writeHead(200);
         //response.write("hoe");
             response.end("");
       }
       else if(resourcePath.startsWith("/read_image_region/")){
         h5images.readRegion(resourcePath, function(metaData){
           //response.write(JSON.stringify(metaData));
         });
         response.writeHead(200);
         //response.write("hoe");
             response.end("");
       }
       else if(resourcePath.startsWith("/read_image_mosaic/")){
         h5images.readMosaic(resourcePath, function(metaData){
           //response.write(JSON.stringify(metaData));
         });
         response.writeHead(200);
         //response.write("hoe");
             response.end("");
       }
       else if(resourcePath.startsWith("/create_group/")){
         h5.createGroup(resourcePath.substring(14));
         response.writeHead(200);
         //response.write("hoe");
             response.end("");
       }
       else if(resourcePath.endsWith("734344main_g306_wide_large.jpg")){
         var filePath = __dirname+"/examples/734344main_g306_wide_large.jpg";
         //console.dir(filePath);
         response.writeHead(200)
         var fileStream = fs.createReadStream(filePath)
         fileStream.pipe(response)
         fileStream.on('error',function(e) {
             response.writeHead(404)     // assume the file doesn't exist
             response.end()
         })
         
       }
       else{
           //console.dir("resourcePath "+resourcePath);
         var filePath = __dirname+"/examples"+resourcePath;
         console.dir("filePath "+filePath);
         if(filePath.endsWith(".html")){
            response.writeHead(200, { 'Content-Type': 'text/html' })
         console.dir("filePath "+filePath);
             
         }
         else if(filePath.endsWith(".js")){
           filePath = __dirname+"/../lib/"+resourcePath;
           response.writeHead(200, { 'Content-Type': 'application/javascript' });
         }
         else response.writeHead(200);
         var fileStream = fs.createReadStream(filePath)
         fileStream.pipe(response)
         fileStream.on('error',function(e) {
             response.writeHead(404)     // assume the file doesn't exist
             response.end()
         })
       }
     } catch(e) {
       console.dir("e: "+e);
       response.writeHead(500)
       response.end()     // end the response so browsers don't hang
       console.log(e.stack)
     }
  });
  theServer.on('clientError', (err, socket) => {
    console.dir("client err: "+err);
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  });  
  theServer.on('close', function () { console.dir("the server closed ")});
  theServer.listen(8888);
