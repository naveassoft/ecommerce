import Joi from "joi";
import {
  bodyParser,
  deleteImage,
  errorHandler,
  getDateFromDB,
  mySql,
  varifyOwner,
} from "./common";

export function getBrand(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM brand WHERE id=${req.query.id}`;
      getDateFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.page || 0) * req.query.limit;
      const sql = `SELECT * FROM brand LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM brand";
      getDateFromDB(res, sql, count);
    } else {
      //send all category
      const sql = "SELECT * FROM brand";
      getDateFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const brandSchema = Joi.object({
  name: Joi.string().required(),
  category_id: Joi.number().integer().required(),
  category_name: Joi.string().required(),
  image: Joi.string().required(),
});

export async function postBrand(req, res) {
  try {
    const img = [{ name: "image", maxCount: 1 }];

    const { error } = await bodyParser(req, res, "assets", img);
    if (error || !req.files.image) {
      return errorHandler(res, {
        message: "Error occured when image updlading",
      });
    }
    req.body.image = req.files.image[0].filename;
    if (!req.body.user_id) {
      deleteImage(req.body.image);
      return errorHandler(res, { message: "Forbiden", status: 403 });
    }

    function post() {
      delete req.body.user_id;
      //api validateion;
      const varify = brandSchema.validate(req.body);
      if (varify.error) {
        deleteImage(req.body.image);
        errorHandler(res, { message: varify.error.message });
        return;
      }

      const sql = "INSERT INTO brand SET ?";
      mySql.query(sql, req.body, (err, result) => {
        if (err) {
          deleteImage(req.body.image);
          return errorHandler(res, { message: err.sqlMessage });
        } else {
          if (result.insertId > 0) {
            res.send({ message: "Brand Added Successfully" });
          } else {
            res.send({ message: "Unable to Added, please try again" });
          }
        }
      });
    }
    varifyOwner(res, req.body.user_id, post, req.body.image);
  } catch (error) {
    deleteImage(req.body.image);
    errorHandler(res, error);
  }
}

export async function deleteBrand(req, res) {
  try {
    const { error } = await bodyParser(req, res, "", []);
    if (error) {
      return errorHandler(res, {
        message: "Error occured when parsing body",
      });
    }
    if (!req.body.user_id) {
      return errorHandler(res, { message: "Forbiden", status: 403 });
    }
    varifyOwner(res, req.body.user_id, () => {
      const sql = `DELETE FROM brand WHERE id=${req.body.id}`;
      mySql.query(sql, (err) => {
        if (err) return errorHandler(res, { message: err.sqlMessage });
        deleteImage(req.body.image);
        res.send({ message: "Deleted successfully" });
      });
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updatetCategory(req, res) {
  try {
    const img = [{ name: "image", maxCount: 1 }];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error) {
      return errorHandler(res, {
        message: "Error occured when image updlading",
      });
    }

    if (!req.body.user_id) {
      return errorHandler(res, { message: "Forbiden", status: 403 });
    }

    varifyOwner(res, req.body.user_id, () => {
      delete req.body.user_id;
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

      const sql = `UPDATE brand SET ${data} WHERE id=${req.query.id}`;
      mySql.query(sql, (err, result) => {
        if (err) errorHandler(res, { message: err.sqlMessage });
        else {
          if (result.changedRows > 0) {
            if (exist) {
              deleteImage(exist);
            }
            res.send({ message: "Brand Updated Successfully" });
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
