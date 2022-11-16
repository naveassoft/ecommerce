import {
  bodyParser,
  deleteImage,
  errorHandler,
  getDateFromDB,
  mySql,
} from "./common";

export function getCategory(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM category WHERE id=${req.query.id}`;
      getDateFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.page || 0) * req.query.limit;
      const sql = `SELECT * FROM category ORDER BY priority LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM category";
      getDateFromDB(res, sql, count);
    } else {
      //send all category
      const sql = "SELECT * FROM category ORDER BY priority";
      getDateFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function postCategory(req, res) {
  try {
    const img = [{ name: "image", maxCount: 1 }];

    const { error } = await bodyParser(req, res, "assets", img);
    if (error || !req.files.image) {
      throw { message: "Error occured when image updlading" };
    }

    req.body.priority = parseInt(req.body.priority);
    req.body.image = req.files.image[0].filename;
    const sql = "INSERT INTO category SET ?";
    mySql.query(sql, req.body, (err, result) => {
      if (err) throw err;
      else {
        if (result.insertId > 0) {
          res.send({ message: "Category Added Successfully" });
        } else {
          res.send({ message: "Unable to Added, please try again" });
        }
      }
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

export function deleteCategory(req, res) {
  //delete category;
  const categoryQuery = `DELETE FROM category WHERE id=${req.query.id}`;
  mySql.query(categoryQuery, (err) => {
    if (err) return errorHandler(res, { message: err.sqlMessage });
    deleteImage(req.query.image);

    //find sub category under this categroy;
    const subgettingq = `SELECT id, image FROM sub_category WHERE category_id=${req.query.id}`;
    mySql.query(subgettingq, (err, result) => {
      if (err) console.log(err);
      const subId = [],
        imges = [];
      if (result.length) {
        result.forEach((item) => {
          subId.push(item.id);
          imges.push(item.image);
        });
      }
      if (subId.length) {
        //delete sub category under this category;
        const subyQuery = `DELETE FROM sub_category WHERE category_id=${req.query.id}`;
        mySql.query(subyQuery, (err) => {
          if (err) {
            return errorHandler(res, { message: "Cannot delete sub category" });
          }
          imges.forEach((img) => deleteImage(img));
          // delete pro sub category under those sub category;
          const prosub = `DELETE FROM pro_sub_category WHERE sub_category_id IN(${subId.join(
            ","
          )})`;
          mySql.query(prosub, (err, result) => {
            if (err)
              return errorHandler(res, {
                message: "Cannot delete pro sub category",
              });
            res.send({ message: "Deleted successfully" });
          }); //till;
        });
      }
    });
  });
}

export async function updatetCategory(req, res) {
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

    const sql = `UPDATE category SET ${data} WHERE id=${req.query.id}`;
    mySql.query(sql, (err, result) => {
      if (err) throw err;
      else {
        console.log(result);
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
