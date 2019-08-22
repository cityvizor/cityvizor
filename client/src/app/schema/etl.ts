export class ETL {
	"id": string;
	"profile": string;
	"year": string;
	"visible": boolean;

	"status": {
		"validity": Date,
		"lastModified": Date,
		"etag": string,
		"warnings": string[]
	};

	"result": {
		"statusCode": number,
		"statusMessage": string,
		"error": string,
		"timestamp": Date,
	};
	
	"autoImport": {
		"enabled": boolean,
		"importer": string,
		"url": string,
		"delimiter": string,
	};

};
		
export class ETLLog {
  "profile": string;
  "etl": string;
  "timestamp": Date;
  
  "autoImport": boolean;
  "importer": string;
  
  "warnings": string[];
}