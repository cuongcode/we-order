import {
  CameraIcon,
  CloudArrowUpIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { CameraIcon as SolidCameraIcon } from '@heroicons/react/24/solid';
import { doc, updateDoc } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { db, storage } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import { selector } from '@/redux';
import type { User } from '@/types';

import { Portal } from './portal';

export const ImageGallery = ({ field }: { field: keyof User }) => {
  const { currentUser } = useSelector(selector.user);
  const [isOpen, setIsOpen] = useState(false);
  const [avatarList, setAvatarList] = useState<string[]>([]);

  useEffect(() => {
    _fetchGallery();
  }, []);

  const modalRef = useCheckClickOutside(() => {
    setIsOpen(false);
  });

  const _onOpen = async () => {
    setIsOpen(true);
  };

  const _fetchGallery = async () => {
    const storageRef = ref(storage, `users/${currentUser?.uid}`);
    const files = await listAll(storageRef);
    const updatedAvatarList: string[] = [];
    files.items.forEach(async (itemRef) => {
      const url = await getDownloadURL(ref(storage, itemRef.fullPath));
      updatedAvatarList.push(url);
    });
    setAvatarList(updatedAvatarList);
  };

  const _setAvatar = async (url: string) => {
    if (currentUser) {
      const docRef = doc(db, 'users', currentUser?.uid);
      await updateDoc(docRef, {
        [field]: url,
      });
    }
  };

  const _deleteAvatar = async (url: string) => {
    if (url === currentUser?.avatar) {
      _setAvatar('');
    }
    const storageRef = ref(storage, url);
    const updatedAvatarList = avatarList.filter((item: string) => item !== url);
    setAvatarList(updatedAvatarList);
    await deleteObject(storageRef);
  };

  return (
    <div>
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
                  avatarList={avatarList}
                  setAvatarList={setAvatarList}
                />
              </div>
              <div className="no-scrollbar flex flex-wrap gap-2 overflow-x-auto">
                {avatarList.map((url: string) => (
                  <div key={url} className="relative">
                    <button onClick={() => _setAvatar(url)}>
                      <img
                        src={url}
                        alt="user-icon"
                        className="h-20 w-20 rounded-lg bg-gray-200 object-cover"
                      />
                    </button>
                    <button
                      className="absolute right-0 top-0"
                      onClick={() => _deleteAvatar(url)}
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
  avatarList,
  setAvatarList,
}: {
  avatarList: string[];
  setAvatarList: (updatedAvatarList: string[]) => void;
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
        `users/${currentUser?.uid}/${selectedFile.name}`,
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
            avatarList
              .map((item: string) => new URL(item).pathname)
              .indexOf(downlardUrl_pathname) === -1
          ) {
            const updatedMenuImageList = [...avatarList, downloadUrl];
            setAvatarList(updatedMenuImageList);
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
