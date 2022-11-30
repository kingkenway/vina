const httpStatus = require("http-status");
const moment = require("moment-timezone");
const { omit } = require("lodash");
const Transaction = require("../models/transaction.model");
const retry = require("async-retry");
const axios = require("axios");

exports.getTransactions = async (req, res, next) => {
  //   console.log(333111);
  //   try {
  //     const transactions = await Transaction.find({
  //       groupId: req.params.groupId,
  //     });
  //     res.status(httpStatus.OK);
  //     return res.json({ data: transactions });
  //   } catch (error) {
  //     return next(error);
  //   }

  return await axios({
    method: "GET",
    url: `https://api.withmono.com/accounts/${req.params.id}/transactions`,
    headers: {
      "Content-Type": "application/json",
      "mono-sec-key": process.env["MONO_SECRET_KEY"],
    },
  })
    .then((response) => {
      //   console.log(response.data);
      //   return response.data.data;
      return res.json({ data: response.data.data });
    })
    .catch((error) => {
      return next(error);
      //   console.log("Error from getAccountInformation: " + error);
    });
};
