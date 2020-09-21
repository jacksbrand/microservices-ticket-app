import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@jackswebbrand-firetix/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
