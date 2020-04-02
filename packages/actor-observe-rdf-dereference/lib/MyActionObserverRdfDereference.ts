import {IActionRdfDereference, IActorRdfDereferenceOutput} from "@comunica/bus-rdf-dereference";
import {ActionObserver, Actor, IActionObserverArgs, IActorTest} from "@comunica/core";

/**
 * An MyActionObserverRdfDereference will be subscribed to the rdf-dereference bus.
 * For each rdf-dereference action, it will track all URLs that were dereferenced,
 * and it will count all quads/triples that were read.
 */
export class MyActionObserverRdfDereference extends ActionObserver<IActionRdfDereference, IActorRdfDereferenceOutput> {

  /**
   * An array of all URLs that were dereferenced.
   */
  public readonly urls: string[] = [];
  /**
   * A counter of all quads that were parsed across all documents.
   */
  public quads: number = 0;

  constructor(args: IActionObserverArgs<IActionRdfDereference, IActorRdfDereferenceOutput>) {
    super(args);
    // Subscribe this observer to the rdf-dereference bus.
    this.bus.subscribeObserver(this);
  }

  public onRun(actor: Actor<IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>, // The actor that executes the dereference action
               action: IActionRdfDereference, // The dereference action
               output: Promise<IActorRdfDereferenceOutput>, // The promise to a dereference action output, as executed by the actor
  ): void {
    // Wait for the dereference action to finish
    output.then(({ url, quads }) => {
      // Collect the dereferenced URL
      this.urls.push(url);

      // Instead of attaching a data-listener directly to the quads stream,
      // we wait for at least one listener to be attached already.
      // This is needed because if we register our listener before Comunica's internal listener,
      // then the stream may already start emitting data, which may then not be captured by Comunica,
      // resulting in incorrect query result.
      const listener: (...args: any[]) => void = (event) => {
        if (event === 'data') {
          quads.removeListener('newListener', listener); // We don't want to listen multiple times
          // Attach a quads listener, that will just increment a counter for each incoming triple
          quads.on('data', () => this.quads++);
        }
      };
      quads.on('newListener', listener);
    });
  }

}
