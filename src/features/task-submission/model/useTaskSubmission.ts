import { useEffect, useState } from 'react';
import { submissionApi } from '../api/submissionApi';

export interface SubmissionImage {
  id: string;
  file: File;
  previewUrl: string;
  isExisting?: boolean;
}

export const useTaskSubmission = (taskId: string, initialMemo: string = '') => {
  const [memo, setMemo] = useState(initialMemo);
  const [images, setImages] = useState<SubmissionImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    setMemo(initialMemo);
  }, [initialMemo]);
  
  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: `temp-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        isExisting: false,
      }));
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const files = images.map((i) => i.file).filter((f) => f && f.size > 0);
      return await submissionApi.submit(taskId, memo, files);
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    memo,
    setMemo,
    images,
    setImages,
    isSubmitting,
    error,
    handleAddImages,
    handleRemoveImage,
    handleSubmit
  };
};
