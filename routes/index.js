const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const brandRouter = require("./brandRouter");
const typeRouter = require("./typeRouter");
const deviceRouter = require("./deviceRouter");
const ratingRouter = require("./ratingRouter");
const basketRouter = require("./basketRouter");

router.use("/brand", brandRouter);
router.use("/device", deviceRouter);
router.use("/type", typeRouter);
router.use("/user", userRouter);
router.use("/rating", ratingRouter);
router.use("/basket", basketRouter);

module.exports = router;
