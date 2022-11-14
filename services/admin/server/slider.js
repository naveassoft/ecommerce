import {
  bodyParser,
  deleteImage,
  errorHandler,
  getDateFromDB,
  mySql,
} from "./common";

export function getSlider(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM slider WHERE id=${req.query.id}`;
      getDateFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.page || 0) * req.query.limit;
      const sql = `SELECT * FROM slider LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM slider";
      getDateFromDB(res, sql, count);
    } else {
      //send all category
      const sql = "SELECT * FROM slider";
      getDateFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function postSlider(req, res) {
  try {
    const img = [{ name: "image", maxCount: 1 }];

    const { error } = await bodyParser(req, res, "assets", img);
    if (error || !req.files.image) {
      throw { message: "Error occured when image updlading" };
    }

    req.body.image = req.files.image[0].filename;
    const sql = "INSERT INTO slider SET ?";
    mySql.query(sql, req.body, (err, result) => {
      if (err) throw err;
      else {
        if (result.insertId > 0) {
          res.send({ message: "Slider Added Successfully" });
        } else {
          res.send({ message: "Unable to Added, please try again" });
        }
      }
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

export function deleteSlider(req, res) {
  try {
    const sql = `DELETE FROM slider WHERE id=${req.query.id}`;
    mySql.query(sql, (err) => {
      if (err) throw err;
      deleteImage(req.query.image);
      res.send({ message: "Deleted successfully" });
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateSlider(req, res) {
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

    const sql = `UPDATE slider SET ${data} WHERE id=${req.query.id}`;
    mySql.query(sql, (err, result) => {
      if (err) throw err;
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
