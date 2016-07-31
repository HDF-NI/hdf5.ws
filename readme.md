[![Node.js Version][node-version-image]][node-version-url]

Web socket API for moving data to and from hdf5 files.

load script

```html
  <script type="text/javascript" src="HDF5Interface.js"></script>
```
In the case of writing and immediately reading use the callback of makeDataset:
```javascript
    var data=new Float64Array([1.0, 2.0, 3.0, 5.0]);
    var hdf5Interface=new HDF5Interface(9900);
    hdf5Interface.createGroup("pmcservices/x-ray/refinement");
    hdf5Interface.makeDataset("pmcservices/x-ray/refinement/Matrix", data, function(){
    hdf5Interface.readDataset("pmcservices/x-ray/refinement/Matrix", function(data, metaData){
        console.log(data);
        var dataStr="[";
        for(var i=0;i<data.length;i++){
            dataStr+=data[i].toFixed(1);
            if(i<data.length-1)dataStr+=", ";
        }
        dataStr+="]";
        document.getElementById("results").appendChild(document.createTextNode(dataStr));
    });
    });
```
metaData will have rank, rows and if rank is 2, columns.

It is now possible to write a whole image to the h5, read a whole image or read just a region of an image. 
Will have to explore the cross over point for applying compression on the websocket transfer.



[node-version-image]: https://img.shields.io/node/v/hdf5.svg
[node-version-url]: https://nodejs.org/en/download/
