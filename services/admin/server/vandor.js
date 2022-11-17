import bcrypt from "bcrypt";
import Joi from "joi";
import {
  bodyParser,
  deleteImage,
  errorHandler,
  getDateFromDB,
  mySql,
} from "./common";

export function getVandor(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM vandor WHERE id=${req.query.id}`;
      getDateFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.page || 0) * req.query.limit;
      const sql = `SELECT * FROM vandor LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM vandor";
      getDateFromDB(res, sql, count);
    } else {
      //send all category
      const sql = "SELECT * FROM vandor";
      getDateFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const VandorSchema = Joi.object({
  name: Joi.string().max(100).required(),
  email: Joi.string().email().required(),
  number: Joi.string().required(),
  shop_name: Joi.string().max(100).required(),
  trad_liecence: Joi.number().required(),
  shop_location: Joi.string().required(),
  password: Joi.string().min(6).required(),
  shop_logo: Joi.string(),
});

export async function postVandor(req, res) {
  try {
    const img = [{ name: "shop_logo", maxCount: 1 }];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error) {
      throw { message: error.message || "Error occured when image updlading" };
    }

    //check is user exist;
    const query = `SELECT * FROM vandor WHERE email='${req.body.email}'`;
    mySql.query(query, async (err, result) => {
      if (err) {
        errorHandler(res, { message: err.sqlMessage });
      } else {
        if (result.length) {
          //there is an user exist;
          if (req.files.shop_logo) {
            deleteImage(req.files.shop_logo[0].filename);
          }
          return res.status(401).send({ message: "User already exist" });
        } else {
          //no user, you procced;
          //api validateion;
          const varify = VandorSchema.validate(req.body);
          if (varify.error) {
            errorHandler(res, { message: varify.error.message });
            return;
          }
          //hase password;
          const hashed = await bcrypt.hash(req.body.password, 10);
          req.body.password = hashed;
          if (req.files.shop_logo) {
            req.body.shop_logo = req.files.shop_logo[0].filename;
          } else delete req.body.shop_logo;

          //save to db;
          const sql = "INSERT INTO vandor SET ?";
          mySql.query(sql, req.body, (err, result) => {
            if (err) return errorHandler(res, { message: err.sqlMessage });
            else {
              if (result.insertId > 0) {
                res.send({ message: "Vandor Added Successfully" });
              } else {
                res.send({ message: "Unable to Added, please try again" });
              }
            }
          });
        }
      }
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

export function deleteVandor(req, res) {
  try {
    const sql = `DELETE FROM vandor WHERE id=${req.query.id}`;
    mySql.query(sql, (err) => {
      if (err) return errorHandler(res, { message: err.sqlMessage });
      if (req.query.shop_logo) {
        deleteImage(req.query.image);
      }
      res.send({ message: "Deleted successfully" });
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateVandor(req, res) {
  try {
    const img = [{ name: "shop_logo", maxCount: 1 }];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error) throw { message: "Error occured when image updlading" };

    if (req.body.password) {
      const hashed = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashed;
    }

    let data = "";
    Object.entries(req.body).forEach(([key, value]) => {
      if (data) {
        data += `, ${key} = '${value}'`;
      } else data += `${key} = '${value}'`;
    });

    const sql = `UPDATE vandor SET ${data} WHERE id=${req.query.id}`;
    mySql.query(sql, (err, result) => {
      if (err) return errorHandler(res, { message: err.sqlMessage });
      else {
        if (result.changedRows > 0) {
          res.send({ message: "Vandor Updated Successfully" });
        } else {
          res.send({ message: "Unable to Update, please try again" });
        }
      }
    });
  } catch (error) {
    errorHandler(res, error);
  }
}
