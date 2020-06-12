export interface UserMap {
	[userID: string]: string;
}

export interface ActivtitesMap {
	[activityName: string]: {
		[userID: string]: number;
	};
}

export interface Season {
	name: string;
	users: UserMap;
	activites: ActivtitesMap;
	phase: number;
	id: string;
	voteStart: Date,
	createDate: Date,
	seasonStart: Date,
}