var os = require("os");
var hdf5 = require('hdf5').hdf5;
var h5im = require('hdf5').h5im;
var h5lt = require('hdf5').h5lt;

var Access = require('hdf5/lib/globals').Access;
var CreationOrder = require('hdf5/lib/globals').CreationOrder;
var H5Type = require('hdf5/lib/globals.js').H5Type;
const WebSocket = require('ws');

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

module.exports = class H5Datasets { 
    constructor (h5, port) {
        this.h5=h5
        this.port=port
        this.status=false
        this.make = new WebSocket.Server({ noServer: true });
        this.read = new WebSocket.Server({ noServer: true });
        this.make.on("error", error => {
            console.log("The server encountered an error! "+error.message);
        });
        this.make.on('connection', (ws) => {
            ws.isAlive = true;
            ws.binaryType = "nodebuffer";
            var messageCount=0;
            var path;
            var metaData;
                        console.log("connection");
          ws.on('message', function incoming(message) {

                    console.log("msg"+(typeof message));
              if(typeof message === 'string'){
                  if(messageCount===0)path=message;
                  else metaData=JSON.parse(message);
                    console.log("msg"+message);
                    messageCount++;
                    //if(messageCount % 2===0)messageCount=0;
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
                    var datasetBuffer=message;//BSON.deserialize(message, {promoteBuffers: true}, true);
                    //datasetBuffer.length=metaData.rows;
                    //if(metaData.rank>=2)metaData.length*=metaData.columns;
                    //if(metaData.rank>=3)metaData.length*=metaData.sections;

                    var file = new hdf5.File(global.currentH5Path, Access.ACC_RDWR);
                    var group=file.openGroup(stem);
                    var bufferType=undefined;
                    switch(metaData.reconstructor){
                        case "Float64Array":
                            bufferType=H5Type.H5T_NATIVE_DOUBLE;
                            break;
                        case "Float32Array":
                            bufferType=H5Type.H5T_NATIVE_FLOAT;
                            break;
                        case "Int32Array":
                            bufferType=H5Type.H5T_NATIVE_INT;
                            break;
                        case "Uint32Array":
                            bufferType=H5Type.H5T_NATIVE_UINT;
                            break;
                        case "Int16Array":
                            bufferType=H5Type.H5T_NATIVE_SHORT;
                            break;
                        case "Uint16Array":
                            bufferType=H5Type.H5T_NATIVE_USHORT;
                            break;
                        case "Int8Array":
                            bufferType=H5Type.H5T_NATIVE_CHAR;
                            break;
                        case "Uint8Array":
                            bufferType=H5Type.H5T_NATIVE_UCHAR;
                            break;
                        case "Uint8ClampedArray":
                            bufferType=H5Type.H5T_NATIVE_UCHAR;
                            break;
                        //case "Array":
                          //  buffer.type=H5Type.H5T_NATIVE_FLOAT;
                          //  break;
                         default:
                            console.dir(leaf+" unsupported type: "+metaData.reconstructor);
                            break;
                    }
                    if(bufferTpe!=undefined){
                        var options=new Object();
                        options.type=bufferType;
                        options.rank=metaData.rank;
                        switch(metaData.rank){
                            case 3:
                                options.files=metaData.files;
                            case 3:
                                options.sections=metaData.sections;
                            case 2:
                                options.columns=metaData.columns;
                            case 1:
                                options.rows=metaData.rows;
                                break;
                        }
                        var buffer=message;
                        console.log(group.id+" "+leaf);
                        h5lt.makeDataset(group.id, leaf, buffer, options);
                    }
                    group.close();
                    file.close();
                }
          });
            ws.on('pong', function heartbeat() {
              this.isAlive = true;
            });
            ws.on('close', function close(evt) {
                        console.log("closing "+evt);
            });

          //ws.send('something');
        });
        var _this=this;
        const interval = setInterval(function ping() {
          _this.make.clients.forEach(function each(ws) {
            if (ws.isAlive === false) return ws.terminate();

            ws.isAlive = false;
            ws.ping(noop);
          });
        }, 30000);

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
            var options=new Object();
            options.reconstructor=readBuffer.constructor.name;
            const readBuffer=h5lt.readDataset(group.id, leaf, (_options)=>{
                options.rank=_options.rank;
                switch(_options.rank){
                    case 4:
                        options.files=_options.files;
                    case 3:
                        options.sections=_options.sections;
                    case 2:
                        options.columns=_options.columns;
                    case 1:
                        options.rows=_options.rows;
                        break;
                    default:
                        break;
                }
            });
            ws.send(JSON.stringify(options));
            ws.send(readBuffer, { binary: true, mask: false });
            //ws.end("");

            group.close();
            file.close();
              }
          });
        });
    }
        
    makeText(path) {
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
        this.status=true
        const _this=this
        //var p = yield new Promise((resolve, reject) => {
            var WebSocketServer = require('ws').Server
              , wss = new WebSocketServer({ host: os.hostname(), port: _this.port, path: '/make-text', perMessageDeflate: false });
            
            wss.on('connection', function connection(ws) {
                ws.binaryType = "nodebuffer";
                var metaData;
              ws.on('message', function incoming(message) {
                  if(typeof message === 'string'){
                      metaData=JSON.parse(message);
                  }
                  else{

                        var file = new hdf5.File(global.currentH5Path, Access.ACC_RDWR);
                        var group=file.openGroup(stem);
                        var buffer=message;
                        var options=new Object();
                        options.type=H5Type.H5T_NATIVE_UCHAR;
                        options.rank=metaData.rank;
                        switch(metaData.rank){
                            case 3:
                                options.files=metaData.files;
                            case 3:
                                options.sections=metaData.sections;
                            case 2:
                                options.columns=metaData.columns;
                            case 1:
                                options.rows=metaData.rows;
                                break;
                        }
                        h5lt.makeDataset(group.id, leaf, buffer.toString(), options);
                        group.close();
                        file.close();
                        //wss.close(function(){_this.status=false});
                    }
              });
                ws.on('close', function close() {
                  //resolve("");
                  wss.close(function(){_this.status=false});
                });
            
              //ws.send('something');
            });        
        //});        
            //this.body = "";
            return;
    }
    
        readText(path) {
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
            const _this=this
                var WebSocketServer = require('ws').Server
                  , wss = new WebSocketServer({ host: os.hostname(), port: _this.port, path: '/read-text', perMessageDeflate: false });
                
                wss.on('connection', function connection(ws) {
                    ws.binaryType = "nodebuffer";
                    ws.on('close', function close() {
                      //resolve("");
                      wss.close(function(){_this.status=false});
                    });
                    var file = new hdf5.File(global.currentH5Path, Access.ACC_RDONLY);
                    var group=file.openGroup(stem);
                    var options=new Object();
                    options.reconstructor=readBuffer.constructor.name;
                    const readBuffer=h5lt.readDataset(group.id, leaf, (_options)=>{
                        options.rank=_options.rank;
                        switch(_options.rank){
                            case 4:
                                options.files=_options.files;
                            case 3:
                                options.sections=_options.sections;
                            case 2:
                                options.columns=_options.columns;
                            case 1:
                                options.rows=_options.rows;
                                break;
                            default:
                                break;
                        }
                    });
                    ws.send(JSON.stringify(options));
                    ws.send(readBuffer, { binary: true, mask: false });
                    //ws.end("");
    
                    group.close();
                    file.close();
                    //wss.close(function(){_this.status=false});
                    
                });
            
                return;
        }

}

