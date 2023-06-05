import {
  fileURLToPath
} from "url";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  faker
} from "@faker-js/faker";
import * as dotenv from "dotenv";
import winston from "winston";
import config from '../config/config.js'

const __filename = fileURLToPath(
  import.meta.url);
const __dirname = path.dirname(__filename);
const __mainDirname = path.join(__dirname, '..')

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);


export const generateToken = (user) => {
  const token = jwt.sign({
      user,
    },
    config.privateKey, {
      expiresIn: "1h",
    }
  );
  return token;
};

export const decodeToken = (token) => {
  const result = jwt.verify(token, config.privateKey, function (err, decoded) {

    if(err) {
      return null
    } else {
      return decoded
    }
  })

  return result
}

//CUSTOM CALL
export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(error);

      if (!user) {
        return res.status(401).send({
          error: info.messages ? info.messages : info.toString(),
        });
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (rol) => {
  return async (req, res, next) => {
    if (req.user.rol != rol)
      return res.status(403).send({
        error: "Not permissions",
      });
    next();
  };
};

//middleware para validar token de acceso
export const authenticateToken = (req, res, next) => {
  const token = req.cookies["cookieToken"];

  if (token == null) {
    return res.status(401).send("unauthorized");
  }
  jwt.verify(token, config.privateKey, (err, user) => {
    if (err) {
      return res.status(403).send("forbbiden");
    }
    req.user = user;
    next();
  });
};

//middleware para limitar el acceso a endpoints segun rol
export const authorizeRol = (rol) => (req, res, next) => {
  if (rol.includes(req.user.user.rol)) {
    return next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

faker.locale = "es";

export const generateProduct = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    thumbnail: faker.image.imageUrl(),
    code: faker.random.numeric(10),
    stock: faker.random.numeric(1),
    status: faker.datatype.boolean(),
    category: faker.helpers.arrayElement(["bebida", "comida", "complemento"]),
  };
};


dotenv.config();
const ENVIROMENT = config.enviroment;

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'red',
    error: 'blue',
    warning: 'yellow',
    info: 'green',
    debug: 'cyan'
  }
}

let logger;

if (ENVIROMENT === "production") {
  logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.colorize({
            all: true,
            colors: customLevelOptions.colors
          }),
          winston.format.simple()
        )
      }),
      new winston.transports.File({
        filename: "src/logs/errors.log",
        level: "info",
      }),
    ],
  });
} else {
  logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
      new winston.transports.Console({
        level: 'debug',
        format: winston.format.combine(
          winston.format.colorize({
            all: true,
            colors: customLevelOptions.colors
          }),
          winston.format.simple()
        )
      })
    ]
  })
}

export const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.debug(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
  next();
};

export default __mainDirname;