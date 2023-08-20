// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Slider from 'react-slick';

import { db, storage } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import { Icons } from '@/images';
import { selector } from '@/redux';
import type { WantedInfo } from '@/types';

const SLIDER_SETTINGS = {
  dots: true,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  pauseOnHover: true,
  arrows: false,
  draggable: true,
};

export const WantedBoard = () => {
  const { wanteds } = useSelector(selector.wanted);
  const { order } = useSelector(selector.order);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<Blob | undefined>(undefined);
  const [message, setMessage] = useState('');
  const [isShow, setIsShow] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const uploadFormRef = useCheckClickOutside(() => {
    setIsShow(false);
    setSelectedFile(undefined);
    formRef.current?.reset();
    setMessage('');
    setError('');
  });

  const _onUpload = () => {
    if (message === '') {
      setError('Please input a message');
      return;
    }
    if (selectedFile === undefined) {
      setError('Please select a picture');
      return;
    }
    const storageRef = ref(storage, `wanted/${order?.id}/${selectedFile.name}`);
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
        if (order) {
          const newWanted = {
            avatar: downloadUrl,
            message,
          };
          await addDoc(
            collection(db, 'orders', order?.id, 'wanteds'),
            newWanted,
          );
        }
      },
    );

    setSelectedFile(undefined);
    formRef.current?.reset();
    setMessage('');
    setError('');
    setIsShow(false);
  };

  const _onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length !== 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const _onMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMessage(value);
  };

  const _onShow = () => {
    setIsShow(true);
  };

  return (
    <div className="relative">
      <Slider {...SLIDER_SETTINGS}>
        {wanteds.length === 0 ? <WantedSample /> : Wanteds(wanteds)}
      </Slider>
      <button className="absolute -bottom-5 -right-1" onClick={_onShow}>
        <CloudArrowUpIcon className="h-5 w-5" />
      </button>
      <div className="absolute -top-7 left-16 font-bold">WANTED</div>
      {isShow ? (
        <div
          ref={uploadFormRef}
          className="absolute -right-8 top-36 flex flex-col gap-2 bg-gray-200 p-2"
        >
          <form ref={formRef} action="" className="flex flex-col gap-2">
            <input
              type="file"
              accept="/image/*"
              onChange={_onFileChange}
              className="text-xs"
            />
            <input
              className="h-6 rounded-md"
              type="text"
              value={message}
              name="message"
              onChange={_onMessageChange}
            />
          </form>
          <button onClick={_onUpload} className="rounded-md bg-gray-400 py-1">
            Upload
          </button>
          {error !== '' ? <div className="text-red-400">{error}</div> : null}
        </div>
      ) : null}
    </div>
  );
};

const Wanteds = (listItem: WantedInfo[]) => {
  return listItem.map((w: WantedInfo) => (
    <div key={w.id} className="flex gap-2">
      <img
        className="h-24 w-24 rounded-lg bg-gray-200 object-cover"
        src={w.avatar}
        alt="user-icon"
      />
      <div className="h-24 w-28 leading-4 tracking-tight">
        <div>{w.message}</div>
      </div>
    </div>
  ));
};

const WantedSample = () => {
  return (
    <div className="flex gap-2">
      <img
        className="h-24 w-24 rounded-lg bg-gray-200 object-cover"
        src={Icons.user_icon.src}
        alt="user-icon"
      />
      <div className="h-24 w-28 leading-4 tracking-tight">
        <div>Write a message to someone if he/she still owe you money.</div>
      </div>
    </div>
  );
};
