const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

//* The `/api/products` endpoint

//* get all products
router.get("/", async (req, res) => {
  try {
    //* find all products
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ["id", "category_name"],
        },
        {
          model: Tag,
          through: ProductTag,
          as: "tags",
          attributes: ["id", "tag_name"],
        },
      ],
    });

    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//* get one product
router.get("/:id", async (req, res) => {
  try {
    //* find a single product by its `id`
    const productId = req.params.id;

    //* includes associated Category and Tag data
    const product = await Product.findByPk(productId, {
      include: [
        { model: Category, as: "category" },
        { model: Tag, through: { model: ProductTag } },
      ],
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error retrieving the product" });
  }
});

//* create new product
router.post("/", async (req, res) => {
  const { product_name, price, stock, tagIds } = req.body;

  Product.create(req.body)
    .then((product) => {
      //* if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (Array.isArray(req.body.tagIds) && req.body.tagIds.length > 0) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      //* if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

//* update product
router.put("/:id", (req, res) => {
  //* update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        ProductTag.findAll({
          where: { product_id: req.params.id },
        }).then((productTags) => {
          //* create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          //* figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          //* run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      //* console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", async (req, res) => {
  //* delete one product by its `id` value
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.destroy({
      where: {
        id: productId,
      },
    });

    if (deletedProduct) {
      res.status(200).json({ message: "Product deleted" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
