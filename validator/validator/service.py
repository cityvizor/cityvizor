import json
import os

import boto3
from lib.message import Level
from lib.parser import Parser

BUCKET_NAME = os.environ['BUCKET_NAME']
INPUT_TMP_FILE = '/tmp/input.csv'
OUTPUT_TMP_FILE = '/tmp/output.txt'


def handler(event, context):
    s3 = boto3.resource('s3')
    input_file = event['Records'][0]['s3']['object']['key']

    parser = Parser.create(input_file)
    if parser is None:
        return

    s3.Bucket(BUCKET_NAME).download_file(input_file, INPUT_TMP_FILE)

    f = open(OUTPUT_TMP_FILE, 'w')
    output_name = os.path.basename(input_file).replace('.csv', '.txt')
    s3.Bucket(BUCKET_NAME).upload_file(OUTPUT_TMP_FILE, 'output/{}'.format(output_name))
    f.close()

    with open(INPUT_TMP_FILE, 'r') as input:
        errors = parser.parse(input)

        with open(OUTPUT_TMP_FILE, 'w') as f:
            success = not any(e.level is Level.ERROR for e in errors)
            result = {'success': success, 'errors': [str(error) for error in errors]}
            f.write(json.dumps(result))

    s3.Bucket(BUCKET_NAME).upload_file(OUTPUT_TMP_FILE, 'output/{}'.format(output_name))
