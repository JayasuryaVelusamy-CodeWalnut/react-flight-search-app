import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted
    ? createPortal(children, document.querySelector('#portal-root') as HTMLElement)
    : null;
};

export default Portal;
