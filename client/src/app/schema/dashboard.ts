export class DashboardYear{
	year:number;
	amount:number;
}

export class Dashboard {
	transportation:DashboardYear[];
	schools:DashboardYear[];
	housing:DashboardYear[];
	culture:DashboardYear[];
	sports:DashboardYear[];
	government:DashboardYear[];
}