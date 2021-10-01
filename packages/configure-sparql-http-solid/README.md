**While this guide can still be followed, if you just want to query Solid pods with Comunica, you can use [this ready-to-use engine](https://comunica.dev/docs/query/advanced/solid/) instead.**

# Comunica Example: Replacing the HTTP actor with a Solid HTTP actor

This is an example [Comunica](https://github.com/comunica/comunica) package where the default HTTP actor has been replaced by the [Solid HTTP actor](https://github.com/comunica/actor-http-solid-auth-fetch).

Most probably, you will not need all files in this example package,
you can omit any of the files you don't need.

Concretely, this example package does the following:
* **Required:** Comunica config with Solid HTTP actor.
* **Optional:** Usage of TypeScript
* **Optional:** Comunica CLI tool
* **Optional:** Comunica dynamic CLI tool
* **Optional:** Comunica SPARQL endpoint
* **Optional:** Exposing the engine via the npm package.
* **Optional:** Exposing the engine via the npm package for browser applications.

The remainder of this README contains several pointers on how this package is constructed.

## Package Overview

### Configs

Comunica allows you to create custom query engines by combining modules via a JSON configuration file.
If you want to learn more about these config files, please refer to [these slides](https://comunica.github.io/Tutorial-ESWC2019-Comunica-Advanced-Slides/)
and our tutorial on [creating a custom Comunica actor](https://github.com/comunica/Tutorial-Comunica-Reduced-Actor/wiki/Comunica-tutorial:-Creating-a-REDUCED-actor).

**1. package.json entries**

In order for the Comunica framework to recognise your custom engine,
you need to add this entry to your package.json file:

* **Required:** `"lsd:module": true`: Indicates that this is a package with components for the Comunica framework.

**2. components/config.jsonld**

The `components/config.jsonld` file is used to define JSON shortcuts for your `config.jsonld` file.
As before, make sure you replace `example-configure-sparql-http-solid` with your package name.

**3. Config file**

The default configuration of Comunica SPARQL can be found [here](https://github.com/comunica/comunica/tree/master/packages/actor-init-sparql/config).
[`config-default.json`](https://github.com/comunica/comunica/blob/master/packages/actor-init-sparql/config/config-default.json)
imports several smaller config files, which are present in the [`sets/` folder](https://github.com/comunica/comunica/tree/master/packages/actor-init-sparql/config/sets).
Each config set contains a collection of pre-configured actors that can be reused.

If you want to create your own config file, it suffices to copy [Comunica SPARQL's `config-default.json`](https://github.com/comunica/comunica/blob/master/packages/actor-init-sparql/config/config-default.json)
to your own package, and adjust the imports you want to change.
You can even remove entries that you don't want/need if you want to reduce package size.
As before, make sure you replace `example-configure-sparql-http-solid` with your package name.

The `config/config-default.json` in this package only replaces the import to `files-cais:config/sets/http-solid.json`
to `files-ex:config/sets/http-solid.json`.
`files-ex:config/sets/http-solid.json` points to our `config/sets/http-solid.json` file,
in which we have configured the Solid HTTP actor. 

As you can see, our `config/sets/http/json` is a direct copy of [Comunica SPARQL's `config/sets/http/json`](https://github.com/comunica/comunica/blob/master/packages/actor-init-sparql/config/sets/http.json),
with a few adjustments:

* Replaced `@comunica/actor-http-native` with `@comunica/actor-http-solid-auth-fetch` in the `@context` definitions,
* Replace the actor `ActorHttpNative` with `ActorHttpSolidAuthFetch`. 

**4. (Optional) Compile config file to JavaScript**

*This step is only required if you want to make use of `bin/query.ts` or expose your engine via the npm package.*

When you want to use your Comunica engine in production,
it is recommended to compile your Comunica config into a compiled JavaScript representation.
This is to [avoid the expensive dependency injection phase](https://componentsjs.readthedocs.io/en/latest/compilation/).

This can be done by doing the following:

* Add `@comunica/runner` dev-dependency to package.json.
* Add `comunica-compile-config` script to package.json to create a `engine-default.js` file.

As you can see, the `engine-default.js` file is used in a couple of performance-critical places,
such as `index.ts` and `bin/query.ts`.

### TypeScript

Just like Comunica, this package makes use of [TypeScript](https://www.typescriptlang.org/).
By making applications strongly typed, many programming errors can be moved from runtime to compile time.

Note that the TypeScript language is merely a recommendation for Comunica applications.
It is possible to write Comunica applications in JavaScript directly as well.

The relevant parts to make a package TypeScript-enabled are the following:

* `typescript` dev-dependency in package.json.
* A `tsconfig.json` file containing the TypeScript options.
* Compile of TypeScript to JavaScript by invoking `tsc` in a package.json script.
* Invoke TypeScript building on `prepublishOnly` in package.json, to ensure valid JS files before publishing to npm.
* Add `.js` and `.d.ts` files to `.gitignore`, to avoid these files to be included in Git, only `.ts` files should be included in Git.
* An empty `.npmignore` file, to avoid `.ts` files to be published to npm, as only `.js` files should be published to npm.
* Add `.js` and `.d.ts` to the `files` array in package.json, so that (only) these files are published to npm.

### CLI tools

The following command line tools are typically exposed from Comunica engines:

* `bin/query.ts`: a command line tool for executing queries.
* `bin/query-dynamic.ts`: a command line tool for executing queries, based on a custom Comunica config.
* `bin/http.ts`: a command line tool for starting a SPARQL endpoint.

Each of them has a `bin` entry in package.json.

### Programmatic Access

`index.ts` exposes your Comunica engine via the `newEngine` function.

Additionally, `newEngineDynamic` is exposed, which allows a custom config to be passed.
This is useful if you want to change the configuration of certain actors slightly.

Don't forget to add a `main` entry to your package.json file pointing to your index.

### Browser

You may want to use your engine within Web browsers.
In this case, you must create an `index-browser.ts` file,
and add a `browser` entry to package.json which overrides `index.ts` with `index-browser.ts`.

This essentially removes all functionality from Comunica that is not applicable within Web browsers,
such as local file access.
