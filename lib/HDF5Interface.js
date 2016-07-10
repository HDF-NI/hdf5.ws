

function HDF5Interface(port){
    this.port=port;
}

HDF5Interface.prototype.createGroup = function(path){

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", function(evt){
        console.log("XMLHttpRequest load");

    });
    path=encodeURIComponent(path);
    xmlHttp.open( "POST", "http://"+location.hostname+(location.port ? ":"+location.port: "")+"/create_group/"+path ); // false for synchronous request
    xmlHttp.send( );
}

HDF5Interface.prototype.makeDataset = function(path, data, cb){
    var _this=this;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", function(evt){
        console.log("XMLHttpRequest load");
    var ws = new WebSocket('ws://'+location.hostname+':'+_this.port+'/make-dataset');
    
    ws.addEventListener('open', function open() {
    
        data.buffer.reconstructor=data.constructor.name;
        data.buffer.rank=1;
        data.buffer.rows=data.length;
      ws.send(JSON.stringify({reconstructor: data.constructor.name, rank: 1, rows: data.length}));
      ws.send(data.buffer);
      //ws.end();
      ws.close();
    });
    
    ws.addEventListener('close', function close() {
        cb();
    });
        
    });
    path=encodeURIComponent(path);
    xmlHttp.open( "POST", "http://"+location.hostname+(location.port ? ":"+location.port: "")+"/make_dataset/"+path ); // false for synchronous request
    xmlHttp.send( );

}

HDF5Interface.prototype.readDataset = function(path, read){
    var _this=this;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", function(evt){
        console.log("XMLHttpRequest load");
        var ws = new WebSocket('ws://'+location.hostname+':'+_this.port+'/read-dataset');
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
        
    });
    path=encodeURIComponent(path);
    xmlHttp.open( "POST", "http://"+location.hostname+(location.port ? ":"+location.port: "")+"/read_dataset/"+path ); // false for synchronous request
    xmlHttp.send( );

}

HDF5Interface.prototype.makeText = function(path, data, cb){
    var _this=this;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", function(evt){
        console.log("XMLHttpRequest load");
    var ws = new WebSocket('ws://'+location.hostname+':'+_this.port+'/make-text');
    
    ws.addEventListener('open', function open() {
    
        //data.buffer.reconstructor=data.constructor.name;
        //data.buffer.rank=1;
        //data.buffer.rows=data.length;
      ws.send(JSON.stringify({reconstructor: data.constructor.name, rank: 1, rows: data.length}));
      var buf = new ArrayBuffer(data.length); // 2 bytes for each char
      var bufView = new Uint8Array(buf);
      for (var i=0, strLen=data.length; i < strLen; i++) {
        bufView[i] = data.charCodeAt(i);
      }      
      ws.send(buf);
      //ws.end();
      ws.close();
    });
    
    ws.addEventListener('close', function close() {
        cb();
    });
        
    });
    path=encodeURIComponent(path);
    xmlHttp.open( "POST", "http://"+location.hostname+(location.port ? ":"+location.port: "")+"/make_text/"+path ); // false for synchronous request
    xmlHttp.send( );

}

HDF5Interface.prototype.readText = function(path, read){
    var _this=this;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", function(evt){
        console.log("XMLHttpRequest load");
        var ws = new WebSocket('ws://'+location.hostname+':'+_this.port+'/read-text');
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
        
    });
    path=encodeURIComponent(path);
    xmlHttp.open( "POST", "http://"+location.hostname+(location.port ? ":"+location.port: "")+"/read_text/"+path ); // false for synchronous request
    xmlHttp.send( );

}

HDF5Interface.prototype.makeTable = function(path, columnLabels, data, cb){
    var _this=this;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", function(evt){
        console.log("XMLHttpRequest load");
    var ws = new WebSocket('ws://'+location.hostname+':'+_this.port+'/make-table');
    
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
        
      ws.send(JSON.stringify({rows: rows, columns: data.length, column_labels: columnLabels, reconstructors: reconstructors}));
      for (var k=0; k < data.length; k++) {
          //console.log(reconstructors[k]+" "+columnLabels[k]);
          ws.send(data[k].buffer);
      }

      //ws.end();
      ws.close();
    });
    
    ws.addEventListener('close', function close() {
        cb();
    });
        
    });
    path=encodeURIComponent(path);
    xmlHttp.open( "POST", "http://"+location.hostname+(location.port ? ":"+location.port: "")+"/make_table/"+path ); // false for synchronous request
    xmlHttp.send( );

}

HDF5Interface.prototype.readTable = function(path, read){
    var _this=this;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", function(evt){
        console.log("XMLHttpRequest load");
        var ws = new WebSocket('ws://'+location.hostname+':'+_this.port+'/read-text');
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
        
    });
    path=encodeURIComponent(path);
    xmlHttp.open( "POST", "http://"+location.hostname+(location.port ? ":"+location.port: "")+"/read_table/"+path ); // false for synchronous request
    xmlHttp.send( );

}

HDF5Interface.prototype.makeImage = function(path, data, metaData, cb){
    var _this=this;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", function(evt){
        console.log("XMLHttpRequest load");
    var ws = new WebSocket('ws://'+location.hostname+':'+_this.port+'/make-image');
    
    ws.addEventListener('open', function open() {
    
      ws.send(JSON.stringify(metaData));
      ws.send(data);
      //ws.end();
      ws.close();
    });
    
    ws.addEventListener('close', function close() {
        cb();
    });
        
    });
    path=encodeURIComponent(path);
    xmlHttp.open( "POST", "http://"+location.hostname+(location.port ? ":"+location.port: "")+"/make_image/"+path ); // false for synchronous request
    xmlHttp.send( );

}

HDF5Interface.prototype.readImage = function(path, read){
    var _this=this;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", function(evt){
        console.log("XMLHttpRequest load");
        var ws = new WebSocket('ws://'+location.hostname+':'+_this.port+'/read-image');
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
        console.log(Object.prototype.toString.call(evt.data));
            read(evt.data, metaData);
            ws.close();
        }
    });
        
    });
    path=encodeURIComponent(path);
    xmlHttp.open( "POST", "http://"+location.hostname+(location.port ? ":"+location.port: "")+"/read_image/"+path ); // false for synchronous request
    xmlHttp.send( );

}

HDF5Interface.prototype.readImage = function(read){
    var _this=this;

    var ws = new WebSocket('ws://'+location.hostname+':'+_this.port+'/read-image');
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
        console.log(Object.prototype.toString.call(evt.data));
            read(evt.data, metaData);
            ws.close();
        }
    });
        
}

