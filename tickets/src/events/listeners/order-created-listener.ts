import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@jackswebbrand-firetix/common';
import { qGroupName } from './qGroupName';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  qGroupName = qGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });

    //  Save the ticket
    await ticket.save();

    await new TicketUpdatedPublisher(this.sc).publish({
      id: ticket.id,
      userId: ticket.userId,
      version: ticket.version,
      price: ticket.price,
      orderId: ticket.orderId,
      title: ticket.title,
    });

    // Ack the message
    msg.ack();
  }
}
