const Router = require("express");
const basketController = require("../controllers/basketController");
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();

router.post("/", authMiddleware, basketController.addItem);
router.get("/", authMiddleware, basketController.getAll);

module.exports = router;
