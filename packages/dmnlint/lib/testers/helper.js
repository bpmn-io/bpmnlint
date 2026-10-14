const { DmnModdle } = require('dmn-moddle');

const { createModdleHelper } = require('@bpmn-io/lint-core/lib/testers/helper');

const {
  createModdle,
  readModdle
} = createModdleHelper({
  Moddle: DmnModdle,
  rootType: 'dmn:Definitions'
});

module.exports = {
  createModdle,
  readModdle
};
