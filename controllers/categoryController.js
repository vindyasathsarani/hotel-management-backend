import Category from "../models/categoryModels.js";

export function createCategory(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  if (req.user.type != "admin") {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }
  const newCategory = new Category(req.body);
  newCategory
    .save()
    .then((result) => {
      res.json({
        message: "Category created successfully",
        result: result,
      });
    })
    .catch((err) => {
      res.json({
        message: "Category crreation failed",
        error: err,
      });
    });
}
