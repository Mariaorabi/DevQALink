const Counter = require("../models/auth-models/counter-models");

const getNextSequenceValue = async (sequenceName) => {
    try {
      console.log(`Getting next sequence value for ${sequenceName}`);
      const sequenceDocument = await Counter.findByIdAndUpdate(
        sequenceName,
        { $inc: { sequence_value: 1 } },
        { new: true }
      );
  
      if (!sequenceDocument) {
        throw new Error('Failed to retrieve sequence value');
      }
  
      console.log(`Next sequence value: ${sequenceDocument.sequence_value}`);
      return sequenceDocument.sequence_value;
    } catch (error) {
      console.error('Error getting next sequence value:', error);
      throw error;
    }
  };
  
  module.exports = getNextSequenceValue;
  