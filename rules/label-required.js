const isNodeOfType = (node, type) => Boolean(node.$descriptor.allTypes.filter(({name}) => type === name).length);

const error = node => `Error: Element ${node.id} is missing a label/name.`;

module.exports = function labelRequired(node, reporter){
  if(isNodeOfType(node, 'bpmn:FlowNode') && !(node.name || '').trim().length) {
    reporter.report(node, error(node));
  }
}