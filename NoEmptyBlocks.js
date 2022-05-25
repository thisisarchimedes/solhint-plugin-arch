const { isFallbackFunction } = require('./ast-types.js');

const ruleId = 'no-empty-blocks';
const meta = {
  type: 'best-practises',

  docs: {
    description: 'Code contains empty block.',
    category: 'Best Practise Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: null
};

class NoEmptyBlocksChecker {
  Block(node) {
    const isFallbackFunctionBlock = isFallbackFunction(node.parent)
    if (isFallbackFunctionBlock) {
      // ignore empty blocks in fallback functions
      return;
    }
    if (node.parent.isContructor) {
      // ignore constructors
      return;
    }
    this._validateChildrenCount(node, 'statements')
  }

  StructDefinition(node) {
    this._validateChildrenCount(node, 'members')
  }

  EnumDefinition(node) {
    this._validateChildrenCount(node, 'members')
  }

  AssemblyBlock(node) {
    this._validateChildrenCount(node, 'operations')
  }

  ContractDefinition(node) {
    this._validateContractPartsCount(node)
  }

  _validateChildrenCount(node, children) {
    const blockChildrenCount = node[children].length

    if (blockChildrenCount === 0) {
      this._error(node)
    }
  }

  _validateContractPartsCount(node) {
    const contractPartCount = node.subNodes.length

    if (contractPartCount === 0) {
      this._error(node)
    }
  }

  _error(node) {
    this.warn(node, 'Code contains empty blocks')
  }
}

module.exports = NoEmptyBlocksChecker