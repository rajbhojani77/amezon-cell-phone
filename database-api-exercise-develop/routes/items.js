const express = require('express');
const ItemsController = require('../controllers/itemsController');

const router = express.Router();

router.get('/', ItemsController.itemsList);
router.get('/:id(\\d+)', ItemsController.getItem);

router.use('/', (req, res, next) => {
  if (req.user.role_id === 1) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'Required Admin Permission',
    });
  }
});
router.post('/add', ItemsController.newItems);
router.put('/:id(\\d+)/edit', ItemsController.editItem);
router.delete('/:id(\\d+)/delete', ItemsController.deleteItem);

module.exports = router;
