export interface ProfileRecord {
	
	id:number;

	hidden: boolean;
	
	url: string;
	name: string;
	email: string;
	avatar: Buffer;
	
	ico: string;
	dataBox: string;
	edesky: number;
	mapasamospravy: number;
  gpsX:number;
  gpsY:number;
	
}