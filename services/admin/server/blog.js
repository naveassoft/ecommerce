import Joi from "joi";
import { errorHandler, getDateFromDB, mySql, varifyUser } from "./common";

export function getBlog(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM blog WHERE id=${req.query.id}`;
      getDateFromDB(res, sql);
    } else {
      // send category for home category page;
      const limit = req.query.limit || 10;
      const page = parseInt(req.query.page || 0) * limit;
      let sql = "";
      let count = "";
      if (req.query.user_type === "vendor") {
        sql = `SELECT * FROM blog WHERE user_id = '${req.query.user_id}' AND user_type = '${req.query.user_type}' LIMIT ${page}, ${limit}`;
        count = `SELECT COUNT(id) FROM blog WHERE user_id = '${req.query.user_id}' AND user_type = '${req.query.user_type}'`;
      } else {
        sql = `SELECT * FROM blog LIMIT ${page}, ${limit}`;
        count = "SELECT COUNT(id) FROM blog";
      }
      getDateFromDB(res, sql, count);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const FaqSchema = Joi.object({
  title: Joi.string().max(400).required(),
  body: Joi.string().max(600).required(),
  user_id: Joi.number().integer().required(),
  user_type: Joi.string().required(),
  created_at: Joi.date().required(),
  category_id: Joi.number().integer().required(),
  category_name: Joi.string().required(),
  sub_category_id: Joi.number().integer(),
  sub_category_name: Joi.string(),
  pro_sub_id: Joi.number().integer(),
  pro_sub_name: Joi.string(),
});

export async function postBlog(req, res) {
  try {
    if (!req.body.user_id) {
      return errorHandler(res, { message: "Forbiden", status: 403 });
    }

    varifyUser(res, req.body.user_id, req.body.user_type, () => {
      req.body.created_at = new Date();
      //api validateion;
      const varify = FaqSchema.validate(req.body);
      if (varify.error) {
        errorHandler(res, { message: varify.error.message });
        return;
      }
      const sql = "INSERT INTO blog SET ?";
      mySql.query(sql, req.body, (err, result) => {
        if (err) return errorHandler(res, { message: err.sqlMessage });
        else {
          if (result.insertId > 0) {
            res.send({ message: "Blog Added Successfully" });
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

export function deleteBlog(req, res) {
  try {
    if (!req.body.user_id && !req.body.user_type) {
      return errorHandler(res, { message: "Forbiden", status: 403 });
    }
    varifyUser(res, req.body.user_id, req.body.user_type, () => {
      const sql = `DELETE FROM blog WHERE id=${req.body.id}`;
      mySql.query(sql, (err) => {
        if (err) return errorHandler(res, { message: err.sqlMessage });
        res.send({ message: "Deleted successfully" });
      });
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateBlog(req, res) {
  try {
    if (!req.body.user_id && !req.body.user_type) {
      return errorHandler(res, { message: "Forbiden", status: 403 });
    }

    varifyUser(res, req.body.user_id, req.body.user_type, () => {
      let data = "";
      Object.entries(req.body).forEach(([key, value]) => {
        if (!value) return;
        if (data) {
          data += `, ${key} = '${value}'`;
        } else data += `${key} = '${value}'`;
      });

      const sql = `UPDATE blog SET ${data} WHERE id=${req.query.id}`;
      mySql.query(sql, (err, result) => {
        if (err) return errorHandler(res, { message: err.sqlMessage });
        else {
          if (result.changedRows > 0) {
            res.send({ message: "Blog Updated Successfully" });
          } else {
            res.send({ message: "Unable to Update, please try again" });
          }
        }
      });
    });
  } catch (error) {
    errorHandler(res, error);
  }
}
