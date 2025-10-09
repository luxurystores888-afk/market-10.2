/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import { Product } from '@/lib/types';

// Mock the types
const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'This is a test product',
  price: '99.99',
  category: 'Electronics',
  imageUrl: 'https://example.com/image.jpg',
  stock: 10,
  status: 'active',
  tags: ['test', 'product'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockAddToCart = jest.fn();
const mockAddToWishlist = jest.fn();

describe('ProductCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product information correctly', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={mockAddToCart}
        onAddToWishlist={mockAddToWishlist}
      />
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('This is a test product')).toBeInTheDocument();
  });

  it('displays product image when provided', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={mockAddToCart}
        onAddToWishlist={mockAddToWishlist}
      />
    );

    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('calls onAddToCart when Add to Cart button is clicked', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={mockAddToCart}
        onAddToWishlist={mockAddToWishlist}
      />
    );

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('calls onAddToWishlist when wishlist button is clicked', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={mockAddToCart}
        onAddToWishlist={mockAddToWishlist}
      />
    );

    const wishlistButton = screen.getByRole('button', { name: /add to wishlist/i });
    fireEvent.click(wishlistButton);

    expect(mockAddToWishlist).toHaveBeenCalledTimes(1);
    expect(mockAddToWishlist).toHaveBeenCalledWith(mockProduct);
  });

  it('shows out of stock message when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };

    render(
      <ProductCard
        product={outOfStockProduct}
        onAddToCart={mockAddToCart}
        onAddToWishlist={mockAddToWishlist}
      />
    );

    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled();
  });

  it('displays tags when provided', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={mockAddToCart}
        onAddToWishlist={mockAddToWishlist}
      />
    );

    expect(screen.getByText('#test')).toBeInTheDocument();
    expect(screen.getByText('#product')).toBeInTheDocument();
  });

  it('handles missing optional props gracefully', () => {
    const minimalProduct = {
      id: '1',
      name: 'Minimal Product',
      price: '50.00',
      stock: 5,
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(
      <ProductCard
        product={minimalProduct}
        onAddToCart={mockAddToCart}
        onAddToWishlist={mockAddToWishlist}
      />
    );

    expect(screen.getByText('Minimal Product')).toBeInTheDocument();
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={mockAddToCart}
        onAddToWishlist={mockAddToWishlist}
      />
    );

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    const wishlistButton = screen.getByRole('button', { name: /add to wishlist/i });

    expect(addToCartButton).toHaveAttribute('aria-label');
    expect(wishlistButton).toHaveAttribute('aria-label');
  });
});
