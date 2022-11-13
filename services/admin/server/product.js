import {
  bodyParser,
  deleteImage,
  errorHandler,
  getDateFromDB,
  mySql,
} from "./common";

export function getProduct(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM product WHERE id=${req.query.id}`;
      getDateFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.skip || 0) * req.query.limit;
      const sql = `SELECT * FROM product LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM product";
      getDateFromDB(res, sql, count);
    } else {
      //send all category
      const sql = "SELECT * FROM product";
      getDateFromDB(res, sql);
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
    mySql().query(query, (err, result) => {
      mySql().end();
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
        req.body.main_image = req.files.main_image[0].filename;
        const features_img = [];
        req.files.features_img.forEach((img) => {
          features_img.push(img.filename);
        });
        req.body.features_img = JSON.stringify(features_img);
        const keyword = req.body.keyword.split("|").map((item) => item.trim());
        req.body.keyword = JSON.stringify(keyword);

        const sql = "INSERT INTO product SET ?";
        mySql().query(sql, req.body, (err, result) => {
          mySql().end();
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

export async function updateProduct(req, res) {
  try {
    const img = [
      { name: "main_image", maxCount: 1 },
      { name: "features_img", maxCount: 5 },
    ];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error) throw { message: "Error occured when image updlading" };

    // let exist;
    if (req.files.main_image) {
      req.body.main_image = req.files.main_image[0].filename;
      //   exist = req.body.existimage;
      //   delete req.body.existimage;
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
    mySql().query(sql, (err, result) => {
      mySql().end();
      if (err) throw err;
      else {
        if (result.changedRows > 0) {
          if (exist) {
            deleteImage(exist);
          }
          res.send({ message: "Offer Updated Successfully" });
        } else {
          res.send({ message: "Unable to Update, please try again" });
        }
      }
    });
  } catch (error) {
    errorHandler(res, error);
  }
}
