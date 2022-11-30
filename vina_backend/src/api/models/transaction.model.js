const mongoose = require('mongoose');
// const crypto = require('crypto');
// const moment = require('moment-timezone');

/**
 * Transaction Schema
 * @private
 */
const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    index: true,
  },
  groupId: {
    type: 'String',
    required: true,
    default: '',
  },
  amount: {
    type: 'String',
    required: true,
    default: '',
  },
  date: {
    type: 'String',
    required: true,
    default: '',
  },
  narration: {
    type: 'String',
    required: true,
    default: '',
  },
  type: {
    type: 'String',
    required: true,
    default: '',
  },
//   expires: { type: Date },
});

transactionSchema.statics = {

  /**
   * Generate a refresh token object and saves it into the database
   *
   * @param {Transaction} transaction
   * @returns {Transaction}
   */
  generate(transaction) {
    const accountId = transaction.accountId;
    const amount = transaction.amount;
    const narration = transaction.narration;
    const date = transaction.date;
    const type = transaction.type;
    const category = transaction.category;
    const transactionObject = new Transaction({
        accountId,amount,narration,date,type,category
    });
    transactionObject.save();
    return transactionObject;
  },
};

/**
 * @typedef Transaction
 */
const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
