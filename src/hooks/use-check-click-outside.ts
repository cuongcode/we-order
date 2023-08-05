import { useEffect, useRef } from 'react';

export const useCheckClickOutside = (callback: any) => {
  const ref = useRef<any>();
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref?.current && !ref?.current.contains(event.target)) {
        if (callback) callback();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return ref;
};
