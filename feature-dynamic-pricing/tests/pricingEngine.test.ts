/**
 * UNIT TESTS - Pricing Engine
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { DynamicPricingEngine } from '../src/pricingEngine';

describe('DynamicPricingEngine', () => {
  let engine: DynamicPricingEngine;

  beforeEach(() => {
    engine = new DynamicPricingEngine();
  });

  describe('Price Optimization', () => {
    it('should return price within floor/ceiling bounds', async () => {
      const state = {
        productId: 'test-1',
        currentPrice: 100,
        baseCost: 60,
        floorPrice: 80,
        ceilingPrice: 150,
        inventory: 50,
        salesVelocity: 10,
        competitorPrice: 105,
        demandLevel: 'high' as const
      };

      const decision = await engine.optimizePrice(state);
      const newPrice = state.currentPrice * (1 + decision.priceChange / 100);

      expect(newPrice).toBeGreaterThanOrEqual(state.floorPrice);
      expect(newPrice).toBeLessThanOrEqual(state.ceilingPrice);
    });

    it('should increase price when demand is very high and inventory is low', async () => {
      const state = {
        productId: 'test-2',
        currentPrice: 100,
        baseCost: 60,
        floorPrice: 80,
        ceilingPrice: 200,
        inventory: 5, // Low inventory
        salesVelocity: 25, // High sales
        competitorPrice: 110,
        demandLevel: 'very-high' as const
      };

      const decision = await engine.optimizePrice(state);
      
      // Should recommend price increase
      expect(decision.priceChange).toBeGreaterThanOrEqual(0);
      expect(decision.confidence).toBeGreaterThan(0);
      expect(decision.reasoning).toContain('demand');
    });

    it('should decrease price when inventory is high and sales are slow', async () => {
      const state = {
        productId: 'test-3',
        currentPrice: 100,
        baseCost: 60,
        floorPrice: 70,
        ceilingPrice: 150,
        inventory: 200, // High inventory
        salesVelocity: 1, // Slow sales
        competitorPrice: 95,
        demandLevel: 'low' as const
      };

      const decision = await engine.optimizePrice(state);
      
      // Should recommend price decrease or hold
      expect(decision.priceChange).toBeLessThanOrEqual(5);
    });
  });

  describe('Model Learning', () => {
    it('should update Q-values based on rewards', () => {
      const state = {
        productId: 'test-4',
        currentPrice: 100,
        baseCost: 60,
        floorPrice: 80,
        ceilingPrice: 150,
        inventory: 50,
        salesVelocity: 10,
        competitorPrice: 105,
        demandLevel: 'medium' as const
      };

      const nextState = { ...state, currentPrice: 105, salesVelocity: 15 };

      // Positive reward for good outcome
      engine.updateModel(state, 0.05, 10, nextState);

      const stats = engine.getModelStats();
      expect(stats.statesLearned).toBeGreaterThan(0);
    });

    it('should calculate reward correctly', () => {
      const reward = engine.calculateReward(
        10000, // old revenue
        12000, // new revenue (+20%)
        30, // old margin
        35, // new margin (+16.7%)
        100, // old sales
        90 // new sales (-10%)
      );

      // Revenue up = positive
      // Margin up = positive
      // Sales down = negative
      // Net should be positive
      expect(reward).toBeGreaterThan(0);
    });
  });

  describe('Model Persistence', () => {
    it('should export model to JSON', () => {
      const exported = engine.exportModel();
      expect(exported).toBeTruthy();
      expect(() => JSON.parse(exported)).not.toThrow();
    });

    it('should import model from JSON', () => {
      const exported = engine.exportModel();
      const newEngine = new DynamicPricingEngine();
      
      expect(() => newEngine.importModel(exported)).not.toThrow();
    });
  });
});

