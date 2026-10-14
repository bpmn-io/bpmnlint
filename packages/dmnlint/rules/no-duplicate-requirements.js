const {
  is,
  isAny
} = require('dmnlint-utils');

const requirements = [
  'dmn:AuthorityRequirement',
  'dmn:InformationRequirement',
  'dmn:KnowledgeRequirement'
];

const requiredPropertiesMap = {
  'dmn:AuthorityRequirement': [
    'requiredAuthority',
    'requiredDecision',
    'requiredInput'
  ],
  'dmn:InformationRequirement': [
    'requiredDecision',
    'requiredInput'
  ],
  'dmn:KnowledgeRequirement': [
    'requiredKnowledge'
  ]
};

/**
 * A rule that verifies that there are no duplicated
 * requirements, i.e. two or more requirements
 * between two elements
 */
module.exports = function() {

  const keyed = {};

  const outgoingReported = {};
  const incomingReported = {};

  function check(node, reporter) {

    if (!isAny(node, requirements)) {
      return;
    }

    const key = requirementKey(node);

    if (key in keyed) {
      const sourceId = getRequirementSourceId(node);
      const targetId = getRequirementTargetId(node);

      if (!outgoingReported[sourceId]) {
        reporter.report(sourceId, 'Duplicate outgoing requirements');

        outgoingReported[sourceId] = true;
      }

      if (!incomingReported[targetId]) {
        reporter.report(targetId, 'Duplicate incoming requirements');

        incomingReported[targetId] = true;
      }
    } else {
      keyed[key] = node;
    }
  }

  return {
    check
  };

};


// helpers /////////////////

function requirementKey(requirement) {
  const sourceId = requirement.$parent.id;

  const targetId = getRequirementTargetId(requirement);

  return sourceId + '#' + targetId;
}

function getRequirementSourceId(requirement) {
  return requirement.$parent.id;
}

function getRequirementTargetId(requirement) {

  let requiredProperties = [];

  if (is(requirement, 'dmn:AuthorityRequirement')) {
    requiredProperties = requiredPropertiesMap['dmn:AuthorityRequirement'];
  } else if (is(requirement, 'dmn:InformationRequirement')) {
    requiredProperties = requiredPropertiesMap['dmn:InformationRequirement'];
  } else if (is(requirement, 'dmn:KnowledgeRequirement')) {
    requiredProperties = requiredPropertiesMap['dmn:KnowledgeRequirement'];
  }

  for (const property of requiredProperties) {
    if (requirement[property]) {
      return requirement[property].href.replace('#', '');
    }
  }
}
