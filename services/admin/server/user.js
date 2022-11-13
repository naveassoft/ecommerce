import bcrypt from "bcrypt";
import {
  bodyParser,
  deleteImage,
  errorHandler,
  getDateFromDB,
  mySql,
} from "./common";

export function getUser(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM user WHERE id=${req.query.id}`;
      getDateFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.skip || 0) * req.query.limit;
      const sql = `SELECT * FROM user LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM user";
      getDateFromDB(res, sql, count);
    } else {
      //send all category
      const sql = "SELECT * FROM user";
      getDateFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function postUser(req, res) {
  try {
    const img = [{ name: "profile", maxCount: 1 }];

    const { error } = await bodyParser(req, res, "assets", img);
    if (error) {
      throw { message: error.message || "Error occured when image updlading" };
    }
    const hashed = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashed;
    if (req.files.profile) {
      req.body.profile = req.files.profile[0].filename;
    } else delete req.body.profile;

    const sql = "INSERT INTO user SET ?";
    mySql().query(sql, req.body, (err, result) => {
      mySql().end();
      if (err) throw err;
      else {
        if (result.insertId > 0) {
          res.send({ message: "User Added Successfully" });
        } else {
          res.send({ message: "Unable to Added, please try again" });
        }
      }
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

export function deleteUser(req, res) {
  try {
    const sql = `DELETE FROM user WHERE id=${req.query.id}`;
    mySql().query(sql, (err) => {
      mySql().end();
      if (err) throw err;
      deleteImage(req.query.image);
      res.send({ message: "Deleted successfully" });
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateUser(req, res) {
  try {
    const img = [{ name: "profile", maxCount: 1 }];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error) throw { message: "Error occured when image updlading" };

    let exist;
    if (req.files.profile) {
      req.body.profile = req.files.profile[0].filename;
      exist = req.body.existimage;
      delete req.body.existimage;
    }
    let data = "";
    Object.entries(req.body).forEach(([key, value]) => {
      if (value) {
        if (data) {
          data += `, ${key} = '${value}'`;
        } else data += `${key} = '${value}'`;
      }
    });

    const sql = `UPDATE user SET ${data} WHERE id=${req.query.id}`;
    mySql().query(sql, (err, result) => {
      mySql().end();
      if (err) throw err;
      else {
        if (result.changedRows > 0) {
          if (exist) {
            deleteImage(exist);
          }
          res.send({ message: "Category Updated Successfully" });
        } else {
          res.send({ message: "Unable to Update, please try again" });
        }
      }
    });
  } catch (error) {
    errorHandler(res, error);
  }
}
