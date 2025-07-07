/**
 * @agent Claude: Service layer demonstrating API integration patterns
 * This module shows how to structure services for external integrations
 */

/**
 * Base service class with common functionality
 */
class BaseService {
  constructor(baseUrl, options = {}) {
    this.baseUrl = baseUrl;
    this.options = {
      timeout: 5000,
      retries: 3,
      ...options,
    };
  }

  /**
   * Make HTTP request with built-in retry logic
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} Response data
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // @agent Codex: Implement retry logic with exponential backoff
    for (let i = 0; i < this.options.retries; i++) {
      try {
        const response = await fetch(url, config);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        if (i === this.options.retries - 1) throw error;

        // Exponential backoff
        await new Promise(resolve =>
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
      }
    }
  }
}

/**
 * @agent Codex: User service with CRUD operations
 */
class UserService extends BaseService {
  constructor(baseUrl, apiKey) {
    super(baseUrl);
    this.apiKey = apiKey;
  }

  async request(endpoint, options = {}) {
    const requestOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    };
    return super.request(endpoint, requestOptions);
  }

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>} User data
   */
  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Update existing user
   * @param {string} id - User ID
   * @param {Object} updates - User updates
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(id, updates) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteUser(id) {
    await this.request(`/users/${id}`, { method: 'DELETE' });
    return true;
  }
}

/**
 * @agent Copilot: Cache service for performance optimization
 */
class CacheService {
  constructor(ttl = 300000) {
    // 5 minutes default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  /**
   * Get cached value
   * @param {string} key - Cache key
   * @returns {*} Cached value or null
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Set cached value
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live (optional)
   */
  set(key, value, ttl = this.ttl) {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl,
    });
  }

  /**
   * Clear expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
}

module.exports = {
  BaseService,
  UserService,
  CacheService,
};
