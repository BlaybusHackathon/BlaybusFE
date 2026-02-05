import { useState } from 'react';

export interface SubmissionImage {
  id: string;
  file: File;
  previewUrl: string;
}

export const useTaskSubmission = (taskId: string, initialMemo: string = '') => {
  const [memo, setMemo] = useState(initialMemo);
  const [images, setImages] = useState<SubmissionImage[]>([]);
  
  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: `temp-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = () => {
    console.log('Submission Data:', {
      taskId,
      memo,
      images: images.map(i => i.file.name)
    });
    alert('과제가 제출되었습니다.');
  };

  return {
    memo,
    setMemo,
    images,
    handleAddImages,
    handleRemoveImage,
    handleSubmit
  };
};