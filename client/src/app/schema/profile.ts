export type ProfileStatus = "visible" | "hidden" | "pending" | "preview";

export type ProfileSumMode = "complete" | "visible";

export type ProfileType = "municipality" | "pbo" | "external"

export class Profile {
    id: number;

    status: ProfileStatus;
    sumMode: ProfileSumMode;
    type: ProfileType;
    pboCategoryId?: number | null;

    main: boolean;

    url: string;
    name: string;
    popupName?: string;
    entity: any;
    gpsX: number;
    gpsY: number;
    ico?: string;
    databox?: string;
    edesky?: number;
    parent?: number | null;
    mapasamospravy: number;

    avatarType: string;
    avatarUrl: string;
}
