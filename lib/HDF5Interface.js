

function HDF5Interface(){
    
}

HDF5Interface.prototype.createGroup = function(path){

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", function(evt){
        console.log("XMLHttpRequest load");

    });
    path=encodeURIComponent(path);
    xmlHttp.open( "POST", "http://"+location.hostname+":8888/create_group/"+path ); // false for synchronous request
    xmlHttp.send( );
}

HDF5Interface.prototype.makeDataset = function(path, data, cb){

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", function(evt){
        console.log("XMLHttpRequest load");
    var ws = new WebSocket('ws://'+location.hostname+':9900/make-dataset');
    
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
    xmlHttp.open( "POST", "http://"+location.hostname+":8888/make_dataset/"+path ); // false for synchronous request
    xmlHttp.send( );

}

HDF5Interface.prototype.readDataset = function(path, read){

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", function(evt){
        console.log("XMLHttpRequest load");
    var ws = new WebSocket('ws://'+location.hostname+':9900/read-dataset');
    ws.binaryType = 'arraybuffer';
    ws.addEventListener('open', function open() {
    
        /*data.buffer.reconstructor=data.constructor.name;
        data.buffer.rank=1;
        data.buffer.rows=data.length;
      ws.send(JSON.stringify({reconstructor: data.constructor.name, rank: 1, rows: data.length}));
      ws.send(data.buffer);*/
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
        }
    });
        
    });
    path=encodeURIComponent(path);
    xmlHttp.open( "POST", "http://"+location.hostname+":8888/read_dataset/"+path ); // false for synchronous request
    xmlHttp.send( );

}