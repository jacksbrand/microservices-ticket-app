import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from '@jackswebbrand-firetix/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
