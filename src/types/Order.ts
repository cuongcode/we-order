// import { UserProfile } from "./UserProfile";
import { Menu } from "./Menu";
// import { DrinkTableData } from "./DrinkTableData";
// import { WantedInfo } from "./WantedInfo";

export interface Order {
	// id: string,
	// shopOwnerProfile: UserProfile,
	isCloseOrder: boolean,
	// time: number,
  // wanted: WantedInfo,
	menu: Menu[],
	// tableData: DrinkTableData,
}