import {
  Subjects,
  Publisher,
  OrderCancelledEvent,
} from '@jackswebbrand-firetix/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
