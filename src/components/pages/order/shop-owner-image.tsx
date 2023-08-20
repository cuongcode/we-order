import { useSelector } from 'react-redux';

import { ImageGallery } from '@/components/common';
import { Icons } from '@/images';
import { selector } from '@/redux';

export const ShopOwnerImage = () => {
  const { currentUser, shopOwner } = useSelector(selector.user);

  return (
    <div className="relative rounded-full bg-gray-500 p-1">
      <img
        className="h-20 w-20 rounded-full bg-gray-200 object-cover"
        src={
          shopOwner?.avatar && shopOwner.avatar !== ''
            ? shopOwner.avatar
            : Icons.user_icon.src
        }
        alt="user-icon"
      />
      {currentUser && currentUser.uid === shopOwner?.uid ? (
        <div className="absolute -right-4 top-0">
          <ImageGallery />
        </div>
      ) : null}
    </div>
  );
};
