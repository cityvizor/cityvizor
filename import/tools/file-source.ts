export class FileSource implements UnderlyingSource {

  fr: FileReader;

  chunkSize: number = 1024 * 65; //65k

  chunkStart: number = 0;

  loadedChunkCb:() => void;

  constructor(private file: File) {

  }

  start(controller: ReadableStreamDefaultController) {
    this.fr = new FileReader();
    this.fr.onload = (e) => {
      controller.enqueue(this.fr.result);
      this.loadedChunkCb();
      this.loadedChunkCb = () => {};
    }
    this.fr.onerror = e => {
      controller.error(this.fr.error);
    }
  }

  pull(controller: ReadableStreamDefaultController) {
    if (this.chunkStart <= this.file.size) {
      this.fr.readAsArrayBuffer(this.file.slice(this.chunkStart, this.chunkStart + this.chunkSize));
      this.chunkStart += this.chunkSize;
    }
    else {
      controller.close();
    }

    return new Promise<void>((resolve,reject) => {
      this.loadedChunkCb = resolve;
    });
    
  }

}