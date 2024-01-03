import { HeartIcon } from '@heroicons/react/24/outline';

export const FEATURE_LIST = [
  {
    id: 1,
    content: (
      <>
        <span>Import and save your favorite</span>
        <span className="text-yellow-500">MENUS</span>
      </>
    ),
  },
  {
    id: 1,
    content: (
      <>
        <span className="text-purple-500">OFFER</span>
        <span>your friends drinks, your bill will be counted separately</span>
      </>
    ),
  },

  {
    id: 1,
    content: (
      <>
        <span>If someone offers you a drink, give them a big</span>
        <HeartIcon className="h-6 w-6 text-red-500" />
        <span>(cause they may offer more)</span>
      </>
    ),
  },
  {
    id: 1,
    content: (
      <>
        <span>Set a</span>
        <span className="text-green-500">COUNTDOWN</span>
        <span>cause someone just cannot make up their mind</span>
      </>
    ),
  },
  {
    id: 1,
    content: (
      <>
        <span className="text-orange-500">WANTED</span>
        <span>someone if he/she still owes you money</span>
      </>
    ),
  },
];
