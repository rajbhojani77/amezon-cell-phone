const Items = require('../models/items');

module.exports = {

  // GET ITEMS
  itemsList(req, res, next) {
    const PAGE_NO = req.query.page_no || 1;
    const brand = req.query.brand || '';
    const orderby = req.query.orderby || 'items.id';
    const order = req.query.order || true;

    Items.list(PAGE_NO, brand, orderby, order)
      .then((result) => {
        res.status(200).json({
          success: true,
          message: 'Items fetched',
          data: result,
        });
      })
      .catch((err) => next(err));
  },

  // REGISTER A NEW Items
  newItems(req, res, next) {
    const newItems = req.body;
    delete (newItems.id);
    Items.create(newItems)
      .then((result) => {
        res.status(201).json({
          success: true,
          message: 'Items added',
          data: { id: result.id },
        });
      })
      .catch((err) => next(err));
  },

  // GET ITEM
  getItem(req, res, next) {
    const { id } = req.params;
    const response = {};
    // USE MODEL TO REGISTER A NEW Items
    Items.findById(id).then((result) => {
      if (result == null) { throw new Error('Id Not Found'); } else { response.item = result; }
    }).catch((err) => next(err));

    Items.itemReviews(id).then((result) => {
      if (result == null) { response.reviews = result; } else { response.reviews = result; }
      res.status(200).json({
        success: true,
        message: 'Item fetched',
        data: response,
      });
    })
      .catch((err) => next(err));
  },

  // EDIT ITEMS
  editItem(req, res, next) {
    req.body.id = req.params.id;
    const newItems = req.body;

    Items.edit(newItems)
      .then((result) => {
        res.status(201).json({
          success: true,
          message: 'Items Updated',
          data: { id: result.id },
        });
      })
      .catch((err) => next(err));
  },

  // DELETE ITEMS
  deleteItem(req, res, next) {
    const { id } = req.params;

    Items.remove(id)
      .then((result) => {
        res.status(201).json({
          success: true,
          message: 'Items Deleted',
          data: { id: result.id },
        });
      })
      .catch((err) => next(err));
  },

};
