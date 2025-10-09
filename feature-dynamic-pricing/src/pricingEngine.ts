/**
 * 🤖 AI-DRIVEN DYNAMIC PRICING ENGINE
 * 
 * Uses reinforcement learning to optimize prices in real-time
 * Maximizes revenue while maintaining competitive positioning
 * 
 * Algorithm: Q-Learning with epsilon-greedy exploration
 * Updates: Every minute based on live data
 * Constraints: Floor/ceiling prices per product
 */

interface PricingState {
  productId: string;
  currentPrice: number;
  baseCost: number;
  floorPrice: number; // Minimum allowed price
  ceilingPrice: number; // Maximum allowed price
  inventory: number;
  salesVelocity: number; // Sales per hour
  competitorPrice: number;
  demandLevel: 'low' | 'medium' | 'high' | 'very-high';
}

interface PricingAction {
  priceChange: number; // -10%, -5%, 0%, +5%, +10%, +15%, +20%
  confidence: number;
  reasoning: string;
}

interface ReinforcementLearningModel {
  qTable: Map<string, Map<number, number>>; // State -> Action -> Q-value
  epsilon: number; // Exploration rate (0.1 = 10% random)
  alpha: number; // Learning rate (0.1)
  gamma: number; // Discount factor (0.95)
}

export class DynamicPricingEngine {
  private model: ReinforcementLearningModel;
  private priceHistory: Map<string, number[]>;
  private revenueHistory: Map<string, number[]>;

  constructor() {
    this.model = {
      qTable: new Map(),
      epsilon: 0.1, // 10% exploration, 90% exploitation
      alpha: 0.1, // Learn slowly for stability
      gamma: 0.95 // Value future rewards highly
    };
    this.priceHistory = new Map();
    this.revenueHistory = new Map();

    console.log('🤖 Dynamic Pricing Engine initialized');
    console.log(`📊 RL Model: Q-Learning (ε=${this.model.epsilon}, α=${this.model.alpha}, γ=${this.model.gamma})`);
  }

  /**
   * MAIN PRICING DECISION FUNCTION
   * Called every minute for each product
   */
  async optimizePrice(state: PricingState): Promise<PricingAction> {
    const stateKey = this.encodeState(state);
    
    // Get Q-values for this state
    if (!this.model.qTable.has(stateKey)) {
      this.model.qTable.set(stateKey, new Map());
    }

    // Epsilon-greedy action selection
    const action = Math.random() < this.model.epsilon
      ? this.exploreAction(state) // Random exploration
      : this.exploitAction(state, stateKey); // Best known action

    // Calculate new price
    const newPrice = this.calculateNewPrice(state, action);

    // Ensure within bounds
    const boundedPrice = Math.max(
      state.floorPrice,
      Math.min(state.ceilingPrice, newPrice)
    );

    return {
      priceChange: ((boundedPrice - state.currentPrice) / state.currentPrice) * 100,
      confidence: this.getActionConfidence(stateKey, action),
      reasoning: this.explainDecision(state, action, boundedPrice)
    };
  }

  /**
   * UPDATE MODEL (after observing results)
   */
  updateModel(
    state: PricingState,
    action: number,
    reward: number,
    nextState: PricingState
  ): void {
    const stateKey = this.encodeState(state);
    const nextStateKey = this.encodeState(nextState);

    // Get current Q-value
    const qTable = this.model.qTable.get(stateKey)!;
    const currentQ = qTable.get(action) || 0;

    // Get max Q-value for next state
    const nextQTable = this.model.qTable.get(nextStateKey) || new Map();
    const maxNextQ = Math.max(...Array.from(nextQTable.values()), 0);

    // Q-learning update rule
    const newQ = currentQ + this.model.alpha * (
      reward + this.model.gamma * maxNextQ - currentQ
    );

    qTable.set(action, newQ);

    console.log(`📈 Model updated: Q(${stateKey}, ${action}) = ${newQ.toFixed(2)}`);
  }

  /**
   * CALCULATE REWARD
   * Higher revenue + higher margin = higher reward
   */
  calculateReward(
    oldRevenue: number,
    newRevenue: number,
    oldMargin: number,
    newMargin: number,
    oldSales: number,
    newSales: number
  ): number {
    // Revenue change (weighted 50%)
    const revenueReward = ((newRevenue - oldRevenue) / oldRevenue) * 50;

    // Margin change (weighted 30%)
    const marginReward = ((newMargin - oldMargin) / oldMargin) * 30;

    // Sales velocity change (weighted 20%)
    const salesReward = ((newSales - oldSales) / oldSales) * 20;

    return revenueReward + marginReward + salesReward;
  }

  /**
   * ENCODE STATE for Q-table lookup
   */
  private encodeState(state: PricingState): string {
    // Discretize continuous variables for Q-table
    const priceRatio = Math.round((state.currentPrice / state.competitorPrice) * 10) / 10;
    const inventoryLevel = state.inventory < 10 ? 'low' : state.inventory < 50 ? 'medium' : 'high';
    const velocityLevel = state.salesVelocity < 5 ? 'low' : state.salesVelocity < 20 ? 'medium' : 'high';

    return `${priceRatio}_${inventoryLevel}_${velocityLevel}_${state.demandLevel}`;
  }

  /**
   * EXPLORE: Try random action (10% of time)
   */
  private exploreAction(state: PricingState): number {
    // Actions: -10%, -5%, 0%, +5%, +10%, +15%, +20%
    const actions = [-0.10, -0.05, 0, 0.05, 0.10, 0.15, 0.20];
    return actions[Math.floor(Math.random() * actions.length)];
  }

  /**
   * EXPLOIT: Use best known action (90% of time)
   */
  private exploitAction(state: PricingState, stateKey: string): number {
    const qTable = this.model.qTable.get(stateKey)!;
    
    if (qTable.size === 0) {
      return 0; // No change if no data
    }

    // Find action with highest Q-value
    let bestAction = 0;
    let bestQ = -Infinity;

    for (const [action, qValue] of qTable.entries()) {
      if (qValue > bestQ) {
        bestQ = qValue;
        bestAction = action;
      }
    }

    return bestAction;
  }

  /**
   * CALCULATE NEW PRICE
   */
  private calculateNewPrice(state: PricingState, action: number): number {
    return state.currentPrice * (1 + action);
  }

  /**
   * GET CONFIDENCE SCORE
   */
  private getActionConfidence(stateKey: string, action: number): number {
    const qTable = this.model.qTable.get(stateKey);
    if (!qTable || qTable.size === 0) return 0.5;

    const qValue = qTable.get(action) || 0;
    const maxQ = Math.max(...Array.from(qTable.values()));
    const minQ = Math.min(...Array.from(qTable.values()));

    if (maxQ === minQ) return 0.5;
    return (qValue - minQ) / (maxQ - minQ);
  }

  /**
   * EXPLAIN PRICING DECISION
   */
  private explainDecision(
    state: PricingState,
    action: number,
    newPrice: number
  ): string {
    const reasons: string[] = [];

    // Competitive positioning
    if (newPrice < state.competitorPrice * 0.9) {
      reasons.push('Undercutting competitor for market share');
    } else if (newPrice > state.competitorPrice * 1.1) {
      reasons.push('Premium positioning based on demand');
    }

    // Inventory management
    if (state.inventory < 10) {
      reasons.push('Low stock - increasing price to maximize margin');
    } else if (state.inventory > 100) {
      reasons.push('High inventory - lowering price to increase velocity');
    }

    // Demand response
    if (state.demandLevel === 'very-high' && action > 0) {
      reasons.push('High demand detected - capturing willingness to pay');
    } else if (state.demandLevel === 'low' && action < 0) {
      reasons.push('Low demand - price reduction to stimulate sales');
    }

    // Sales velocity
    if (state.salesVelocity < 2) {
      reasons.push('Slow sales - price adjustment needed');
    }

    return reasons.join('; ') || 'Maintaining optimal price based on historical performance';
  }

  /**
   * BATCH OPTIMIZE ALL PRODUCTS
   */
  async optimizeAllProducts(products: PricingState[]): Promise<Map<string, PricingAction>> {
    const decisions = new Map<string, PricingAction>();

    for (const product of products) {
      const decision = await this.optimizePrice(product);
      decisions.set(product.productId, decision);
    }

    console.log(`✅ Optimized pricing for ${products.length} products`);
    return decisions;
  }

  /**
   * SAVE MODEL STATE (for persistence)
   */
  exportModel(): string {
    const modelData = {
      qTable: Array.from(this.model.qTable.entries()).map(([state, actions]) => ({
        state,
        actions: Array.from(actions.entries())
      })),
      epsilon: this.model.epsilon,
      alpha: this.model.alpha,
      gamma: this.model.gamma,
      lastUpdated: new Date().toISOString()
    };

    return JSON.stringify(modelData, null, 2);
  }

  /**
   * LOAD MODEL STATE
   */
  importModel(modelJson: string): void {
    try {
      const modelData = JSON.parse(modelJson);
      
      this.model.qTable = new Map(
        modelData.qTable.map((entry: any) => [
          entry.state,
          new Map(entry.actions)
        ])
      );
      
      this.model.epsilon = modelData.epsilon;
      this.model.alpha = modelData.alpha;
      this.model.gamma = modelData.gamma;

      console.log('✅ Model loaded successfully');
    } catch (error) {
      console.error('❌ Model load failed:', error);
    }
  }

  /**
   * GET MODEL STATISTICS
   */
  getModelStats(): any {
    return {
      statesLearned: this.model.qTable.size,
      totalQValues: Array.from(this.model.qTable.values())
        .reduce((sum, actions) => sum + actions.size, 0),
      epsilon: this.model.epsilon,
      alpha: this.model.alpha,
      gamma: this.model.gamma,
      modelAge: 'Active'
    };
  }
}

export const pricingEngine = new DynamicPricingEngine();
export default pricingEngine;

