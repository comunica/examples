# Comunica Examples

[![Build Status](https://travis-ci.org/comunica/examples.svg?branch=master)](https://travis-ci.org/comunica/examples)
[![Gitter chat](https://badges.gitter.im/comunica.png)](https://gitter.im/comunica/Lobby)

This is a repository of [Comunica](https://github.com/comunica/comunica) examples.

## Contributing new examples

If you want to add examples to this repo,
or if you want to fix mistakes in existing examples,
you can clone and set up this repo as follows.

These examples require [Node.JS](http://nodejs.org/) 10.0 or higher and the [Yarn](https://yarnpkg.com/en/) package manager.

This project can be setup by cloning and installing it as follows:

```bash
$ git clone https://github.com/comunica/examples.git
$ cd examples
$ yarn install
```

**Note: `npm install` is not supported at the moment, as this project makes use of Yarn's [workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) functionality**

This will install the dependencies of all modules, and bootstrap the Lerna monorepo.
After that, all [example packages](https://github.com/comunica/examples/tree/master/packages) are available in the `packages/` folder.

Furthermore, this will add [pre-commit hooks](https://www.npmjs.com/package/pre-commit)
to build, lint and test.
These hooks can temporarily be disabled at your own risk by adding the `-n` flag to the commit command.

## License
This code is copyrighted by [Ghent University – imec](http://idlab.ugent.be/)
and released under the [MIT license](http://opensource.org/licenses/MIT).
