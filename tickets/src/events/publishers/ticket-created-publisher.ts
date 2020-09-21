import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@jackswebbrand-firetix/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
