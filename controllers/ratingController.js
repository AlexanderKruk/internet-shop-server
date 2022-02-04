const { Sequelize } = require("../db");
const ApiError = require("../error/apiError");
const { Rating, Device } = require("../models/models");

class RatingController {
  async create(req, res, next) {
    try {
      const { id } = req.user;
      const { deviceId, rate } = req.body;
      if (!deviceId || !rate) {
        return next(ApiError.badRequest("No deviceId or rate"));
      }
      let rated = await Rating.findOne({
        where: { userId: id, deviceId },
      });
      if (!rated) {
        rated = await Rating.create({ userId: id, deviceId, rate });
      } else {
        rated.rate = +rate;
        await rated.save();
      }
      const deviceRating = await Rating.findOne({
        where: { deviceId },
        attributes: [[Sequelize.fn("avg", Sequelize.col("rate")), "rating"]],
      });
      const device = await Device.findOne({ where: { id: deviceId } });
      device.rating = +deviceRating.toJSON().rating;
      await device.save();
      return res.json(rated);
    } catch (e) {
      res.json({ message: e.message });
    }
  }
}

module.exports = new RatingController();
