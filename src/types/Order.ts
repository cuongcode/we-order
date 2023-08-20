// import { WantedInfo } from "./WantedInfo";

export interface Order {
  id: string;
  isClosed: boolean;
  shipFee: number;
  discount: number;
  // time: number,
  selectedMenuName: string;
  selectedMenuLink: string;
  uid: string;
  timestamp: firestoreTimestamp;
  heart: number;
}

interface firestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}
