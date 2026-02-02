import { useState, useEffect, useCallback } from 'react';
import { Subject } from '@/shared/constants/subjects';
import { StudyTimeSlot } from '@/entities/study-time/types';
import { slotsToGridState, gridStateToSlots, calculateTotalMinutes } from './studyTimeUtils';


export const useStudyTime = (
  initialSlots: StudyTimeSlot[], 
  onUpdate: (slots: StudyTimeSlot[]) => void,
  menteeId: string,
  date: string
) => {
  const [gridState, setGridState] = useState<(Subject | null)[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject>('KOREAN');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartIdx, setDragStartIdx] = useState<number | null>(null);
  const [dragEndIdx, setDragEndIdx] = useState<number | null>(null);

  useEffect(() => {
    setGridState(slotsToGridState(initialSlots));
  }, [initialSlots]);

  const startDrag = (index: number) => {
    setIsDragging(true);
    setDragStartIdx(index);
    setDragEndIdx(index);
  };

  const onDrag = (index: number) => {
    if (isDragging) {
      setDragEndIdx(index);
    }
  };

  const endDrag = useCallback(() => {
    if (!isDragging || dragStartIdx === null || dragEndIdx === null) return;

    const start = Math.min(dragStartIdx, dragEndIdx);
    const end = Math.max(dragStartIdx, dragEndIdx);

    const newGrid = [...gridState];
    
    if (start === end && newGrid[start] !== null) {
      newGrid[start] = null;
    } else {
      for (let i = start; i <= end; i++) {
        newGrid[i] = selectedSubject;
      }
    }

    setGridState(newGrid);
    const newSlots = gridStateToSlots(newGrid, menteeId, date);
    onUpdate(newSlots);

    setIsDragging(false);
    setDragStartIdx(null);
    setDragEndIdx(null);
  }, [isDragging, dragStartIdx, dragEndIdx, gridState, selectedSubject, onUpdate, menteeId, date]);

  const getDisplayGrid = () => {
    if (!isDragging || dragStartIdx === null || dragEndIdx === null) return gridState;

    const start = Math.min(dragStartIdx, dragEndIdx);
    const end = Math.max(dragStartIdx, dragEndIdx);
    
    const previewGrid = [...gridState];
    for (let i = start; i <= end; i++) {
      previewGrid[i] = selectedSubject;
    }
    return previewGrid;
  };

  return {
    gridState: getDisplayGrid(),
    selectedSubject,
    setSelectedSubject,
    startDrag,
    onDrag,
    endDrag,
    totalMinutes: calculateTotalMinutes(initialSlots),
  };
};