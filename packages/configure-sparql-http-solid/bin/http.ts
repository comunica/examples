#!/usr/bin/env node
/*
 This script exposes a SPARQL endpoint that can be started from the command line.
 It is exposed as `my-comunica-http`, as defined in package.json.
 It is optional, and can be omitted from the package if not needed.
 */
import {HttpServiceSparqlEndpoint} from "@comunica/actor-init-sparql";
HttpServiceSparqlEndpoint.runArgsInProcess(process.argv.slice(2), process.stdout, process.stderr,
  __dirname + '/../', process.env, __dirname + '/../config/config-default.json', () => process.exit(1));
