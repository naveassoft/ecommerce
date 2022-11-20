import { errorHandler, getDateFromDB, mySql, varifyOwner } from "./common";

export function getFooterPages(req, res) {
  try {
    if (req.query.name) {
      //send single category;
      const sql = `SELECT * FROM footer_pages WHERE name = '${req.query.name}'`;
      getDateFromDB(res, sql);
    } else {
      //send all category
      const sql = "SELECT * FROM footer_pages";
      getDateFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateFooterPages(req, res) {
  try {
    if (!req.body.user_id) {
      return errorHandler(res, { message: "Forbiden", status: 403 });
    }
    varifyOwner(res, req.body.user_id, () => {
      delete req.body.user_id;
      const data = `description = '${req.body.description}'`;
      const sql = `UPDATE footer_pages SET ${data} WHERE name='${req.query.name}'`;
      mySql.query(sql, (err, result) => {
        if (err) {
          res
            .status(500)
            .send({ message: "Unable to Update, please try again" });
        } else {
          if (result.changedRows > 0) {
            res.send({ message: `${req.query.name} Updated Successfully` });
          } else {
            res.send({ message: "No Update found" });
          }
        }
      });
    });
  } catch (error) {
    errorHandler(res, error);
  }
}
