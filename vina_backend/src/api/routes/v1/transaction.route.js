const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/transaction.controller");
const { authorize, ADMIN, LOGGED_USER } = require("../../middlewares/auth");
// const {
//   register,
// } = require('../../validations/log.validation');

const router = express.Router();

// /**
//  * Load user when API with userId route parameter is hit
//  */
// router.param('userId', controller.load);

router.route("/:id").get(authorize(LOGGED_USER), controller.getTransactions);

module.exports = router;
