if (typeof jQuery === 'undefined') {
  throw new Error('jQuery Orderable: I require jQuery to work! Make sure you load me after jQuery.')
}

(function () {
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

+function ($) {
  $.fn.orderable = function (opts) {
    var self = this;
    opts = opts || {};
    var options = {
      unit: opts.tbodyAsUnit ? 'tbody' : 'tbody tr'
    }

    $draggedUnit = {}; //Reference to the currently dragged/pulled table row
    var $ghost; //Reference to the ghost element at the top that makes moving to top easier
    var mouseY;     //The position on the Y axis of the mouse

    var EVENT = {
      MOUSEDOWN: 'mousedown touchstart',
      MOUSEUP: 'mouseup touchend'
    };
    var STATE = {
      ORDERABLE: 'jq-orderable',
      ORDERABLE_UNIT: 'jq-orderable-unit',
      MOVING: 'moving',
      HOVERED: 'hovered',
      REORDERING: 'reordering',
    };

    var EVENTS = {
      LOADED: 'jquery.orderable.load',
      INITIATED: 'jquery.orderable.init',
      ORDERING_STARTED: 'jquery.orderable.order.start',
      ORDERING_CANCELLED: 'jquery.orderable.order.cancel',
      ORDERING_FINISHED: 'jquery.orderable.order.finish'
    }

    document.dispatchEvent(new CustomEvent(EVENTS.LOADED));

    init(this, options);

    $(document).on(EVENT.MOUSEDOWN, mouseDown);  //Listen for drag attempts on all rows of current table
    $(document).on(EVENT.MOUSEUP, mouseUp);                  //Listen for drop attempts on the entire document


    function init(currentElement, options) {
      if (typeof (currentElement) === 'undefined' || !currentElement.length) {
        throw new Error('jQuery Ordable: Supplied table doesn\'t exist!');
      }
      if (!$(currentElement).is('table')) {
        throw new Error('jQuery Orderable: I work on <table> delements only. Supplied element: ' + currentElement.tagName);
      }

      $(currentElement).addClass(STATE.ORDERABLE)
                       .attr('ondragstart', 'return false;'); //Prevents the browser from pulling elements 
      $(currentElement).find(options.unit).addClass(STATE.ORDERABLE_UNIT);

      $(document).on({
        mouseenter: function () {
          $('.jq-orderable .hovered').removeClass('hovered');
          $(this).addClass('hovered');
        }
      }, '.jq-orderable.reordering ' + options.unit);

      $(document).on('touchmove mousemove', function (event) {
        if (event.changedTouches) {
          mouseY = event.changedTouches[event.changedTouches.length - 1].pageY;
        } else {
          mouseY = event.pageY;
        }
        if (!$('.moving')[0])
          return;
        calculateHoveredUnits();
      });

      document.dispatchEvent(new CustomEvent(EVENTS.initiated));
    }

    function mouseDown(event) {
      if ($($(event.target).closest('td')).is('.jq-orderable ' + options.unit + ':not(.orderable-exclude) td:not(.orderable-exclude)')) {
        $draggedUnit = $(event.target).parents(options.unit)[0];
        addGhostElement();
        $($draggedUnit).parents('table').addClass(STATE.REORDERING);  //Set table's style
        $($draggedUnit).css({
          //Set its position equal to its current position, so it's ready for 'fixed'
          top: $draggedUnit.getBoundingClientRect().top,
          left: $draggedUnit.getBoundingClientRect().left,
          width: $($draggedUnit).width()
        });
        $($draggedUnit).addClass(STATE.MOVING);   //Row becomes fixed, 'movable'  and can start moving
        $($draggedUnit).find('tr:visible').addClass('orderable-row-as-table');
        calculateHoveredUnits();
        document.dispatchEvent(new CustomEvent(EVENTS.ORDERING_STARTED));
      }
    };

    function addGhostElement() {
      var $firstUnitInTable = $(options.unit, self).first();
      $ghost = $($firstUnitInTable).clone();
      $ghost.find('td').empty();
      $ghost.addClass('orderable-ghost').css('display', '').css('background', '').insertBefore($firstUnitInTable);
    }

    function mouseUp(event) {
      if (!$('.' + STATE.MOVING).length)
        return;
      var movingUnitPosition = $('.' + STATE.MOVING)[0].getBoundingClientRect();
      var movingUnitX = movingUnitPosition.left + 20;
      var movingUnitTop = movingUnitPosition.top;
      var movingUnitBottom = movingUnitPosition.bottom;
      var unitBefore = unitFromPoint(movingUnitX, movingUnitTop);

      if (!isValidUnit(unitBefore)) {
        var unitAfter = unitFromPoint(movingUnitX, movingUnitBottom);

        if (!isValidUnit(unitAfter)) {
          resetTable();
          document.dispatchEvent(new CustomEvent(EVENTS.ORDERING_CANCELLED));
          return;
        }
      }

      if (unitAfter) {
        if ($(unitAfter).is('.orderable-ghost')) {
          $($draggedUnit).insertAfter(unitAfter);
        } else {
          $($draggedUnit).insertAfter(unitAfter);
        }
      } else {
        $($draggedUnit).insertAfter(unitBefore);
      }
      $($draggedUnit).addClass('added');
      setTimeout(function () {
        $($draggedUnit).removeClass('added');
      }, 1000);
      resetTable();
      document.dispatchEvent(new CustomEvent(EVENTS.ORDERING_FINISHED, {
        detail: $draggedUnit
      }));
    };

    function isValidUnit(unit) {
      return $(unit).is(options.unit) && !$(unit).parent('thead').length && $(unit).parents('.jq-orderable').length;
    }

    function unitFromPoint(x, y) {
      var direct = document.elementFromPoint(x, y);
      if (!$(direct).is('tr') && !$(direct).is('tbody'))
        direct = $(direct).parents(options.unit);
      if ($(direct).is('tbody'))
        return direct;
      if ($(direct).is('tr'))
        return options.unit == 'tbody' ? direct.parentElement : direct;
    }

    function resetTable() {
      clearState([STATE.MOVING, STATE.REORDERING, STATE.HOVERED, 'orderable-row-as-table']);
      $ghost.remove();
    }

    function clearState(states) {
      var states = (states.constructor === Array ? states : [states]);
      states.forEach(function (state) {
        $("." + state).removeClass(state);
      });
    }

    function calculateHoveredUnits() {
      var movingUnitPosition = $('.moving')[0].getBoundingClientRect();
      var movingUnitX = movingUnitPosition.left + 20; //Make sure its not a border or something
      var movingUnitTop = movingUnitPosition.top;
      var unitBefore = unitFromPoint(movingUnitX, movingUnitTop);
      $('.hovered').removeClass('hovered');
      $(unitBefore).addClass('hovered');
      $('.moving').css({
        top: mouseY - 15,
      });
    }
    return this;
  };
}(jQuery);
