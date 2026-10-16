// @ts-expect-error 'missing <bpmn-moddle> types'
const { BpmnModdle } = require('bpmn-moddle');

const { createModdleHelper } = require('@bpmn-io/lint-core/lib/testers/helper');

const {
  createModdle,
  readModdle
} = createModdleHelper({
  Moddle: BpmnModdle,
  rootType: 'bpmn:Definitions'
});

module.exports = {
  createModdle,
  readModdle
};
