var os = require("os");
var hdf5 = require('hdf5').hdf5;
var h5im = require('hdf5').h5im;
var h5lt = require('hdf5').h5lt;
var h5tb = require('hdf5').h5tb;
var h5pt = require('hdf5').h5pt;

var co = require('co');

var Access = require('hdf5/lib/globals').Access;
var CreationOrder = require('hdf5/lib/globals').CreationOrder;
var State = require('hdf5/lib/globals').State;
var H5OType = require('hdf5/lib/globals').H5OType;
var HLType = require('hdf5/lib/globals').HLType;
var Interlace = require('hdf5/lib/globals').Interlace;

module.exports = class H5Tables { 
    constructor (h5, port) {
        this.h5=h5
        this.port=port
        this.status=false
    }
        
makeTable(path) {
    path=decodeURIComponent(path);
    if(!path.startsWith("/make_table/")) return;
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
    //var p = yield new Promise((resolve, reject) => {
        var WebSocketServer = require('ws').Server
          , wss = new WebSocketServer({ host: os.hostname(), port: _this.port, path: '/make-table', perMessageDeflate: true  });
        
        wss.on('connection', function connection(ws) {
            ws.binaryType = "arraybuffer";
            var metaData;
            var columnIndex=0;
            var tableModel=Array();
          ws.on('message', function incoming(message) {
              if(typeof message === 'string'){
                  metaData=JSON.parse(message);
                  columnIndex=0;
                  tableModel=Array();
              }
              else{
                  var tableModelBuffer=message;
               switch(metaData.reconstructors[columnIndex]){
                   case "Int32Array":
                       tableModel[tableModel.length]=new Int32Array(tableModelBuffer.buffer, tableModelBuffer.byteOffset, tableModelBuffer.byteLength / Int32Array.BYTES_PER_ELEMENT);
                       tableModel[tableModel.length-1].name=metaData.column_labels[columnIndex];
                       break;
                   case "Uint32Array":
                       tableModel[tableModel.length]=new Uint32Array(tableModelBuffer.buffer, tableModelBuffer.byteOffset, tableModelBuffer.byteLength / Uint32Array.BYTES_PER_ELEMENT);
                       tableModel[tableModel.length-1].name=metaData.column_labels[columnIndex];
                       break;
                   case "Float64Array":
                       tableModel[tableModel.length]=new Float64Array(tableModelBuffer.buffer, tableModelBuffer.byteOffset, tableModelBuffer.byteLength / Float64Array.BYTES_PER_ELEMENT);
                       tableModel[tableModel.length-1].name=metaData.column_labels[columnIndex];
                       break;
                   case "Float32Array":
                       tableModel[tableModel.length]=new Float32Array(tableModelBuffer.buffer, tableModelBuffer.byteOffset, tableModelBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT);
                       tableModel[tableModel.length-1].name=metaData.column_labels[columnIndex];
                       break;
                   case "Uint8Array":
                       var splitStr=tableModelBuffer.toString().split(",");
                       var information = new Array(splitStr.length);
                       for(var i=0;i<splitStr.length;i++){
                           information[i]=splitStr[i];
                       }
                       tableModel[tableModel.length]=information;
                       tableModel[tableModel.length-1].name=metaData.column_labels[columnIndex];
                       break;
                   case "Array":
                       var information = new Array(metaData.rows);
                       //console.dir(tableModelBuffer.toString());
                       for(var i=0;i<metaData.rows;i++){
                           information[i]=tableModelBuffer[i];
                       //console.dir(information[i]);
                       }
                       tableModel[tableModel.length]=information;
                       tableModel[tableModel.length-1].name=metaData.column_labels[columnIndex];
                       break;
                    default:
                       console.dir(metaData.column_labels[columnIndex]+" unsupported type: "+metaData.reconstructors[columnIndex]+" "+tableModelBuffer.byteLength);
                       break;
               }
                if(columnIndex===metaData.column_labels.length-1){
                var file = new hdf5.File(global.currentH5Path, Access.ACC_RDWR);
                var group=file.openGroup(stem);
                    h5tb.makeTable(group.id, leaf, tableModel);
                group.close();
                file.close();
                }
                columnIndex++;
              }
          });
            ws.on('close', function close() {
              //console.log('disconnected');
                wss.close();
              //resolve("");
            });
        
          ws.send('something');
        });        
    //});        
        this.body = "";
        return;
}

modifyFields(path) {
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
    while(this.isPortTaken(this.port)){
        
    }
    const _this=this;
    var WebSocketServer = require('ws').Server
      , wss = new WebSocketServer({ host: os.hostname(),  port: _this.port, path: '/modify-fields', perMessageDeflate: true   });
    
    wss.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        //console.log('received: %s', message);
      });
    
      ws.send('something');
    });        
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