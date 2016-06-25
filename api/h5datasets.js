var os = require("os");
var hdf5 = require('hdf5').hdf5;
var h5im = require('hdf5').h5im;
var h5lt = require('hdf5').h5lt;

var co = require('co');
var bson = require("bson");
var BSON = new bson.BSONPure.BSON();

var Access = require('hdf5/lib/globals').Access;
var CreationOrder = require('hdf5/lib/globals').CreationOrder;
var H5Type = require('hdf5/lib/globals.js').H5Type;

module.exports.makeDataset = function * makeDataset(path) {
    if ('POST' != this.method) return yield next;
    console.dir("got to make dataset");
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
          , wss = new WebSocketServer({ host: os.hostname(), port: 9900, path: '/make-dataset' });
        
        wss.on('connection', function connection(ws) {
            //ws.binaryType = "arraybuffer";
          ws.on('message', function incoming(message, flags) {
              if(!flags.binary){
                  console.log('received: %s', message);
              }
              else{
                    var datasetBuffer=BSON.deserialize(message, {promoteBuffers: true}, true);
                    datasetBuffer.length=datasetBuffer.rows;
                    if(datasetBuffer.rank>=2)datasetBuffer.length*=datasetBuffer.columns;
                    if(datasetBuffer.rank>=3)datasetBuffer.length*=datasetBuffer.sections;
            
                    var file = new hdf5.File(global.currentH5Path, Access.ACC_RDWR);
                    var group=file.openGroup(stem);
                    switch(datasetBuffer.reconstructor){
                        case "Uint32Array":
                            var buffer=Uint32Array.from(datasetBuffer);
                            buffer.rank=datasetBuffer.rank;
                            buffer.rows=datasetBuffer.rows;
                            buffer.columns=datasetBuffer.columns;
                            buffer.type=H5Type.H5T_NATIVE_UINT;
                            h5lt.makeDataset(group.id, leaf, buffer);
                            break;
                        case "Int32Array":
                            var buffer=Int32Array.from(datasetBuffer);
                            buffer.rank=datasetBuffer.rank;
                            buffer.rows=datasetBuffer.rows;
                            buffer.columns=datasetBuffer.columns;
                            buffer.type=H5Type.H5T_NATIVE_INT;
                            h5lt.makeDataset(group.id, leaf, buffer);
                            break;
                        case "Float64Array":
                            var buffer=Float64Array.from(datasetBuffer);
                            buffer.rank=datasetBuffer.rank;
                            buffer.rows=datasetBuffer.rows;
                            buffer.columns=datasetBuffer.columns;
                            buffer.type=H5Type.H5T_NATIVE_DOUBLE;
                            h5lt.makeDataset(group.id, leaf, buffer);
                            break;
                        case "Float32Array":
                            var buffer=Float32Array.from(datasetBuffer);
                            buffer.rank=datasetBuffer.rank;
                            buffer.rows=datasetBuffer.rows;
                            buffer.columns=datasetBuffer.columns;
                            buffer.type=H5Type.H5T_NATIVE_FLOAT;
                            h5lt.makeDataset(group.id, leaf, buffer);
                            break;
                        //case "Array":
                          //  buffer.type=H5Type.H5T_NATIVE_FLOAT;
                          //  break;
                         default:
                            console.dir(leaf+" unsupported type: "+datasetBuffer[0].reconstructor);
                            break;
                    }
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

