module.exports = {
  plugins: [],
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:prettier/recommended' // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
  },
  overrides: [
    // Typescript specific configuration
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: [],
      extends: [
        'plugin:@typescript-eslint/recommended' // Uses the recommended rules from the @typescript-eslint/eslint-plugin
      ],
      rules: {}
    }
  ]
};
