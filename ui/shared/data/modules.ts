
/**
	* module list has been moved to app-config.js, this file is for backwards compatibility
	*/

import { AppConfig } from "../../config/app-config";

export class Module {
	public id: string;
	public url: string;
	public name: string;
	public optional: boolean;
}

export const MODULES:Module[] = AppConfig.modules;