import { AggregateRoot, EventPublisher } from '@nestjs/cqrs';

export function mergeObjectContext<T extends AggregateRoot>(aggregate: T, publisher?: EventPublisher): T {
  return publisher ? publisher.mergeObjectContext(aggregate) : aggregate;
}
