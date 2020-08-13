# Comunica Example: Query over a JSON weather API source

This is an example [Comunica](https://github.com/comunica/comunica) package where support is added for querying over a specific source,
namely a weather API that returns JSON responses.
This is done by creating an [`Actor`](https://github.com/comunica/comunica/blob/master/packages/core/lib/Actor.ts)
for the [`rdf-resolve-quad-pattern` bus](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-resolve-quad-pattern).

As a result, you will be able to query the temperature of specific cities:
```bash
$ node bin/query.js https://samples.openweathermap.org/data/2.5/weather \
    'SELECT * WHERE {
      <http://dbpedia.org/resource/Ghent> <http://example.org/temperature> ?temperature.
    }'
[
{"?temperature":"\"280.32\""}
]
```

Combining this source with other sources through federated querying are automatically enabled:
```bash
$ node bin/query.js https://samples.openweathermap.org/data/2.5/weather \
    https://fragments.dbpedia.org/2016-04/en \
    'SELECT * WHERE {
      # Will be retrieved from weater API
      ?city <http://example.org/temperature> ?temperature.

      # Will be retrieved from DBpedia
      ?city <http://www.w3.org/2000/01/rdf-schema#label> "Ghent"@en.
      ?city a <http://dbpedia.org/ontology/City>.
    }'
[
{"?temperature":"\"280.32\"","?city":"http://dbpedia.org/resource/Ghent"}
]
```

Concretely, this example package does the following:
* **Required:** Implementation of an actor that will listen on the `rdf-resolve-quad-pattern` bus: `lib/ActorRdfResolveQuadPatternWeatherApi.ts`
* **Required:** Comunica config with our custom actor: `config/config-default.json`
* **Optional:** Comunica CLI tool
* **Optional:** Comunica dynamic CLI tool
* **Optional:** Comunica SPARQL endpoint
* **Optional:** Exposing the engine via the npm package.
* **Optional:** Exposing the engine via the npm package for browser applications.

The remainder of this README contains several pointers on how this package is constructed.

### Actor implementation

Comunica allows _actors_ to be registered to buses.
When an _action_ is published on a bus,
all actors on this bus will be _tested_ to see if they can execute the given action.
One of the actors that can execute this action will then be allowed to _run_ and effectively execute this action. 

When creating an actor, you first have to determine which bus you want to registered to.
Buses in comunica are [packages that start with `bus-`](https://github.com/comunica/comunica/tree/master/packages).

In our case, we want to listen to RDF resolve quad pattern actions,
so we pick the [`rdf-resolve-quad-pattern` bus](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-resolve-quad-pattern).
This is the bus that will be invoked for every triple or quad pattern in the SPARQL query. 

All actors must implement the [`Actor` interface](https://github.com/comunica/comunica/blob/master/packages/core/lib/Actor.ts).
However, the `'@comunica/bus-rdf-resolve-quad-pattern'` package already provides an abstraction
[`ActorRdfResolveQuadPattern`](https://github.com/comunica/comunica/blob/master/packages/bus-rdf-resolve-quad-pattern/lib/ActorRdfResolveQuadPattern.ts)
that simplifies the implementation of actors in the `rdf-resolve-quad-pattern` bus.
Our implementation can be found in `lib/ActorRdfResolveQuadPatternWeatherApi.ts`, which extends from `ActorRdfResolveQuadPattern`.
Make sure to export this class from `index.ts`, so that this class can be instantiated later on.

### Configs

Similar to the [tutorial on creating a custom Comunica actor](https://github.com/comunica/Tutorial-Comunica-Reduced-Actor/wiki/Comunica-tutorial:-Creating-a-REDUCED-actor),
we define a `ActorRdfResolveQuadPatternApiWeather` component in the `components/` folder.
This will make it possible to refer to this component from within our config file.

In this example, we make use of the default Comunica SPARQL config,
and we just add an instance of our actor to it.

For this, we have a `config/config-default.json` file,
where we _import_ the [default Comunica SPARQL config `"files-cais:config/config-default.json"`](https://github.com/comunica/comunica/blob/master/packages/actor-init-sparql/config/config-default.json),
and we import a local configuration file `"files-ex:config/sets/rdf-resolve-quad-pattern-api-weather.json"`.

This local configuration file resides in `config/sets/rdf-resolve-quad-pattern-api-weather.json`,
which just contains an instance of `ActorRdfResolveQuadPatternApiWeather`. 

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
