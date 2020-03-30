#!/usr/bin/env node
/*
 This script exposes a command line tool for executing queries.
 It is exposed as `my-comunica`, as defined in package.json.
 It is optional, and can be omitted from the package if not needed.
 */
// tslint:disable:no-var-requires
import {runArgsInProcessStatic} from "@comunica/runner-cli";
runArgsInProcessStatic(require('../engine-default.js'));
