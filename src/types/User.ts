// import { BankInfo } from "./BankInfo";

import type { Menu } from './Menu';

export interface User {
  uid: string;
  nickname: string | null;
  momo: string;
  bank1Name: string;
  bank1Number: string;
  bank2Name: string;
  bank2Number: string;
  menus: Menu[];
  // avatar: string, //img link
}
