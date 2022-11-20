import Joi from "joi";
import {
  bodyParser,
  deleteImage,
  errorHandler,
  getDateFromDB,
  mySql,
  varifyUser,
} from "./common";

//get common function;
function sendSpecifiqData(req, res, name, query) {
  const limit = req.query.limit || 10;
  const page = parseInt(req.query.page || 0) * limit;
  let sql = "";
  if (name && query) {
    sql = `SELECT * FROM product WHERE ${name} = '${query}' ORDER BY created_at DESC LIMIT ${page}, ${limit}`;
  } else {
    sql = `SELECT * FROM product ORDER BY created_at DESC LIMIT ${page}, ${limit}`;
  }
  const count = "SELECT COUNT(id) FROM product";
  getDateFromDB(res, sql, count);
}

export function getProduct(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM product WHERE id=${req.query.id}`;
      getDateFromDB(res, sql);
    } else if (req.query.category) {
      //send all category product
      const limit = req.query.limit || 10;
      const page = parseInt(req.query.page || 0) * limit;
      const sql = `SELECT * FROM product WHERE category_id = '${req.query.category}' ORDER BY created_at DESC LIMIT ${page}, ${limit}`;
      const count = "SELECT COUNT(id) FROM product";
      getDateFromDB(res, sql, count);
    } else if (req.query.subCategory) {
      //send all  sub category product
      sendSpecifiqData(req, res, "sub_category_id", req.query.subCategory);
    } else if (req.query.proSubCategory) {
      //send all category product
      sendSpecifiqData(req, res, "pro_sub_id", req.query.proSubCategory);
    } else {
      //send all product
      sendSpecifiqData(req, res);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const ProductSchema = Joi.object({
  created_by: Joi.number().integer().required(),
  created_at: Joi.date().required(),
  name: Joi.string().required(),
  brand: Joi.string().required(),
  sku: Joi.string().required(),
  price: Joi.number().required(),
  prev_price: Joi.number(),
  tax: Joi.number(),
  stock: Joi.number().required(),
  keyword: Joi.string().required(),
  category_id: Joi.number().integer().required(),
  category_name: Joi.string().required(),
  sub_category_id: Joi.number().integer(),
  sub_category_name: Joi.string(),
  pro_sub_id: Joi.number().integer(),
  pro_sub_name: Joi.string(),
  short_description: Joi.string().required(),
  description: Joi.string().required(),
  main_image: Joi.string().required(),
  features_img: Joi.string().required(),
  type: Joi.string().valid("single", "package").required(),
  colour: Joi.string(),
  size: Joi.string(),
  unit: Joi.string().valid("piece", "kg"),
});

export async function postProduct(req, res) {
  try {
    const img = [
      { name: "main_image", maxCount: 1 },
      { name: "features_img", maxCount: 5 },
    ];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error || !req.files.main_image || !req.files.features_img) {
      return resError(req, res, "Error occured when image updlading");
    }
    if (!req.body.user_id) {
      return errorHandler(res, { message: "Forbiden", status: 403 });
    }
    varifyUser(res, req.body.user_id, () => {
      delete req.body.user_id;
      req.body.created_at = new Date();
      req.body.main_image = req.files.main_image[0].filename;
      const features_img = [];
      req.files.features_img.forEach((img) => {
        features_img.push(img.filename);
      });
      req.body.features_img = JSON.stringify(features_img);

      //api validateion;
      const varify = ProductSchema.validate(req.body);
      if (varify.error) return resError(req, res, varify.error.message);

      //check sku is exist;
      const query = `SELECT * FROM product WHERE sku = '${req.body.sku}'`;
      mySql.query(query, (err, result) => {
        if (err) return resError(req, res, err.sqlMessage);
        else if (result.length) {
          return resError(
            req,
            res,
            "Already this SKU added, try with different SKU"
          );
        } else {
          //procced to uploading product;
          const sql = "INSERT INTO product SET ?";
          mySql.query(sql, req.body, (err, result) => {
            if (err) return resError(req, res, err.sqlMessage);
            else {
              if (result.insertId > 0) {
                res.send({ message: "Product Added Successfully" });
              } else {
                res.send({ message: "Unable to Added, please try again" });
              }
            }
          });
        }
      });
    });
  } catch (error) {
    resError(req, res, error.message);
  }
}

export async function deleteProduct(req, res) {
  try {
    const { error } = await bodyParser(req, res, "", []);
    if (error) {
      return resError(req, res, "Error occured when parsing body");
    }
    if (!req.body.user_id) {
      return errorHandler(res, { message: "Forbiden", status: 403 });
    }
    varifyUser(res, req.body.user_id, () => {
      const sql = `DELETE FROM product WHERE id=${req.body.id}`;
      mySql.query(sql, (err) => {
        if (err) {
          errorHandler(res, { message: err.sqlMessage });
        } else {
          JSON.parse(req.body.image).forEach((img) => {
            deleteImage(img);
          });
          res.send({ message: "Deleted successfully" });
        }
      });
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateProduct(req, res) {
  try {
    const img = [
      { name: "main_image", maxCount: 1 },
      { name: "features_img", maxCount: 5 },
    ];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error) {
      return errorHandler(res, {
        message: "Error occured when image updlading",
      });
    }
    if (!req.body.user_id) {
      return errorHandler(res, { message: "Forbiden", status: 403 });
    }

    varifyUser(res, req.body.user_id, () => {
      delete req.body.user_id;

      if (Object.keys(req.body).length < 2) {
        return res.status(404).send({ message: "No updated feild found" });
      }

      if (req.files.main_image) {
        req.body.main_image = req.files.main_image[0].filename;
      }
      if (req.files.features_img) {
        const features_img = [];
        req.files.features_img.forEach((img) => {
          features_img.push(img.filename);
        });
        req.body.features_img = JSON.stringify(features_img);
      }

      let deleteImg;
      if (req.body.deleteImage) {
        deleteImg = JSON.parse(req.body.deleteImage);
        delete req.body.deleteImage;
      }

      let data = "";
      Object.entries(req.body).forEach(([key, value]) => {
        if (value) {
          if (data) {
            data += `, ${key} = '${value}'`;
          } else data += `${key} = '${value}'`;
        }
      });
      const sql = `UPDATE product SET ${data} WHERE id=${req.query.id}`;
      mySql.query(sql, (err, result) => {
        if (err) {
          //if err occured;
          if (req.files.main_image) {
            deleteImage(req.files.main_image[0].filename);
          }
          if (req.files.features_img) {
            req.files.features_img.forEach((img) => {
              deleteImage(img.filename);
            });
          }
          return errorHandler(res, {
            message: err.sqlMessage,
          }); //till;
        } else {
          if (result.changedRows > 0) {
            if (deleteImg) {
              deleteImg.forEach((img) => {
                deleteImage(img);
              });
            }
            res.send({ message: "Product Updated Successfully" });
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

function resError(req, res, message) {
  deleteImage(req.files.main_image[0].filename);
  req.files.features_img.forEach((img) => {
    deleteImage(img.filename);
  });
  errorHandler(res, { message });
}
