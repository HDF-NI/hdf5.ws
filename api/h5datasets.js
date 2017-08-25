var os = require("os");
var hdf5 = require('hdf5').hdf5;
var h5im = require('hdf5').h5im;
var h5lt = require('hdf5').h5lt;

var Access = require('hdf5/lib/globals').Access;
var CreationOrder = require('hdf5/lib/globals').CreationOrder;
var H5Type = require('hdf5/lib/globals.js').H5Type;

module.exports = class H5Datasets { 
    constructor (h5, port) {
        this.h5=h5
        this.port=port
        this.status=false
    }
        
    makeDataset(path) {
        path=decodeURIComponent(path);
        if(!path.startsWith("/make_dataset/")) return;
        path=path.substring(14);
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
        while(this.isPortTaken(this.port)){
            
        }
        const _this=this
        //var p = yield new Promise((resolve, reject) => {
            var WebSocketServer = require('ws').Server,
            wss = new WebSocketServer({ host: os.hostname(), port: _this.port, path: '/make-dataset', perMessageDeflate: true });
            
            wss.on('connection', function connection(ws) {
                ws.binaryType = "nodebuffer";
                var metaData;
              ws.on('message', function incoming(message) {
                  
                  if(typeof message === 'string'){
                      metaData=JSON.parse(message);
                  }
                  else{
                        var datasetBuffer=message;//BSON.deserialize(message, {promoteBuffers: true}, true);
                        //datasetBuffer.length=metaData.rows;
                        //if(metaData.rank>=2)metaData.length*=metaData.columns;
                        //if(metaData.rank>=3)metaData.length*=metaData.sections;
                
                        var file = new hdf5.File(global.currentH5Path, Access.ACC_RDWR);
                        var group=file.openGroup(stem);
                        switch(metaData.reconstructor){
                            case "Float64Array":
                                var buffer=message;
                                buffer.rank=metaData.rank;
                                buffer.rows=metaData.rows;
                                if(metaData.rank>=2)buffer.columns=metaData.columns;
                                buffer.type=H5Type.H5T_NATIVE_DOUBLE;
                                h5lt.makeDataset(group.id, leaf, buffer);
                                break;
                            case "Float32Array":
                                var buffer=message;
                                buffer.rank=metaData.rank;
                                buffer.rows=metaData.rows;
                                if(metaData.rank>=2)buffer.columns=metaData.columns;
                                buffer.type=H5Type.H5T_NATIVE_FLOAT;
                                h5lt.makeDataset(group.id, leaf, buffer);
                                break;
                            case "Int32Array":
                                var buffer=message;
                                buffer.rank=metaData.rank;
                                buffer.rows=metaData.rows;
                                if(metaData.rank>=2)buffer.columns=metaData.columns;
                                buffer.type=H5Type.H5T_NATIVE_INT;
                                h5lt.makeDataset(group.id, leaf, buffer);
                                break;
                            case "Uint32Array":
                                var buffer=message;
                                buffer.rank=metaData.rank;
                                buffer.rows=metaData.rows;
                                if(metaData.rank>=2)buffer.columns=metaData.columns;
                                buffer.type=H5Type.H5T_NATIVE_UINT;
                                h5lt.makeDataset(group.id, leaf, buffer);
                                break;
                            case "Int16Array":
                                var buffer=message;
                                buffer.rank=metaData.rank;
                                buffer.rows=metaData.rows;
                                if(metaData.rank>=2)buffer.columns=metaData.columns;
                                buffer.type=H5Type.H5T_NATIVE_SHORT;
                                h5lt.makeDataset(group.id, leaf, buffer);
                                break;
                            case "Uint16Array":
                                var buffer=message;
                                buffer.rank=metaData.rank;
                                buffer.rows=metaData.rows;
                                if(metaData.rank>=2)buffer.columns=metaData.columns;
                                buffer.type=H5Type.H5T_NATIVE_USHORT;
                                h5lt.makeDataset(group.id, leaf, buffer);
                                break;
                            case "Int8Array":
                                var buffer=message;
                                buffer.rank=metaData.rank;
                                buffer.rows=metaData.rows;
                                if(metaData.rank>=2)buffer.columns=metaData.columns;
                                buffer.type=H5Type.H5T_NATIVE_CHAR;
                                h5lt.makeDataset(group.id, leaf, buffer);
                                break;
                            case "Uint8Array":
                                var buffer=message;
                                buffer.rank=metaData.rank;
                                buffer.rows=metaData.rows;
                                if(metaData.rank>=2)buffer.columns=metaData.columns;
                                buffer.type=H5Type.H5T_NATIVE_UCHAR;
                                h5lt.makeDataset(group.id, leaf, buffer);
                                break;
                            case "Uint8ClampedArray":
                                var buffer=message;
                                buffer.rank=metaData.rank;
                                buffer.rows=metaData.rows;
                                if(metaData.rank>=2)buffer.columns=metaData.columns;
                                buffer.type=H5Type.H5T_NATIVE_UCHAR;
                                h5lt.makeDataset(group.id, leaf, buffer);
                                break;
                            //case "Array":
                              //  buffer.type=H5Type.H5T_NATIVE_FLOAT;
                              //  break;
                             default:
                                console.dir(leaf+" unsupported type: "+metaData.reconstructor);
                                break;
                        }
                        group.close();
                        file.close();
                        wss.close(function(){_this.status=false});
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
    
        readDataset(path) {
            path=decodeURIComponent(path);
            if(!path.startsWith("/read_dataset/")) return;
            path=path.substring(14);
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
            const _this=this
                var WebSocketServer = require('ws').Server
                  , wss = new WebSocketServer({ host: os.hostname(), port: _this.port, path: '/read-dataset', perMessageDeflate: true});
                
                wss.on('connection', function connection(ws) {
                    ws.binaryType = "nodebuffer";
                    ws.on('close', function close() {
                      //resolve("");
                      wss.close(function(){_this.status=false});
                    });
                    var file = new hdf5.File(global.currentH5Path, Access.ACC_RDONLY);
                    var group=file.openGroup(stem);
                    const readBuffer=h5lt.readDataset(group.id, leaf);
                    switch(readBuffer.rank){
                        case 3:
                            ws.send(JSON.stringify({reconstructor: readBuffer.constructor.name, rank: readBuffer.rank, rows: readBuffer.rows, columns: readBuffer.columns, sections: readBuffer.sections}));
                            break;
                        case 2:
                            ws.send(JSON.stringify({reconstructor: readBuffer.constructor.name, rank: readBuffer.rank, rows: readBuffer.rows, columns: readBuffer.columns}));
                            break;
                        default:
                            ws.send(JSON.stringify({reconstructor: readBuffer.constructor.name, rank: readBuffer.rank, rows: readBuffer.rows}));
                            break;
                    }
                    ws.send(readBuffer, { binary: true, mask: false });
                    //ws.end("");
    
                    group.close();
                    file.close();
                    //wss.close(function(){_this.status=false});
                    
                });
            
                return;
        }

    makeText(path) {
        path=decodeURIComponent(path);
        if(!path.startsWith("/make_text/")) return;
        path=path.substring(11);
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
        while(this.isPortTaken(this.port)){
            
        }
        const _this=this
        //var p = yield new Promise((resolve, reject) => {
            var WebSocketServer = require('ws').Server
              , wss = new WebSocketServer({ host: os.hostname(), port: _this.port, path: '/make-text', perMessageDeflate: true });
            
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
                        buffer.rank=metaData.rank;
                        buffer.rows=metaData.rows;
                        if(metaData.rank>=2)buffer.columns=metaData.columns;
                        buffer.type=H5Type.H5T_NATIVE_UCHAR;
                        h5lt.makeDataset(group.id, leaf, buffer.toString());
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
            if(!path.startsWith("/read_text/")) return;
            path=path.substring(11);
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
            const _this=this
                var WebSocketServer = require('ws').Server
                  , wss = new WebSocketServer({ host: os.hostname(), port: _this.port, path: '/read-text', perMessageDeflate: true });
                
                wss.on('connection', function connection(ws) {
                    ws.binaryType = "nodebuffer";
                    ws.on('close', function close() {
                      //resolve("");
                      wss.close(function(){_this.status=false});
                    });
                    var file = new hdf5.File(global.currentH5Path, Access.ACC_RDONLY);
                    var group=file.openGroup(stem);
                    const readBuffer=h5lt.readDataset(group.id, leaf);
                    ws.send(JSON.stringify({reconstructor: readBuffer.constructor.name, rank: readBuffer.rank, rows: readBuffer.rows}));
                    ws.send(readBuffer, { binary: true, mask: false });
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

