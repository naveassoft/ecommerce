import { errorHandler, getDateFromDB, mySql } from "./common";

export function getFaq(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM faq WHERE id=${req.query.id}`;
      getDateFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.page || 0) * req.query.limit;
      const sql = `SELECT * FROM faq LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM faq";
      getDateFromDB(res, sql, count);
    } else {
      //send all category
      const sql = "SELECT * FROM faq";
      getDateFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function postFaq(req, res) {
  try {
    const sql = "INSERT INTO faq SET ?";
    mySql.query(sql, req.body, (err, result) => {
      if (err) throw err;
      else {
        if (result.insertId > 0) {
          res.send({ message: "Faq Added Successfully" });
        } else {
          res.send({ message: "Unable to Added, please try again" });
        }
      }
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

export function deleteFaq(req, res) {
  try {
    const sql = `DELETE FROM faq WHERE id=${req.query.id}`;
    mySql.query(sql, (err) => {
      if (err) throw err;
      res.send({ message: "Deleted successfully" });
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateFaq(req, res) {
  try {
    let data = "";
    Object.entries(req.body).forEach(([key, value]) => {
      if (!value) return;
      if (data) {
        data += `, ${key} = '${value}'`;
      } else data += `${key} = '${value}'`;
    });

    const sql = `UPDATE faq SET ${data} WHERE id=${req.query.id}`;
    mySql.query(sql, (err, result) => {
      if (err) throw err;
      else {
        if (result.changedRows > 0) {
          res.send({ message: "Faq Updated Successfully" });
        } else {
          res.send({ message: "Unable to Update, please try again" });
        }
      }
    });
  } catch (error) {
    errorHandler(res, error);
  }
}
