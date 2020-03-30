/*
 If you publish your query engine as a package to npm,
 developers that depend on your package will be able to use your query engine as exported in this index file.
 */
export {newEngine} from './index-browser';

import {ActorInitSparql} from '@comunica/actor-init-sparql/lib/ActorInitSparql-browser';
import {IQueryOptions, newEngineDynamicArged} from "@comunica/actor-init-sparql/lib/QueryDynamic";

/**
 * Create a new dynamic comunica engine from a given config file.
 * @param {IQueryOptions} options Optional options on how to instantiate the query evaluator.
 * @return {Promise<QueryEngine>} A promise that resolves to a fully wired comunica engine.
 */
export function newEngineDynamic(options?: IQueryOptions): Promise<ActorInitSparql> {
  return newEngineDynamicArged(options || {}, __dirname, __dirname + '/config/config-default.json');
}
