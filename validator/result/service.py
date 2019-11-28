import json
import os

import boto3

BUCKET_NAME = os.environ['BUCKET_NAME']


def handler(event, context):
    filename = event['filename']
    s3 = boto3.resource('s3')

    def result(file):
        try:
            response = s3.Object(BUCKET_NAME, 'output/{}_{}.txt'.format(filename, file)).get()['Body'].read()
            if len(response) == 0:
                return {'result': 'PROCESSING'}
            result = json.loads(response.decode())
            return result
        except Exception:
            return None

    return {
        'data': result('data'),
        'events': result('events'),
    }
