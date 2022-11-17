import Joi from "joi";
import { errorHandler, getDateFromDB, mySql } from "./common";

export function getReview(req, res) {
  // send category for home category page;
  const limit = req.query.limit || 10;
  const page = parseInt(req.query.page || 0) * limit;
  const sql = `SELECT * FROM customer_review LIMIT ${page}, ${limit}`;
  const count = "SELECT COUNT(id) FROM customer_review";
  getDateFromDB(res, sql, count);
}

const PostSchema = Joi.object({
  customer_id: Joi.number().required(),
  product_id: Joi.number().required(),
  customer_name: Joi.string().required(),
  customer_email: Joi.string().email().required(),
  customer_profile: Joi.string(),
  comment: Joi.string().required(),
  rating: Joi.number().max(5),
});

export async function postReview(req, res) {
  //api validateion;
  const varify = PostSchema.validate(req.body);
  if (varify.error) {
    errorHandler(res, { message: varify.error.message });
    return;
  }

  const query = `SELECT id FROM user WHERE id = '${req.body.customer_id}' AND email = '${req.body.customer_email}'`;
  mySql.query(query, (err, result) => {
    if (err) errorHandler(res, { message: err.sqlMessage });
    else {
      if (!result.length) {
        return errorHandler(res, { message: "Forbiden", status: 401 });
      }
      const sql = "INSERT INTO customer_review SET ?";
      mySql.query(sql, req.body, (err, result) => {
        if (err) errorHandler(res, { message: err.sqlMessage });
        else {
          if (result.insertId > 0) {
            res.send({ message: "Your Valueable Comment Added Successfully" });
          } else {
            res.send({ message: "Unable to Added, please try again" });
          }
        }
      });
    }
  });
}

const DeleteSchema = Joi.object({
  customer_id: Joi.number().required(),
  customer_email: Joi.string().email().required(),
});
export function deleteReview(req, res) {
  //api validateion;
  const varify = DeleteSchema.validate(req.body);
  if (varify.error) {
    errorHandler(res, { message: varify.error.message });
    return;
  }
  const query = `SELECT id FROM customer_review WHERE customer_id = '${req.body.customer_id}' AND customer_email = '${req.body.customer_email}'`;
  mySql.query(query, (err, result) => {
    if (err) errorHandler(res, { message: err.sqlMessage });
    else {
      if (!result.length) {
        return errorHandler(res, { message: "Forbiden", status: 401 });
      }
      const sql = `DELETE FROM customer_review WHERE id=${req.query.id}`;
      mySql.query(sql, (err) => {
        if (err) return errorHandler(res, { message: err.sqlMessage });
        res.send({ message: "Deleted successfully" });
      });
    }
  });
}

export async function updateReview(req, res) {
  const query = `SELECT id FROM customer_review WHERE id = '${req.query.id}' AND customer_id = '${req.body.customer_id}' AND customer_email = '${req.body.customer_email}'`;
  mySql.query(query, (err, result) => {
    if (err) errorHandler(res, { message: err.sqlMessage });
    else {
      if (!result.length) {
        return errorHandler(res, { message: "Forbiden", status: 401 });
      }
      delete req.body.customer_id;
      delete req.body.customer_email;

      let data = "";
      Object.entries(req.body).forEach(([key, value]) => {
        if (!value) return;
        if (data) {
          data += `, ${key} = '${value}'`;
        } else data += `${key} = '${value}'`;
      });

      const sql = `UPDATE customer_review SET ${data} WHERE id=${req.query.id}`;
      mySql.query(sql, (err, result) => {
        if (err) errorHandler(res, { message: err.sqlMessage });
        else {
          if (result.changedRows > 0) {
            res.send({ message: "Updated Successfull" });
          } else {
            res.send({ message: "Unable to Update, please try again" });
          }
        }
      });
    }
  });
}
