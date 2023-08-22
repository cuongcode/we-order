import {
  CameraIcon,
  CheckIcon,
  CloudArrowUpIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { CameraIcon as SolidCameraIcon } from '@heroicons/react/24/solid';
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { Portal } from '@/components/common';
import { storage } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import { selector } from '@/redux';

interface MenuImage {
  isSelected: boolean;
  url: string;
}

export const MenuImageGallery = () => {
  const { currentUser } = useSelector(selector.user);
  const [isOpen, setIsOpen] = useState(false);
  const [menuImageList, setMenuImageList] = useState<MenuImage[]>([]);

  useEffect(() => {
    _fetchGallery();
  }, []);

  const modalRef = useCheckClickOutside(() => {
    const updatedMenuImageList = menuImageList.map((item: MenuImage) => {
      return { ...item, isSelected: false };
    });
    setMenuImageList(updatedMenuImageList);
    setIsOpen(false);
  });

  const _onOpen = async () => {
    setIsOpen(true);
  };

  const _fetchGallery = async () => {
    const storageRef = ref(storage, `users/${currentUser?.uid}/menus`);
    const files = await listAll(storageRef);
    const updatedMenuImageList: MenuImage[] = [];
    files.items.forEach(async (itemRef) => {
      const url = await getDownloadURL(ref(storage, itemRef.fullPath));
      updatedMenuImageList.push({ isSelected: false, url });
    });
    setMenuImageList(updatedMenuImageList);
  };

  // const _setAvatar = async (url: string) => {
  //   if (currentUser) {
  //     const docRef = doc(db, 'users', currentUser?.uid);
  //     await updateDoc(docRef, {
  //       [field]: url,
  //     });
  //   }
  // };

  const _deleteAvatar = async (url: string) => {
    // if (url === currentUser?.avatar) {
    //   _setAvatar('');
    // }
    const storageRef = ref(storage, url);
    const updatedMenuImageList = menuImageList.filter(
      (item: MenuImage) => item.url !== url,
    );
    setMenuImageList(updatedMenuImageList);
    await deleteObject(storageRef);
  };

  const _onSelect = (menuImage: MenuImage) => {
    const updatedMenuImageList = menuImageList.map((item: MenuImage) => {
      if (item.url === menuImage.url) {
        return { ...item, isSelected: !item.isSelected };
      }
      return item;
    });
    setMenuImageList(updatedMenuImageList);
  };

  return (
    <div>
      <button onClick={_onOpen}>
        <PhotoIcon className="h-4 w-4" />
      </button>
      {isOpen ? (
        <Portal>
          <div className="fixed inset-0 z-10 h-full w-full bg-gray-800/50">
            <div
              ref={modalRef}
              className="m-auto mt-16 flex h-64 w-96 flex-col gap-5 rounded-xl bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div>My Gallery</div>
                <UploadImageButton
                  menuImageList={menuImageList}
                  setMenuImageList={setMenuImageList}
                />
              </div>
              <div className="no-scrollbar flex flex-wrap gap-2 overflow-x-auto">
                {menuImageList.map((item: MenuImage) => (
                  <div key={item.url} className="relative">
                    <div className="absolute -top-1 left-0">
                      <TickBox
                        menuImage={item}
                        menuImageList={menuImageList}
                        setMenuImageList={setMenuImageList}
                      />
                    </div>
                    <button onClick={() => _onSelect(item)}>
                      <img
                        src={item.url}
                        alt="user-icon"
                        className="h-20 w-20 rounded-lg bg-gray-200 object-cover"
                      />
                    </button>
                    <button
                      className="absolute right-0 top-0"
                      onClick={() => _deleteAvatar(item.url)}
                    >
                      <XMarkIcon className="h-4 w-4 rounded-full bg-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Portal>
      ) : null}
    </div>
  );
};

const UploadImageButton = ({
  menuImageList,
  setMenuImageList,
}: {
  menuImageList: MenuImage[];
  setMenuImageList: (updatedMenuImageList: MenuImage[]) => void;
}) => {
  const { currentUser } = useSelector(selector.user);
  const [selectedFile, setSelectedFile] = useState<Blob | undefined>(undefined);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadButtonRef = useCheckClickOutside(() => {
    formRef.current?.reset();
    setSelectedFile(undefined);
  });

  const _onClick = () => {
    inputRef.current?.click();
  };

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length !== 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const _onUpload = () => {
    if (selectedFile) {
      const storageRef = ref(
        storage,
        `users/${currentUser?.uid}/menus/${selectedFile.name}`,
      );
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);
      uploadTask.on(
        'state_changed',
        () => {
          //
        },
        () => {
          //
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          const downlardUrl_pathname = new URL(downloadUrl).pathname;
          if (
            menuImageList
              .map((item: MenuImage) => new URL(item.url).pathname)
              .indexOf(downlardUrl_pathname) === -1
          ) {
            const updatedMenuImageList = [
              ...menuImageList,
              { isSelected: false, url: downloadUrl },
            ];
            setMenuImageList(updatedMenuImageList);
          }
        },
      );
    }
    setSelectedFile(undefined);
    formRef.current?.reset();
  };

  return (
    <div>
      {selectedFile ? (
        <div ref={uploadButtonRef} className="flex items-center gap-1">
          <button className="" onClick={_onUpload}>
            <CloudArrowUpIcon className="h-4 w-4" />
          </button>
          <button>
            <SolidCameraIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button onClick={_onClick}>
          <CameraIcon className="h-4 w-4" />
        </button>
      )}
      <form ref={formRef} action="" className="hidden">
        <input
          type="file"
          ref={inputRef}
          accept="/image/*"
          onChange={_onChange}
        />
      </form>
    </div>
  );
};

const TickBox = ({
  menuImage,
  menuImageList,
  setMenuImageList,
}: {
  menuImage: MenuImage;
  menuImageList: MenuImage[];
  setMenuImageList: (updatedMenuImageList: MenuImage[]) => void;
}) => {
  const _onTick = async () => {
    const updatedMenuImageList = menuImageList.map((item: MenuImage) => {
      if (item.url === menuImage.url) {
        return { ...item, isSelected: !item.isSelected };
      }
      return item;
    });
    setMenuImageList(updatedMenuImageList);
  };

  return (
    <button
      className="h-4 w-4 rounded-md border-2 border-gray-500 bg-white"
      onClick={_onTick}
    >
      {menuImage.isSelected ? (
        <CheckIcon className="m-auto h-3 w-3 text-green-600" />
      ) : null}
    </button>
  );
};
