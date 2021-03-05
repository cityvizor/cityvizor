/**
 * User object to save data concerning profile
 */
export class Profile {

    /**
     * profile identification
     */
    id: number;

    status: "visible" | "hidden" | "pending" | "preview";

    main: boolean;

    url: string;
    name: string;
    entity: any;
    gpsX: number;
    gpsY: number;
    ico: string;
    edesky?: number;
    mapasamospravy: number;

    avatarType: string;
    avatarUrl: string;

}