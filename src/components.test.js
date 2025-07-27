/**
 * @agent Codex: Component tests demonstrating UI testing patterns
 */

const {
  BaseComponent,
  FormComponent,
  ListComponent,
} = require('./components.js');

// Mock DOM environment
const createMockElement = () => ({
  innerHTML: '',
  querySelector: jest.fn(),
  addEventListener: jest.fn(),
});

describe('BaseComponent', () => {
  let element;

  beforeEach(() => {
    element = createMockElement();
  });

  test('initializes with props and state', () => {
    const props = { title: 'Test Component' };

    class TestComponent extends BaseComponent {
      render() {
        this.element.innerHTML = `<div>${this.props.title}</div>`;
      }
    }

    const component = new TestComponent(element, props);

    expect(component.props.title).toBe('Test Component');
    expect(component.mounted).toBe(true);
    expect(element.innerHTML).toBe('<div>Test Component</div>');
  });

  test('updates state and re-renders', () => {
    class TestComponent extends BaseComponent {
      render() {
        this.element.innerHTML = `<div>${this.state.count || 0}</div>`;
      }
    }

    const component = new TestComponent(element);
    expect(element.innerHTML).toBe('<div>0</div>');

    component.setState({ count: 5 });
    expect(element.innerHTML).toBe('<div>5</div>');
  });

  test('destroys component properly', () => {
    class TestComponent extends BaseComponent {
      render() {
        this.element.innerHTML = '<div>Test</div>';
      }
    }

    const component = new TestComponent(element);
    component.destroy();

    expect(component.mounted).toBe(false);
    expect(element.innerHTML).toBe('');
  });
});

describe('FormComponent', () => {
  let element;

  beforeEach(() => {
    element = createMockElement();
    element.querySelector.mockReturnValue({
      addEventListener: jest.fn(),
    });
  });

  test('renders form with fields', () => {
    const props = {
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
      ],
    };

    new FormComponent(element, props);

    expect(element.innerHTML).toContain('Name');
    expect(element.innerHTML).toContain('Email');
    expect(element.innerHTML).toContain('required');
  });

  test('validates form data', () => {
    const props = {
      fields: [
        { name: 'name', label: 'Name' },
        { name: 'email', label: 'Email' },
      ],
      validation: {
        name: { required: true },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      },
    };

    const form = new FormComponent(element, props);

    // Test validation with empty data
    const errors = form.validateForm();
    expect(errors.name).toBe('name is required');
    expect(errors.email).toBe('email is required');
  });

  test('validates email pattern', () => {
    const props = {
      fields: [{ name: 'email', label: 'Email' }],
      validation: {
        email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      },
    };

    const form = new FormComponent(element, props);
    form.setState({ values: { email: 'invalid-email' } });

    const errors = form.validateForm();
    expect(errors.email).toBe('email format is invalid');
  });

  test('validates minimum length', () => {
    const props = {
      fields: [{ name: 'password', label: 'Password' }],
      validation: {
        password: { minLength: 8 },
      },
    };

    const form = new FormComponent(element, props);
    form.setState({ values: { password: '123' } });

    const errors = form.validateForm();
    expect(errors.password).toBe('password must be at least 8 characters');
  });

  test('passes validation with valid data', () => {
    const props = {
      fields: [
        { name: 'name', label: 'Name' },
        { name: 'email', label: 'Email' },
      ],
      validation: {
        name: { required: true },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      },
    };

    const form = new FormComponent(element, props);
    form.setState({
      values: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    });

    const errors = form.validateForm();
    expect(Object.keys(errors)).toHaveLength(0);
  });
});

describe('ListComponent', () => {
  let element;

  beforeEach(() => {
    element = createMockElement();
    element.querySelector.mockReturnValue({
      addEventListener: jest.fn(),
    });
  });

  test('renders list items', () => {
    const props = {
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ],
      renderItem: item => `<div>${item.name}</div>`,
    };

    new ListComponent(element, props);

    expect(element.innerHTML).toContain('Item 1');
    expect(element.innerHTML).toContain('Item 2');
  });

  test('filters items by value', () => {
    const props = {
      items: [
        { id: 1, name: 'Apple' },
        { id: 2, name: 'Banana' },
        { id: 3, name: 'Orange' },
      ],
      filterBy: 'name',
    };

    const list = new ListComponent(element, props);
    list.setState({ filterValue: 'app' });

    const filteredItems = list.getFilteredItems();
    expect(filteredItems).toHaveLength(1); // Only Apple
    expect(filteredItems[0].name).toBe('Apple');
  });

  test('sorts items by field', () => {
    const props = {
      items: [
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ],
      sortBy: 'name',
    };

    const list = new ListComponent(element, props);
    const sortedItems = list.getSortedItems(props.items);

    expect(sortedItems[0].name).toBe('Alice');
    expect(sortedItems[1].name).toBe('Bob');
    expect(sortedItems[2].name).toBe('Charlie');
  });

  test('sorts items in descending order', () => {
    const props = {
      items: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ],
      sortBy: 'name',
    };

    const list = new ListComponent(element, props);
    list.setState({ sortOrder: 'desc' });

    const sortedItems = list.getSortedItems(props.items);

    expect(sortedItems[0].name).toBe('Charlie');
    expect(sortedItems[1].name).toBe('Bob');
    expect(sortedItems[2].name).toBe('Alice');
  });

  test('handles empty items array', () => {
    const props = {
      items: [],
      renderItem: item => `<div>${item.name}</div>`,
    };

    new ListComponent(element, props);

    expect(element.innerHTML).toContain('list-component');
    expect(element.innerHTML).toContain('list-items');
  });
});
