module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:jsdoc/recommended"
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": 12,
		"sourceType": "module"
	},
	"plugins": [
		"@typescript-eslint",
		"jsdoc"
	],
	"rules": {
		"jsdoc/require-jsdoc": "on",
		"jsdoc/newline-after-description": "off",
		"jsdoc/require-param-type": "off",
		"jsdoc/require-returns-type": "off",
    	"no-mixed-spaces-and-tabs": "off",
		"quotes": [
			"warn",
			"double"
		],
		"semi": [
			"error",
			"always"
		]
	}
};
