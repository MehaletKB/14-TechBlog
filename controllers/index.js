const router = require("express").Router();
const apiRoutes = require("./apiRoutes");
const homeRoutes = require("./homeRoutes");
const dashboardRoutes = require("./dashboard");

router.use("/api", apiRoutes );

router.use("/", homeRoutes);

router.use("/dashboard", dashboardRoutes);

module.exports = router;