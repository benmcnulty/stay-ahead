/**
 * Add two numbers.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function add(a, b) {
  return a + b;
}

/**
 * @agent Claude: This is a data processing utility that demonstrates
 * functional programming patterns for agent collaboration
 */

/**
 * Process an array of items with a transformation function
 * @param {Array} items - Items to process
 * @param {Function} transform - Transformation function
 * @returns {Array} Processed items
 */
function processItems(items, transform) {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array');
  }
  return items.map(transform);
}

/**
 * @agent Codex: Implement validation utilities for data integrity
 */

/**
 * Validate user input with customizable rules
 * @param {Object} data - Data to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result
 */
function validateInput(data, rules) {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];

    if (rule.required && (value === undefined || value === null)) {
      errors[field] = `${field} is required`;
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    }

    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = `${field} format is invalid`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * @agent Copilot: Async utilities for modern JavaScript patterns
 */

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @returns {Promise} Promise that resolves with function result
 */
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}

module.exports = {
  add,
  processItems,
  validateInput,
  retryWithBackoff,
};
