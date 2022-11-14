import {
  bodyParser,
  deleteImage,
  errorHandler,
  getDateFromDB,
  mySql,
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

export async function postProduct(req, res) {
  try {
    const img = [
      { name: "main_image", maxCount: 1 },
      { name: "features_img", maxCount: 5 },
    ];

    const { error } = await bodyParser(req, res, "assets", img);
    if (error || !req.files.main_image || !req.files.features_img) {
      throw { message: "Error occured when image updlading" };
    }

    //check sku is exist;
    const query = `SELECT * FROM product WHERE sku = '${req.body.sku}'`;
    mySql.query(query, (err, result) => {
      if (err) {
        //if err occured;
        deleteImage(req.files.main_image[0].filename);
        req.files.features_img.forEach((img) => {
          deleteImage(img.filename);
        });
        return errorHandler(res, {
          message: err.sqlMessage,
        }); //till;
      } else if (result.length) {
        //if product already exist;
        deleteImage(req.files.main_image[0].filename);
        req.files.features_img.forEach((img) => {
          deleteImage(img.filename);
        });
        return errorHandler(res, {
          message: "Already This SKU added, Try with different SKU",
        }); //till;
      } else {
        //procced to uploading product;
        req.body.created_at = new Date();
        req.body.main_image = req.files.main_image[0].filename;
        const features_img = [];
        req.files.features_img.forEach((img) => {
          features_img.push(img.filename);
        });
        req.body.features_img = JSON.stringify(features_img);

        const sql = "INSERT INTO product SET ?";
        mySql.query(sql, req.body, (err, result) => {
          if (err) return errorHandler(res, { message: err.sqlMessage });
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
  } catch (error) {
    errorHandler(res, error);
  }
}

export function deleteProduct(req, res) {
  try {
    const sql = `DELETE FROM product WHERE id=${req.query.id}`;
    mySql.query(sql, (err) => {
      if (err) {
        errorHandler(res, { message: err.sqlMessage });
      } else {
        req.query.image.split(",").forEach((img) => {
          deleteImage(img);
        });
        res.send({ message: "Deleted successfully" });
      }
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
    if (error) throw { message: "Error occured when image updlading" };

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
        console.log(err);
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
  } catch (error) {
    errorHandler(res, error);
  }
}
