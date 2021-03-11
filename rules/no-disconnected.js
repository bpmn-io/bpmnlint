const {
  isAny
} = require('bpmnlint-utils');


/**
 * A rule that verifies that there exists no disconnected
 * flow elements, i.e. elements without incoming
 * _or_ outgoing sequence flows
 */
module.exports = function() {

  function check(node, reporter) {

    if (!isAny(node, ['bpmn:Task','bpmn:Gateway','bpmn:SubProcess','bpmn:Event']) || node.triggeredByEvent) {
      return;
    }

  //Check for compensation boundary events

    if(node.$type == 'bpmn:BoundaryEvent'){
     var eventDefinitions = node.get('eventDefinitions');      
      if(eventDefinitions.length == 1){
          if(node.eventDefinitions[0].$type == 'bpmn:CompensateEventDefinition'){
          return;
        }
      }
     }

  //Check for compensation task

    if (node.isForCompensation){
      return;
    }

    const incoming = node.incoming || [];
    const outgoing = node.outgoing || [];
   
  
    if(!incoming.length && !outgoing.length){
    reporter.report(node.id, 'Element is not connected');

   }
  
  }

  return {
    check
  }
}
