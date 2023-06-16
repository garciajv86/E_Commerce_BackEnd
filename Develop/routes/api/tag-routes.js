const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

//* The `/api/tags` endpoint

router.get("/", async (req, res) => {
  try {
    //* find all tags
    const tags = await Tag.findAll({
      include: Product, //* Include its associated Product data
    });
    res.status(200).json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  //* find a single tag by its `id`
  const { id } = req.params;
  try {
    const tag = await Tag.findByPk(id, {
      include: Product, //* Include associated Product data
    });
    if (!tag) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }
    res.status(200).json(tag);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  //* create a new tag
  const { tag_name } = req.body;
  try {
    const tag = await Tag.create({ tag_name });
    res.status(200).json(tag);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  //* update a tag's name by its `id` value
  const { id } = req.params;
  const { tag_name } = req.body;
  try {
    const result = await Tag.update(
      { tag_name },
      {
        where: { id },
      }
    );
    if (result[0] === 0) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }
    res.status(200).json({ message: "Tag updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  //* delete on tag by its `id` value
  const { id } = req.params;
  try {
    const result = await Tag.destroy({
      where: { id },
    });
    if (result === 0) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
