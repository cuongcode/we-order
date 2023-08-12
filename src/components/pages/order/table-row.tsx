import { doc, updateDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';

import { db } from '@/firebase';
import { selector } from '@/redux';
import type { DrinkTableRow } from '@/types';

import { BonusFormula } from './bonus-formula';
import { DeleteRowButton } from './delete-row-button';
import { GiveHeart } from './give-heart';
import { OfferedByFormula } from './offered-by-formula';
import { OptionsDropdown } from './options-dropdown';
import { ShowFormula } from './show-formula';
import { TransferFormula } from './transfer-formula';

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL'];
const PERCENTAGE_OPTIONS = ['100%', '80%', '50%', '20%', '0%'];

export const TableRow = ({
  row,
  rowIndex,
  transfer,
}: {
  row: DrinkTableRow;
  rowIndex: any;
  transfer: number | undefined;
}) => {
  const { order } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);

  // useMemo here ?
  const offerByOptions = [
    '--',
    ...rows
      .filter((_row: DrinkTableRow) => _row.offerBy === '--')
      .map((_row: DrinkTableRow) => _row.name),
  ].filter((option: string) => option !== row.name && option !== '');

  const _updateRow = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const docRef = doc(db, 'orders', order.id, 'rows', row.id);
    await updateDoc(docRef, {
      [name]: value,
    });
  };

  return (
    <div key={row.id} className="flex w-full items-center gap-2 text-xs">
      <div className="w-4">{rowIndex}</div>
      <div className="relative w-14 rounded-md border-2 bg-white p-1 drop-shadow-md hover:border-gray-600">
        <input
          className="w-full"
          type="text"
          value={row.name}
          name="name"
          onChange={_updateRow}
        />
        <div className="absolute -right-2 top-4 ">
          <GiveHeart row={row} />
        </div>
      </div>
      <div className="grow rounded-md border-2 bg-white p-1 drop-shadow-md hover:border-gray-600">
        <input
          className="w-full"
          type="text"
          placeholder="Type Here"
          value={row.drink.toUpperCase()}
          name="drink"
          onChange={_updateRow}
        />
        {/* <DrinkInput order={order} row={row} /> */}
      </div>
      <div className="w-14 rounded-md border-2 bg-white p-1 drop-shadow-md hover:border-gray-600">
        <input
          className="w-full"
          type="number"
          value={row.price !== 0 ? row.price : ''}
          name="price"
          onChange={_updateRow}
        />
      </div>
      <div className="z-30 w-8 rounded-md border-2 bg-white p-1 drop-shadow-md">
        <OptionsDropdown row={row} options={SIZE_OPTIONS} field="size" />
      </div>
      <div className="z-20 w-11 rounded-md border-2 bg-white p-1 drop-shadow-md">
        <OptionsDropdown row={row} options={PERCENTAGE_OPTIONS} field="sugar" />
      </div>
      <div className="z-10 w-11 rounded-md border-2 bg-white p-1 drop-shadow-md">
        <OptionsDropdown row={row} options={PERCENTAGE_OPTIONS} field="ice" />
      </div>
      <div className="w-32 rounded-md border-2 bg-white p-1 drop-shadow-md hover:border-gray-600">
        <input
          className="w-full"
          type="text"
          placeholder="No topping"
          value={row.topping}
          name="topping"
          onChange={_updateRow}
        />
      </div>
      <div className="z-10 w-16 rounded-md border-2 bg-white p-1 drop-shadow-md">
        <OptionsDropdown row={row} options={offerByOptions} field="offerBy" />
      </div>
      <div className="flex w-28 items-center gap-1">
        <div className="w-16 rounded-md bg-gray-400 p-1 drop-shadow-md">
          {transfer?.toLocaleString('en-US')}
        </div>
        <ShowFormula>
          {row.offerBy !== '--' ? (
            <div className="absolute -top-16 right-0 z-10 flex flex-col gap-2 divide-y-2 rounded-lg bg-white p-2">
              <OfferedByFormula row={row} />
            </div>
          ) : (
            <div className="absolute -top-28 right-0 z-10 flex flex-col gap-2 divide-y-2 rounded-lg bg-white p-2">
              <TransferFormula row={row} transfer={transfer} />
              <BonusFormula />
            </div>
          )}
        </ShowFormula>
        <DeleteRowButton row={row} />
      </div>
    </div>
  );
};

// const DrinkInput = ({ order, row }: { order: Order; row: DrinkTableRow }) => {
//   const [isEdit, setIsEdit] = useState(false);
//   const [drink, setDrink] = useState('');

//   const _onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     setDrink(value);
//   };
//   const _updateRow = async () => {
//     const docRef = doc(db, 'orders', order.id, 'rows', row.id);
//     await updateDoc(docRef, {
//       drink,
//     });
//     setIsEdit(false);
//   };

//   return (
//     <div className="relative">
//       {isEdit || row.drink === '' ? (
//         <>
//           <input
//             className="w-full"
//             type="text"
//             placeholder="Type Here"
//             value={drink.toUpperCase()}
//             name="drink"
//             onChange={_onChange}
//           />
//           <button className="absolute right-0 top-0" onClick={_updateRow}>
//             <CheckIcon className="h-4 w-4" />
//           </button>
//         </>
//       ) : (
//         <>
//           <div className="w-full">{row.drink.toUpperCase()}</div>
//           <button
//             className="absolute right-0 top-0"
//             onClick={() => setIsEdit(!isEdit)}
//           >
//             <PencilSquareIcon className="h-4 w-4" />
//           </button>
//         </>
//       )}
//     </div>
//   );
// };
