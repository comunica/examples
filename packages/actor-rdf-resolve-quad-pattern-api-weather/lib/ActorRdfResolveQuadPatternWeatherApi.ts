import {
  ActorRdfResolveQuadPattern,
  IActionRdfResolveQuadPattern,
  IActorRdfResolveQuadPatternOutput
} from '@comunica/bus-rdf-resolve-quad-pattern';
import { IActorTest } from '@comunica/core';
import * as DataFactory from '@rdfjs/data-model';
import { EmptyIterator, SingletonIterator } from 'asynciterator';

// Some constants that will be reused several times
const RESOURCE_PREFIX = 'http://dbpedia.org/resource/';
const PREDICATE_WEATHER = DataFactory.namedNode('http://example.org/temperature');

/**
 * ActorRdfResolveQuadPatternWeatherApi allows quad pattern queries to be executed over a weather API.
 * This weather API returns JSON, but we translate it on-the-fly to RDF.
 */
export class ActorRdfResolveQuadPatternWeatherApi extends ActorRdfResolveQuadPattern {

  // No explicit constructor, as it is inherited from ActorRdfResolveQuadPattern

  public async test(action: IActionRdfResolveQuadPattern): Promise<IActorTest> {
    // Make sure that this actor is only used when querying https://samples.openweathermap.org/data/2.5/weather
    const baseUrl: string | undefined = this.getContextSourceUrl(this.getContextSource(action.context));
    if (!baseUrl || baseUrl !== 'https://samples.openweathermap.org/data/2.5/weather') {
      throw new Error(`${this.name} requires a single source with URL 'http://samples.openweathermap.org/data/2.5/weather' to be present in the context.`);
    }
    return true;
  }

  // This run method will be called for every triple/quad pattern in the query
  // Additionally, this will be called during query planning,
  // for which the estimated number of resulting quads (totalItems) metadata will be retrieved.
  public async run(action: IActionRdfResolveQuadPattern): Promise<IActorRdfResolveQuadPatternOutput> {
    // Determine requested URL
    // Due to our test() implementation, this will always be https://samples.openweathermap.org/data/2.5/weather
    const baseUrl: string | undefined = this.getContextSourceUrl(this.getContextSource(action.context));
    if (!baseUrl) {
      throw new Error('Illegal state: Invalid weatherApi source found.');
    }

    // For patterns that match '<http://dbpedia.org/resource/...> <http://example.org/temperature> ?object'
    if (action.pattern.subject.termType === 'NamedNode' && action.pattern.subject.value.startsWith(RESOURCE_PREFIX)
      && action.pattern.predicate.equals(PREDICATE_WEATHER)
      && action.pattern.object.termType === 'Variable'
      && action.pattern.graph.termType === 'DefaultGraph') {
      // Fetch the raw temperature data
      const cityName = action.pattern.subject.value.slice(RESOURCE_PREFIX.length);
      const temperature = await this.fetchCityTemperature(baseUrl, cityName);

      // Return a single triple '<http://dbpedia.org/resource/...> <http://example.org/temperature> "temperatureValue"'
      return {
        // SingletonIterator is an AsyncIterator with one data element
        // Read more about AsyncIterators here: https://github.com/RubenVerborgh/AsyncIterator/
        // ADVANCED: this data stream will not always be consumed. For better performance, autoStart can be set to false on large data streams.
        data: new SingletonIterator(DataFactory.quad(
          action.pattern.subject,
          PREDICATE_WEATHER,
          DataFactory.literal(temperature),
        )),
        // Metadata will be retrieved during query planning,
        // and should provide an estimate of the number of items in the 'data' stream
        metadata: async () => ({ totalItems: 1 }),
      }
    }

    // For patterns that match '?subject <http://example.org/temperature> ?object',
    // return infinity metadata so de-prioritize it during query planning.
    if (action.pattern.subject.termType === 'Variable'
      && action.pattern.predicate.equals(PREDICATE_WEATHER)
      && action.pattern.object.termType === 'Variable'
      && action.pattern.graph.termType === 'DefaultGraph') {
      return {
        // EmptyIterator is an AsyncIterator without data elements
        // Read more about AsyncIterators here: https://github.com/RubenVerborgh/AsyncIterator/
        data: new EmptyIterator(),
        // Metadata will be retrieved during query planning,
        // and should provide an estimate of the number of items in the 'data' stream
        metadata: async () => ({ totalItems: Infinity }),
      };
    }

    // Return empty data and metadata for all other queries
    return {
      data: new EmptyIterator(),
      metadata: async () => ({ totalItems: 0 }),
    };
  }

  protected async fetchCityTemperature(baseUrl: string, cityName: string) {
    // Do a simple HTTP(S) request
    const response = await fetch(`${baseUrl}?q=${encodeURI(cityName)}&appid=439d4b804bc8187953eb36d2a8c26a02`)
    // Obtain the JSON output
    const data = await response.json();
    // Navigate to the JSON field we need
    return data.main.temp;
  }

}
