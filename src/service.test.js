/**
 * @agent Codex: Service layer tests demonstrating API testing patterns
 */

const { BaseService, UserService, CacheService } = require('./service.js');

// Mock fetch for testing
global.fetch = jest.fn();

describe('BaseService', () => {
  let service;

  beforeEach(() => {
    service = new BaseService('https://api.example.com');
    fetch.mockClear();
    fetch.mockReset();
  });

  test('makes successful request', async () => {
    const mockResponse = { id: 1, name: 'Test' };
    const mockFetchResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    };

    fetch.mockResolvedValueOnce(mockFetchResponse);

    const result = await service.request('/test');

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/test', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(result).toEqual(mockResponse);
  });

  test('handles HTTP errors', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: jest.fn().mockResolvedValue({ error: 'Not Found' }),
    };

    fetch.mockResolvedValue(mockResponse);

    await expect(service.request('/nonexistent')).rejects.toThrow(
      'HTTP 404: Not Found'
    );
  });

  test('retries on network failure', async () => {
    const mockSuccessResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true }),
    };

    fetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockSuccessResponse);

    const result = await service.request('/flaky');

    expect(fetch).toHaveBeenCalledTimes(3);
    expect(result).toEqual({ success: true });
  });

  test('throws after max retries', async () => {
    fetch.mockRejectedValue(new Error('Persistent error'));

    await expect(service.request('/always-fails')).rejects.toThrow(
      'Persistent error'
    );
    expect(fetch).toHaveBeenCalledTimes(3);
  });
});

describe('UserService', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService('https://api.example.com', 'test-key');
    fetch.mockClear();
    fetch.mockReset();
  });

  test('gets user by ID', async () => {
    const mockUser = { id: '123', name: 'John Doe' };
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockUser),
    };

    fetch.mockResolvedValueOnce(mockResponse);

    const result = await userService.getUser('123');

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/users/123', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-key',
      },
    });
    expect(result).toEqual(mockUser);
  });

  test('creates new user', async () => {
    const userData = { name: 'Jane Doe', email: 'jane@example.com' };
    const createdUser = { id: '456', ...userData };
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(createdUser),
    };

    fetch.mockResolvedValueOnce(mockResponse);

    const result = await userService.createUser(userData);

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-key',
      },
      body: JSON.stringify(userData),
    });
    expect(result).toEqual(createdUser);
  });

  test('updates existing user', async () => {
    const updates = { name: 'Updated Name' };
    const updatedUser = { id: '123', name: 'Updated Name' };
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(updatedUser),
    };

    fetch.mockResolvedValueOnce(mockResponse);

    const result = await userService.updateUser('123', updates);

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/users/123', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-key',
      },
      body: JSON.stringify(updates),
    });
    expect(result).toEqual(updatedUser);
  });

  test('deletes user', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    };

    fetch.mockResolvedValueOnce(mockResponse);

    const result = await userService.deleteUser('123');

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/users/123', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-key',
      },
    });
    expect(result).toBe(true);
  });
});

describe('CacheService', () => {
  let cache;

  beforeEach(() => {
    cache = new CacheService(1000); // 1 second TTL for testing
  });

  test('stores and retrieves values', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });

  test('returns null for non-existent keys', () => {
    expect(cache.get('nonexistent')).toBeNull();
  });

  test('expires values after TTL', () => {
    jest.useFakeTimers();
    cache.set('key1', 'value1', 100); // 100ms TTL

    jest.advanceTimersByTime(150);
    expect(cache.get('key1')).toBeNull();
    jest.useRealTimers();
  });

  test('cleans up expired entries', () => {
    jest.useFakeTimers();
    cache.set('key1', 'value1', 100);
    cache.set('key2', 'value2', 1000);

    jest.advanceTimersByTime(150);
    cache.cleanup();
    expect(cache.cache.has('key1')).toBe(false);
    expect(cache.cache.has('key2')).toBe(true);
    jest.useRealTimers();
  });

  test('allows custom TTL per entry', () => {
    jest.useFakeTimers();
    cache.set('short', 'value', 50);
    cache.set('long', 'value', 1000);

    jest.advanceTimersByTime(100);
    expect(cache.get('short')).toBeNull();
    expect(cache.get('long')).toBe('value');
    jest.useRealTimers();
  });
});
