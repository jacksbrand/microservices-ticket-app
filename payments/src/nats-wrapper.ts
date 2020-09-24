import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _sc?: Stan;

  get sc() {
    if (!this._sc) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._sc;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._sc = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this._sc?.on('connect', () => {
        console.log('---PAYMENTS--- Connected to NATS');
        resolve();
      });
      this._sc?.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
