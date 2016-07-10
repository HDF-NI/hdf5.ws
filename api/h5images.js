var os = require("os");
var hdf5 = require('hdf5').hdf5;
var h5im = require('hdf5').h5im;

var Access = require('hdf5/lib/globals').Access;
var CreationOrder = require('hdf5/lib/globals').CreationOrder;
var H5Type = require('hdf5/lib/globals.js').H5Type;
var Interlace = require('hdf5/lib/globals').Interlace;

module.exports = class H5Images { 
    constructor (port) {
        this.port=port
        this.status=false
    }
        
makeImage(path) {
    path=decodeURIComponent(path);
    if(!path.startsWith("/make_image/")) return;
    console.dir("got to make image");
    path=path.substring(12);
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
            while(this.isPortTaken(this.port)){
                
            }
        const _this=this
    //var p = yield new Promise((resolve, reject) => {
        var WebSocketServer = require('ws').Server
          , wss = new WebSocketServer({ host: os.hostname(), port: _this.port, path: '/make-image' });
            console.dir(os.hostname()+" "+_this.port);
        
        wss.on('connection', function connection(ws) {
            ws.binaryType = "nodebuffer";
            var metaData;
          ws.on('message', function incoming(message, flags) {
              if(!flags.binary){
                  console.log('received: %s', message);
                  metaData=JSON.parse(message);
              }
              else{
                    var imageBuffer=message;//BSON.deserialize(message, {promoteBuffers: false});
                    console.dir(imageBuffer.constructor.name);
                    //imageBuffer.length=metaData.width*metaData.height*metaData.planes;
                    console.dir(metaData);
                    var image=message;//Buffer.from(imageBuffer);
                    image.width=metaData.width;
                    image.height=metaData.height;
                    image.planes=metaData.planes;
                    image.interlace=Interlace.INTERLACE_PIXEL;//metaData.interlace;
                    image.npals=metaData.npals;
/*for(var key in image){
    if (image.hasOwnProperty(key)) {
      console.dir(key);
    }
   }   */                         

                var file = new hdf5.File(global.currentH5Path, Access.ACC_RDWR);
                var group=file.openGroup(stem);
                h5im.makeImage(group.id, leaf, image);
                group.close();
                file.close();
                wss.close();
      }
          });
            ws.on('close', function close() {
              console.log('disconnected');
              //resolve("");
            });
        
          ws.send('something');
        });        
    //});        
        this.body = "";
        return;
}

    readImage(path, cb) {
        path=decodeURIComponent(path);
        if(!path.startsWith("/read_image/")) return;
        console.dir("got to read image");
        path=path.substring(12);
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
        while(this.isPortTaken(this.port)){
            
        }
        const _this=this;
            var WebSocketServer = require('ws').Server
              , wss = new WebSocketServer({ host: os.hostname(), port: _this.port, path: '/read-image' });
            console.dir(os.hostname()+" "+_this.port);
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
            wss.on('connection', function connection(ws) {
                ws.binaryType = "nodebuffer";
                ws.on('close', function close() {
                  console.log('disconnected');
                  //resolve("");
                  wss.close(function(){_this.status=false});
                });
                ws.send(JSON.stringify(metaData));
                ws.send(buffer, { binary: true, mask: false });
                //ws.end("");

                group.close();
                file.close();
                //wss.close(function(){_this.status=false});
                
            });
        
            return;
    }
    
    isPortTaken(port) {
      var net = require('net')
      var tester = net.createServer()
      .once('error', function (err) {
        if (err.code != 'EADDRINUSE') return false
        return true
      })
      .once('listening', function() {
        tester.once('close', function() { return false })
        .close()
      })
      .listen(port)
    }    
}

