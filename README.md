# JS Obfuscator Advanced

A modern, advanced JavaScript obfuscation tool built as an ES Module. Transform your JavaScript code to make it harder to reverse-engineer while maintaining functionality.

## Features

- Variable renaming with random identifiers
- String encoding using hex transformation
- Control flow flattening
- Dead code injection
- TypeScript and JSX support
- Configurable obfuscation options

## Installation

```bash
npm install js-obfuscator-advanced
```

## Usage

```javascript
import { obfuscate } from 'js-obfuscator-advanced';

const sourceCode = `
  const greeting = "Hello World";
  let count = 0;
  
  function sayHello(name) {
    if (name) {
      console.log(greeting + " " + name);
    } else {
      console.log("No name provided");
    }
    return count++;
  }
`;

const obfuscated = obfuscate(sourceCode, {
  renameVariables: true,
  encodeStrings: true,
  flattenControlFlow: true,
  injectDeadCode: true
});

console.log(obfuscated);
```

## Options

The obfuscator accepts an optional configuration object with the following properties:

| Option             | Type    | Default | Description                       |
|--------------------|---------|---------|-----------------------------------|
| renameVariables   | boolean | true    | Rename variables to random IDs    |
| encodeStrings     | boolean | true    | Encode string literals to hex     |
| flattenControlFlow| boolean | true    | Flatten if-statements to switches |
| injectDeadCode    | boolean | true    | Add unreachable code blocks       |

Example with custom options:
```javascript
const obfuscated = obfuscate(code, {
  renameVariables: true,
  encodeStrings: false,
  flattenControlFlow: true,
  injectDeadCode: false
});
```

## Requirements

- Node.js 14+ (for ES module support)
- npm 6+

## Development

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Make changes in `src/obfuscator.js`
4. Test with `example.js`

## License

MIT License - see [LICENSE](LICENSE) for details

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Disclaimer

While this obfuscator makes code harder to read, it is not a foolproof security solution. Obfuscation can be reversed with sufficient effort. Use additional security measures for critical applications.
