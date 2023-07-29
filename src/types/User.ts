import { Menu } from "./Menu";
// import { BankInfo } from "./BankInfo";

export interface User {
	id: string,
	name: string,
	// avatar: string, //img link
  momo: string,
	// banks: BankInfo[],
	menus: Menu[],
}