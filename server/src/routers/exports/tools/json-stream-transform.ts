import { Transform, TransformCallback } from "stream";

export class JSONStreamTransform extends Transform {

  private first = true;

  constructor() {
    super({
      writableObjectMode: true,
      readableObjectMode: false
    });
  }

  _transform(chunk: any, encoding: string, callback: TransformCallback) {
    
    if (this.first){
      this.push("[");
      this.first = false;
    }
    else this.push(",");
    
    this.push(JSON.stringify(chunk));
    
    callback();
  }

  _flush(callback: TransformCallback) {
    this.push("]");
    callback();
  }
}