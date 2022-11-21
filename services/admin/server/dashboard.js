import { errorHandler, mySql } from "./common";

export function getDashboardData(req, res) {
  if (req.query.report) {
    sendReport(res);
  } else {
    const data = {};
    const topCustomer = `SELECT id, profile, name FROM user ORDER BY order_placed LIMIT 5`;
    mySql.query(topCustomer, (err, result) => {
      if (err) return errorHandler(res, { message: err.sqlMessage });
      data.topCustomer = result;

      const topSaler = `SELECT id, shop_logo, name FROM vandor ORDER BY delivered_order LIMIT 5`;
      mySql.query(topSaler, (err, result) => {
        if (err) return errorHandler(res, { message: err.sqlMessage });
        data.topSaler = result;

        const topProduct = `SELECT id, main_image, name FROM product ORDER BY delivered_order LIMIT 5`;
        mySql.query(topProduct, (err, result) => {
          if (err) return errorHandler(res, { message: err.sqlMessage });
          data.topProduct = result;

          const topRatedProduct = `SELECT DISTINCT customer_review.product_id as id, product.name, product.main_image FROM customer_review INNER JOIN product ON product.id = customer_review.product_id LIMIT 5`;
          mySql.query(topRatedProduct, (err, result) => {
            if (err) return errorHandler(res, { message: err.sqlMessage });
            data.topRatedProduct = result;
            res.send(data);
          });
        });
      });
    });
  }
}

function sendReport(res) {
  //total product;
  const productCount = `SELECT COUNT(id) FROM product`;
  mySql.query(productCount, (err, result) => {
    if (err) return errorHandler(res, { message: err.sqlMessage });
    const data = {};
    data.total_product = result[0]["COUNT(id)"];

    //total sales;
    const totalSale = `SELECT total FROM orders`;
    mySql.query(totalSale, (err, result) => {
      if (err) return errorHandler(res, { message: err.sqlMessage });
      let total = 0;
      for (const order of result) {
        total += order.total;
      }
      data.total_sale = total;

      // todays order;
      const date = new Date().toISOString().slice(0, 10);
      let yesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24)
        .toISOString()
        .slice(0, 10);
      const totalSale = `SELECT id FROM orders WHERE created_at BETWEEN ${date} AND  ${yesterday}`;
      mySql.query(totalSale, (err, result) => {
        if (err) return errorHandler(res, { message: err.sqlMessage });
        data.todaysOrder = result.length;

        //pending order;
        const pendingOrder = `SELECT id FROM orders WHERE status = 'processing'`;
        mySql.query(pendingOrder, (err, result) => {
          if (err) return errorHandler(res, { message: err.sqlMessage });
          data.pendingOrder = result.length;

          //canceled order;
          const canceledOrder = `SELECT id FROM orders WHERE status = 'canceled'`;
          mySql.query(canceledOrder, (err, result) => {
            if (err) return errorHandler(res, { message: err.sqlMessage });
            data.canceledOrder = result.length;

            //Low stock product
            const lowStockProduct = `SELECT id FROM product WHERE stock <= 5`;
            mySql.query(lowStockProduct, (err, result) => {
              if (err) return errorHandler(res, { message: err.sqlMessage });
              data.lowStockProduct = result.length;

              //top sold product
              const topSoldProduct = `SELECT id FROM product WHERE delivered_order >= 20`;
              mySql.query(topSoldProduct, (err, result) => {
                if (err) return errorHandler(res, { message: err.sqlMessage });
                data.topSoldProduct = result.length;

                // total vandor
                const totalVandor = `SELECT id FROM vandor`;
                mySql.query(totalVandor, (err, result) => {
                  if (err)
                    return errorHandler(res, { message: err.sqlMessage });
                  data.totalVandor = result.length;
                  res.send(data);
                });
              });
            });
          });
        });
      });
    });
  });
}
