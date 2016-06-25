var os = require("os");
var hdf5 = require('hdf5').hdf5;
var h5im = require('hdf5').h5im;
var h5lt = require('hdf5').h5lt;
var h5tb = require('hdf5').h5tb;
var h5pt = require('hdf5').h5pt;

var co = require('co');
var bson = require("bson");
var BSON = new bson.BSONPure.BSON();

var Access = require('hdf5/lib/globals').Access;
var CreationOrder = require('hdf5/lib/globals').CreationOrder;
var State = require('hdf5/lib/globals').State;
var H5OType = require('hdf5/lib/globals').H5OType;
var HLType = require('hdf5/lib/globals').HLType;
var Interlace = require('hdf5/lib/globals').Interlace;

module.exports.makeTable = function * makeTable2(path) {
    if ('POST' != this.method) return yield next;
    console.dir("got to make2 table");
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
          , wss = new WebSocketServer({ host: os.hostname(), port: 9900, path: '/make-table' });
        
        wss.on('connection', function connection(ws) {
            //ws.binaryType = "arraybuffer";
          ws.on('message', function incoming(message, flags) {
              if(!flags.binary){
                  console.log('received: %s', message);
              }
              else{
                  var tableModelBuffer=BSON.deserialize(message, {promoteBuffers: true});

var tableModel=Array();
for(var propertyName in tableModelBuffer[1]) {
   // propertyName is what you want
   // you can get the value like this: myObject[propertyName]
   console.dir(propertyName+": "+tableModelBuffer[1][propertyName]+" "+tableModelBuffer[0][propertyName].reconstructor);
   switch(tableModelBuffer[0][propertyName].reconstructor){
       case "Uint32Array":
           tableModelBuffer[1][propertyName].length=tableModelBuffer[0][propertyName].length;
           tableModel[tableModel.length]=new Uint32Array(tableModelBuffer[1][propertyName]);
           tableModel[tableModel.length-1].name=tableModelBuffer[0][propertyName].name;
           break;
       case "Int32Array":
           tableModelBuffer[1][propertyName].length=tableModelBuffer[0][propertyName].length;
           tableModel[tableModel.length]=new Int32Array(tableModelBuffer[1][propertyName]);
           tableModel[tableModel.length-1].name=tableModelBuffer[0][propertyName].name;
           break;
       case "Float64Array":
           tableModelBuffer[1][propertyName].length=tableModelBuffer[0][propertyName].length;
           tableModel[tableModel.length]=new Float64Array(tableModelBuffer[1][propertyName]);
           tableModel[tableModel.length-1].name=tableModelBuffer[0][propertyName].name;
           break;
       case "Float32Array":
           tableModelBuffer[1][propertyName].length=tableModelBuffer[0][propertyName].length;
           tableModel[tableModel.length]=new Float32rray(tableModelBuffer[1][propertyName]);
           tableModel[tableModel.length-1].name=tableModelBuffer[0][propertyName].name;
           break;
       case "Array":
           tableModel[tableModel.length]=new Array();
            for(var propertyName2 in tableModelBuffer[1][propertyName]) {
               tableModel[tableModel.length-1][propertyName2]=tableModelBuffer[1][propertyName][propertyName2];
            }                  
           tableModel[tableModel.length-1].name=tableModelBuffer[0][propertyName].name;
           tableModel[tableModel.length-1].length=tableModelBuffer[0][propertyName].length;
           console.dir(tableModel[tableModel.length-1].name+" in Array "+tableModelBuffer[0][propertyName].reconstructor);
           break;
           default:
           console.dir(tableModel[tableModel.length-1].name+" unsupported type: "+tableModel[tableModel.length-1].length+" "+tableModelBuffer[0][propertyName].length);
           break;
   }
}                  
//tableModel.length=length;
                console.log('array?: %s', tableModel.length);
                console.log('received: %s', JSON.stringify(tableModelBuffer));
                var file = new hdf5.File(global.currentH5Path, Access.ACC_RDWR);
                var group=file.openGroup(stem);
                    h5tb.makeTable(group.id, leaf, tableModel);
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

module.exports.modifyFields = function * modifyFields(path) {
    if ('POST' != this.method) return yield next;
    console.dir("got to modify fields");
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
    var WebSocketServer = require('ws').Server
      , wss = new WebSocketServer({ port: 9000 });
    
    wss.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        console.log('received: %s', message);
      });
    
      ws.send('something');
    });        
}