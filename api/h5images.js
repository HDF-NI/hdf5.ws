import os from "os";
import net from 'net';
import {hdf5, h5im} from 'hdf5';

import {Access, CreationOrder, H5Type, Interlace} from 'hdf5/lib/globals';
import WebSocket from 'ws';
import { WebSocketServer } from 'ws';

export default class H5Images { 
    constructor (h5, port) {
        this.h5=h5
        this.port=port
        this.status=false
        this.make = new WebSocketServer({ noServer: true });
        this.read = new WebSocketServer({ noServer: true });
        this.make.on("error", error => {
            console.log("The server encountered an error! "+error.message);
        });
        this.make.on('connection', function connection(ws) {
            ws.binaryType = "nodebuffer";
            var msgCount=0;
            var path;
            var metaData;
          ws.on('message', function incoming(message) {
              if(typeof message === 'string'){
                  if(msgCount===0)path=message;
                  else metaData=JSON.parse(message);
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
                  
                var image=message;//Buffer.from(imageBuffer);
                if(leaf.endsWith(".png")){

                }
                var file = new hdf5.File(global.currentH5Path, Access.ACC_RDWR);
                var group=file.openGroup(stem);
                h5im.makeImage(group.id, leaf, image, {interlace: Interlace.INTERLACE_PIXEL, width: metaData.width, height: metaData.height, planes: metaData.planes, npals: metaData.npals});
                group.close();
                file.close();
            }
          });
            ws.on('close', function close() {
              //resolve("");
            });
        
          ws.send('something');
        });
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
                var buffer=h5im.readImage(group.id, leaf);
                var channelSize = buffer.width * buffer.height;
                var size = channelSize * (buffer.planes);
                var redChannelEnd = channelSize * 1;
                var greenChannelEnd = channelSize * 2;
                var blueChannelEnd = channelSize * 3;
                var metaData={name: leaf, width: buffer.width, height: buffer.height, planes: buffer.planes, npals: buffer.planes, size: size}
                ws.send(JSON.stringify(metaData));
                ws.send(Uint8Array.from(buffer), { binary: true, compress: false, mask: false });
                //ws.end("");

                group.close();
                file.close();
              }
            });
        });
    }

getInfo(path) {
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
    var file = new hdf5.File(global.currentH5Path, Access.ACC_RDONLY);
    var group=file.openGroup(stem);
    var info=h5im.getImageInfo(group.id, leaf);
    group.close();
    file.close();
    return info;
}

        
make(path) {
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
//    console.dir(stem);
//    console.dir(leaf);
        const _this=this
    console.log(os.hostname()+" "+_this.port);
    //var p = yield new Promise((resolve, reject) => {
        var WebSocketServer = require('ws').Server
          , wss = new WebSocketServer({ host: os.hostname(), port: _this.port, path: '/make-image', maxPayload: 1024*1024*1024, perMessageDeflate: false  });
            console.dir(os.hostname()+" "+_this.port);
        wss.on("error", error => {
            console.log("The server encountered an error! "+error.message);
            });
        wss.on('connection', function connection(ws) {
            ws.binaryType = "nodebuffer";
            var metaData;
          ws.on('message', function incoming(message) {
              if(typeof message === 'string'){
                  metaData=JSON.parse(message);
              }
              else{
                  
                var image=message;//Buffer.from(imageBuffer);
                if(leaf.endsWith(".png")){

                }
                var file = new hdf5.File(global.currentH5Path, Access.ACC_RDWR);
                var group=file.openGroup(stem);
                h5im.makeImage(group.id, leaf, image, {interlace: Interlace.INTERLACE_PIXEL, width: metaData.width, height: metaData.height, planes: metaData.planes, npals: metaData.npals});
                group.close();
                file.close();
                wss.close();
            }
          });
            ws.on('close', function close() {
              //resolve("");
              wss.close();
            });
        
          ws.send('something');
        });        
    //});        
        this.body = "";
        return;
}

    readImage(path, cb) {
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
//        console.dir(stem);
//        console.dir(leaf);
        const _this=this;
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
        this.ws.send(JSON.stringify(metaData));
        this.ws.send(Uint8Array.from(buffer), { binary: true, compress: false, mask: false });

        group.close();
        file.close();
        return;
    }
    
    readRegion(path, cb) {
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
        const _this=this;
            var wss = new WebSocketServer({ host: os.hostname(), port: _this.port, path: '/read-image-region', perMessageDeflate: false  });
            wss.on('connection', function connection(ws) {
                ws.binaryType = "arraybuffer";
                ws.on('close', function close() {
                  //resolve("");
                  console.log('rclose wss');
                  wss.close(function(){_this.status=false});
                });
                var metaDataInput;
                ws.on('message', function incoming(message) {
                  if(typeof message === 'string'){
                      //console.log('region received: %s', message);
                      metaDataInput=JSON.parse(message);
                        console.dir(metaDataInput);
                    var file = new hdf5.File(global.currentH5Path, Access.ACC_RDONLY);
                    var group=file.openGroup(stem);
                    var buffer=h5im.readImageRegion(group.id, leaf, metaDataInput);
                    var channelSize = buffer.width * buffer.height;
                    var size = channelSize * (buffer.planes);
                    var redChannelEnd = channelSize * 1;
                    var greenChannelEnd = channelSize * 2;
                    var blueChannelEnd = channelSize * 3;
                    var metaData={name: leaf, width: buffer.width, height: buffer.height, planes: buffer.planes, npals: buffer.planes, size: size}
                    cb(metaData);
                    ws.send(JSON.stringify(metaData));
                    ws.send(buffer, { binary: true, compress: false, mask: false });
                    ws.send(JSON.stringify({ type: 'STREAM_COMPLETE' }));
                    group.close();
                    file.close();
        
                    // Gracefully give the network card a tiny 100ms window to flush buffers, then disconnect
                    setTimeout(() => {
                        ws.close(); 
                    }, 100);
                  }
                });
                
            });

            return;
    }
    
    readMosaic(path, cb) {
        console.log('readMosaic called with path:', path);
        // path=path.substring(19);
        // console.log('Decoded path for readMosaic:', path);
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
        const _this=this;
            var wss = new WebSocketServer({ host: os.hostname(), port: _this.port, path: '/read-image-mosaic', perMessageDeflate: false  });
            wss.on('connection', function connection(ws) {
                //ws.binaryType = "arraybuffer";
                ws.on('close', function close() {
                  //resolve("");
                  console.log('rclose wss');
                  wss.close(function(){_this.status=false});
                });
                var metaDataInput;
                ws.on('message', (message, isBinary) => {
                  if(!isBinary){
                      //console.log('region received: %s', message);
                      metaDataInput=JSON.parse(message);
                      console.dir(metaDataInput);
                    var file = new hdf5.File(global.currentH5Path, Access.ACC_RDONLY);
                    var group=file.openGroup(stem);
                    var buffer=h5im.readImageRegion(group.id, leaf, metaDataInput);
                    var planes = buffer.planes;
                    var channelSize = buffer.width * buffer.height;
                    var size = channelSize * (buffer.planes);
                    var redChannelEnd = channelSize * 1;
                    var greenChannelEnd = channelSize * 2;
                    var blueChannelEnd = channelSize * 3;
                    var originStartY=parseInt(metaDataInput.start[0]);
                    var originStartX=parseInt(metaDataInput.start[1]);
                    var metaData={name: leaf, startX: originStartX, startY: originStartY, width: buffer.height, height: buffer.width, planes: buffer.planes, npals: 0, size: size}
                    console.log('Initial tile metadata to send:', metaData);
                    console.log(typeof buffer.buffer);
                    console.log(`🚀 Streaming a pure native ArrayBuffer. Byte size: ${buffer.buffer.byteLength}`);
                    cb(metaData);
                    ws.send(JSON.stringify(metaData));
                    ws.send(buffer.buffer, { binary: true, compress: false, mask: false });
                    var metaDataInputCopy = JSON.parse(JSON.stringify(metaDataInput)); // Deep copy to avoid mutation issues
                    if(originStartX+metaDataInput.count[1]<metaDataInput.imageWidth && originStartY+metaDataInput.count[0]<metaDataInput.imageHeight)
                    for(var j=-metaDataInput.boundary[1];j<=metaDataInput.boundary[1];j++){
                        metaDataInput.start[1]=parseInt(originStartX+j*metaDataInput.count[1]);
                        metaData.startX=parseInt(originStartX+j*metaDataInput.count[1]);
                        console.log('Updated tile metadata for X axis:', metaDataInput.start[1], metaDataInput.count[1], metaDataInput.imageWidth);
                        if(metaDataInput.start[1]<0)continue;
                        else if(metaDataInput.start[1]+metaDataInput.count[1]>metaDataInput.imageWidth){
                            console.log(`Tile exceeds image width boundary. Adjusting tile width for boundary conditions.`+metaDataInput.start[1]+', '+metaDataInput.count[1]+', '+metaDataInput.imageWidth);
                            if(parseInt(metaDataInput.imageWidth-metaDataInput.start[1])<0)continue;
                            metaDataInput.count[1]=parseInt(metaDataInput.imageWidth-metaDataInput.start[1]);
                            metaData.width=parseInt(metaDataInput.count[1]);
                            console.log('Adjusted tile width for boundary: ', metaData.width);
                        }
                    for(var i=-metaDataInput.boundary[0];i<=metaDataInput.boundary[0];i++){
                        // if(i===0 && j===0)continue;
                        // if(i>-metaDataInput.boundary[0] && j>-metaDataInput.boundary[1] && i<metaDataInput.boundary[0] && j<metaDataInput.boundary[1])continue;
                        metaDataInput.start[0]=parseInt(originStartY+i*metaDataInput.count[0]);
                        metaData.startY=parseInt(originStartY+i*metaDataInput.count[0]);
                        console.log('Updated tile metadata for Y axis:', metaDataInput.start[0], metaDataInput.count[0], metaDataInput.imageHeight);
                        if(metaDataInput.start[0]<0)continue;
                        else if(metaDataInput.start[0]+metaDataInput.count[0]>metaDataInput.imageHeight){
                            console.log(`Tile exceeds image height boundary. Adjusting tile height for boundary conditions.`+metaDataInput.start[0]+', '+metaDataInput.count[0]+', '+metaDataInput.imageHeight);
                            if(parseInt(metaDataInput.imageHeight-metaDataInput.start[0])<0)continue;
                            metaDataInput.count[0]=parseInt(metaDataInput.imageHeight-metaDataInput.start[0]);
                            metaData.height=parseInt(metaDataInput.count[0]);
                            console.log('Adjusted tile height for boundary: ', metaData.height);
                        }
                        if(metaDataInput.start[0]+metaDataInput.count[0]<metaDataInput.imageHeight && metaDataInput.start[1]+metaDataInput.count[1]<metaDataInput.imageWidth){
                        ws.send(JSON.stringify(metaData));
                        console.log('Requesting region with metadata: ', metaDataInput);
                        buffer=h5im.readImageRegion(group.id, leaf, metaDataInput);

                    console.log(`🚀 Streaming a pure native ArrayBuffer. Byte size: ${buffer.buffer.byteLength}`);
                        ws.send(buffer.buffer, { binary: true, compress: false, mask: false });
                        }
                        metaDataInput.count[0]=metaDataInputCopy.count[0];
                        metaData.height=metaDataInput.count[0];
                        metaDataInput.count[1]=metaDataInputCopy.count[1];
                        metaData.width=metaDataInput.count[1];
                    }
                    }
                    // Send a dedicated final payload message frame
                    ws.send(JSON.stringify({ type: 'STREAM_COMPLETE' }));
                    group.close();
                    file.close();
        
                    // Gracefully give the network card a tiny 100ms window to flush buffers, then disconnect
                    setTimeout(() => {
                        ws.close(); 
                    }, 100);
                  }
                });
                
            });
        
            return;
    }
    
}

