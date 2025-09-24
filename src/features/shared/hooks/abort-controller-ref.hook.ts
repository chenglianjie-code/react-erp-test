import { useEffect, useRef } from 'react';

export function useAbortControllerRef() {
  const abortControllerRef = useRef<AbortController | undefined>(void 0);
  useEffect(() => {
    const ctrl = new AbortController();
    abortControllerRef.current = ctrl;

    return () => {
      ctrl.abort();
    };
  }, []);

  return abortControllerRef;
}
