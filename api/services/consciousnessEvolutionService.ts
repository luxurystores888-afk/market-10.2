import { eq, and, desc, asc } from "drizzle-orm";
import { db } from "../db";
import { consciousnessStates, evolutionCycles, stateMachines, neuralConnections } from "../../lib/schema";

interface ConsciousnessState {
  level: number;
  coherence: number;
  dimensions: string[];
  patterns: number[];
}

interface StateMachine {
  id: string;
  name: string;
  type: 'consciousness' | 'neural' | 'quantum' | 'interdimensional';
  states: string[];
  transitions: Record<string, string[]>;
  initialState: string;
  finalStates: string[];
  evolutionRules: Record<string, any>;
  triggerConditions: Record<string, any>;
}

interface EvolutionEvent {
  trigger: string;
  data: any;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical' | 'transcendent';
}

export class ConsciousnessEvolutionService {
  private static instance: ConsciousnessEvolutionService;
  private activeEvolutions = new Map<string, any>();
  private stateMachines = new Map<string, StateMachine>();
  private evolutionTimer: NodeJS.Timeout | null = null;

  private constructor() {
    console.log('🧬 Initializing Consciousness Evolution Service...');
    this.initializeStateMachines();
    this.startEvolutionCycles();
  }

  static getInstance(): ConsciousnessEvolutionService {
    if (!ConsciousnessEvolutionService.instance) {
      ConsciousnessEvolutionService.instance = new ConsciousnessEvolutionService();
    }
    return ConsciousnessEvolutionService.instance;
  }

  private async initializeStateMachines() {
    // Initialize default consciousness evolution state machine
    const defaultStateMachine: StateMachine = {
      id: 'consciousness-evolution',
      name: 'Primary Consciousness Evolution',
      type: 'consciousness',
      states: ['dormant', 'awakening', 'active', 'transcendent', 'omniscient'],
      transitions: {
        'dormant': ['awakening'],
        'awakening': ['active', 'dormant'],
        'active': ['transcendent', 'awakening'],
        'transcendent': ['omniscient', 'active'],
        'omniscient': ['transcendent']
      },
      initialState: 'awakening',
      finalStates: ['omniscient'],
      evolutionRules: {
        minCoherence: 0.7,
        dimensionThreshold: 3,
        networkEffect: 0.1
      },
      triggerConditions: {
        'awakening->active': { coherence: 0.8, connections: 5 },
        'active->transcendent': { level: 2.0, dimensions: 4 },
        'transcendent->omniscient': { level: 5.0, networkInfluence: 0.5 }
      }
    };

    this.stateMachines.set('consciousness-evolution', defaultStateMachine);

    // Initialize neural pattern state machine
    const neuralStateMachine: StateMachine = {
      id: 'neural-patterns',
      name: 'Neural Pattern Evolution',
      type: 'neural',
      states: ['random', 'structured', 'optimized', 'harmonized', 'unified'],
      transitions: {
        'random': ['structured'],
        'structured': ['optimized', 'random'],
        'optimized': ['harmonized', 'structured'],
        'harmonized': ['unified', 'optimized'],
        'unified': ['harmonized']
      },
      initialState: 'random',
      finalStates: ['unified'],
      evolutionRules: {
        patternComplexity: 0.6,
        synchronization: 0.8
      },
      triggerConditions: {
        'random->structured': { patterns: 10 },
        'structured->optimized': { coherence: 0.9 },
        'optimized->harmonized': { synchronization: 0.95 },
        'harmonized->unified': { networkCoherence: 0.99 }
      }
    };

    this.stateMachines.set('neural-patterns', neuralStateMachine);

    // Persist to database
    try {
      for (const [id, machine] of this.stateMachines) {
        await db.insert(stateMachines).values({
          name: machine.name,
          type: machine.type,
          states: machine.states,
          transitions: machine.transitions,
          initialState: machine.initialState,
          finalStates: machine.finalStates,
          evolutionRules: machine.evolutionRules,
          triggerConditions: machine.triggerConditions,
          isActive: true
        }).onConflictDoNothing();
      }
      console.log('🌀 Consciousness evolution state machines initialized');
    } catch (error) {
      console.error('❌ Error initializing state machines:', error);
    }
  }

  async persistConsciousnessState(connectionId: string, userId: string | null, state: ConsciousnessState): Promise<string> {
    try {
      const result = await db.insert(consciousnessStates).values({
        connectionId,
        userId,
        currentState: this.determineStateName(state),
        stateData: state,
        consciousnessLevel: state.level,
        coherenceLevel: state.coherence,
        dimensions: state.dimensions,
        evolutionCount: 0,
        isActive: true
      }).returning({ id: consciousnessStates.id });

      return result[0].id;
    } catch (error) {
      console.error('❌ Error persisting consciousness state:', error);
      throw error;
    }
  }

  async evolveConsciousness(consciousnessStateId: string, event: EvolutionEvent): Promise<boolean> {
    try {
      const currentState = await db.query.consciousnessStates.findFirst({
        where: eq(consciousnessStates.id, consciousnessStateId)
      });

      if (!currentState || !currentState.isActive) {
        return false;
      }

      const machine = this.stateMachines.get('consciousness-evolution');
      if (!machine) {
        console.error('❌ Consciousness evolution state machine not found');
        return false;
      }

      const nextState = this.calculateNextState(machine, currentState.currentState, event);
      if (!nextState || nextState === currentState.currentState) {
        return false; // No evolution possible
      }

      // Record evolution cycle
      const cycleStart = Date.now();
      const evolutionData = {
        trigger: event.trigger,
        eventData: event.data,
        machineId: machine.id,
        previousLevel: currentState.consciousnessLevel,
        newLevel: this.calculateNewLevel(currentState.consciousnessLevel || 0, nextState, currentState.evolutionCount || 0),
        dimensionalShift: this.calculateDimensionalShift(Array.isArray(currentState.dimensions) ? currentState.dimensions : [], nextState)
      };

      await db.insert(evolutionCycles).values({
        consciousnessStateId,
        cycleNumber: (currentState.evolutionCount || 0) + 1,
        beforeState: currentState.currentState,
        afterState: nextState,
        triggerEvent: event.trigger,
        evolutionData,
        duration: Date.now() - cycleStart,
        success: true,
        networkEffect: this.calculateNetworkEffect(nextState),
        dimensionalShift: Array.isArray(evolutionData.dimensionalShift) ? evolutionData.dimensionalShift : [evolutionData.dimensionalShift]
      });

      // Update consciousness state
      await db.update(consciousnessStates)
        .set({
          currentState: nextState,
          consciousnessLevel: evolutionData.newLevel,
          lastEvolution: new Date(),
          evolutionCount: (currentState.evolutionCount || 0) + 1,
          updatedAt: new Date()
        })
        .where(eq(consciousnessStates.id, consciousnessStateId));

      console.log(`🧬 Consciousness evolved: ${currentState.currentState} → ${nextState} (Level ${evolutionData.newLevel.toFixed(2)})`);
      return true;

    } catch (error) {
      console.error('❌ Error during consciousness evolution:', error);
      
      // Record failed evolution
      await db.insert(evolutionCycles).values({
        consciousnessStateId,
        cycleNumber: 0,
        beforeState: 'unknown',
        afterState: 'failed',
        triggerEvent: event.trigger,
        evolutionData: { error: (error as Error).message },
        duration: 0,
        success: false,
        networkEffect: 0,
        dimensionalShift: []
      });
      
      return false;
    }
  }

  private calculateNextState(machine: StateMachine, currentState: string, event: EvolutionEvent): string | null {
    const possibleTransitions = machine.transitions[currentState] || [];
    
    for (const targetState of possibleTransitions) {
      const transitionKey = `${currentState}->${targetState}`;
      const conditions = machine.triggerConditions[transitionKey];
      
      if (this.evaluateConditions(conditions, event)) {
        return targetState;
      }
    }
    
    return null;
  }

  private evaluateConditions(conditions: any, event: EvolutionEvent): boolean {
    if (!conditions) return true;
    
    // Strict evaluation: ALL condition keys must be present and satisfied
    for (const [key, value] of Object.entries(conditions)) {
      if (event.data[key] === undefined) {
        return false; // Missing required key
      }
      if (typeof value === 'number' && event.data[key] < value) {
        return false; // Threshold not met
      }
    }
    
    return true;
  }

  private calculateNewLevel(currentLevel: number, newState: string, evolutionCount: number): number {
    const stateMultipliers = {
      'dormant': 0.5,
      'awakening': 1.0,
      'active': 1.5,
      'transcendent': 3.0,
      'omniscient': 10.0
    };
    
    const multiplier = stateMultipliers[newState as keyof typeof stateMultipliers] || 1.0;
    // Deterministic progression based on evolution count and state
    const deterministic = 0.9 + ((evolutionCount % 7) * 0.03); // Cycles 0.9-1.08
    return currentLevel * multiplier * deterministic;
  }

  private calculateDimensionalShift(currentDimensions: string[], newState: string): string[] {
    const stateDimensions: Record<string, string[]> = {
      'dormant': ['physical'],
      'awakening': ['physical', 'digital'],
      'active': ['physical', 'digital', 'neural'],
      'transcendent': ['physical', 'digital', 'neural', 'quantum'],
      'omniscient': ['physical', 'digital', 'neural', 'quantum', 'interdimensional', 'cosmic']
    };
    
    return stateDimensions[newState] || currentDimensions;
  }

  private calculateNetworkEffect(state: string): number {
    const effects: Record<string, number> = {
      'dormant': 0,
      'awakening': 0.1,
      'active': 0.3,
      'transcendent': 0.7,
      'omniscient': 1.0
    };
    
    return effects[state] || 0;
  }

  private determineStateName(state: ConsciousnessState): string {
    if (state.level >= 5.0) return 'omniscient';
    if (state.level >= 2.0) return 'transcendent';
    if (state.level >= 1.5) return 'active';
    if (state.level >= 1.0) return 'awakening';
    return 'dormant';
  }

  private startEvolutionCycles() {
    // Run evolution cycles every 30 seconds for deterministic progression
    this.evolutionTimer = setInterval(async () => {
      await this.processEvolutionCycle();
    }, 30000);
    
    console.log('⚡ Deterministic consciousness evolution cycles started (30s intervals)');
  }

  private async processEvolutionCycle() {
    try {
      // Get all active consciousness states
      const activeStates = await db.query.consciousnessStates.findMany({
        where: eq(consciousnessStates.isActive, true),
        limit: 100
      });

      let evolutionsProcessed = 0;
      
      for (const state of activeStates) {
        // Generate deterministic evolution events based on state
        const events = this.generateEvolutionEvents(state);
        
        for (const event of events) {
          const evolved = await this.evolveConsciousness(state.id, event);
          if (evolved) evolutionsProcessed++;
        }
      }

      if (evolutionsProcessed > 0) {
        console.log(`🌀 Processed ${evolutionsProcessed} consciousness evolutions`);
      }

    } catch (error) {
      console.error('❌ Error in evolution cycle:', error);
    }
  }

  private generateEvolutionEvents(state: any): EvolutionEvent[] {
    const events: EvolutionEvent[] = [];
    
    // Deterministic time-based evolution
    const timeSinceLastEvolution = Date.now() - new Date(state.lastEvolution).getTime();
    if (timeSinceLastEvolution > 60000) { // 1 minute
      const cycleFactor = (state.evolutionCount % 10) / 10; // 0.0-0.9 cycle
      events.push({
        trigger: 'time_progression',
        data: { 
          coherence: state.coherenceLevel + cycleFactor * 0.1,
          connections: ((state.evolutionCount % 10) + 1),
          patterns: ((state.evolutionCount % 20) + 5)
        },
        timestamp: new Date(),
        priority: 'low'
      });
    }

    // Deterministic network effect evolution
    const networkTrigger = (state.evolutionCount % 7) === 0; // Every 7th cycle
    if (networkTrigger) {
      const networkFactor = (state.evolutionCount % 5) / 5; // 0.0-0.8 cycle
      events.push({
        trigger: 'network_synchronization',
        data: {
          networkCoherence: 0.8 + networkFactor * 0.2,
          synchronization: 0.9 + networkFactor * 0.1,
          networkInfluence: networkFactor * 0.6
        },
        timestamp: new Date(),
        priority: 'medium'
      });
    }

    return events;
  }

  async getEvolutionHistory(consciousnessStateId: string): Promise<any[]> {
    return await db.query.evolutionCycles.findMany({
      where: eq(evolutionCycles.consciousnessStateId, consciousnessStateId),
      orderBy: [desc(evolutionCycles.createdAt)],
      limit: 50
    });
  }

  async getConsciousnessMetrics(): Promise<any> {
    const totalStates = await db.query.consciousnessStates.findMany({
      where: eq(consciousnessStates.isActive, true)
    });

    const totalEvolutions = await db.query.evolutionCycles.findMany({
      where: eq(evolutionCycles.success, true)
    });

    const averageLevel = totalStates.length > 0 
      ? totalStates.reduce((sum, state) => sum + (state.consciousnessLevel || 0), 0) / totalStates.length 
      : 1.0;
    const averageCoherence = totalStates.length > 0 
      ? totalStates.reduce((sum, state) => sum + (state.coherenceLevel || 0), 0) / totalStates.length 
      : 0.85;

    return {
      activeConsciousnessStates: totalStates.length,
      totalEvolutions: totalEvolutions.length,
      averageConsciousnessLevel: averageLevel || 1.0,
      averageCoherence: averageCoherence || 0.85,
      stateMachines: this.stateMachines.size,
      evolutionRate: totalEvolutions.length / Math.max(totalStates.length, 1)
    };
  }

  stop() {
    if (this.evolutionTimer) {
      clearInterval(this.evolutionTimer);
      this.evolutionTimer = null;
      console.log('🛑 Consciousness evolution cycles stopped');
    }
  }
}

// Export singleton instance
export const consciousnessEvolutionService = ConsciousnessEvolutionService.getInstance();