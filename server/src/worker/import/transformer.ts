import { Transform, TransformCallback } from "stream";
import { BalanceChunk, PaymentChunk, EventChunk } from "./parser";

export class ImportTransformer extends Transform {

  eventIds: string[] = [];

  constructor() {
    super({ readableObjectMode: true, writableObjectMode: true });
  }

  _transform(chunk: BalanceChunk | PaymentChunk | EventChunk, encoding: string, callback: TransformCallback) {
    
    // remove duplicate events
    if (chunk.type === "event") {

      if (this.eventIds.indexOf(chunk.data.id) !== -1) {
        callback();
        return;
      }

      this.eventIds.push(chunk.data.id);
    }

    callback(null, chunk)
  }
}