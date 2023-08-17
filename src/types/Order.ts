// import { WantedInfo } from "./WantedInfo";

export interface Order {
  id: string;
  isClosed: boolean;
  shipFee: number;
  discount: number;
  // time: number,
  // wanted: WantedInfo,
  // shopOwnerName: string;
  // shopOwnerMomo: string;
  selectedMenuName: string;
  selectedMenuLink: string;
  uid: string;
  timestamp: firestoreTimestamp;
  // bank1Name: string;
  // bank1Number: string;
  // bank2Name: string;
  // bank2Number: string;
  // shopOwnerAvatar: string;
}

interface firestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}
