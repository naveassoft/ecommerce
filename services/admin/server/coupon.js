import Joi from "joi";
import { errorHandler, getDateFromDB, mySql } from "./common";

export function getCoupon(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM coupon WHERE id=${req.query.id}`;
      getDateFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.page || 0) * req.query.limit;
      const sql = `SELECT * FROM coupon LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM coupon";
      getDateFromDB(res, sql, count);
    } else {
      //send all category
      const sql = "SELECT * FROM coupon";
      getDateFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const CouponSchema = Joi.object({
  code: Joi.string().max(50).required(),
  amount: Joi.number().required(),
  type: Joi.string().required(),
});

export async function postCoupon(req, res) {
  try {
    //api validateion;
    const varify = CouponSchema.validate(req.body);
    if (varify.error) {
      errorHandler(res, { message: varify.error.message });
      return;
    }
    const query = `SELECT id FROM coupon WHERE code = '${req.body.code}'`;
    mySql.query(query, (err, result) => {
      if (err) throw { message: err.sqlMessage };
      if (result.length) {
        return res.status(403).send({ message: "Already exist" });
      }
      const sql = "INSERT INTO coupon SET ?";
      mySql.query(sql, req.body, (err, result) => {
        if (err) throw { message: err.sqlMessage };
        else {
          if (result.insertId > 0) {
            res.send({ message: "Coupon Added Successfully" });
          } else {
            res.send({ message: "Unable to Added, please try again" });
          }
        }
      });
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

export function deleteCoupon(req, res) {
  try {
    const sql = `DELETE FROM coupon WHERE id=${req.query.id}`;
    mySql.query(sql, (err) => {
      if (err) throw { message: err.sqlMessage };
      res.send({ message: "Deleted successfully" });
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateCoupon(req, res) {
  try {
    let data = "";
    Object.entries(req.body).forEach(([key, value]) => {
      if (data) {
        data += `, ${key} = '${value}'`;
      } else data += `${key} = '${value}'`;
    });

    const sql = `UPDATE coupon SET ${data} WHERE id=${req.query.id}`;
    mySql.query(sql, (err, result) => {
      if (err) throw { message: err.sqlMessage };
      else {
        if (result.changedRows > 0) {
          res.send({ message: "Coupon Updated Successfully" });
        } else {
          res.send({ message: "Unable to Update, please try again" });
        }
      }
    });
  } catch (error) {
    errorHandler(res, error);
  }
}
