# jQuery Orderable

**jQuery Orderable** is a jQuery plugin that allows reording of elements inside an HTML `<table>` via drag'n'drop.

## Demo

http://www.iuliu.net/jquery.orderable/

<img src="https://github.com/iuliuvisovan/jquery-orderable/blob/master/demo.gif" width="50%">

## Installation

Add `.js` and `.css` files into your project:

- *Via CDN*

``` 
    <script src="https://cdn.rawgit.com/iuliuvisovan/jquery-orderable/master/1.1/js/jquery.orderable.min.js"></script>
    <link rel="stylesheet" href="https://cdn.rawgit.com/iuliuvisovan/jquery-orderable/master/1.1/css/jquery.orderable.min.css"></link>    
```





 - *Download & reference locally (Right click -> Save As..)*
      - JS: [jquery-orderable.min.js](https://cdn.rawgit.com/iuliuvisovan/jquery-orderable/master/1.1/js/jquery.orderable.min.js) /  [jquery.orderable.js](https://cdn.rawgit.com/iuliuvisovan/jquery-orderable/master/1.1/js/jquery.orderable.js)

      - CSS: [jquery-orderable.min.css](https://cdn.rawgit.com/iuliuvisovan/jquery-orderable/master/1.1/css/jquery.orderable.min.css) / [jquery.orderable.css](https://cdn.rawgit.com/iuliuvisovan/jquery-orderable/master/1.1/css/jquery.orderable.css)
         
      - Reference ```<script src="scripts/jquery.orderable.min.js"></script>```
      - Reference ```<link rel="stylesheet" href="css/jquery.orderable.min.css"></link> ```
      
## Usage

`$('#myTable').orderable();`

## Configuration
 - By supplying a params object:

    Example: `$('#myTable').orderable({ flagName: 'flagName' });`

    Available parameters:

  - `useTbodyAsUnit`: Set to true if you want to move whole row-groups (`<tbody>` elements)

      - `false` *(default)* - The order units are the `<tr>` elements inside the target table
      - `true` - The order units are the `<tbody>` elements inside the target table
      
  - `useHandlerOnTouch`: Set to true if you want to use specific drag handlers to move a row when on touch devices.

      - `false` *(default)* - The entire row/row-group is draggable
      - `true` - Only elements decorated with the `touch-move-row` class will act as drag handlers when on a touch device. (It is your responsibility to place and mark these handlers.)
   
   - `onLoad`, `onInit`, `onOrderStart`, `onOrderCancel`, `onOrderFinish`, `onOrderReorder`: Supply functions to these parameters if you want to handle behaviour at specific points of the plugin's activity. These are fired together with their respective events, see *behaviour/events* below.

 - By adding state classes to markup:

     Available classes:

  - `.orderable-exclude`: Add this class to a row, row group or table data to exclude the element from being pullable for reordering  
  - `.touch-move-row`: Add this class to any element if you want it to act as its containing row's handler when on a touch device
    
Example with full parameters:

        $('.scrollable-table-body table').orderable({
          useTbodyAsUnit: true,
          useHandlerOnTouch: true,
          onLoad: function () { console.info('I loaded!') },
          onInit: function () { console.info('I did all my thingies!') },
          onOrderStart: function (element) { console.info('I\'m reordering! Selected unit: ', element) },
          onOrderCancel: function (element) { console.info('I\'m not reordering anymore, I got cancelled! Selected unit: ', element) },
          onOrderFinish: function (element) { console.info('I\'ve finished reordering! Selected unit: ', element) },
          onOrderReorder: function (element) { console.info('I\'ve finished reordering and I definitely changed order! Changed unit: ', element) },
          
        });

## Behaviour

Events are dispatched at key moments of the reordering process. Add handlers to them if you want to add custom behaviour to the plugin.

Example:

```
  document.addEventListener('jquery.orderable.order.start', function (changedElement) {
      console.log("I\'m reordering! Selected unit: ", changedElement);
  }, false);
```

Available events:

 - `jquery.orderable.load`: Dispatched when the plugin has sucessfully loaded (make sure to add event listener before applying the plugin)
 - `jquery.orderable.init`: Dispatched when targeted table was found & was sucessfully prepared for reordering
 - `jquery.orderable.order.start`: Dispatched when the left mouse button was clicked on a reorderable row
 - `jquery.orderable.order.cancel`: Dispatched when the picked row was dropped in an invalid location
 - `jquery.orderable.order.finish`: Dispatched when the target row got successfully moved (even if onto its initial position) 
 - `jquery.orderable.order.finish.reorder`: Dispatched when the target row sucessfully moved (but only if end position different than start position)


## Contact

Iuliu Vișovan / www.iuliu.net / iuliuvisovan@gmail.com
