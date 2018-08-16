const { isNodeOfType } = require("../lib/utils");

const ERROR = "Implicit parallel gateways are not allowed";

function check(node, reporter) {
  if (!isNodeOfType(node, "Gateway") && (node.outgoing || []).length > 1) {
    reporter.report(node, ERROR);
  }
}

function listAllProperties(o) {
  var objectToInspect;
  var result = [];

  for (
    objectToInspect = o;
    objectToInspect !== null;
    objectToInspect = Object.getPrototypeOf(objectToInspect)
  ) {
    result = result.concat(Object.getOwnPropertyNames(objectToInspect));
  }

  return result;
}

function fix({ node, moddle, moddleRoot }) {
  var prevOutgoing = node.outgoing;
  var parallelGateway = moddle.create("bpmn:ParallelGateway", { id: "foo" });
  var outgoingFromNode = moddle.create("bpmn:SequenceFlow", {
    id: "bar",
    sourceRef: node.id,
    targetRef: parallelGateway.id
  });
  node.$parent.get("flowElements").push(outgoingFromNode);
  node.$parent.get("flowElements").push(parallelGateway);
  node.set("outgoing", [outgoingFromNode]);
  parallelGateway.set("outgoing", prevOutgoing);
  // console.log(parallelGateway.outgoing);
  return moddle.toXML(moddleRoot, (err, xml) => {
    console.log(xml);
  });
}

module.exports = { check, fix };
