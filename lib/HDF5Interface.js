
function heartbeat() {
  clearTimeout(this.pingTimeout);

  // Use `WebSocket#terminate()`, which immediately destroys the connection,
  // instead of `WebSocket#close()`, which waits for the close timer.
  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.
  this.pingTimeout = setTimeout(() => {
    this.terminate();
  }, 30000 + 1000);
}

function HDF5Interface(port){
    this.port=port;
}

    HDF5Interface.prototype.createGroup = function(path, cb){

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", function(evt){
        console.log("load ");
    });
    xmlHttp.addEventListener("error", function(evt){
        console.log("error "+event);
    });
    xmlHttp.addEventListener("abort", function(evt){
        console.log("abort "+event);
    });
    xmlHttp.addEventListener('loadend', function(evt) {
        cb();
    });
    path=encodeURIComponent(path);
    xmlHttp.open( "POST", "https://"+location.hostname+(location.port ? ":"+location.port: "")+"/create_group/"+path ); // false for synchronous request
    xmlHttp.send( );
}

HDF5Interface.prototype.setCompression = function(path){

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", function(evt){

    });
    path=encodeURIComponent(path);
    xmlHttp.open( "POST", "https://"+location.hostname+(location.port ? ":"+location.port: "")+"/set_compression/"+path ); // false for synchronous request
    xmlHttp.send( );
}

HDF5Interface.prototype.makeDataset = function(path, data, metaData, cb){
    var ws = new WebSocket('wss://'+location.hostname+(location.port ? ":"+location.port: "")+'/make_dataset/');
    ws.addEventListener('open', function open() {
    
        ws.send(path);
        ws.send(JSON.stringify(metaData));
        console.log("ws send "+data.constructor.name);
        ws.send(data, {compress: false});
    });
    
    ws.addEventListener('error', function error(err) {
        console.log(err);
    });
    ws.addEventListener('ping', heartbeat);
    ws.addEventListener('close', function close(evt) {
        console.log("close code "+evt.code);
        if(evt.code===1001)cb();
        clearTimeout(this.pingTimeout);
    });
}

HDF5Interface.prototype.readDataset = function(path, read){

        var ws = new WebSocket('wss://'+location.hostname+(location.port ? ":"+location.port: "")+'/read_dataset/');
        ws.binaryType = 'arraybuffer';
        ws.addEventListener('open', function open() {
        ws.send(path);
    });
    
    var metaData;
    ws.addEventListener('message', function message(evt) {
        console.log(Object.prototype.toString.call(evt.data));
        if(Object.prototype.toString.call(evt.data)==="[object String]"){
            metaData=JSON.parse(evt.data);
        console.log(metaData);
        }
        else{
            switch(metaData.reconstructor){
                case "Float64Array":
                    var array = new Float64Array(evt.data);
                    read(array, metaData);
                    break;
                case "Float32Array":
                    var array = new Float32Array(evt.data);
                    read(array, metaData);
                    break;
                case "Int32Array":
                    var array = new Int32Array(evt.data);
                    read(array, metaData);
                    break;
                case "Uint32Array":
                    var array = new Uint32Array(evt.data);
                    read(array, metaData);
                    break;
                case "Int16Array":
                    var array = new Int16Array(evt.data);
                    read(array, metaData);
                    break;
                case "Uint16Array":
                    var array = new Uint16Array(evt.data);
                    read(array, metaData);
                    break;
                case "Int8Array":
                    var array = new Int8Array(evt.data);
                    read(array, metaData);
                    break;
                case "Uint8Array":
                    var array = new Uint8Array(evt.data);
                    read(array, metaData);
                    break;
                case "Uint8ClampedArray":
                    var array = new Uint8ClampedArray(evt.data);
                    read(array, metaData);
                    break;
            }
            ws.close();
        }
    });
        

}

HDF5Interface.prototype.makeText = function(path, data, cb){
    var ws = new WebSocket('wss://'+location.hostname+(location.port ? ":"+location.port: "")+'/make_text');
    
    ws.addEventListener('open', function open() {
    
        //data.buffer.reconstructor=data.constructor.name;
        //data.buffer.rank=1;
        //data.buffer.rows=data.length;
        ws.send(path);
      ws.send(JSON.stringify({reconstructor: data.constructor.name, rank: 1, rows: data.length}));
      var buf = new ArrayBuffer(data.length); // 2 bytes for each char
      var bufView = new Uint8Array(buf);
      for (var i=0, strLen=data.length; i < strLen; i++) {
        bufView[i] = data.charCodeAt(i);
      }      
      ws.send(buf, {compress: false});
      //ws.end();
      ws.close();
    });
    
    ws.addEventListener('close', function close() {
        cb();
    });

}

HDF5Interface.prototype.readText = function(path, read){
        var ws = new WebSocket('wss://'+location.hostname+(location.port ? ":"+location.port: "")+'/read_text');
        ws.binaryType = 'arraybuffer';
        ws.addEventListener('open', function open() {
    
    });
    
    var metaData;
    ws.addEventListener('message', function message(evt) {
        console.log(Object.prototype.toString.call(evt.data));
        if(Object.prototype.toString.call(evt.data)==="[object String]"){
            metaData=JSON.parse(evt.data);
        console.log(metaData);
        }
        else{
                    var array = String.fromCharCode.apply(null, new Uint8Array(evt.data));
                    read(array, metaData);
            ws.close();
        }
    });

}

HDF5Interface.prototype.makeTable = function(path, columnLabels, data, cb){
    var ws = new WebSocket('wss://'+location.hostname+(location.port ? ":"+location.port: "")+'/make-table');
    
    ws.addEventListener('open', function open() {
    
        //data.buffer.reconstructor=data.constructor.name;
        //data.buffer.rank=1;
        //data.buffer.rows=data.length;
        var reconstructors=[];
        var rows=data[0].length;
      for (var k=0; k < data.length; k++) {
          reconstructors[k]=data[k].constructor.name;
          if(rows>data[k].length)rows=data[k].length;
      }
      ws.send(path);
      ws.send(JSON.stringify({rows: rows, columns: data.length, column_labels: columnLabels, reconstructors: reconstructors}));
      for (var k=0; k < data.length; k++) {
          //console.log(reconstructors[k]+" "+columnLabels[k]);
          ws.send(data[k].buffer, {compress: false});
      }

      //ws.end();
      ws.close();
    });
    
    ws.addEventListener('close', function close() {
        cb();
    });

}

HDF5Interface.prototype.readTable = function(path, read){
        var ws = new WebSocket('wss://'+location.hostname+(location.port ? ":"+location.port: "")+'/read-text');
        ws.binaryType = 'arraybuffer';
        ws.addEventListener('open', function open() {
    
    });
    
    var metaData;
    ws.addEventListener('message', function message(evt) {
        console.log(Object.prototype.toString.call(evt.data));
        if(Object.prototype.toString.call(evt.data)==="[object String]"){
            metaData=JSON.parse(evt.data);
        console.log(metaData);
        }
        else{
                    var array = String.fromCharCode.apply(null, new Uint8Array(evt.data));
                    read(array, metaData);
            ws.close();
        }
    });

}

HDF5Interface.prototype.getImageInfo = function(path){
    var metaData=undefined;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", function(evt){
        metaData=JSON.parse(xmlHttp.responseText);
    });
    path=encodeURIComponent(path);
    xmlHttp.open( "POST", "https://"+location.hostname+(location.port ? ":"+location.port: "")+"/get_image_info/"+path, false ); // false for synchronous request
    xmlHttp.send( );
    return metaData;
}


HDF5Interface.prototype.makeImage = function(path, data, metaData, cb){

    var ws = new WebSocket('wss://'+location.hostname+(location.port ? ":"+location.port: "")+'/make_image/');
    
    ws.addEventListener('open', function open() {
      ws.send(path);
      ws.send(JSON.stringify(metaData));
      ws.send(data, {compress: false});
      //ws.end();
      ws.close();
    });
    
    ws.addEventListener('error', function error(err) {
        console.log(err);
    });
    ws.addEventListener('close', function close() {
        cb();
    });
        
}

HDF5Interface.prototype.requestImage = function(path, read){
    var ws = new WebSocket('wss://'+location.hostname+(location.port ? ":"+location.port: "")+'/read_image/');
    ws.binaryType = 'arraybuffer';
    ws.addEventListener('open', function open() {
      ws.send(path);
    });
    
    var metaData;
    ws.addEventListener('message', function message(evt) {
//        console.log(Object.prototype.toString.call(evt.data));
        if(Object.prototype.toString.call(evt.data)==="[object String]"){
            metaData=JSON.parse(evt.data);
        }
        else{
            read(evt.data, metaData);
            ws.close();
        }
    });
        
}

HDF5Interface.prototype.readImage = function(read){
    var ws = new WebSocket('wss://'+location.hostname+(location.port ? ":"+location.port: "")+'/read_image/');
    ws.binaryType = 'arraybuffer';
    ws.addEventListener('open', function open() {
    
    });
    
    var metaData;
    ws.addEventListener('message', function message(evt) {
        console.log(Object.prototype.toString.call(evt.data));
        if(Object.prototype.toString.call(evt.data)==="[object String]"){
            metaData=JSON.parse(evt.data);
        }
        else{
            read(evt.data, metaData);
            ws.close();
        }
    });
        
}


HDF5Interface.prototype.requestImageRegion = function(path, metaDataInput, read){
    var ws = new WebSocket('wss://'+location.hostname+(location.port ? ":"+location.port: "")+'/read_image_region');
    ws.binaryType = 'arraybuffer';
    ws.addEventListener('open', function open() {
    ws.send(path);
    ws.send(JSON.stringify(metaDataInput));
    
    });
    ws.addEventListener('close', function close() {
    });
    
    var metaData;
    ws.addEventListener('message', function message(evt) {
//        console.log(Object.prototype.toString.call(evt.data));
        if(Object.prototype.toString.call(evt.data)==="[object String]"){
            metaData=JSON.parse(evt.data);
        }
        else{
            read(evt.data, metaData);
            ws.close();
            //resolve("great!");
        }
    });
}

HDF5Interface.prototype.requestImageMosaic = function(path, metaDataInput, read){
        var ws = new WebSocket('wss://'+location.hostname+(location.port ? ":"+location.port: "")+'/read-image-mosaic');
        ws.binaryType = 'arraybuffer';
        ws.addEventListener('open', function open() {
    //console.log(JSON.stringify(metaDataInput));
    ws.send(path);
    ws.send(JSON.stringify(metaDataInput));
    
    });
    ws.addEventListener('close', function close() {
        //resolve("great!");
    });
    
    var metaData;
    ws.addEventListener('message', function message(evt) {
        if(Object.prototype.toString.call(evt.data)==="[object String]"){
            metaData=JSON.parse(evt.data);
        }
        else{
        //console.log(Object.prototype.toString.call(evt.data));
            read(evt.data, metaData);
            //ws.close();
            //resolve("great!");
        }
    });
}

