export interface ProfileRecord {

	id: number;

	status: "visible" | "pending" | "hidden";
	main: boolean;

	url: string;
	name: string;
	email: string;
	avatarType: string | null;
	avatarUrl?: string;

	ico: string;
	dataBox: string;
	edesky: number;
	mapasamospravy: number;
	gpsX: number;
	gpsY: number;

	tokenCode: number;

}