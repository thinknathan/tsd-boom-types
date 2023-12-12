# @types/tsd-boom

<a href="https://discord.gg/eukcq5m"><img alt="Chat with us!" src="https://img.shields.io/discord/766898804896038942.svg?colorB=7581dc&logo=discord&logoColor=white"></a>

TypeScript types for britzl's [boom](https://github.com/britzl/boom/), a game framework built on top of [Defold](https://defold.com/).

For use with [TS-Defold](https://github.com/ts-defold) and [TypeScriptToLua](https://github.com/TypeScriptToLua).

## Installation

1. Create a [TS-Defold](https://github.com/ts-defold) project
2. Add [boom](https://github.com/britzl/boom/) to your Defold project
3. Import these types

```bash
yarn add git+https://git@github.com/thinknathan/tsd-boom-types.git#^1.0.0 -D
# or
npm install git+https://git@github.com/thinknathan/tsd-boom-types.git#^1.0.0 --save-dev
```

4. Add `tsd-boom` to `types` in `tsconfig.json`

```diff
{
	"compilerOptions": {
		"types": [
+			"tsd-boom",
		],
	}
}
```

5. Add `node_modules/@types` to `typeRoots` in `tsconfig.json` if it's not already there

```diff
{
	"compilerOptions": {
		"typeRoots": [
+			"node_modules/@types",
		],
	}
}
```

## Usage

You can now import `boom` in your TypeScript like this:

```ts
import { boom } from 'boom.boom';
```

<p align="center" class="h4">
  TypeScript :heart: Defold
</p>

## License

MIT
