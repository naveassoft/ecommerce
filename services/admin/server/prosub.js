import Joi from "joi";
import { errorHandler, getDateFromDB, mySql } from "./common";

export function getProSub(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM pro_sub_category WHERE id=${req.query.id}`;
      getDateFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.page || 0) * req.query.limit;
      const sql = `SELECT * FROM pro_sub_category LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM pro_sub_category";
      getDateFromDB(res, sql, count);
    } else {
      //send all category
      const sql = "SELECT * FROM pro_sub_category";
      getDateFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const prosubSchema = Joi.object({
  name: Joi.string().required(),
  sub_category_id: Joi.number().integer().required(),
  sub_category_name: Joi.string().required(),
});

export async function postProSub(req, res) {
  try {
    //api validateion;
    const varify = prosubSchema.validate(req.body);
    if (varify.error) {
      errorHandler(res, { message: varify.error.message });
      return;
    }

    const sql = "INSERT INTO pro_sub_category SET ?";
    mySql.query(sql, req.body, (err, result) => {
      if (err) throw { message: err.sqlMessage };
      else {
        if (result.insertId > 0) {
          res.send({ message: "Pro Sub Category Added Successfully" });
        } else {
          res.send({ message: "Unable to Added, please try again" });
        }
      }
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

export function deleteProsub(req, res) {
  try {
    const sql = `DELETE FROM pro_sub_category WHERE id=${req.query.id}`;
    mySql.query(sql, (err) => {
      if (err) throw { message: err.sqlMessage };
      res.send({ message: "Deleted successfully" });
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updatetProsub(req, res) {
  try {
    let data = "";
    Object.entries(req.body).forEach(([key, value]) => {
      if (data) {
        data += `, ${key} = '${value}'`;
      } else data += `${key} = '${value}'`;
    });

    const sql = `UPDATE pro_sub_category SET ${data} WHERE id=${req.query.id}`;
    mySql.query(sql, (err, result) => {
      if (err) throw { message: err.sqlMessage };
      else {
        if (result.changedRows > 0) {
          res.send({ message: "Pro Sub Category Updated Successfully" });
        } else {
          res.send({ message: "Unable to Update, please try again" });
        }
      }
    });
  } catch (error) {
    errorHandler(res, error);
  }
}
