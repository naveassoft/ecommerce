import { errorHandler, getDateFromDB, mySql } from "./common";

export function getOder(req, res) {
  if (req.query.id) {
    //send single order;
    const sql = `SELECT * FROM orders WHERE id=${req.query.id}`;
    getDateFromDB(res, sql);
  }
  //
  else if (req.query.date && req.query.status) {
    if (!req.query.start && !req.query.end) {
      errorHandler(res, { message: "Start date and End date must be given" });
      return;
    }
    const limit = req.query.limit || 10;
    const page = parseInt(req.query.page || 0) * limit;
    const sql = `SELECT * FROM orders WHERE created_at >= '${req.query.start}' AND created_at <= '${req.query.end}' AND status = '${req.query.status}' LIMIT ${page}, ${limit}`;
    const count = `SELECT COUNT(id) FROM orders WHERE created_at BETWEEN '${req.query.start}' AND '${req.query.end}'`;
    getDateFromDB(res, sql, count);
  }
  // send orders based on status;
  else if (req.query.status) {
    const limit = req.query.limit || 10;
    const page = parseInt(req.query.page || 0) * limit;
    const sql = `SELECT * FROM orders WHERE status = '${req.query.status}' LIMIT ${page}, ${limit}`;
    const count = `SELECT COUNT(id) FROM orders WHERE status = '${req.query.status}'`;
    getDateFromDB(res, sql, count);
  }
  // send orders based on datae;
  else if (req.query.date) {
    if (!req.query.start && !req.query.end) {
      errorHandler(res, { message: "Start date and End date must be given" });
      return;
    }
    const limit = req.query.limit || 10;
    const page = parseInt(req.query.page || 0) * limit;
    const sql = `SELECT * FROM orders WHERE created_at >= '${req.query.start}' AND created_at <= '${req.query.end}' LIMIT ${page}, ${limit}`;
    const count = `SELECT COUNT(id) FROM orders WHERE created_at BETWEEN '${req.query.start}' AND '${req.query.end}'`;
    getDateFromDB(res, sql, count);
  }
  //send customer whose placed order ;
  else if (req.query.customer) {
    const limit = req.query.limit || 10;
    const page = parseInt(req.query.page || 0) * limit;
    const sql = `SELECT DISTINCT customer_id FROM orders LIMIT ${page}, ${limit}`;

    mySql.query(sql, (err, result) => {
      if (err) return errorHandler(res, { message: err.sqlMessage });
      if (!result.length) {
        return errorHandler(res, { message: "Not Found", status: 404 });
      }
      const customerId = [];
      result.forEach((item) => customerId.push(item.customer_id));
      const query = `SELECT * FROM user WHERE id IN(${customerId})`;
      const count = "SELECT DISTINCT customer_id FROM orders";
      mySql.query(query, (err, data) => {
        if (err) return errorHandler(res, { message: err.sqlMessage });
        mySql.query(count, (err, count) => {
          if (err) return errorHandler(res, { message: err.sqlMessage });
          res.send({ count: count.length, data });
        });
      });
    });
  }
  // send orders for home order page;
  else {
    const limit = req.query.limit || 10;
    const page = parseInt(req.query.page || 0) * limit;
    const sql = `SELECT * FROM orders LIMIT ${page}, ${limit}`;
    const count = "SELECT COUNT(id) FROM orders";
    getDateFromDB(res, sql, count);
  }
}

export async function postOrder(req, res) {
  //check user is exist to db;
  const query_1 = `SELECT * FROM user WHERE id = '${req.body.customer_id}' AND email = '${req.body.customer_email}'`;
  mySql.query(query_1, (err, result) => {
    if (err) errorHandler(res, { message: err.sqlMessage });
    else {
      //user not exist;
      if (!result.length) {
        res.status(403).send({ message: "Forbidden" });
      } else {
        req.body.created_at = new Date();
        req.body.order_id = "OR-" + Date.now();
        req.body.invoice_id = "INV-" + Date.now();

        const product = req.body.product_info;
        const errors = [];

        product.forEach((item, i) => {
          //user exist , now check stock whether available;
          const query_2 = `SELECT stock FROM product WHERE id = '${item.product_id}'`;
          mySql.query(query_2, (err, result) => {
            if (err) errors.push(item.product_id);
            else {
              //product is not found in db;
              if (!result.length) {
                errors.push(item.product_id);
              }
              //stock is not available;
              else if (result[0].stock < item.quantity) {
                errors.push(item.product_id);
              }
              //at the end of the array;
              if (product.length - 1 === i) {
                //is error exist, filter the product;
                if (errors.length) {
                  const existedProduct = product.filter((item) => {
                    for (let i = 0; i < errors.length; i++) {
                      if (item.product_id !== errors[i]) {
                        return true;
                      } else return false;
                    }
                  });
                  req.body.product_info = existedProduct;
                }
                //if all product are invalid ;
                if (!req.body.product_info.length) {
                  res.status(403).send({ message: "Forbidden" });
                } else {
                  //finally save to db, all operation done;
                  req.body.product_info = JSON.stringify(req.body.product_info);
                  const sql = "INSERT INTO orders SET ?";
                  mySql.query(sql, req.body, (err, result) => {
                    if (err) errorHandler(res, { message: err.sqlMessage });
                    else {
                      if (result.insertId > 0) {
                        res.send({ message: "Order Created Successfully" });
                      } else {
                        res.send({
                          message: "Unable to Added, please try again",
                        });
                      }
                    }
                  });
                }
              }
            }
          });
        });
      }
    }
  });
}

export function deleteOrder(req, res) {
  const sql = `DELETE FROM orders WHERE id=${req.query.id}`;
  mySql.query(sql, (err) => {
    if (err) return errorHandler(res, { message: err.sqlMessage });
    res.send({ message: "Deleted successfully" });
  });
}

export async function updateOrder(req, res) {
  const sql = `UPDATE orders SET status = '${req.body.status}' WHERE id=${req.query.id}`;
  mySql.query(sql, (err, result) => {
    if (err) errorHandler(res, { message: err.sqlMessage });
    else {
      if (result.changedRows > 0) {
        res.send({ message: "Order Updated Successfully" });
      } else {
        res.send({ message: "Unable to Update, please try again" });
      }
    }
  });
}
