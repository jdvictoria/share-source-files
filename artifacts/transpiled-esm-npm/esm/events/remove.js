import $ from '../core/renderer';
import { beforeCleanData } from '../core/element_data';
import eventsEngine from './core/events_engine';
import registerEvent from './core/event_registrator';
export var removeEvent = 'dxremove';
var eventPropName = 'dxRemoveEvent';

/**
  * @name UI Events.dxremove
  * @type eventType
  * @type_function_param1 event:event
  * @module events/remove
*/

beforeCleanData(function (elements) {
  elements = [].slice.call(elements);
  for (var i = 0; i < elements.length; i++) {
    var $element = $(elements[i]);
    if ($element.prop(eventPropName)) {
      $element[0][eventPropName] = null;
      eventsEngine.triggerHandler($element, removeEvent);
    }
  }
});
registerEvent(removeEvent, {
  noBubble: true,
  setup: function setup(element) {
    $(element).prop(eventPropName, true);
  }
});