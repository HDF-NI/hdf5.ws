import os  from "os";
import {hdf5, h5im, h5lt, h5tb, h5pt}  from 'hdf5';
import {Access, CreationOrder, H5Type, Interlace}  from 'hdf5/lib/globals';
import WebSocket from 'ws';
import { WebSocketServer } from 'ws';
import co  from 'co';


function noop() {}

function heartbeat() {
  this.isAlive = true;
}

export default class H5Tables { 
    constructor (h5, port) {
        this.h5=h5
        this.port=port
        this.status=false
        this.make = new WebSocketServer({ noServer: true });
        this.make.on('connection', function connection(ws) {
            ws.binaryType = "arraybuffer";
            var msgCount=0;
            var metaData;
            var columnIndex=0;
            var tableModel=Array();
          ws.on('message', function incoming(message) {
              if(typeof message === 'string'){
                  if(msgCount===0)path=message;
                  else {metaData=JSON.parse(message);
                  columnIndex=0;
                  tableModel=Array();}
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
    }
        
makeTable(path) {
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
    console.log("leaf to port "+this.port);
    while(this.isPortTaken(this.port)){
        
    }
    const _this=this;
    //var p = yield new Promise((resolve, reject) => {
           const wss = new WebSocketServer({ host: os.hostname(), port: _this.port, path: '/make-table', perMessageDeflate: true  });
        
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

readTable(path) {
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
    var file = new hdf5.File(global.currentH5Path, Access.ACC_RDONLY);
    var group=file.openGroup(stem);
    var tableModel=h5tb.readTable(group.id, leaf);
    group.close();
    file.close();
    this.body = "";
}
modifyFields(path) {
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

readCsv(path) {
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
        const readBuffer=h5lt.readDataset(group.id, leaf);
        //ws.send(JSON.stringify(options));
        ws.send(readBuffer, { binary: true, mask: false });
        //ws.end("");

        group.close();
        file.close();
        //wss.close(function(){_this.status=false});
        
    });
    
     this.body = "";
}

    isPortTaken(port) {
        try{
      var tester = net.createServer()
      .once('error', function (err) {
        if (err.code != 'EADDRINUSE') return false
        return true
      })
      .once('listening', function() {
        tester.once('close', function() { return false })
        .close()
      })
      .listen(port);
        }
        catch(ex){
            
        }
      return false;
    }
}