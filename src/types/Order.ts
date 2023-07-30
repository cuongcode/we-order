// import { WantedInfo } from "./WantedInfo";

export interface Order {
	id: string,
	// isCloseOrder: boolean,
  shipFee: number,
  discount: number,
	// time: number,
  // wanted: WantedInfo,
  shopOwnerName: string,
  shopOwnerMomo: string,
  selectedMenuName: string,
  selectedMenuLink: string,
}