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
                            h5lt.makeDataset(group.id, leaf, buffer, options);
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

