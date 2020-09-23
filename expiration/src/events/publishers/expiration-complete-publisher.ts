import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from '@jackswebbrand-firetix/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
