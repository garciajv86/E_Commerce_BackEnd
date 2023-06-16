const router = require("express").Router();
const { Category, Product } = require("../../models");

//* The `/api/categories` endpoint

router.get("/", async (req, res) => {
  try {
    //* Find all categories and include associated Products
    const categories = await Category.findAll({
      include: [Product],
    });

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    //* Find the category by id and include associated Products
    const category = await Category.findByPk(categoryId, {
      include: [Product],
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  //* create a new category
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  //* update a category by its `id` value
  try {
    const [rowsAffected] = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (rowsAffected === 0) {
      res.status(404).json({ message: "No category found with this id" });
      return;
    }

    res.json({ message: "Category updated successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  //* delete a category by its `id` value
  try {
    const rowsAffected = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (rowsAffected === 0) {
      res.status(404).json({ message: "No category found with this id" });
      return;
    }

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
