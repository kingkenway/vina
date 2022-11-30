const express = require("express");
// const homeRoute = require('./home.route');
const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");
const accountRoutes = require("./account.route");
const logRoutes = require("./log.route");
const serviceRoutes = require("./service.route");
const transactionRoutes = require("./transaction.route");

const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));

/**
 * GET v1/docs
 */
router.use("/docs", express.static("docs"));

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/accounts", accountRoutes);
router.use("/logs", logRoutes);
router.use("/transactions", transactionRoutes);
router.use("/services", serviceRoutes);

// router.use('/', homeRoute);

module.exports = router;
