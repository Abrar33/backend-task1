const Inventory = require('../Models/inventory-model');

// Create or update inventory
const upsertInventory = async (req, res) => {
  const { productId, quantityAvailable, warehouseLocation, minimumStockAlert } = req.body;

  try {
    const existing = await Inventory.findOne({ productId });

    if (existing) {
      existing.quantityAvailable = quantityAvailable;
      existing.lastRestockedDate = new Date();
      existing.warehouseLocation = warehouseLocation;
      existing.minimumStockAlert = minimumStockAlert;
      await existing.save();
      return res.json({ message: 'Inventory updated', inventory: existing });
    }

    const inventory = new Inventory({
      productId,
      quantityAvailable,
      warehouseLocation,
      minimumStockAlert
    });

    await inventory.save();
    res.status(201).json({ message: 'Inventory created', inventory });
  } catch (err) {
    console.error('Inventory error:', err.message);
    res.status(500).json({ error: 'Failed to upsert inventory' });
  }
};

// Get inventory by product
const getInventoryByProduct = async (req, res) => {
  try {
    const inventory = await Inventory.findOne({ productId: req.params.productId }).populate('productId');
    if (!inventory) return res.status(404).json({ error: 'Inventory not found' });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};
module.exports={
    upsertInventory,
    getInventoryByProduct
}