export default {
  'src/**/*.{js,ts}': ['eslint --fix', 'prettier --write'],
  'tests/**/*.{js,ts}': ['eslint --fix', 'prettier --write'],
  '*.{json,md}': ['prettier --write']
};
