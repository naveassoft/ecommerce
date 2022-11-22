import bcrypt from "bcrypt";
import Joi from "joi";
import {
  bodyParser,
  deleteImage,
  errorHandler,
  getDateFromDB,
  mySql,
  varifyOwner,
} from "./common";

export function getUser(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM user WHERE id=${req.query.id}`;
      getDateFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.page || 0) * req.query.limit;
      const sql = `SELECT * FROM user LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM user";
      getDateFromDB(res, sql, count);
    } else if (req.query.filter) {
      const sql = `SELECT * FROM user WHERE user_role = '${req.query.filter}'`;
      getDateFromDB(res, sql);
    } else {
      //send all category
      const sql = "SELECT * FROM user";
      getDateFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const UserSchema = Joi.object({
  name: Joi.string().max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  user_role: Joi.string().valid("uploader", "owner").required(),
  profile: Joi.string(),
});

export async function postUser(req, res) {
  try {
    const img = [{ name: "profile", maxCount: 1 }];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error) {
      return errorHandler(res, { message: "Error occured when parsing body" });
    }
    if (!req.body.user_id) {
      if (req.files.profile) {
        deleteImage(req.files.profile[0].filename);
      }
      return errorHandler(res, { message: "Forbiden", status: 403 });
    }
    varifyOwner(
      res,
      req.body.user_id,
      () => {
        delete req.body.user_id;
        //api validateion;
        const varify = UserSchema.validate(req.body);
        if (varify.error) {
          errorHandler(res, { message: varify.error.message });
          return;
        }
        //check is user exist;
        const query = `SELECT * FROM user WHERE email='${req.body.email}'`;
        mySql.query(query, async (err, result) => {
          if (err) {
            errorHandler(res, { message: err.sqlMessage });
          } else {
            if (result.length) {
              //there is an user exist;
              if (req.files.profile) {
                deleteImage(req.files.profile[0].filename);
              }
              return res.status(401).send({ message: "User already exist" });
            } else {
              //no user, you procced;
              //hased password;
              const hashed = await bcrypt.hash(req.body.password, 10);
              req.body.password = hashed;
              if (req.files.profile) {
                req.body.profile = req.files.profile[0].filename;
              } else delete req.body.profile;
              req.body.joined_at = new Date();

              //save to db;
              const sql = "INSERT INTO user SET ?";
              mySql.query(sql, req.body, (err, result) => {
                if (err) {
                  if (req.files.profile) {
                    deleteImage(req.files.profile[0].filename);
                  }
                  return errorHandler(res, { message: err.sqlMessage });
                } else {
                  if (result.insertId > 0) {
                    res.send({ message: "User Added Successfully" });
                  } else {
                    res.send({ message: "Unable to Added, please try again" });
                  }
                }
              });
            }
          }
        });
      },
      req.files.profile ? req.files.profile[0].filename : ""
    );
  } catch (error) {
    if (req.files.profile) {
      deleteImage(req.files.profile[0].filename);
    }
    errorHandler(res, error);
  }
}

export async function deleteUser(req, res) {
  try {
    const { error } = await bodyParser(req, res, "", []);
    if (error) {
      return errorHandler(res, { message: "Error occured when parsing body" });
    }
    if (!req.body.user_id) {
      return errorHandler(res, { message: "Forbiden", status: 403 });
    }
    varifyOwner(res, req.body.user_id, () => {
      const sql = `DELETE FROM user WHERE id=${req.body.id}`;
      mySql.query(sql, (err) => {
        if (err) return errorHandler(res, { message: err.sqlMessage });
        if (req.body.image) {
          deleteImage(req.body.image);
        }
        res.send({ message: "Deleted successfully" });
      });
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateUser(req, res) {
  try {
    const img = [{ name: "profile", maxCount: 1 }];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error) {
      return errorHandler(res, { message: "Error occured when parsing body" });
    }
    if (!req.body.user_id) {
      return errorHandler(res, { message: "Forbiden", status: 403 });
    }

    varifyOwner(res, req.body.user_id, async () => {
      delete req.body.user_id;
      if (req.body.password) {
        const hashed = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashed;
      }
      let data = "";
      Object.entries(req.body).forEach(([key, value]) => {
        if (data) {
          data += `, ${key} = '${value}'`;
        } else data += `${key} = '${value}'`;
      });

      const sql = `UPDATE user SET ${data} WHERE id=${req.query.id}`;
      mySql.query(sql, (err, result) => {
        if (err) return errorHandler(res, { message: err.sqlMessage });
        else {
          if (result.changedRows > 0) {
            res.send({ message: "User Updated Successfully" });
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
