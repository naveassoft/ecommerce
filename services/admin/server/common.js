import mysql from "mysql";
import multer from "multer";
import path from "path";
import fs from "fs";

export const mySql = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "ecommerce",
  password: "",
  connectionLimit: 10,
});

export function getDateFromDB(res, query, count = undefined) {
  return mySql.query(query, (err, data) => {
    if (err) return errorHandler(res, { message: err.sqlMessage });
    if (count) {
      mySql.query(count, (err, totalDocument) => {
        if (err) {
          errorHandler(res, { message: err.sqlMessage });
        } else {
          res.send({ count: totalDocument[0]["COUNT(id)"], data });
        }
      });
    } else {
      res.send(data);
    }
  });
}

export async function bodyParser(req, res, folder, images) {
  try {
    const MulterConfiq = multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, path.join(process.cwd(), "public", folder));
        },
        filename(req, file, cb) {
          let fileName;
          const isFavicon = req.files.favicon;
          if (isFavicon) {
            fileName = "favicon.ico";
          } else {
            fileName = `${file.fieldname}-${Date.now()}${path.extname(
              file.originalname
            )}`;
          }
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const filetypes = /jpg|jpeg|png|gif/;
        const extname = filetypes.test(
          path.extname(file.originalname).toLowerCase()
        );
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
          return cb(null, true);
        } else {
          cb("Unsupported file extension");
        }
      },
      limits: 1000000,
    });

    await new Promise((resolve) => {
      const multer = MulterConfiq.fields(images);
      multer(req, res, resolve);
    });
    return { error: false };
  } catch (err) {
    return { error: err.message };
  }
}

export function errorHandler(res, error) {
  console.log(error);
  res
    .status(error.status || 500)
    .send({ message: error.message || "Serverside error" });
}

export function deleteImage(image) {
  try {
    fs.unlinkSync(path.join(process.cwd(), "public", "assets", image));
  } catch (error) {
    console.log(error);
  }
}
