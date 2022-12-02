import Joi from "joi";
import { postDocument, queryDocument } from "../mysql";
import {
  bodyParser,
  deleteImage,
  errorHandler,
  getDataFromDB,
  varifyOwner,
} from "./common";

export function getBrand(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM brand WHERE id=${req.query.id}`;
      getDataFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.page || 0) * req.query.limit;
      const sql = `SELECT * FROM brand LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM brand";
      getDataFromDB(res, sql, count);
    } else {
      //send all category
      const sql = "SELECT * FROM brand";
      getDataFromDB(res, sql);
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
      throw { message: "Error occured when image updlading" };
    }
    await varifyOwner(req.body.user_id);

    req.body.image = req.files.image[0].filename;
    delete req.body.user_id;
    //api validateion;
    const varify = brandSchema.validate(req.body);
    if (varify.error) throw { message: varify.error.message };

    const sql = "INSERT INTO brand SET ";
    const result = await postDocument(sql, req.body);
    if (result.insertId > 0) {
      res.send({ message: "Brand Added Successfully" });
    } else throw { message: "Unable to Added" };
  } catch (error) {
    deleteImage(req.body.image);
    errorHandler(res, error);
  }
}

export async function deleteBrand(req, res) {
  try {
    const { error } = await bodyParser(req, res, "", []);
    if (error) {
      throw { message: "Error occured when parsing body" };
    }
    await varifyOwner(req.body.user_id);
    const sql = `DELETE FROM brand WHERE id=${req.body.id}`;
    const result = await queryDocument(sql);
    if (result.affectedRows > 0) {
      deleteImage(req.body.image);
      res.send({ message: "Deleted successfully" });
    } else throw { message: "unable to delete" };
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updatetCategory(req, res) {
  try {
    const img = [{ name: "image", maxCount: 1 }];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error) {
      throw { message: "Error occured when image updlading" };
    }
    await varifyOwner(req.body.user_id);
    delete req.body.user_id;
    let exist;
    if (req.files.image) {
      req.body.image = req.files.image[0].filename;
      exist = req.body.existimage;
      delete req.body.existimage;
    }
    const sql = `UPDATE brand SET `;
    const option = `WHERE id=${req.query.id}`;
    const result = await postDocument(sql, req.body, option);
    if (result.changedRows > 0) {
      if (exist) {
        deleteImage(exist);
      }
      res.send({ message: "Brand Updated Successfully" });
    } else throw { message: "Unable to Update" };
  } catch (error) {
    if (req.body.image) deleteImage(req.body.image);
    errorHandler(res, error);
  }
}
