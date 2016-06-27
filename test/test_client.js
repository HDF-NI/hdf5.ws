
var nightwatch = require('nightwatch');
var os = require("os");
var http = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')

var hdf5 = require('hdf5').hdf5;
var Access = require('hdf5/lib/globals').Access;

var h5datasets = require('../api/h5datasets.js');

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
            const group=file.createGroup('pmcservices/x-ray/refinement');
            group.close();
      file.close();
  }

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


  it('test datasets', function (done) {
    browser
      .url('http://'+os.hostname()+':8888/typedarrays.html')
      .waitForElementVisible('body', 5000)
      .assert.title('HDF5 Interface')
      .waitForElementVisible('button[name=hdf5makedataset]', 1000)
      .click('button[name=hdf5makedataset]')
      .pause(2000)
      .assert.containsText('#results', '[1.0, 2.0, 3.0, 5.0]')
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

