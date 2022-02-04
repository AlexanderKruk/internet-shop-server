const ApiError = require("../error/apiError");
const { Basket, BasketDevice, Device } = require("../models/models");

class BasketController {
  async addItem(req, res, next) {
    const { id: userId } = req.user;
    const { deviceId } = req.body;
    if (!deviceId) {
      return next(ApiError.badRequest("Need deviceId"));
    }
    const basketId = await Basket.findOne({ where: userId });
    const deviceInBasket = await BasketDevice.create({
      basketId: basketId.id,
      deviceId,
    });
    return res.json(deviceInBasket);
  }
  async getAll(req, res) {
    const { id: userId } = req.user;
    const basketId = await Basket.findOne({ where: userId });
    const basketDivices = await BasketDevice.findAll({
      where: { basketId: basketId.id },
      include: [{ model: Device, attributes: ["name", "price"] }],
    });
    return res.json(basketDivices);
  }
}

module.exports = new BasketController();
