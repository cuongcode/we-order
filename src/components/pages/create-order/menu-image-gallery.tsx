import {
  CameraIcon,
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

export const MenuImageGallery = ({ name }: { name: string }) => {
  const { currentUser } = useSelector(selector.user);
  const [isOpen, setIsOpen] = useState(false);
  const [menuImageList, setMenuImageList] = useState<string[]>([]);

  useEffect(() => {
    _fetchGallery(name);
  }, []);

  const modalRef = useCheckClickOutside(() => {
    setIsOpen(false);
  });

  const _onOpen = async () => {
    setIsOpen(true);
  };

  const _fetchGallery = async (menuName: string) => {
    const storageRef = ref(
      storage,
      `users/${currentUser?.uid}/menus/${menuName}`,
    );
    const files = await listAll(storageRef);
    const updatedMenuImageList: string[] = [];
    files.items.forEach(async (itemRef) => {
      const url = await getDownloadURL(ref(storage, itemRef.fullPath));
      updatedMenuImageList.push(url);
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
    const storageRef = ref(storage, url);
    const updatedMenuImageList = menuImageList.filter(
      (item: string) => item !== url,
    );
    setMenuImageList(updatedMenuImageList);
    await deleteObject(storageRef);
  };

  return (
    <div className="flex items-center">
      <button onClick={_onOpen}>
        <PhotoIcon className="h-4 w-4" />
      </button>
      {isOpen ? (
        <Portal>
          <div className="fixed inset-0 z-50 h-full w-full bg-gray-800/50">
            <div
              ref={modalRef}
              className="m-auto mt-16 flex h-64 w-96 flex-col gap-5 rounded-xl bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div>My Gallery</div>
                <UploadImageButton
                  name={name}
                  menuImageList={menuImageList}
                  setMenuImageList={setMenuImageList}
                />
              </div>
              <div className="no-scrollbar flex flex-wrap gap-2 overflow-x-auto">
                {menuImageList.map((item: string) => (
                  <div key={item} className="relative">
                    <div className="absolute -top-1 left-0" />
                    <button>
                      <img
                        src={item}
                        alt="user-icon"
                        className="h-20 w-20 rounded-lg bg-gray-200 object-cover"
                      />
                    </button>
                    <button
                      className="absolute right-0 top-0"
                      onClick={() => _deleteAvatar(item)}
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
  name,
  menuImageList,
  setMenuImageList,
}: {
  name: string;
  menuImageList: string[];
  setMenuImageList: (updatedMenuImageList: string[]) => void;
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
        `users/${currentUser?.uid}/menus/${name}/${selectedFile.name}`,
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
              .map((item: string) => new URL(item).pathname)
              .indexOf(downlardUrl_pathname) === -1
          ) {
            const updatedMenuImageList = [...menuImageList, downloadUrl];
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
