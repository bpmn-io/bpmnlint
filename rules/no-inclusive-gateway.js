import {
  checkDiscouragedNodeType
} from './helper.js';

const noInclusiveGatewayRule = checkDiscouragedNodeType('bpmn:InclusiveGateway', 'no-inclusive-gateway');

export default noInclusiveGatewayRule;