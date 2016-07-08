var os = require("os");
var hdf5 = require('hdf5').hdf5;
var h5im = require('hdf5').h5im;
var assert = require("assert");
//var should = require("should");
var fs = require('fs');
var http = require('http');
var util = require('util');
var WebSocket = require('ws');
var bson = require("bson");
var BSON = new bson.BSONPure.BSON();

const Access  = require('hdf5/lib/globals.js').Access;

describe("testing api interface ",function(){

    describe("create an h5, group and some tables ",function(){
        // open hdf file
        //var app;
        before(function*(){
          //app = require;
        });

        it("create an h5 file", function*(done){
            try
            {
              var options = {
                port: 3000,
                hostname: os.hostname(),
                method: 'POST',
                path: '/create_h5/.%2Fnewone2.h5'
              };
                var keepAliveAgent = new http.Agent({ keepAlive: true });
                options.agent = keepAliveAgent;            
                  var req = http.request(options, (res) => {
                      //console.log(`STATUS: ${res.statusCode}`);
                      //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                      res.setEncoding('utf8');
                      res.on('data', (chunk) => {
                        //console.log(`BODY: ${chunk}`);
                      });
                      res.on('end', () => {
                        //console.log('No more data in response.');
                        done();
                      })
                });
                req.on('error', (e) => {
                  console.log(`problem with request: ${e.message}`);
                  done();
                });
                
                req.end();
              console.dir('end');
            }
            catch (err) {
            console.dir(err.message);
            }
        });
        it("create a group", function*(done){
            try
            {
              var options = {
                port: 3000,
                hostname: os.hostname(),
                method: 'POST',
                path: '/create_node/pmc%2Fx-ray%2Frefinement'
              };
                var keepAliveAgent = new http.Agent({ keepAlive: true });
                options.agent = keepAliveAgent;            
                  var req = http.request(options, (res) => {
                      //console.log(`STATUS: ${res.statusCode}`);
                      //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                      res.setEncoding('utf8');
                      res.on('data', (chunk) => {
                        //console.log(`BODY: ${chunk}`);
                      });
                      res.on('end', () => {
                        console.log('No more data in response.');
                        done();
                      })
                });
                req.on('error', (e) => {
                  console.log(`problem with request: ${e.message}`);
                  done();
                });
                
                req.end();
              console.dir('end');
            }
            catch (err) {
            console.dir(err.message);
            }
        });
        it("rename a group", function*(done){
            try
            {
              var options = {
                port: 3000,
                hostname: os.hostname(),
                method: 'POST',
                path: '/rename_node/pmcservices[pmc]'
              };
                var keepAliveAgent = new http.Agent({ keepAlive: true });
                options.agent = keepAliveAgent;            
                  var req = http.request(options, (res) => {
                      //console.log(`STATUS: ${res.statusCode}`);
                      //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                      res.setEncoding('utf8');
                      res.on('data', (chunk) => {
                        //console.log(`BODY: ${chunk}`);
                      });
                      res.on('end', () => {
                        console.log('No more data in response.');
                        done();
                      })
                });
                req.on('error', (e) => {
                  console.log(`problem with request: ${e.message}`);
                  done();
                });
                
                req.end();
              console.dir('end');
            }
            catch (err) {
            console.dir(err.message);
            }
        });
        it("make a table", function*(done){
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
                        //console.log(`BODY: ${chunk}`);
                      });
                      res.on('end', () => {
                        console.log('No more data in response.');
                        var pi =  new Promise((resolve2, reject2) => {
                          var WebSocket = require('ws');
                          var ws = new WebSocket('ws://'+os.hostname()+':9900/make-table', {protocolVersion: 13});
                          ws.binaryType = "arraybuffer";
                          ws.on('open', function open() {
                            var tableModel=new ArrayBuffer(3);
                            var metaData=new ArrayBuffer(3);
                            var nameArray=new Array(4);
                            metaData[0]={name: "Names", reconstructor: nameArray.constructor.name, length: nameArray.length};
                            nameArray[0]="theobromine";
                            nameArray[1]="caffeine";
                            nameArray[2]="phenylethylamine";
                            nameArray[3]="anandamide";
                            tableModel[0]=nameArray;
                            var numberOfRingsArray=new Uint32Array(4);
                            metaData[1]={name: "# of Rings", reconstructor: numberOfRingsArray.constructor.name, length: numberOfRingsArray.length};
                            numberOfRingsArray[0]=3;
                            numberOfRingsArray[1]=3;
                            numberOfRingsArray[2]=1;
                            numberOfRingsArray[3]=0;
                            tableModel[1]=numberOfRingsArray;
                            var fieldArray3=new Float64Array(4);
                            metaData[2]={name: "Molecular Weight", reconstructor: fieldArray3.constructor.name, length: fieldArray3.length};
                            fieldArray3[0]=180.1658;
                            fieldArray3[1]=194.1926;
                            fieldArray3[2]=121.1816;
                            fieldArray3[3]=347.5398;
                            tableModel[2]=fieldArray3;
                            var ab=new Array(2);
                            ab[0]=metaData;
                            ab[1]=tableModel;
                            ws.send(BSON.serialize(ab, true, false, true), { binary: true, mask: true });
                            ws.close();
                          });
                          ws.on('close', function close() {
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
                  
                  req.end();
                }).then(function(result) { 
                	/* do something with the result */
                    done();
                }).catch(function(err) {
                	/* error :( */
                    done();
                });
              console.dir('end');
            }
            catch (err) {
            console.dir(err.message);
            }
        });
        it("make a dataset", function*(done){
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
                        console.log('No more data in response.');
                        var pi =  new Promise((resolve2, reject2) => {
                            var WebSocket = require('ws');
                            var ws = new WebSocket('ws://'+os.hostname()+':9900/make-dataset', {protocolVersion: 13});
                            ws.binaryType = "arraybuffer";
                            ws.on('open', function open() {
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
                            console.dir(buffer);
                            buffer.reconstructor=buffer.constructor.name;
                            buffer.rank=2;
                            buffer.rows=4;
                            buffer.columns=4;
                            buffer.length=16;
                            ws.send(BSON.serialize(buffer, true, true, true), { binary: true, mask: false });
                            ws.close();
                          });
                          ws.on('close', function close() {
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
                  
                  req.end();
                }).then(function(result) { 
                	/* do something with the result */
                    done();
                }).catch(function(err) {
                	/* error :( */
                    done();
                });
              console.dir('end');
            }
            catch (err) {
            console.dir(err.message);
            }
        });
        it("make an image", function*(done){
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
                        console.log('No more data in response.');
                        var pi =  new Promise((resolve2, reject2) => {
                            var WebSocket = require('ws');
                            var ws = new WebSocket('ws://'+os.hostname()+':9900/make-image', {protocolVersion: 13});
                            ws.binaryType = "nodebuffer";
                            ws.on('open', function open() {
                            var file2 = new hdf5.File('./test/examples/hdf5.h5', Access.ACC_RDONLY);
                            var image = h5im.readImage(file2.id, 'hdf_logo.jpg');
                            console.dir(image.constructor.name);
for(var key in image){
    if (image.hasOwnProperty(key)) {
      console.dir(key);
    }
   }                            
                            ws.send(BSON.serialize(image, true, true, true), { binary: true, mask: true });
                            ws.close();
                            file2.close();
                          });
                          ws.on('close', function close() {
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
                  
                  req.end();
                }).then(function(result) { 
                	/* do something with the result */
                    done();
                }).catch(function(err) {
                	/* error :( */
                    done();
                });
              console.dir('end');
            }
            catch (err) {
            console.dir(err.message);
            }
        });
        after(function*(){
            //app.close();
        });
    });
    
});

