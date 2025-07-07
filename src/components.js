/**
 * @agent Claude: UI component patterns for web applications
 * This module demonstrates component-based architecture and state management
 */

/**
 * Base component class with lifecycle methods
 */
class BaseComponent {
  constructor(element, props = {}) {
    this.element = element;
    this.props = props;
    this.state = {};
    this.mounted = false;

    this.init();
  }

  /**
   * Initialize component
   */
  init() {
    this.render();
    this.bindEvents();
    this.mounted = true;
    this.onMount();
  }

  /**
   * Update component state
   * @param {Object} newState - New state values
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    if (this.mounted) {
      this.render();
      this.bindEvents();
    }
  }

  /**
   * Render component (to be implemented by subclasses)
   */
  render() {
    throw new Error('render() must be implemented by subclasses');
  }

  /**
   * Bind event listeners (to be implemented by subclasses)
   */
  bindEvents() {
    // Override in subclasses
  }

  /**
   * Lifecycle hook called after component mounts
   */
  onMount() {
    // Override in subclasses
  }

  /**
   * Cleanup component
   */
  destroy() {
    this.mounted = false;
    this.element.innerHTML = '';
  }
}

/**
 * @agent Codex: Form component with validation
 */
class FormComponent extends BaseComponent {
  constructor(element, props = {}) {
    super(element, {
      fields: [],
      onSubmit: () => {},
      validation: {},
      ...props,
    });

    this.state = {
      values: {},
      errors: {},
      isSubmitting: false,
    };
  }

  render() {
    const { fields } = this.props;
    const { values = {}, errors = {}, isSubmitting } = this.state;

    this.element.innerHTML = `
      <form class="form-component">
        ${fields
          .map(
            field => `
          <div class="form-field">
            <label for="${field.name}">${field.label}</label>
            <input
              type="${field.type || 'text'}"
              id="${field.name}"
              name="${field.name}"
              value="${values[field.name] || ''}"
              ${field.required ? 'required' : ''}
              ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
            />
            ${errors[field.name] ? `<span class="error">${errors[field.name]}</span>` : ''}
          </div>
        `
          )
          .join('')}
        <button type="submit" ${isSubmitting ? 'disabled' : ''}>
          ${isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    `;
  }

  bindEvents() {
    const form = this.element.querySelector('form');

    // Handle input changes
    form.addEventListener('input', e => {
      const { name, value } = e.target;
      this.setState({
        values: { ...this.state.values, [name]: value },
      });
    });

    // Handle form submission
    form.addEventListener('submit', e => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  /**
   * @agent Copilot: Validate form data
   */
  validateForm() {
    const { validation } = this.props;
    const { values } = this.state;
    const errors = {};

    Object.keys(validation).forEach(field => {
      const rules = validation[field];
      const value = values[field];

      if (rules.required && !value) {
        errors[field] = `${field} is required`;
      } else if (rules.minLength && value && value.length < rules.minLength) {
        errors[field] =
          `${field} must be at least ${rules.minLength} characters`;
      } else if (rules.pattern && value && !rules.pattern.test(value)) {
        errors[field] = `${field} format is invalid`;
      }
    });

    return errors;
  }

  /**
   * Handle form submission
   */
  async handleSubmit() {
    const errors = this.validateForm();

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    this.setState({ isSubmitting: true, errors: {} });

    try {
      await this.props.onSubmit(this.state.values);
    } catch (error) {
      this.setState({ errors: { submit: error.message } });
    } finally {
      this.setState({ isSubmitting: false });
    }
  }
}

/**
 * @agent Copilot: List component with filtering and sorting
 */
class ListComponent extends BaseComponent {
  constructor(element, props = {}) {
    super(element, {
      items: [],
      renderItem: item => `<div>${JSON.stringify(item)}</div>`,
      sortBy: null,
      filterBy: null,
      ...props,
    });

    this.state = {
      sortOrder: 'asc',
      filterValue: '',
    };
  }
  render() {
    const filteredItems = this.getFilteredItems();
    const sortedItems = this.getSortedItems(filteredItems);

    this.element.innerHTML = `
      <div class="list-component">
        <div class="list-controls">
          <input 
            type="text" 
            placeholder="Filter items..."
            value="${this.state.filterValue}"
            class="filter-input"
          />
          <select class="sort-select">
            <option value="">Sort by...</option>
            ${
              this.props.items.length > 0
                ? Object.keys(this.props.items[0])
                    .map(
                      key =>
                        `<option value="${key}" ${this.props.sortBy === key ? 'selected' : ''}>${key}</option>`
                    )
                    .join('')
                : ''
            }
          </select>
        </div>
        <div class="list-items">
          ${sortedItems.map(item => this.props.renderItem(item)).join('')}
        </div>
      </div>
    `;
    this.bindEvents();
  }

  bindEvents() {
    const filterInput = this.element.querySelector('.filter-input');
    const sortSelect = this.element.querySelector('.sort-select');

    filterInput.addEventListener('input', e => {
      this.setState({ filterValue: e.target.value });
    });

    sortSelect.addEventListener('change', e => {
      this.props.sortBy = e.target.value;
      this.render();
    });
  }

  getFilteredItems() {
    const { items, filterBy } = this.props;
    const { filterValue } = this.state;

    if (!filterValue) return items;

    if (filterBy) {
      return items.filter(
        item =>
          item[filterBy] &&
          item[filterBy]
            .toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase())
      );
    }

    // If no specific filterBy field, search all string fields
    return items.filter(item =>
      Object.values(item).some(
        value =>
          value &&
          value.toString().toLowerCase().includes(filterValue.toLowerCase())
      )
    );
  }

  getSortedItems(items) {
    const { sortBy } = this.props;
    const { sortOrder } = this.state;

    if (!sortBy) return items;

    return [...items].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }
}

module.exports = {
  BaseComponent,
  FormComponent,
  ListComponent,
};
