const mongoose = require("mongoose");
// const crypto = require('crypto');
// const moment = require('moment-timezone');

/**
 * Cron Schema
 * @private
 */
const cronSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    status: {
      type: "String",
      required: true,
      default: "",
    },
    code: {
      type: "String",
      required: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

cronSchema.statics = {
  /**
   * Generate a refresh token object and saves it into the database
   *
   * @param {Cron} cron
   * @returns {Cron}
   */
  generate(cron) {
    const accountId = cron.accountId;
    const status = cron.status;
    const code = cron.code;
    const cronObject = new Cron({
      accountId,
      status,
      code,
    });
    cronObject.save();
    return cronObject;
  },
};

/**
 * @typedef Cron
 */
const Cron = mongoose.model("Cron", cronSchema);
module.exports = Cron;
