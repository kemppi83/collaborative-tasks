# My fullstack TypeScript template

The client side was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) (CRA). The server side is running on Node.js and Express. The main point of this template is to gather a good ESLint and Prettier configuration for both applications. Both the client and the server need to be separately compiled to JavaScript with the command `tsc`before they can be separately run with the command `npm start`.

## VSCode

I found a good basis for VSCode configuration in this [video](https://www.youtube.com/watch?v=YIvjKId9m2c). What I learned was that the ESLint and Prettier extensions run concurrently, which may cause problems. So, if you have both extensions, disable the Prettier one.

I have added these lines to my VSCode settings.json:
```
"eslint.validate": [
      "typescript",
      "typescriptreact"
  ],
  // Autosave configs
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.formatOnSave": false,
  },
  // "eslint.autoFixOnSave": true,
  "editor.codeActionsOnSave": { "source.fixAll.eslint": true },
  "eslint.alwaysShowStatus": true,
  "editor.tabSize": 2,
}
```

The instructions on making your ESLint run Prettier are in the end of next section of this Readme.

## Client side

CRA includes under the hood very comprehensive linter configuration, for both JavaScript and TypeScript. It also offers a template for TypeScript. I used the template and created the client side app on the command line with the command:

```
create-react-app client --template typescript --use-npm
```

The CRA linter configuration can be seen [here](https://github.com/facebook/create-react-app/tree/master/packages/eslint-config-react-app). It says in the README that the CRA already has ESLint and the following plugins in use:

- eslint
- eslint-config-react-app
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- babel-eslint
- eslint-plugin-flowtype
- eslint-plugin-import
- eslint-plugin-jsx-a11y
- eslint-plugin-react
- eslint-plugin-react-hooks

When creating a project, linter is taken automatically in use in package.json:

```
"eslintConfig": {
  "extends": [
    "react-app",
    "react-app/jest"
  ]
},
```

The eslintConfig also has the line `"react-app/jest"`. This enables linter configuration for Jest and React Testing Library. However, you have to install these plugins manually if you want to use them. Type in the command line:

```
npm install --save-dev eslint-plugin-jest@^24.0.0 eslint-plugin-testing-library@^3.9.0
```

I moved the eslintConfig from package.json to .eslintrc.js. In that file, you can add plugins, extends and/or rules to either the whole app or only to the TypeScript files (section 'overrides').

CRA has chosen the linting rules that they are using from different plugins manually. You can add more rules in the .eslintrc.js file or extend recommended rule sets from different plugins.

# Prettier

CRA installs Prettier automatically, as can be seen in their [package.json](https://github.com/facebook/create-react-app/blob/master/package.json). I'm using [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) to run Prettier as an ESLint rule. Installation:

```
npm install --save-dev eslint-plugin-prettier
```

I'm using [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) to disable all formatting-related ESLint rules so that they don't interfere with Prettier. Installation:

```
npm install --save-dev eslint-config-prettier
```

With eslint-config-prettier installed, all you need to do is to put this as the LAST extends:

```
{
  "extends": ["plugin:prettier/recommended"]
}
```

in your .eslintrc.js. It expands under the hood to:

```
{
  "extends": ["prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off"
  }
}
```

My formatting rules can be found in the file .prettierrc.js.

## Server side

The server is a very basic Node.js and Express.js server template, written in TypeScript. Linting is done with ESLint and parsed by [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser). In addition, the plugin [@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin) is used.