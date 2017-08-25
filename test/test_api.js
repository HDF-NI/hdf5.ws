var os = require("os");
var hdf5 = require('hdf5').hdf5;
var h5im = require('hdf5').h5im;
var assert = require("assert");
//var should = require("should");
var fs = require('fs');
var http = require('http');
var util = require('util');
var WebSocket = require('ws');

const Access  = require('hdf5/lib/globals.js').Access;
var H5 = require('../api/h5.js');
var H5Datasets = require('../api/h5datasets.js');
var H5Images = require('../api/h5images.js');
var H5Tables = require('../api/h5tables.js');

describe("testing api interface ",function(){
  global.currentH5Path="/home/roger/NodeProjects/hdf5.ws/newone2.h5";
  if(global.currentH5Path.length>0 && !fs.existsSync(global.currentH5Path)){
      var file = new hdf5.File(global.currentH5Path, Access.ACC_TRUNC);
            //const group=file.createGroup('pmcservices/x-ray/refinement');
            //group.close();
      file.close();
  }
  let h5=new H5();
  let h5datasets=new H5Datasets(h5, 9700);
  let h5images=new H5Images(h5, 9700);
  let h5tables=new H5Tables(h5, 9700);

  var theServer=http.createServer(function (request, response) {
             response.end("");
  });
    theServer.listen(3000);


        // open hdf file
        //var app;
        before(function*(){
          //app = require;
        });

        it("create an h5 file", function(done){
            try
            {
              h5.createH5(global.currentH5Path);
              console.dir('end');
              done();
            }
            catch (err) {
            console.dir(err.message);
            }
        });
        it("create a group", function(done){
            try
            {
              h5.createGroup('/create_group/pmc/x-ray/refinement');
              console.dir('end');
              done();
            }
            catch (err) {
            console.dir(err.message);
            }
        });
        it("rename a group", function(done){
            try
            {
              h5.renameGroup('/rename_group/pmcservices[pmc]');
              console.dir('end');
              done();
            }
            catch (err) {
            console.dir(err.message);
            }
        });
        it("make a dataset", function*(){
          var holder=new Object();
            try
            {
              var options = {
                port: 3000,
                hostname: os.hostname(),
                method: 'POST',
                path: '/make_dataset/pmcservices%2Fx-ray%2Frefinement%2FMatrix'
              };
                var keepAliveAgent = new http.Agent({ keepAlive: true });
                options.agent = keepAliveAgent;
                var p = yield new Promise((resolve, reject) => {
                  var _p=this;
                  var req = http.request(options, (res) => {
                      //res.setEncoding('utf8');
                      res.on('data', (chunk) => {
                        //console.log(`BODY: ${chunk}`);
                      });
                      res.on('end', () => {
                          h5datasets.makeDataset('/make_dataset/pmcservices/x-ray/refinement/Matrix');
                        console.log('d: No more data in response.');
                        var pi =  new Promise((resolve2, reject2) => {
                            var WebSocket = require('ws');
                            holder.ws = new WebSocket('ws://'+os.hostname()+':9700/make-dataset', {protocolVersion: 13});
                            holder.ws.binaryType = "nodebuffer";
                            holder.ws.on('open', function open() {
                            var buffer=new Float64Array(16);
                            for (var j = 0; j < 4; j++) {
                                for (var i = 0; i < 4; i++){
                                        if (j===i)
                                            buffer[i*4+j]=1.0;
                                        else if (j< (4/2))
                                            buffer[i*4+j]=0.0;
                                        else
                                           buffer[i*4+j]=2.0+j;
                                }
                            }
                            //buffer.length=16;
                            buffer.reconstructor=buffer.constructor.name;
                            //buffer.rank=2;
                            //buffer.rows=4;
                            //buffer.columns=4;
                            //buffer.length=16;
                            holder.ws.send(JSON.stringify({reconstructor: buffer.constructor.name, rank: 2, rows: 4,columns: 4}));
                            holder.ws.send(buffer, { compress: false });
                            //holder.ws.close();
                          });
                          holder.ws.on('error', function error(err) {
                            console.log('error '+err);
                                                  resolve("");
                          });
                          holder.ws.on('close', function close() {
                            console.log('disconnected');
                                                  resolve("");
                          });
                        });
                      })
                  });
                  req.on('error', (e) => {
                    console.log(`problem with request: ${e.message}`);
                    reject("");
                  });
                  req.write("");
                  req.end();
                }).then(function(result) { 
                	/* do something with the result */
                           // holder.ws.close();
                }).catch(function(err) {
                	/* error :( */
                });
              console.dir('end');
            }
            catch (err) {
            console.dir(err.message);
            }
        });
        it("make an image", function*(){
          var holder=new Object();
            try
            {
              var options = {
                port: 3000,
                hostname: os.hostname(),
                method: 'POST',
                path: '/make_image/pmcservices%2Fx-ray%2Fhdf_logo'
              };
                var keepAliveAgent = new http.Agent({ keepAlive: true });
                options.agent = keepAliveAgent;
                var p = yield new Promise((resolve, reject) => {
                  var _p=this;
                  var req = http.request(options, (res) => {
                      //res.setEncoding('utf8');
                      res.on('data', (chunk) => {
                        //console.log(`BODY: ${chunk}`);
                      });
                      res.on('end', () => {
                          h5images.make('/make_image/pmcservices/x-ray/hdf_logo');
                        console.log('i: No more data in response.');
                        var pi =  new Promise((resolve2, reject2) => {
                            var WebSocket = require('ws');
                            holder.ws = new WebSocket('ws://'+os.hostname()+':9700/make-image', {protocolVersion: 13});
                            holder.ws.binaryType = "nodebuffer";
                            holder.ws.on('open', function open() {
                            var file2 = new hdf5.File('./test/examples/hdf5.h5', Access.ACC_RDONLY);
                            var image = h5im.readImage(file2.id, 'hdf_logo.jpg');
                            console.dir("constructor: "+image.constructor.name);
                            for(var key in image){
                              if (image.hasOwnProperty(key)) {
                                //console.dir(key);
                              }
                             }
                             var metaData={width: image.width, height: image.height, planes: 3, npals: 4, size: 3*image.width*image.height};
                            holder.ws.send(JSON.stringify(metaData));
                            holder.ws.send(image, { compress: false });
                            holder.ws.close();
                            file2.close();
                          });
                          holder.ws.on('close', function close() {
                            console.log('disconnected');
                                                  resolve("");
                          });
                        });
                      })
                  });
                  req.on('error', (e) => {
                    console.log(`problem with request: ${e.message}`);
                    reject("");
                  });
                  req.write("");
                  req.end();
                }).then(function(result) { 
                	/* do something with the result */
                  //holder.ws.close();
                }).catch(function(err) {
                	/* error :( */
                });
              console.dir('end');
            }
            catch (err) {
            console.dir(err.message);
            }
        });
        it("make a table", function*(){
          var holder=new Object();
            try
            {
              var options = {
                port: 3000,
                hostname: os.hostname(),
                method: 'POST',
                path: '/make_table/pmcservices%2Fx-ray%2Frefinement%2FChocolate'
              };
                var keepAliveAgent = new http.Agent({ keepAlive: true });
                options.agent = keepAliveAgent;
                var p = yield new Promise((resolve, reject) => {
                  var _p=this;
                  var req = http.request(options, (res) => {
                      //res.setEncoding('utf8');
                      res.on('data', (chunk) => {
                        console.log(`BODY: ${chunk}`);
                      });
                      res.on('end', () => {
                          h5tables.makeTable('/make_table/pmcservices/x-ray/refinement/Chocolate');
                        console.log('t: No more data in response.');
                        var pi =  new Promise((resolve2, reject2) => {
                          var WebSocket = require('ws');
                          holder.ws = new WebSocket('ws://'+os.hostname()+':9700/make-table', {protocolVersion: 13});
                          holder.ws.binaryType = "nodebuffer";
                          holder.ws.on('open', function open() {
                            var tableModel=new ArrayBuffer(3);
                            var metaData=new ArrayBuffer(3);
                            var nameArray=new Uint8Array(4);
                            var columnLabels=[];
                            columnLabels[0]="Names";
                            metaData[0]={name: "Names", reconstructor: nameArray.constructor.name, length: nameArray.length};
                            nameArray[0]="theobromine";
                            nameArray[1]="caffeine";
                            nameArray[2]="phenylethylamine";
                            nameArray[3]="anandamide";
                            tableModel[0]=nameArray;
                            var numberOfRingsArray=new Uint32Array(4);
                            columnLabels[1]="# of Rings";
                            metaData[1]={name: "# of Rings", reconstructor: numberOfRingsArray.constructor.name, length: numberOfRingsArray.length};
                            numberOfRingsArray[0]=3;
                            numberOfRingsArray[1]=3;
                            numberOfRingsArray[2]=1;
                            numberOfRingsArray[3]=0;
                            tableModel[1]=numberOfRingsArray;
                            var fieldArray3=new Float64Array(4);
                            columnLabels[2]="Molecular Weight";
                            metaData[2]={name: "Molecular Weight", reconstructor: fieldArray3.constructor.name, length: fieldArray3.length};
                            fieldArray3[0]=180.1658;
                            fieldArray3[1]=194.1926;
                            fieldArray3[2]=121.1816;
                            fieldArray3[3]=347.5398;
                            tableModel[2]=fieldArray3;
                            var reconstructors=[];
                            var rows=tableModel[0].length;
                            for (var k=0; k < 3; k++) {
                                reconstructors[k]=tableModel[k].constructor.name;
                                if(rows>tableModel[k].length)rows=tableModel[k].length;
                            }
                            holder.ws.send(JSON.stringify({rows: rows, columns: 3, column_labels: columnLabels, reconstructors: reconstructors}));
                            for (var k=0; k < 3; k++) {
                                //console.log(reconstructors[k]+" "+columnLabels[k]);
                                holder.ws.send(tableModel[k].buffer, {compress: false});
                            }
                            holder.ws.close();
                          });
                          holder.ws.on('close', function close() {
                            console.log('disconnected');
                                                  resolve("");
                          });
                        });
                      })
                  });
                  req.on('error', (e) => {
                    console.log(os.hostname()+` problem with request: ${e.message}`);
                    reject("");
                  });
                  req.write("");
                  req.end();
                }).then(function(result) { 
                	/* do something with the result */
                	//holder.ws.close();
                }).catch(function(err) {
                	/* error :( */
                	console.dir(err);
                	//holder.ws.close();
                });
              console.dir('end');
            }
            catch (err) {
            console.dir(err.message);
            }
        });
        
  afterEach(function() {
  });

  after(function(done){
      //app.close();
        theServer.close();
        done();
  });

});

