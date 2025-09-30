import { Router } from 'express';
import { storage } from '../storage';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get user's wishlist
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;
    const wishlist = await storage.getUserWishlist(userId);
    
    res.json({
      success: true,
      items: wishlist.map(item => ({
        id: item.id,
        productId: item.productId,
        addedAt: item.addedAt,
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          imageUrl: item.product.imageUrl,
          category: item.product.category,
          stock: item.product.stock,
          status: item.product.status
        }
      }))
    });
  } catch (error) {
    console.error('Failed to get wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve wishlist'
    });
  }
});

// Add product to wishlist
router.post('/:productId', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { productId } = req.params;

    // Check if product exists
    const product = await storage.getProduct(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Check if already in wishlist
    const isAlreadyInWishlist = await storage.isInWishlist(userId, productId);
    if (isAlreadyInWishlist) {
      return res.status(400).json({
        success: false,
        error: 'Product already in wishlist'
      });
    }

    // Add to wishlist
    const wishlistItem = await storage.addToWishlist(userId, productId);
    
    if (!wishlistItem) {
      return res.status(400).json({
        success: false,
        error: 'Product already in wishlist or failed to add'
      });
    }
    
    res.json({
      success: true,
      item: wishlistItem,
      message: 'Product added to wishlist successfully'
    });
  } catch (error) {
    console.error('Failed to add to wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add product to wishlist'
    });
  }
});

// Remove product from wishlist
router.delete('/:productId', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { productId } = req.params;

    // Check if in wishlist
    const isInWishlist = await storage.isInWishlist(userId, productId);
    if (!isInWishlist) {
      return res.status(404).json({
        success: false,
        error: 'Product not found in wishlist'
      });
    }

    // Remove from wishlist
    await storage.removeFromWishlist(userId, productId);
    
    res.json({
      success: true,
      message: 'Product removed from wishlist successfully'
    });
  } catch (error) {
    console.error('Failed to remove from wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove product from wishlist'
    });
  }
});

// Check if product is in wishlist
router.get('/check/:productId', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { productId } = req.params;

    const isInWishlist = await storage.isInWishlist(userId, productId);
    
    res.json({
      success: true,
      isInWishlist
    });
  } catch (error) {
    console.error('Failed to check wishlist status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check wishlist status'
    });
  }
});

export default router;