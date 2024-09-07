import { useState, useCallback } from 'react';

export function useLoadingProgress() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setProgress(0);
  }, []);

  const updateProgress = useCallback((newProgress: number) => {
    setProgress(newProgress);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setProgress(0);
  }, []);

  return { isLoading, progress, startLoading, updateProgress, stopLoading };
}