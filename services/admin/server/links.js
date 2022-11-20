import {
  bodyParser,
  deleteImage,
  errorHandler,
  getDateFromDB,
  mySql,
  varifyOwner,
} from "./common";

export function getLinks(req, res) {
  try {
    const sql = "SELECT * FROM important_links";
    getDateFromDB(res, sql);
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateLinks(req, res) {
  try {
    const img = [{ name: "logo", maxCount: 1 }];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error) {
      return errorHandler(res, { message: "Error occured when parsing body" });
    }
    const document = JSON.parse(req.body.document);
    if (!req.body.user_id) {
      return errorHandler(res, { message: "Forbiden", status: 403 });
    }

    varifyOwner(res, req.body.user_id, () => {
      delete req.body.user_id;
      let exist;
      if (req.files.logo) {
        document.push({ name: "logo", info: req.files.logo[0].filename });
        exist = req.body.exist;
      }

      document.forEach((item) => {
        const sql = `UPDATE important_links SET info = "${item.info}" WHERE name = "${item.name}"`;
        mySql.query(sql, (err) => {
          if (err) {
            return res.status(500).send({ message: "There was an error" });
          }
        });
      });
      if (exist) deleteImage(exist);
      res.send({ message: "Updated successfully" });
    });
  } catch (error) {
    errorHandler(res, error);
  }
}
