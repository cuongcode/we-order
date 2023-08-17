import { CameraIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { CameraIcon as SolidCameraIcon } from '@heroicons/react/24/solid';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { db, storage } from '@/firebase';
import { Icons } from '@/images';
import { selector } from '@/redux';

export const ShopOwnerImage = () => {
  const { currentUser, shopOwner } = useSelector(selector.user);
  const [selectedFile, setSelectedFile] = useState<Blob | undefined>(undefined);

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const _onClick = () => {
    inputRef.current?.click();
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
          if (currentUser) {
            const docRef = doc(db, 'users', currentUser?.uid);
            await updateDoc(docRef, {
              avatar: downloadUrl,
            });
          }
        },
      );
    }
    setSelectedFile(undefined);
    formRef.current?.reset();
  };

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length !== 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

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
        <UploadImgButton selectedFile={selectedFile} _onClick={_onClick} />
      ) : null}
      {selectedFile ? (
        <button className="absolute -right-5 top-0" onClick={_onUpload}>
          <CloudArrowUpIcon className="h-4 w-4" />
        </button>
      ) : null}
      <form ref={formRef} action="">
        <input
          type="file"
          ref={inputRef}
          accept="/image/*"
          className="hidden"
          onChange={_onChange}
        />
      </form>
    </div>
  );
};

const UploadImgButton = ({
  selectedFile,
  _onClick,
}: {
  selectedFile: Blob | undefined;
  _onClick: () => void;
}) => {
  return (
    <button className="absolute right-0 top-0" onClick={_onClick}>
      {selectedFile ? (
        <SolidCameraIcon className="h-4 w-4" />
      ) : (
        <CameraIcon className="h-4 w-4" />
      )}
    </button>
  );
};

export const UserImage = () => {
  const [selectedFile, setSelectedFile] = useState<Blob | undefined>(undefined);
  const { currentUser } = useSelector(selector.user);

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const _onClick = () => {
    inputRef.current?.click();
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
          if (currentUser) {
            const docRef = doc(db, 'users', currentUser?.uid);
            await updateDoc(docRef, {
              avatar: downloadUrl,
            });
          }
        },
      );
    }
    setSelectedFile(undefined);
    formRef.current?.reset();
  };

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length !== 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="relative rounded-full bg-gray-500 p-1">
      <img
        className="h-20 w-20 rounded-full bg-gray-200 object-cover"
        src={
          currentUser?.avatar && currentUser?.avatar !== ''
            ? currentUser.avatar
            : Icons.user_icon.src
        }
        alt="user-icon"
      />
      <button className="absolute right-0 top-0" onClick={_onClick}>
        {selectedFile ? (
          <SolidCameraIcon className="h-4 w-4" />
        ) : (
          <CameraIcon className="h-4 w-4" />
        )}
      </button>
      {selectedFile ? (
        <button className="absolute -right-5 top-0" onClick={_onUpload}>
          <CloudArrowUpIcon className="h-4 w-4" />
        </button>
      ) : null}
      <form ref={formRef} action="">
        <input
          type="file"
          ref={inputRef}
          accept="/image/*"
          className="hidden"
          onChange={_onChange}
        />
      </form>
    </div>
  );
};
