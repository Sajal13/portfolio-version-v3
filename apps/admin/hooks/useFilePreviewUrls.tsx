import { useEffect, useRef, useState } from 'react';

/**
 * Creates and caches object URLs for File objects, revoking stale ones
 * automatically so nothing leaks. Keyed by File reference identity.
 */
function useFilePreviewUrls(files: File[] | undefined): Map<File, string> {
  const [urlMap, setUrlMap] = useState<Map<File, string>>(new Map());
  const urlMapRef = useRef(urlMap);
  urlMapRef.current = urlMap;

  useEffect(() => {
    const current = urlMapRef.current;
    const next = new Map<File, string>();

    (files ?? []).forEach((file) => {
      // Reuse existing URL if we already made one for this exact File
      const existing = current.get(file);
      next.set(file, existing ?? URL.createObjectURL(file));
    });

    // Revoke URLs for files that are no longer present
    current.forEach((url, file) => {
      if (!next.has(file)) {
        URL.revokeObjectURL(url);
      }
    });

    setUrlMap(next);

    // Cleanup on unmount: revoke everything still held
    return () => {
      if (files === undefined) {
        next.forEach((url) => URL.revokeObjectURL(url));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  // Revoke all on final unmount
  useEffect(() => {
    return () => {
      urlMapRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return urlMap;
}

export default useFilePreviewUrls;
