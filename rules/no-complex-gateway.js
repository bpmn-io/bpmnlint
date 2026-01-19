import {
  checkDiscouragedNodeType
} from './helper.js';

const noComplexGatewayRule = checkDiscouragedNodeType('bpmn:ComplexGateway', 'no-complex-gateway');

export default noComplexGatewayRule;