import { loginUser } from "../../services/admin/server/login";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      loginUser(req, res);
      break;

    case "PUT":
      // updateNews(req, res, news);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
