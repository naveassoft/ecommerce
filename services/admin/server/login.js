import {
  errorHandler,
  forgotMailOpt,
  mailer,
  mySql,
  varifyEmailOpt,
} from "./common";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function getUser(req, res) {
  try {
    //send email for forget password;
    if (req.query.forgotPassword) {
      sendForgotPasswordLink(req, res);
    } else if (req.query.varifypasswordToken) {
      varifypasswordToken(req, res);
    }
    //varify email;
    else if (req.query.varifyEmail) {
      varifyEmail(req, res);
    }
    //check token in every request;
    else {
      if (!req.query.token) {
        return errorHandler(res, {
          message: "Unauthenticated",
          status: 401,
        });
      }
      const varify = jwt.verify(req.query.token, process.env.JWT_SECRET);
      delete varify.iat;
      delete varify.exp;
      const token = jwt.sign(varify, process.env.JWT_SECRET, {
        expiresIn: `${varify.user_role !== "customer" ? "3d" : "5h"}`,
      });
      res.send({ user: varify, token });
    }
  } catch (error) {
    return errorHandler(res, error);
  }
}

export function loginUser(req, res) {
  try {
    //social media login;
    if (req.query.socialLogin) {
      const sql = `SELECT * FROM user WHERE email = '${req.body.email}'`;
      mySql.query(sql, async (err, result) => {
        if (err) {
          return errorHandler(res, { message: "There was an error" });
        }
        if (!result.length) {
          if (process.env.NEXT_PUBLIC_APP_PASSWORD !== req.body.password) {
            return errorHandler(res, { message: "Forbiden", status: 403 });
          }
          const hashed = await bcrypt.hash(req.body.password, 10);
          req.body.password = hashed;
          const sql = "INSERT INTO user ?";
          mySql.query(sql, req.body, (err, result) => {
            if (err) return errorHandler(res, { message: err.sqlMessage });
            delete result[0].password;
            const token = jwt.sign({ ...result[0] }, process.env.JWT_SECRET, {
              expiresIn: "3d",
            });
            res.send({ user: result[0], token });
          });
        } else {
          const sql = `SELECT * FROM user WHERE email = '${req.body.email}'`;
          mySql.query(sql, (err, result) => {
            if (err) return errorHandler(res, { message: err.sqlMessage });
            delete result[0].password;
            const token = jwt.sign({ ...result[0] }, process.env.JWT_SECRET, {
              expiresIn: `${result[0].user_role !== "customer" ? "3d" : "5h"}`,
            });
            res.send({ user: result[0], token });
          });
        }
      });
    }
    // normal email login
    else {
      const sql = `SELECT * FROM user WHERE email = '${req.body.email}'`;
      mySql.query(sql, async (err, result) => {
        if (err) {
          return errorHandler(res, { message: "There was an error" });
        }
        if (!result.length) {
          const sql = `SELECT * FROM vandor WHERE email = '${req.body.email}'`;
          mySql.query(sql, (err, result) => {
            if (err) return errorHandler(res, { message: err.sqlMessage });
            if (!result.length) {
              return errorHandler(res, {
                message: "No user found",
                status: 404,
              });
            } else {
              console.log(result);
              sendUserInfo(req, res, result);
            }
          });
        } else {
          sendUserInfo(req, res, result);
        }
      });
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

export function signUpUser(req, res) {
  try {
    //update user password;
    if (req.query.updateuser) {
      const sql = `SELECT * FROM user WHERE id = '${req.body.id}' AND email = '${req.body.email}'`;
      mySql.query(sql, async (err, result) => {
        if (err) return errorHandler(res, { message: err.sqlMessage });
        if (!result.length) {
          return errorHandler(res, { message: "There was an error" });
        }
        const hashed = await bcrypt.hash(req.body.password, 10);
        const query = `UPDATE user SET password='${hashed}' WHERE id=${req.body.id}`;
        mySql.query(query, (err, result) => {
          if (err) return errorHandler(res, { message: err.sqlMessage });
          if (result.changedRows > 0) {
            const sql = `SELECT * FROM user WHERE id = '${req.body.id}'`;
            mySql.query(sql, (err, result) => {
              if (err) {
                return errorHandler(res, {
                  message:
                    "Your profile updated successfully,Please login manually",
                });
              }
              const token = jwt.sign({ ...result[0] }, process.env.JWT_SECRET, {
                expiresIn: `${
                  result[0].user_role !== "customer" ? "3d" : "5h"
                }`,
              });
              res.send({
                message: "Your password updated successfully",
                token,
              });
            });
          } else {
            console.log(result);
            errorHandler(res, {
              message: "Unable to update, please try again",
            });
          }
        });
      });
    }
    //send email for varify eamil;
    else {
      const sql = `SELECT * FROM user WHERE email = '${req.body.email}'`;
      mySql.query(sql, async (err, result) => {
        if (err) {
          return errorHandler(res, { message: "There was an error" });
        }
        if (result.length) {
          return errorHandler(res, {
            message: "User already exist",
            status: 409,
          });
        } else {
          const token = jwt.sign(req.body, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });
          const options = varifyEmailOpt(req.body.email, token);
          const email = await mailer.sendMail(options);
          if (email.messageId) {
            res.send({ message: "An email sent to your email, please check" });
          } else throw { message: "There was an error" };
        }
      });
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

function sendForgotPasswordLink(req, res) {
  const sql = `SELECT * FROM user WHERE email = '${req.query.forgotPassword}'`;
  mySql.query(sql, async (err, result) => {
    if (err) {
      return errorHandler(res, { message: err.sqlMessage });
    }
    if (!result.length) {
      return errorHandler(res, { message: "No user found", status: 404 });
    }
    delete result[0].password;
    const token = jwt.sign({ ...result[0] }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const options = forgotMailOpt(req.query.forgotPassword, token);
    const email = await mailer.sendMail(options);
    if (email.messageId) {
      res.send({ message: "An email sent to your email, please check" });
    } else throw { message: "There was an error" };
  });
}

function varifyEmail(req, res) {
  jwt.verify(
    req.query.varifyEmail,
    process.env.JWT_SECRET,
    async (err, result) => {
      if (err) {
        return errorHandler(res, {
          message: "Varification faild",
          type: 401,
        });
      } else {
        delete result.iat;
        delete result.exp;
        const hashedPassword = await bcrypt.hash(result.password, 10);
        result.password = hashedPassword;
        const sql = "INSERT INTO user SET ?";
        mySql.query(sql, result, (err, result) => {
          if (err) return errorHandler(res, { message: err.sqlMessage });
          else {
            if (result.insertId > 0) {
              const sql = `SELECT * FROM user WHERE id = '${result.insertId}'`;
              mySql.query(sql, (err, result) => {
                if (err) {
                  return errorHandler(res, {
                    message: "Please login manually",
                  });
                }
                delete result[0].password;
                const token = jwt.sign(
                  { ...result[0] },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "3d",
                  }
                );
                res.send({ user: result[0], token });
              });
            } else {
              res.send({ message: "Unable to Added" });
            }
          }
        });
      }
    }
  );
}

function varifypasswordToken(req, res) {
  jwt.verify(
    req.query.varifypasswordToken,
    process.env.JWT_SECRET,
    (err, result) => {
      if (err) {
        return errorHandler(res, { message: "Token expired", status: 401 });
      } else {
        delete result.exp;
        delete result.iat;
        res.send(result);
      }
    }
  );
}

async function sendUserInfo(req, res, result) {
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
    const token = jwt.sign({ ...result[0] }, process.env.JWT_SECRET, {
      expiresIn: `${result[0].user_role !== "customer" ? "3d" : "5h"}`,
    });
    res.send({ user: result[0], token });
  }
}
