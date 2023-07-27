import { DrinkTableData, Order } from '@/types'

export const NEW_ORDER:Order = {
  id: '',
  isCloseOrder: false,
  menus: [
    {
      name: 'Koi',
      link: 'https://shopeefood.vn/ho-chi-minh/koi-the-ngo-duc-ke',
    }
  ],
  tableDataId: '',
}

export const NEW_DRINK_TABLE:DrinkTableData = {
  rows: [],
  shipFee: 0,
	discount: 0,
}

export const EMPTY_ORDER:Order = {
  id: '',
  isCloseOrder: false,
  menus: [],
  tableDataId: '',
}