var os = require("os");
var net = require('net')
var hdf5 = require('hdf5').hdf5;
var h5im = require('hdf5').h5im;

var Access = require('hdf5/lib/globals').Access;
var CreationOrder = require('hdf5/lib/globals').CreationOrder;
var H5Type = require('hdf5/lib/globals.js').H5Type;
var Interlace = require('hdf5/lib/globals').Interlace;
const WebSocket = require('ws');

module.exports = class H5Images { 
    constructor (h5, port) {
        this.h5=h5
        this.port=port
        this.status=false
        this.make = new WebSocket.Server({ noServer: true });
        this.read = new WebSocket.Server({ noServer: true });
        this.make.on("error", error => {
            console.log("The server encountered an error! "+error.message);
        });
        this.make.on('connection', function connection(ws) {
            ws.binaryType = "nodebuffer";
            var msgCount=0;
            var path;
            var metaData;
          ws.on('message', function incoming(message) {
              if(typeof message === 'string'){
                  if(msgCount===0)path=message;
                  else metaData=JSON.parse(message);
                  msgCount++;
              }
              else{
                  var index=path.lastIndexOf("/");
                  var stem = "";
                  var leaf = "";
                  if(index>=0)
                  {
                      stem=path.substring(0, index);
                      leaf=path.substring(index+1, path.length);
                  }
                  else
                      leaf = path;
                  
                var image=message;//Buffer.from(imageBuffer);
                if(leaf.endsWith(".png")){

                }
                var file = new hdf5.File(global.currentH5Path, Access.ACC_RDWR);
                var group=file.openGroup(stem);
                h5im.makeImage(group.id, leaf, image, {interlace: Interlace.INTERLACE_PIXEL, width: metaData.width, height: metaData.height, planes: metaData.planes, npals: metaData.npals});
                group.close();
                file.close();
            }
          });
            ws.on('close', function close() {
              //resolve("");
            });
        
          ws.send('something');
        });
        this.read.on('connection', function connection(ws) {
                ws.binaryType = "nodebuffer";
                ws.on('close', function close() {
                });
          ws.on('message', function incoming(message) {

              if(typeof message === 'string'){
                var index=message.lastIndexOf("/");
                var stem = "";
                var leaf = "";
                if(index>=0)
                {
                    stem=message.substring(0, index);
                    leaf=message.substring(index+1, message.length);
                }
                else
                    leaf = message;
                var file = new hdf5.File(global.currentH5Path, Access.ACC_RDONLY);
                var group=file.openGroup(stem);
                var buffer=h5im.readImage(group.id, leaf);
                var channelSize = buffer.width * buffer.height;
                var size = channelSize * (buffer.planes);
                var redChannelEnd = channelSize * 1;
                var greenChannelEnd = channelSize * 2;
                var blueChannelEnd = channelSize * 3;
                var metaData={name: leaf, width: buffer.width, height: buffer.height, planes: buffer.planes, npals: buffer.planes, size: size}
                ws.send(JSON.stringify(metaData));
                ws.send(buffer, { binary: true, compress: false, mask: false });
                //ws.end("");

                group.close();
                file.close();
              }
            });
        });
    }

getInfo(path) {
    path=decodeURIComponent(path);
    var index=path.lastIndexOf("/");
    var stem = "";
    var leaf = "";
    if(index>=0)
    {
        stem=path.substring(0, index);
        leaf=path.substring(index+1, path.length);
    }
    else
        leaf = path;
    //console.dir(stem);
    //console.dir(leaf);
    var file = new hdf5.File(global.currentH5Path, Access.ACC_RDONLY);
    var group=file.openGroup(stem);
    var info=h5im.getImageInfo(group.id, leaf);
    group.close();
    file.close();
    return JSON.stringify(info);
}

        
make(path) {
    path=decodeURIComponent(path);
    var index=path.lastIndexOf("/");
    var stem = "";
    var leaf = "";
    if(index>=0)
    {
        stem=path.substring(0, index);
        leaf=path.substring(index+1, path.length);
    }
    else
        leaf = path;
//    console.dir(stem);
//    console.dir(leaf);
        const _this=this
    console.log(os.hostname()+" "+_this.port);
    //var p = yield new Promise((resolve, reject) => {
        var WebSocketServer = require('ws').Server
          , wss = new WebSocketServer({ host: os.hostname(), port: _this.port, path: '/make-image', maxPayload: 1024*1024*1024, perMessageDeflate: false  });
            console.dir(os.hostname()+" "+_this.port);
        wss.on("error", error => {
            console.log("The server encountered an error! "+error.message);
            });
        wss.on('connection', function connection(ws) {
            ws.binaryType = "nodebuffer";
            var metaData;
          ws.on('message', function incoming(message) {
              if(typeof message === 'string'){
                  metaData=JSON.parse(message);
              }
              else{
                  
                var image=message;//Buffer.from(imageBuffer);
                if(leaf.endsWith(".png")){

                }
                var file = new hdf5.File(global.currentH5Path, Access.ACC_RDWR);
                var group=file.openGroup(stem);
                h5im.makeImage(group.id, leaf, image, {interlace: Interlace.INTERLACE_PIXEL, width: metaData.width, height: metaData.height, planes: metaData.planes, npals: metaData.npals});
                group.close();
                file.close();
                wss.close();
            }
          });
            ws.on('close', function close() {
              //resolve("");
              wss.close();
            });
        
          ws.send('something');
        });        
    //});        
        this.body = "";
        return;
}

    readImage(path, cb) {
        path=decodeURIComponent(path);
        var index=path.lastIndexOf("/");
        var stem = "";
        var leaf = "";
        if(index>=0)
        {
            stem=path.substring(0, index);
            leaf=path.substring(index+1, path.length);
        }
        else
            leaf = path;
//        console.dir(stem);
//        console.dir(leaf);
        const _this=this;
        var file = new hdf5.File(global.currentH5Path, Access.ACC_RDONLY);
        var group=file.openGroup(stem);
        var buffer=h5im.readImage(group.id, leaf);
        var channelSize = buffer.width * buffer.height;
        var size = channelSize * (buffer.planes);
        var redChannelEnd = channelSize * 1;
        var greenChannelEnd = channelSize * 2;
        var blueChannelEnd = channelSize * 3;
        var metaData={name: leaf, width: buffer.width, height: buffer.height, planes: buffer.planes, npals: buffer.planes, size: size}
        cb(metaData);
        this.ws.send(JSON.stringify(metaData));
        this.ws.send(buffer, { binary: true, compress: false, mask: false });

        group.close();
        file.close();
        return;
    }
    
    readRegion(path, cb) {
        var index=path.lastIndexOf("/");
        var stem = "";
        var leaf = "";
        if(index>=0)
        {
            stem=path.substring(0, index);
            leaf=path.substring(index+1, path.length);
        }
        else
            leaf = path;
        //console.dir(stem);
        //console.dir(leaf);
        const _this=this;
            var WebSocketServer = require('ws').Server
              , wss = new WebSocketServer({ host: os.hostname(), port: _this.port, path: '/read-image-region', perMessageDeflate: false  });
            wss.on('connection', function connection(ws) {
                ws.binaryType = "nodebuffer";
                ws.on('close', function close() {
                  //resolve("");
                  console.log('rclose wss');
                  wss.close(function(){_this.status=false});
                });
                var metaDataInput;
                ws.on('message', function incoming(message) {
                  if(typeof message === 'string'){
                      //console.log('region received: %s', message);
                      metaDataInput=JSON.parse(message);
                    var file = new hdf5.File(global.currentH5Path, Access.ACC_RDONLY);
                    var group=file.openGroup(stem);
                    var buffer=h5im.readImageRegion(group.id, leaf, metaDataInput);
                    var channelSize = buffer.width * buffer.height;
                    var size = channelSize * (buffer.planes);
                    var redChannelEnd = channelSize * 1;
                    var greenChannelEnd = channelSize * 2;
                    var blueChannelEnd = channelSize * 3;
                    var metaData={name: leaf, width: buffer.width, height: buffer.height, planes: buffer.planes, npals: buffer.planes, size: size}
                    cb(metaData);
                    ws.send(JSON.stringify(metaData));
                    ws.send(buffer, { binary: true, compress: false, mask: false });
                    //ws.end("");
                    group.close();
                    file.close();
                  }
                });
                
            });

            return;
    }
    
    readMosaic(path, cb) {
        path=path.substring(19);
        var index=path.lastIndexOf("/");
        var stem = "";
        var leaf = "";
        if(index>=0)
        {
            stem=path.substring(0, index);
            leaf=path.substring(index+1, path.length);
        }
        else
            leaf = path;
        console.dir(stem);
        console.dir(leaf);
        const _this=this;
            var WebSocketServer = require('ws').Server
              , wss = new WebSocketServer({ host: os.hostname(), port: _this.port, path: '/read-image-mosaic', perMessageDeflate: false  });
            wss.on('connection', function connection(ws) {
                ws.binaryType = "nodebuffer";
                ws.on('close', function close() {
                  //resolve("");
                  console.log('rclose wss');
                  wss.close(function(){_this.status=false});
                });
                var metaDataInput;
                ws.on('message', function incoming(message) {
                  if(typeof message === 'string'){
                      //console.log('region received: %s', message);
                      metaDataInput=JSON.parse(message);
                      console.dir(metaDataInput);
                    var file = new hdf5.File(global.currentH5Path, Access.ACC_RDONLY);
                    var group=file.openGroup(stem);
                    var buffer=h5im.readImageRegion(group.id, leaf, metaDataInput);
                    var channelSize = buffer.width * buffer.height;
                    var size = channelSize * (buffer.planes);
                    var redChannelEnd = channelSize * 1;
                    var greenChannelEnd = channelSize * 2;
                    var blueChannelEnd = channelSize * 3;
                    var metaData={name: leaf, startX: 0, startY: 0, width: buffer.width, height: buffer.height, planes: buffer.planes, npals: buffer.planes, size: size}
                    cb(metaData);
                    ws.send(JSON.stringify(metaData));
                    ws.send(buffer, { binary: true, compress: false, mask: false });
                    var originStartX=metaDataInput.start[0];
                    var originStartY=metaDataInput.start[1];
                    for(var boundary=1;boundary<=metaDataInput.boundary;boundary++){
                    for(var j=-boundary;j<=boundary;j++){
                        metaDataInput.start[1]=originStartY+j*metaDataInput.count[1];
                        metaData.startY=j*metaDataInput.count[1];
                    for(var i=-boundary;i<=boundary;i++){
                        if(i>-boundary && j>-boundary && i<boundary && j<boundary)continue;
                        metaDataInput.start[0]=originStartX+i*metaDataInput.count[0];
                        metaData.startX=i*metaDataInput.count[0];
                        ws.send(JSON.stringify(metaData));
                        buffer=h5im.readImageRegion(group.id, leaf, metaDataInput);
                        ws.send(buffer, { binary: true, compress: false, mask: false });
                    }
                    }
                    }
                    //ws.end("");
                    group.close();
                    file.close();
                  }
                });
                
            });
        
            return;
    }
    
}

