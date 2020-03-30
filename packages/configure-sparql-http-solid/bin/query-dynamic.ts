#!/usr/bin/env node
/*
 This script exposes a command line tool for executing queries, based on a custom Comunica config.
 It is exposed as `my-comunica-dynamic`, as defined in package.json.
 It is optional, and can be omitted from the package if not needed.
 */
import {runArgsInProcess} from "@comunica/runner-cli";
runArgsInProcess(__dirname + '/../', __dirname + '/../config/config-default.json');
