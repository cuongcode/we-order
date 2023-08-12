import clsx from 'clsx';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { db } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import { selector } from '@/redux';
import type { DrinkTableRow } from '@/types';

export const OptionsDropdown = ({
  options,
  row,
  field,
}: {
  options: string[];
  row: DrinkTableRow;
  field: keyof DrinkTableRow;
}) => {
  const { order } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);

  const [isDropdown, setIsDropdown] = useState(false);

  const showOptions = options.filter((option: string) => option !== row[field]);

  const optionDropdownRef = useCheckClickOutside(() => setIsDropdown(false));

  const _updateManyRows = async (newValue: string) => {
    const updatedRows = rows.filter(
      (r: DrinkTableRow) => r.offerBy === row.name,
    );
    updatedRows.forEach(async (r: DrinkTableRow) => {
      const ref = doc(db, 'orders', order.id, 'rows', r.id);
      await updateDoc(ref, {
        [field]: newValue,
      });
    });
  };

  const _updateRow = async (newValue: string) => {
    const docRef = doc(db, 'orders', order.id, 'rows', row.id);
    await updateDoc(docRef, {
      [field]: newValue,
    });
    if (field === 'offerBy') {
      _updateManyRows(newValue);
    }
    setIsDropdown(false);
  };

  return (
    <div ref={optionDropdownRef} className="relative">
      <button
        type="button"
        className="w-full"
        onClick={() => setIsDropdown(true)}
      >
        {row[field]}
      </button>
      {isDropdown && showOptions.length !== 0 ? (
        <div
          className={clsx({
            'absolute flex flex-col items-center gap-1 bg-gray-400 p-1 rounded-lg':
              true,
            '-top-1 left-10': field === 'sugar' || field === 'ice',
            '-top-1 left-7': field === 'size',
            '-top-1 left-16': field === 'offerBy',
          })}
        >
          {showOptions.map((option: string) => (
            <button
              key={option}
              type="button"
              className={clsx({
                'bg-white rounded-md text-center hover:bg-gray-500': true,
                'w-9 h-6': field === 'sugar' || field === 'ice',
                'w-6 h-6': field === 'size',
                'h-6 w-14': field === 'offerBy',
              })}
              onClick={() => _updateRow(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};
