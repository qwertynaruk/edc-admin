import { useEffect, useMemo, useState } from 'react';

export default function useOnScreen(ref) {
  // https://stackoverflow.com/a/65008608
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = useMemo(() => {
    return new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));
  }, []);

  useEffect(() => {
    observer.observe(ref.current);
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, [observer, ref]);

  return isIntersecting;
}
