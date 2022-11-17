import joi from "joi";
import {
  bodyParser,
  deleteImage,
  errorHandler,
  getDateFromDB,
  mySql,
} from "./common";

export function getAdv(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM advertisement WHERE id=${req.query.id}`;
      getDateFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.page || 0) * req.query.limit;
      const sql = `SELECT * FROM advertisement LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM advertisement";
      getDateFromDB(res, sql, count);
    } else {
      //send all category
      const sql = "SELECT * FROM advertisement";
      getDateFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const advSchema = joi.object({
  category_id: joi.number().integer().required(),
  category_name: joi.string().required(),
  sub_category_id: joi.number().integer(),
  sub_category_name: joi.string(),
  image: joi.string().required(),
});

export async function postAdv(req, res) {
  try {
    const img = [{ name: "image", maxCount: 1 }];

    const { error } = await bodyParser(req, res, "assets", img);
    if (error || !req.files.image) {
      throw { message: "Error occured when image updlading" };
    }
    req.body.image = req.files.image[0].filename;

    //api validateion;
    const varify = advSchema.validate(req.body);
    if (varify.error) {
      deleteImage(req.body.image);
      errorHandler(res, { message: varify.error.message });
      return;
    }

    const sql = "INSERT INTO advertisement SET ?";
    mySql.query(sql, req.body, (err, result) => {
      if (err) throw { message: err.sqlMessage };
      else {
        if (result.insertId > 0) {
          res.send({ message: "Banner Added Successfully" });
        } else {
          res.send({ message: "Unable to Added, please try again" });
        }
      }
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

export function deleteAdv(req, res) {
  try {
    const sql = `DELETE FROM advertisement WHERE id=${req.query.id}`;
    mySql.query(sql, (err) => {
      if (err) throw { message: err.sqlMessage };
      deleteImage(req.query.image);
      res.send({ message: "Deleted successfully" });
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateAdv(req, res) {
  try {
    const img = [{ name: "image", maxCount: 1 }];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error) throw { message: "Error occured when image updlading" };

    let exist;
    if (req.files.image) {
      req.body.image = req.files.image[0].filename;
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

    const sql = `UPDATE advertisement SET ${data} WHERE id=${req.query.id}`;
    mySql.query(sql, (err, result) => {
      if (err) throw { message: err.sqlMessage };
      else {
        if (result.changedRows > 0) {
          if (exist) {
            deleteImage(exist);
          }
          res.send({ message: "Slider Updated Successfully" });
        } else {
          res.send({ message: "Unable to Update, please try again" });
        }
      }
    });
  } catch (error) {
    errorHandler(res, error);
  }
}
