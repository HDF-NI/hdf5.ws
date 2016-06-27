Web socket API for moving data to and from hdf5 files.

load script

```html
  <script type="text/javascript" src="HDF5Interface.js"></script>
```

```javascript
    var data=new Float64Array([1.0, 2.0, 3.0, 5.0]);
    var hdf5Interface=new HDF5Interface();
    hdf5Interface.makeDataset(data, "/pmcservices%2Fx-ray%2Frefinement%2FMatrix");
```