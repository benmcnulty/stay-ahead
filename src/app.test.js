const {
  add,
  processItems,
  validateInput,
  retryWithBackoff,
} = require('./app.js');

describe('Basic Math Operations', () => {
  test('adds numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('handles negative numbers', () => {
    expect(add(-1, 1)).toBe(0);
  });
});

describe('Data Processing', () => {
  test('processes array items with transform function', () => {
    const items = [1, 2, 3];
    const double = x => x * 2;
    expect(processItems(items, double)).toEqual([2, 4, 6]);
  });

  test('throws error for non-array input', () => {
    expect(() => processItems('not an array', x => x)).toThrow(
      'Items must be an array'
    );
  });

  test('handles empty array', () => {
    expect(processItems([], x => x)).toEqual([]);
  });
});

describe('Input Validation', () => {
  test('validates required fields', () => {
    const data = { name: 'John' };
    const rules = {
      name: { required: true },
      email: { required: true },
    };

    const result = validateInput(data, rules);
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('email is required');
  });

  test('validates minimum length', () => {
    const data = { password: '123' };
    const rules = { password: { minLength: 8 } };

    const result = validateInput(data, rules);
    expect(result.isValid).toBe(false);
    expect(result.errors.password).toBe(
      'password must be at least 8 characters'
    );
  });

  test('validates pattern matching', () => {
    const data = { email: 'invalid-email' };
    const rules = { email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ } };

    const result = validateInput(data, rules);
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('email format is invalid');
  });

  test('passes valid data', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };
    const rules = {
      name: { required: true },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      password: { required: true, minLength: 8 },
    };

    const result = validateInput(data, rules);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });
});

describe('Async Utilities', () => {
  test('retries function on failure', async () => {
    let attempts = 0;
    const flaky = async () => {
      attempts++;
      if (attempts < 3) throw new Error('Temporary failure');
      return 'success';
    };

    const result = await retryWithBackoff(flaky);
    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });

  test('throws after max retries', async () => {
    const alwaysFails = async () => {
      throw new Error('Always fails');
    };

    await expect(retryWithBackoff(alwaysFails, 2)).rejects.toThrow(
      'Always fails'
    );
  });

  test('succeeds on first try', async () => {
    const succeeds = async () => 'immediate success';

    const result = await retryWithBackoff(succeeds);
    expect(result).toBe('immediate success');
  });
});
