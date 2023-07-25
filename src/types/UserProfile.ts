import { TranferInfo } from "./TransferInfo";
import { Menu } from "./Menu";

export interface UserProfile {
	id: string,
	name: string,
	avatar: string, //img link
	tranferInfo: TranferInfo,
	menu: Menu[],
}