/*
 This is the browser counterpart to index.ts.

 As configured in package.json, browser applications (as packaged by webpack, browserify, ...)
 will make use of index-browser.ts instead of index-ts.

 This is because index.ts exposes newEngineDynamic(), which depends on local file access APIs,
 which are not available in the browser.
 */
import {ActorInitSparql} from '@comunica/actor-init-sparql/lib/ActorInitSparql-browser';

/**
 * Create a new comunica engine from the default config.
 * @return {ActorInitSparql} A comunica engine.
 */
export function newEngine(): ActorInitSparql {
  return require('./engine-browser.js');
}
