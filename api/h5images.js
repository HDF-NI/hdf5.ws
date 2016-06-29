var os = require("os");
var hdf5 = require('hdf5').hdf5;
var h5im = require('hdf5').h5im;

var Access = require('hdf5/lib/globals').Access;
var CreationOrder = require('hdf5/lib/globals').CreationOrder;
var H5Type = require('hdf5/lib/globals.js').H5Type;

module.exports.makeImage = function makeImage(path) {
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
    //var p = yield new Promise((resolve, reject) => {
        var WebSocketServer = require('ws').Server
          , wss = new WebSocketServer({ host: os.hostname(), port: 9900, path: '/make-image' });
        
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
                    imageBuffer.length=metaData.width*metaData.height*metaData.planes;
                    console.dir(imageBuffer.length);
                    var image=message;//Buffer.from(imageBuffer);
                    image.width=metaData.width;
                    image.height=metaData.height;
                    image.planes=metaData.planes;
                    image.interlace=metaData.interlace;
                    image.npals=metaData.npals;
for(var key in image){
    if (image.hasOwnProperty(key)) {
      console.dir(key);
    }
   }                            

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

