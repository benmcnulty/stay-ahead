const { add } = require('./app.js');

test('adds numbers', () => {
  expect(add(2, 3)).toBe(5);
});
