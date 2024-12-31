import { useEffect } from "react";

export const useMutationObserver = (
  ref,
  callback,
  options = { attributes: true }
) => {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new MutationObserver(callback);
    observer.observe(ref.current, options);

    return () => {
      observer.disconnect();
    };
  }, [ref, callback, options]);
};
