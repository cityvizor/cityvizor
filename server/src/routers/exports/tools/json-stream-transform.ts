import { Transform, TransformCallback } from "stream";

export class JSONStreamTransform extends Transform {
  private counter = 0;

  constructor() {
    super({
      writableObjectMode: true,
      readableObjectMode: false,
    });
  }

  _transform(chunk, encoding: string, callback: TransformCallback) {
    if (!this.counter) this.push("[");

    if (this.counter) this.push(",");

    this.counter++;

    this.push(JSON.stringify(chunk));

    callback();
  }

  _flush(callback: TransformCallback) {
    if (!this.counter) this.push("[");

    this.push("]");

    callback();
  }
}
