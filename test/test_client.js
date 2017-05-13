
var nightwatch = require('nightwatch');
var os = require("os");
var net = require('net')
var http = require('http')
var Transform = require('stream').Transform
var url = require('url')
var fs = require('fs')
var path = require('path')

var hdf5 = require('hdf5').hdf5;
var Access = require('hdf5/lib/globals').Access;

var H5 = require('../api/h5.js');
var H5Datasets = require('../api/h5datasets.js');
var H5Images = require('../api/h5images.js');

describe('HDF5 datasets from browser', function() {
  var client = nightwatch.initClient({
    silent : true
  });

  var browser = client.api();

  global.currentH5Path="newone.h5";
  if(global.currentH5Path.length>0 && !fs.existsSync(global.currentH5Path)){
      var file = new hdf5.File(global.currentH5Path, Access.ACC_TRUNC);
            //const group=file.createGroup('pmcservices/x-ray/refinement');
            //group.close();
      file.close();
  }
  let h5=new H5();
  let h5datasets=new H5Datasets(h5, 9900);
  let h5images=new H5Images(h5, 9900);

  var theServer=http.createServer(function (request, response) {
           console.dir("req res ");
     try {
       var requestUrl = url.parse(request.url);
           console.dir("requestUrl "+requestUrl);

       var resourcePath=path.normalize(requestUrl.pathname);
           console.dir("resourcePath "+resourcePath);
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
       else if(resourcePath.startsWith("/get_image_info/")){
         response.writeHead(200);
         response.write(h5images.getInfo(resourcePath));
             response.end("");
       }
       else if(resourcePath.startsWith("/make_image/")){
         h5images.make(resourcePath);
         response.writeHead(200);
         //response.write("hoe");
             response.end("");
       }
       else if(resourcePath.startsWith("/read_image/")){
         h5images.read(resourcePath, function(metaData){
           //response.write(JSON.stringify(metaData));
         });
         response.writeHead(200);
         //response.write("hoe");
             response.end("");
       }
       else if(resourcePath.startsWith("/read_image_region/")){
         h5images.readRegion(resourcePath, function(metaData){
           //response.write(JSON.stringify(metaData));
         });
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
       else if(resourcePath.endsWith("734344main_g306_wide_large.jpg")){
         var filePath = "/home/roger/Pictures/734344main_g306_wide_large.jpg";
         response.writeHead(200)
         var fileStream = fs.createReadStream(filePath)
         fileStream.pipe(response)
         fileStream.on('error',function(e) {
             response.writeHead(404)     // assume the file doesn't exist
             response.end()
         })
         
       }
       else{
           console.dir("resourcePath "+resourcePath);
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
       console.dir("e: "+e);
       response.writeHead(500)
       response.end()     // end the response so browsers don't hang
       console.log(e.stack)
     }
  });
  theServer.on('clientError', (err, socket) => {
    console.dir("client err: "+err);
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  });  
  theServer.on('close', function () { console.dir("the server closed for some reason")});
  theServer.listen(8888);

  before(function() {

    browser.perform(function() {
      console.log('beforeAll')
    });


  });
  this.timeout(99999999);

  beforeEach(function(done) {
    browser.perform(function() {
      console.log('beforeEach')
    });

    client.start(done);
  });


    it("should be 1.10.0", function(done) {
        var version=hdf5.getLibVersion();
        console.dir(version);
        client.start(done);
    });

  it('Start, stop and restart a websocket server', function(done) {
            console.dir("start wss");
          var WebSocketServer = require('ws').Server
            , wss = new WebSocketServer({ host: os.hostname(), port: 9900, path: '/make-dataset' });
          wss.close(function(){
            console.dir("start again");
            wss = new WebSocketServer({ host: os.hostname(), port: 9900, path: '/make-dataset' });
            wss.close(function(){
              let hit=false;
              while(!hit){
                let tester = net.createServer()
                .once('error', function (err) {
                  if (err.code != 'EADDRINUSE') hit=false
                  hit=true
                })
                .once('listening', function() {
                  tester.once('close', function() { hit=false })
                  .close()
                })
                .listen(9900)
              }
            
              done()});
          });
    
  });
  
  it('test datasets', function(done) {
                 console.dir("datasets "+os.hostname());

    browser
      .url('http://'+os.hostname()+':8888/typedarrays.html')
      .waitForElementVisible('body', 20000)
      .assert.title('HDF5 Interface')
      .waitForElementVisible('button[name=hdf5makedataset]', 1000)
      .click('button[name=hdf5makedataset]')
      .pause(3000)
      .assert.containsText('#results', '[1.0, 2.0, 3.0, 5.0]')
      .end();

    client.start(done);
  });

  it('test images', function (done) {
    browser
      .url('http://'+os.hostname()+':8888/images.html')
      .waitForElementVisible('#nwCanvas', 2000)
      .assert.title('HDF5 Interface')
      .useCss()
      .moveToElement('#nwCanvas',  1,  1)
      .mouseButtonDown(0)
      .moveToElement('#droppable',  160,  230)
      .pause(1000)
      .mouseButtonUp(0)
      .pause(30000)
      .assert.containsText('#results', '{"name":"nightwatch.jpg","width":550,"height":381,"planes":4,"npals":4,"size":838200}')
      .end();

    client.start(done);
  });

  it('test panning images', function (done) {
    var url = 'http://www.nasa.gov/images/content/734344main_g306_wide_large.jpg'
    /*http.request(url, function(response) {                                        
      var data = new Transform();                                                    
    
      response.on('data', function(chunk) {
        console.dir("chunk");
        data.push(chunk);                                                         
      });                                                                         
    
      response.on('end', function() {                                             
        fs.writeFileSync('734344main_g306_wide_large.jpg', data.read());                               
      });                                                                         
    }).end();*/
    
    browser
      .url('http://'+os.hostname()+':8888/panningimages.html')
      .waitForElementVisible('#viewportCanvas', 20000)
      .assert.title('HDF5 Interface')
      .useCss()
      .moveToElement('#viewportCanvas',  1,  1)
      //.mouseButtonDown(0)
      //.moveToElement('#editor',  160,  560)
      //.mouseButtonUp(0)
      .pause(60000)
      .assert.containsText('#results', '{"name":"734344main_g306_wide_large.jpg","width":400,"height":400,"planes":4,"npals":4,"size":640000}')
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

    //client.start(done);
                 console.dir("theServer close "+os.hostname());
    theServer.close();
  });

});

