import { errorHandler, mySql } from "./common";
import bcrypt from "bcrypt";
import jwt from "jwt";

export function loginUser(req, res) {
  const sql = `SELECT * FROM user WHERE email = '${req.body.email}'`;
  mySql.query(sql, async (err, result) => {
    if (err) {
      return errorHandler(res, { message: "There was an error" });
    }
    if (!result.length) {
      return errorHandler(res, { message: "No user found", status: 404 });
    }
    const isRightPassword = await bcrypt.compare(
      req.body.password,
      result[0].password
    );
    if (!isRightPassword) {
      return errorHandler(res, {
        message: "Username or password incorrect",
        status: 401,
      });
    } else {
      delete result[0].password;

      res.send(result[0]);
    }
  });
}
