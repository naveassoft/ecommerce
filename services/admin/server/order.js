import Joi from "joi";
import { errorHandler, getDateFromDB, mySql, varifyOwner } from "./common";

export function getOder(req, res) {
  if (!req.query.user) {
    return errorHandler(res, { message: "Forbiden", status: 403 });
  }
  varifyOwner(res, req.query.user, () => {
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
  });
}

const ProductSchema = Joi.object().keys({
  product_id: Joi.number().integer().required(),
  image: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
  size: Joi.string(),
  colour: Joi.string(),
});

const OrderSchema = Joi.object({
  created_at: Joi.date().required(),
  order_id: Joi.string().required(),
  invoice_id: Joi.string().required(),
  vandor_id: Joi.number().integer().required(),
  sub_total: Joi.number().required(),
  discount: Joi.number().required(),
  tax: Joi.number().required(),
  shipping_charge: Joi.number().required(),
  total: Joi.number().required(),
  customer_id: Joi.number().integer().required(),
  customer_name: Joi.string().required(),
  customer_email: Joi.string().email().required(),
  shipping_address: Joi.string().required(),
  customer_comment: Joi.string(),
  customer_number: Joi.string().required(),
  status: Joi.string().valid("processing", "shipping", "delivered", "canceled"),
  delivery_date: Joi.date().required(),
  payment_method: Joi.string().valid("cash on delivery", "online payment"),
  product_info: Joi.array().items(ProductSchema),
});

export async function postOrder(req, res) {
  if (!req.body.product_info.length) {
    errorHandler(res, { message: "product not found" });
    return;
  }
  req.body.created_at = new Date();
  req.body.order_id = "OR-" + Date.now();
  req.body.invoice_id = "INV-" + Date.now();
  //api validateion;
  const varify = OrderSchema.validate(req.body);
  if (varify.error) {
    errorHandler(res, { message: varify.error.message });
    return;
  }

  //check user is exist to db;
  const query_1 = `SELECT id number FROM user WHERE id = '${req.body.customer_id}' AND email = '${req.body.customer_email}'`;
  mySql.query(query_1, (err, result) => {
    if (err) errorHandler(res, { message: err.sqlMessage });
    else {
      //user not exist;
      if (!result.length) {
        res.status(403).send({ message: "Unknown user" });
      } else {
        //update user profile if not update
        if (result[0].number !== req.body.customer_number) {
          const query_2 = `UPDATE user SET number = '${req.body.customer_number}', address = '${req.body.shipping_address}'  WHERE id = '${req.body.customer_id}'`;
          mySql.query(query_2, (err) => {
            if (err) console.log(err);
          });
        }

        //user esist  all done, go ahead;
        const product = req.body.product_info;
        const errors = [];

        product.forEach((item, i) => {
          //now check stock whether available;
          const query_3 = `SELECT stock FROM product WHERE id = '${item.product_id}'`;
          mySql.query(query_3, (err, result) => {
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
                  const query_4 = "INSERT INTO orders SET ?";
                  mySql.query(query_4, req.body, (err, order) => {
                    if (err) errorHandler(res, { message: err.sqlMessage });
                    else {
                      if (order.insertId > 0) {
                        JSON.parse(req.body.product_info).forEach((product) => {
                          const query_5 = `UPDATE product SET stock = stock - ${product.quantity} WHERE id= ${product.product_id}`;
                          mySql.query(query_5, (err) => {
                            if (err) console.log(err);
                          });
                        });
                        res.send({
                          message: "Order Created Successfully",
                        });
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

export async function updateOrder(req, res) {
  if (!req.body.user) {
    return errorHandler(res, { message: "Forbiden", status: 403 });
  }

  varifyOwner(res, req.body.user, () => {
    if (req.body.order_status === "delivered") {
      return errorHandler(res, {
        message: "This order was delivered",
        status: 403,
      });
    }
    const sql = `UPDATE orders SET status = '${req.body.status}' WHERE id=${req.query.id}`;
    mySql.query(sql, (err, result) => {
      if (err) errorHandler(res, { message: err.sqlMessage });
      else {
        if (result.changedRows === 0) {
          return res.send({ message: "Unable to Update, please try again" });
        }
        const status = req.body.status;
        const orderStatus = req.body.order_status;

        if (orderStatus === "canceled" && status !== "canceled") {
          JSON.parse(req.body.products).forEach((product, i, arr) => {
            const query = `UPDATE product SET stock = stock - ${product.quantity} WHERE id= ${product.product_id}`;
            mySql.query(query, (err) => {
              if (err)
                return errorHandler(res, { message: "Unable to update" });
              //at end of the loop;
              if (arr.length - 1 === i) {
                //update user;
                if (status === "delivered") {
                  updateUser(req, res, req.body.products);
                } else res.send({ message: "Order Updated Successfully" });
              }
            });
          });
        } else if (status === "delivered") {
          //update user;
          updateUser(req, res, req.body.products);
        } else if (status === "canceled") {
          JSON.parse(req.body.products).forEach((product, i, arr) => {
            const query = `UPDATE product SET stock = stock + ${product.quantity} WHERE id= ${product.product_id}`;
            mySql.query(query, (err) => {
              if (err)
                return errorHandler(res, { message: "Unable to update" });
              if (arr.length - 1 === i) {
                res.send({ message: "Order Updated Successfully" });
              }
            });
          });
        }
      }
    });
  });
}

export function deleteOrder(req, res) {
  const sql = `DELETE FROM orders WHERE id=${req.query.id}`;
  mySql.query(sql, (err) => {
    if (err) return errorHandler(res, { message: err.sqlMessage });
    res.send({ message: "Deleted successfully" });
  });
}

function updateUser(req, res, product) {
  const query = `UPDATE user SET order_placed = order_placed + ${1} WHERE id= ${
    req.body.customer_id
  }`;
  mySql.query(query, (err) => {
    if (err) return errorHandler(res, { message: "Unable to update user" });
    //update vendor;
    const query = `UPDATE vandor SET delivered_order = delivered_order + ${1} WHERE id= ${
      req.body.vendor_id
    }`;
    mySql.query(query, (err) => {
      if (err) return errorHandler(res, { message: "Unable to update vendor" });
      //update product;
      JSON.parse(product).forEach((pro, i, arr) => {
        const query = `UPDATE product SET delivered_order = delivered_order + ${1} WHERE id= ${
          pro.product_id
        }`;
        mySql.query(query, (err) => {
          if (err) {
            return errorHandler(res, { message: "Unable to update product" });
          }
        });
        if (arr.length - 1 === i) {
          res.send({ message: "Order Updated Successfully" });
        }
      });
    });
  });
}
