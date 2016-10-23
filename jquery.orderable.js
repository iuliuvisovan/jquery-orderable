if (typeof jQuery === 'undefined') {
    throw new Error('jQuery Orderable: I require jQuery to work! Make sure you load me after jQuery.')
}

(function () {
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
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

        var draggedUnit; //Reference to the currently dragged/pulled table row
        var mouseY;     //The position on the Y axis of the mouse

        const EVENT = {
            MOUSEDOWN: 'mousedown touchstart',
            MOUSEUP: 'mouseup touchend'
        };
        const STATE = {
            MOVING: 'moving',
            HOVERED: 'hovered',
            REORDERING: 'reordering',
        };

        var events = {
            loaded: new CustomEvent('jquery.orderable.load'),
            initiated: new CustomEvent('jquery.orderable.init'),
            orderingStarted: new CustomEvent('jquery.orderable.order.start'),
            orderingCancelled: new CustomEvent('jquery.orderable.order.cancel'),
            orderingFinished: new CustomEvent('jquery.orderable.order.finish'),
        }

        document.dispatchEvent(events.loaded);

        init(this, options || {});


        $($(this).find(options.unit + ':not(.orderable-exclude)')).on(EVENT.MOUSEDOWN, mouseDown);  //Listen for drag attempts on all rows of current table
        $(document).on(EVENT.MOUSEUP, mouseUp);                  //Listen for drop attempts on the entire document


        function init(currentElement, options) {
            if (typeof (currentElement) === 'undefined' || !currentElement.length) {
                throw new Error('jQuery Ordable: Supplied table doesn\'t exist!');
            }
            if (!$(currentElement).is('table')) {
                throw new Error('jQuery Orderable: I work on <table> elements only. Supplied element: ' + currentElement.tagName);
            }

            $(currentElement).addClass('jq-orderable');
            $(currentElement).find(options.unit).addClass('jq-orderable-unit');

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

            var $firstUnitInTable = $(currentElement).find(options.unit).first();
            var $ghost = $firstUnitInTable.clone();
            $ghost.addClass('orderable-ghost').insertBefore($firstUnitInTable);

            document.dispatchEvent(events.initiated);
        }

        function mouseDown(event) {
            draggedUnit = event.currentTarget;   //Definitely a unit (read e.target vs e.currentTarget)
            $(draggedUnit).parents('table').addClass(STATE.REORDERING);  //Set table's style
            $(draggedUnit).css({ //Set its position equal to its current position, so it's ready for 'fixed'
                top: draggedUnit.getBoundingClientRect().top,
                left: draggedUnit.getBoundingClientRect().left
            });
            $(draggedUnit).addClass(STATE.MOVING);   //Row becomes fixed, 'movable'  and can start moving
            calculateHoveredUnits();
            document.dispatchEvent(events.orderingStarted);
        };

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
                    document.dispatchEvent(events.orderingCancelled);
                    return;
                }
            }

            if (unitAfter) {
                if ($(unitAfter).is('.orderable-ghost')) {
                    $(draggedUnit).insertAfter(unitAfter);
                } else {
                    $(draggedUnit).insertAfter(unitAfter);
                }
            } else {
                 $(draggedUnit).insertAfter(unitBefore);
            }
            $(draggedUnit).addClass('added');
            setTimeout(function () {
                $(draggedUnit).removeClass('added');
            }, 1000);
            resetTable();
            document.dispatchEvent(events.orderingFinished);
        };

        function isValidUnit(unit) {
            return $(unit).is(options.unit) && !$(unit).parent('thead').length;
        }

        function unitFromPoint(x, y) {
            var direct = document.elementFromPoint(x, y);
            if ($(direct).is('td'))
                direct = direct.parentElement;
            if ($(direct).is('tbody'))
                return direct;
            if ($(direct).is('tr'))
                return options.unit == 'tbody' ? direct.parentElement : direct;
        }

        function resetTable() {
            $('.moving').removeClass('moving');
            $('.reordering').removeClass('reordering');
            $('.hovered').removeClass('hovered');
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
} (jQuery);