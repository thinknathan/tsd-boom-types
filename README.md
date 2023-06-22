# @types/tsd-boom

Types for britzl's [boom](https://github.com/britzl/boom/), a game framework built on top of [Defold](https://defold.com/). For use with [TS-Defold](https://github.com/ts-defold) and [TypeScriptToLua](https://github.com/TypeScriptToLua).

## Work in progress

This project's goal is to accurately describe boom's public API. Some undocumented properties may be added, but they are subject to change.

## Style

- `unknown` is preferred over `any`, although neither should be necessary in most cases.
- Lua `nil` should be described as `undefined`. `null` should not be used.
- Prefer sticking to the param and type names in the boom API unless they're likely to conflict with other libraries.
  - `GameObject` and `Component` were renamed for being too generic.

## Installation

1. Create a [TS-Defold](https://github.com/ts-defold) project
2. Add [boom](https://github.com/britzl/boom/) to your Defold project
3. Import these types

```bash
yarn add git+https://git@github.com/thinknathan/tsd-boom-types.git -D
# or
npm install git+https://git@github.com/thinknathan/tsd-boom-types.git --save-dev
```

4. Add `tsd-boom` to `types` in `tsconfig.json`
5. Add `node_modules/@types` to `typeRoots` in `tsconfig.json` if it's not already there

## Usage

You can now import `boom` in your TypeScript like this:

```ts
import { boom } from 'boom.boom';
```

## License

MIT
