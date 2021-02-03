import {Transform, TransformCallback} from 'stream';
import {Importer} from './importer';

export class ImportTransformer extends Transform {
  eventIds: number[] = [];

  constructor() {
    super({readableObjectMode: true, writableObjectMode: true});
  }

  _transform(
    chunk: Importer.ImportChunk,
    encoding: string,
    callback: TransformCallback
  ) {
    // remove duplicate events
    if (chunk.type === 'event') {
      if (this.eventIds.indexOf(chunk.record.id) !== -1) {
        callback(
          new Error(
            `Duplicate event with id ${chunk.record.id} found, aborting!`
          )
        );
      }

      this.eventIds.push(chunk.record.id);
    }

    callback(null, chunk);
  }
}
