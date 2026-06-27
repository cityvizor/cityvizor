export async function collectObjects(
  stream: NodeJS.ReadableStream
): Promise<unknown[]> {
  return new Promise((resolve, reject) => {
    const chunks: unknown[] = [];

    stream.on("data", chunk => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(chunks));
  });
}
