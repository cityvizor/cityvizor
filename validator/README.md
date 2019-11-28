## Set up

```shell script
pip3 install -r requirements.txt
```

## Run in CLI

```shell script
python main.py test_data.csv # validates data file
python main.py test_events.csv # validates events file
```

## Deploy to lambda functions

1. Set up AWS credentials with `aws configure`.
2. Create service role for lambda functions and grant it access S3.
3. Replace `role` value in `result/config.yaml` and `validator/config.yaml`.
4. Deploy lambda functions:
    ```shell script
    cd result
    lambda deploy
    cd ../validator
    lambda deploy
    ``` 

`cityvizor-validator` function listens to file uploads to `input/` folder in the corresponding S3 bucket.
For files ending with `_data.csv` it launches data validator, for files ending with `_events.csv` it launches events validator.
When processing starts it creates empty file `output/FILENAME.txt`.
After processing ends this file is populated with the results of validation, e.g.:

```json
{
  "success": true, 
  "errors": [
    "[Level.WARNING] Line 1: \"counterpartyId\" is processed for types \"KDF\" or \"KOF\" only. Type is \"ROZ\" so it will be skipped."
  ]
}
```

`cityvizor-result` function can be used to monitor validation state and result.
It can be used with AWS API Gateway. Set up API gateway to use this lambda and call the endpoint
with the following parameters:

```json
{
  "filename": "FILENAME"
}
```

The returned result will be e.g.:

```json
{
    "data": {
        "success": true,
        "errors": [
            "[Level.WARNING] Line 1: \"counterpartyId\" is processed for types \"KDF\" or \"KOF\" only. Type is \"ROZ\" so it will be skipped."
        ]
    },
    "events": {
        "success": true,
        "errors": []
    }
}
```

Function looks for the files `FILENAME_data.txt` and `FILENAME_events.txt` in the `output/` folder and proxies the result
in the corresponding keys.