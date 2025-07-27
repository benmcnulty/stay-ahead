/**
 * @agent Codex: Global test setup and utilities for agent collaboration
 * This file configures testing environment and shared testing utilities
 */

// Extend Jest matchers for better testing experience
expect.extend({
  /**
   * Custom matcher for testing agent handoff patterns
   * @param {string} received - The code or comment to check
   * @param {string} agentName - Expected agent name
   */
  toHaveAgentHandoff(received, agentName) {
    const pass = received.includes(`@agent ${agentName}`);

    if (pass) {
      return {
        message: () => `Expected code not to have @agent ${agentName} handoff`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected code to have @agent ${agentName} handoff`,
        pass: false,
      };
    }
  },

  /**
   * Custom matcher for testing JSDoc documentation
   * @param {Function} received - Function to check
   */
  toHaveJSDocComment(received) {
    const funcString = received.toString();
    const hasJSDoc = funcString.includes('/**') || funcString.includes('* @');

    if (hasJSDoc) {
      return {
        message: () => 'Expected function not to have JSDoc comment',
        pass: true,
      };
    } else {
      return {
        message: () => 'Expected function to have JSDoc comment',
        pass: false,
      };
    }
  },
});

// Global test utilities for agent collaboration
global.testUtils = {
  /**
   * Create mock agent context for testing
   * @param {string} agentName - Name of the agent
   * @param {Object} context - Agent context data
   */
  createMockAgentContext: (agentName, context = {}) => ({
    agent: agentName,
    timestamp: new Date().toISOString(),
    ...context,
  }),

  /**
   * Simulate agent handoff for testing
   * @param {string} fromAgent - Current agent
   * @param {string} toAgent - Target agent
   * @param {Object} payload - Data to pass
   */
  simulateAgentHandoff: (fromAgent, toAgent, payload = {}) => ({
    type: 'agent_handoff',
    from: fromAgent,
    to: toAgent,
    payload,
    timestamp: new Date().toISOString(),
  }),

  /**
   * Mock DOM element factory for component testing
   */
  createMockElement: () => ({
    innerHTML: '',
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    setAttribute: jest.fn(),
    getAttribute: jest.fn(),
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn(),
      toggle: jest.fn(),
    },
  }),
};

// Setup global mocks for consistent testing
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();

  // Reset fetch mock if it exists
  if (global.fetch && global.fetch.mockClear) {
    global.fetch.mockClear();
  }
});

// Global test cleanup
afterEach(() => {
  // Clean up any DOM modifications
  if (typeof document !== 'undefined') {
    document.body.innerHTML = '';
  }
});

