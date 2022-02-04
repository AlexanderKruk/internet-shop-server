const ApiError = require("../error/apiError");
const { User, Basket } = require("../models/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateJWT(id, email, role) {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
}

class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Not corect email or password"));
    }
    const user = await User.findOne({ where: { email } });
    if (user) {
      return next(ApiError.badRequest("User with this email already exist"));
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const newUser = await User.create({ email, password: hashPassword, role });
    const newBasket = await Basket.create({ userId: newUser.id });
    const jwtToken = generateJWT(newUser.id, newUser.email, newUser.role);
    return res.json(jwtToken);
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Not corect email or password"));
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal("User not found"));
    }
    const comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal("Password not valid"));
    }
    const jwtToken = generateJWT(user.id, user.email, user.role);
    return res.json(jwtToken);
  }

  async check(req, res) {
    const token = generateJWT(req.user.id, req.user.email, req.user.role);
    return res.json({ token });
  }
}

module.exports = new UserController();
