const httpStatus = require('http-status');
const moment = require('moment-timezone');
const { omit } = require('lodash');
const Account = require('../models/account.model');

exports.addAccount = async (req, res, next) => {
  try {
    const accountData = req.body;
    const account = await new Account(accountData).save();
    res.status(httpStatus.CREATED);
    return res.json({ data: account });
  } catch (error) {
    return next(error);
  }
};

exports.getAccounts = async (req, res, next) => {
    try {
        const accounts = await Account.find({ userId: req.user._id });
        res.status(httpStatus.OK);
        return res.json({ data: accounts });
    } catch (error) {
        return next(error);
    }
  };
  