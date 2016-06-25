var os = require("os");
var hdf5 = require('hdf5').hdf5;
var h5im = require('hdf5').h5im;

var co = require('co');
var bson = require("bson");
var BSON = new bson.BSONPure.BSON();

var Access = require('hdf5/lib/globals').Access;
var CreationOrder = require('hdf5/lib/globals').CreationOrder;
var H5Type = require('hdf5/lib/globals.js').H5Type;

module.exports.makeImage = function * makeImage(path) {
    if ('POST' != this.method) return yield next;
    console.dir("got to make image");
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
            //ws.binaryType = "arraybuffer";
          ws.on('message', function incoming(message, flags) {
              if(!flags.binary){
                  console.log('received: %s', message);
              }
              else{
                    var imageBuffer=BSON.deserialize(message, {promoteBuffers: false});
                    console.dir(imageBuffer.constructor.name);
                    imageBuffer.length=imageBuffer.width*imageBuffer.height*imageBuffer.planes;
                    console.dir(imageBuffer.length);
                    var image=Buffer.from(imageBuffer);
                    image.width=imageBuffer.width;
                    image.height=imageBuffer.height;
                    image.planes=imageBuffer.planes;
                    image.interlace=imageBuffer.interlace;
                    image.npals=imageBuffer.npals;
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

