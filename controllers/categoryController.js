import Category from "../models/categoryModels.js";
import { isAdminValid } from "./userControllers.js";

export async function createCategory(req, res) {
  try {
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
    const result = await newCategory.save();
    res.json({
      message: "Category created successfully",
      result: result,
    });
  } catch (err) {
    res.json({
      message: "Category creation failed",
      error: err,
    });
  }
}

export async function deleteCategory(req, res) {
  try {
    const name = req.params.name;
    await Category.findOneAndDelete({ name: name });
    res.json({
      message: "Category deleted successfully",
    });
  } catch (err) {
    res.json({
      message: "Category deletion failed",
      error: err,
    });
  }
}

export async function getCategory(req, res) {
  try {
    const result = await Category.find();
    res.json({
      categories: result,
    });
  } catch (err) {
    res.json({
      message: "Failed to get categories",
      error: err,
    });
  }
}

export async function getCategoryByName(req, res) {
  try {
    const name = req.params.name;
    const result = await Category.findOne({ name: name });
    if (result == null) {
      res.json({
        message: "Category not found",
      });
    } else {
      res.json({
        category: result,
      });
    }
  } catch (err) {
    res.json({
      message: "Failed to get category",
      error: err,
    });
  }
}

export async function updateCategory(req, res) {
  try {
    if (!isAdminValid(req)) {
      res.status(403).json({
        message: "Unauthorized",
      });
      return;
    }

    const name = req.params.name;
    await Category.updateOne({ name: name }, req.body);
    res.json({
      message: "Category updated successfully",
    });
  } catch (err) {
    res.json({
      message: "Failed to update category",
      error: err,
    });
  }
}
