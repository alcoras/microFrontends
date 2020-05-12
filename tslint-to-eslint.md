Remove after migration

1. In VScode extensions remove Tslint and install Eslint (exact extension name: dbaeumer.vscode-eslint)
2. In a project root remove tslin.json
3. copy .eslintrc.js
4. run: npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-jsdoc
5. uninstall tslint, tslint-sonarts: npm un tslint tslint-sonarts