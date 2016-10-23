# jQuery Orderable

**jQuery Orderable** is a small jQuery plugin that allows you to reorder rows or row groups inside a table with drag'n'drop. 

## Demo

Soon

## Installation

Add `.js` and `.css` files into your project:

- *Via CDN*

``` 
    <script src="https://cdn.rawgit.com/iuliuvisovan/jquery-orderable/master/jquery.orderable.min.js"></script>
    <link rel="stylesheet" href="https://cdn.rawgit.com/iuliuvisovan/jquery-orderable/master/jquery.orderable.min.css"></link>    
```





 - *Download & reference locally*
      - JS:
         - [jquery-orderable.min.js](https://cdn.rawgit.com/iuliuvisovan/jquery-orderable/master/jquery.orderable.min.js)
         - [jquery.orderable.js](https://cdn.rawgit.com/iuliuvisovan/jquery-orderable/master/jquery.orderable.js)

      - CSS:
         - [jquery-orderable.min.css](https://cdn.rawgit.com/iuliuvisovan/jquery-orderable/master/jquery.orderable.min.css)
         - [jquery.orderable.css](https://cdn.rawgit.com/iuliuvisovan/jquery-orderable/master/jquery.orderable.css)
         
      - Reference ```<script src="scripts/jquery.orderable.min.js"></script>```
      - Reference ```<link rel="stylesheet" href="css/jquery.orderable.min.css"></link> ```
      
## Usage

`$('#myTable').orderable();`

## Configuration
 - By supplying a params object:

    Example: `$('#myTable').orderable({ flagName: 'flagName' });`

    Available parameters:

  - `tbodyAsUnit`: Set to true if you want to move whole row-groups (`<tbody>` elements)

      - `false` *(default)* - The order units are the `<tr>` elements inside the target table
      - `true` - The order units are the `<tbody>` elements inside the target table
      
 - By adding state classes to rows:

     Available classes:

  - `.orderable-exclude`: Add this class to a row or row group to exclude it from reordering  
    

## Behaviour

Events are dispatched at key moments of the reordering process. Useful for adding custom behaviour to the process.

Example:

```
  document.addEventListener('jquery.orderable.load', function () {
      console.log("jQuery Orderable loaded successfully!");
  }, false);
```

Available events:

 - `jquery.orderable.load`: Dispatched when the plugin has sucessfully loaded (make sure to add event listener before applying the plugin)
 - `jquery.orderable.init`: Dispatched when targeted table was found & was sucessfully prepared for reordering
 - `jquery.orderable.order.start`: Dispatched when the left mouse button was clicked on a reorderable row
 - `jquery.orderable.order.cancel`: Dispatched when the picked row was dropped in an invalid location
 - `jquery.orderable.order.finish`: Dispatched when the target row got successfully moved (even if onto its initial position) 


## Contact

Iuliu Vișovan / www.iuliu.net / iuliuvisovan@gmail.com
