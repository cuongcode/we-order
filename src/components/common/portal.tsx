import { type ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export const Portal = ({ children }: { children: ReactNode }) => {
  const portalRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    portalRef.current = document.getElementById('portal');
    setMounted(true);
  }, []);

  return mounted && portalRef.current
    ? createPortal(children, portalRef.current)
    : null;
};
