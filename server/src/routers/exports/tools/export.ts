import express from 'express';
import Knex from 'knex';

import CsvStringify from 'csv-stringify';
import {Readable} from 'stream';

import {JSONStreamTransform} from './json-stream-transform';

export function exportStream(
  req: express.Request,
  res: express.Response,
  stream: Readable,
  filename: string
) {
  stream.on('error', err => res.status(500).send(err.message));

  if (req.accepts('json')) {
    res.type('json');

    res.setHeader(
      'content-disposition',
      'attachment; filename=' + filename + '.json'
    );

    const json = new JSONStreamTransform();

    stream.pipe(json).pipe(res);
  } else if (req.accepts('csv')) {
    res.type('csv');

    res.setHeader(
      'content-disposition',
      'attachment; filename=' + filename + '.csv'
    );

    const csv = CsvStringify({delimiter: ',', header: true});
    csv.on('error', err => res.status(500).send(err.message));

    stream.pipe(csv).pipe(res);
  } else {
    res.sendStatus(406);
  }
}

export function exportArray(
  req: express.Request,
  res: express.Response,
  array: unknown[],
  filename: string
) {
  const stream = new Readable({
    objectMode: true,
    read() {
      const item = array.pop();

      if (!item) {
        this.push(null);
        return;
      }

      this.push(item);
    },
  });

  exportStream(req, res, stream, filename);
}

export function exportQuery(
  req: express.Request,
  res: express.Response,
  data: Knex.QueryBuilder,
  filename: string
) {
  const stream = data.stream();

  // close readable stream and release db connection on user connection abort
  req.on('close', stream.end.bind(stream));

  exportStream(req, res, stream, filename);
}
