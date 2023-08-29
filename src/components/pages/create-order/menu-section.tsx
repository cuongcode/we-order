import type { Menu } from '@/types';

import { MenusByEmbedLink } from './menu-by-embed-link';
import { MenusByImage } from './menus-by-image';

export const MenusSection = ({
  setMenuImageList,
  selectedMenu,
  setSelectedMenu,
}: {
  setMenuImageList: (updatedMenuImageList: string[]) => void;
  selectedMenu: Menu;
  setSelectedMenu: (menu: Menu) => void;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="flex h-9 items-center gap-3">
          <div>Today Menu: </div>
          <div className="w-fit rounded-lg bg-gray-200 px-3 py-1 drop-shadow-md">
            {selectedMenu.name ? selectedMenu.name : 'Select a menu'}
          </div>
        </div>
      </div>
      <MenusByEmbedLink
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
        setMenuImageList={setMenuImageList}
      />
      <MenusByImage
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
        setMenuImageList={setMenuImageList}
      />
    </div>
  );
};
