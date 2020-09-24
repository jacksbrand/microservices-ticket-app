import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@jackswebbrand-firetix/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
