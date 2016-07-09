
var nightwatch = require('nightwatch');
var os = require("os");
var http = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')

var hdf5 = require('hdf5').hdf5;
var Access = require('hdf5/lib/globals').Access;

var h5 = require('../api/h5.js');
var H5Datasets = require('../api/h5datasets.js');
var H5Images = require('../api/h5images.js');

describe('HDF5 datasets from browser', function() {
  var client = nightwatch.initClient({
    silent : true
  });

  var browser = client.api();

  this.timeout(99999999);
  var theServer;
  global.currentH5Path="newone.h5";

  before(function() {

    browser.perform(function() {
      console.log('beforeAll')
    });

  if(global.currentH5Path.length>0 && !fs.existsSync(global.currentH5Path)){
      var file = new hdf5.File(global.currentH5Path, Access.ACC_TRUNC);
            //const group=file.createGroup('pmcservices/x-ray/refinement');
            //group.close();
      file.close();
  }
  let h5datasets=new H5Datasets();
  let h5images=new H5Images();

  theServer=http.createServer(function (request, response) {
     try {
       var requestUrl = url.parse(request.url);
  
       var resourcePath=path.normalize(requestUrl.pathname);
       if(resourcePath.startsWith("/make_dataset/")){
         h5datasets.makeDataset(resourcePath);
         response.writeHead(200);
         //response.write("hoe");
             response.end("");
       }
       else if(resourcePath.startsWith("/read_dataset/")){
         h5datasets.readDataset(resourcePath);
         response.writeHead(200);
         //response.write("hoe");
             response.end("");
       }
       else if(resourcePath.startsWith("/make_image/")){
         h5images.makeImage(resourcePath);
         response.writeHead(200);
         //response.write("hoe");
             response.end("");
       }
       else if(resourcePath.startsWith("/read_image/")){
         h5images.readImage(resourcePath);
         response.writeHead(200);
         //response.write("hoe");
             response.end("");
       }
       else if(resourcePath.startsWith("/create_group/")){
         h5.createGroup(resourcePath);
         response.writeHead(200);
         //response.write("hoe");
             response.end("");
       }
       else{
         var filePath = __dirname+"/examples"+resourcePath;
         console.dir("filePath "+filePath);
         if(filePath.endsWith(".js")){
           filePath = __dirname+"/../lib/"+resourcePath;
         }
         response.writeHead(200)
         var fileStream = fs.createReadStream(filePath)
         fileStream.pipe(response)
         fileStream.on('error',function(e) {
             response.writeHead(404)     // assume the file doesn't exist
             response.end()
         })
       }
     } catch(e) {
       response.writeHead(500)
       response.end()     // end the response so browsers don't hang
       console.log(e.stack)
     }
  });
  theServer.listen(8888);

  });

  beforeEach(function(done) {
    browser.perform(function() {
      console.log('beforeEach')
    });

    client.start(done);
  });

  it('Start, stop and restart a websocket server', function() {
            console.dir("start wss");
          var WebSocketServer = require('ws').Server
            , wss = new WebSocketServer({ host: os.hostname(), port: 9900, path: '/make-dataset' });
          wss.close(function(){
            console.dir("start again");
            wss = new WebSocketServer({ host: os.hostname(), port: 9900, path: '/make-dataset' });
            wss.close();
          });
    
  });
  
  it('test datasets', function (done) {
    browser
      .url('http://'+os.hostname()+':8888/typedarrays.html')
      .waitForElementVisible('body', 20000)
      .assert.title('HDF5 Interface')
      .waitForElementVisible('button[name=hdf5makedataset]', 1000)
      .click('button[name=hdf5makedataset]')
      .pause(2000)
      .assert.containsText('#results', '[1.0, 2.0, 3.0, 5.0]')
      .end();

    client.start(done);
  });

  it('test images', function (done) {
    browser
      .url('http://'+os.hostname()+':8888/images.html')
      .waitForElementVisible('#draggable', 20000)
      .assert.title('HDF5 Interface')
      .useCss()
      .moveToElement('#draggable',  1,  1)
      .mouseButtonDown(0)
      .moveToElement('#droppable',  160,  1)
      .mouseButtonUp(0)
      .pause(30000)
      .assert.containsText('#results', '{"name":"nightwatch.jpg","width":550,"height":381,"planes":4,"npals":4,"size":838200}')
      .end();

    client.start(done);
  });

  afterEach(function() {
    browser.perform(function() {
      console.log('afterEach')
    });
  });

  after(function(done) {
    browser.end(function() {
      console.log('afterAll')
    });

    client.start(done);
    theServer.close();
  });

});

