import { create } from 'zustand';
import type { TaskFeedback } from '@/entities/task-feedback/types';
import type { Answer } from '@/entities/answer/types';
import type { 
  FeedbacksByImage, 
  AnswersByFeedback, 
  CommentMode 
} from '@/features/task-feedback/model/types';

const DEBUG_FEEDBACK = import.meta.env.DEV;

interface PendingPosition {
  x: number;
  y: number;
}

const normalizePositionValue = (value: number) => {
  if (value >= 0 && value <= 1) return value * 100;
  return value;
};

const normalizeFeedbackPosition = (feedback: TaskFeedback) => ({
  ...feedback,
  xPos: normalizePositionValue(feedback.xPos),
  yPos: normalizePositionValue(feedback.yPos),
});

interface TaskFeedbackState {
  feedbacksByImage: FeedbacksByImage;
  answersByFeedback: AnswersByFeedback;
  commentMode: CommentMode;
  activeFeedbackId: string | null;
  pendingPosition: PendingPosition | null;
  currentImageId: string | null;

  setCommentMode: (mode: CommentMode) => void;
  setActiveFeedback: (id: string | null) => void;
  setPendingPosition: (pos: PendingPosition | null) => void;
  setCurrentImageId: (imageId: string | null) => void;
  resetUIState: () => void;

  loadFeedbacks: (feedbacks: TaskFeedback[]) => void;
  addFeedback: (feedback: TaskFeedback) => void;
  updateFeedback: (id: string, updates: Partial<TaskFeedback>) => void;
  removeFeedback: (id: string) => void;

  updateFeedbackPosition: (id: string, x: number, y: number) => void;

  loadAnswers: (answers: Answer[]) => void;
  addAnswer: (answer: Answer) => void;
  updateAnswer: (id: string, comment: string) => void;
  removeAnswer: (id: string) => void;

  getFeedbacksForImage: (imageId: string) => TaskFeedback[];
  getAnswersForFeedback: (feedbackId: string) => Answer[];
  canAddFeedback: (imageId: string) => boolean;
}

export const useTaskFeedbackStore = create<TaskFeedbackState>((set, get) => ({
  feedbacksByImage: {},
  answersByFeedback: {},
  commentMode: 'view',
  activeFeedbackId: null,
  pendingPosition: null,
  currentImageId: null,

  setCommentMode: (mode) => {
    if (DEBUG_FEEDBACK) console.debug('[feedback-store] setCommentMode', { mode });
    set({ commentMode: mode });
  },
  setActiveFeedback: (id) => {
    if (DEBUG_FEEDBACK) console.debug('[feedback-store] setActiveFeedback', { id });
    set({ activeFeedbackId: id });
  },
  setPendingPosition: (pos) => {
    if (DEBUG_FEEDBACK) console.debug('[feedback-store] setPendingPosition', { pos });
    set({ pendingPosition: pos });
  },
  setCurrentImageId: (imageId) => {
    if (DEBUG_FEEDBACK) console.debug('[feedback-store] setCurrentImageId', { imageId });
    set({ 
      currentImageId: imageId,
      activeFeedbackId: null,
      pendingPosition: null,
      commentMode: 'view'
    });
  },
  resetUIState: () => {
    if (DEBUG_FEEDBACK) console.debug('[feedback-store] resetUIState');
    set({
      commentMode: 'view',
      activeFeedbackId: null,
      pendingPosition: null
    });
  },

  loadFeedbacks: (feedbacks) => {
    const normalized = feedbacks.map(normalizeFeedbackPosition);
    if (DEBUG_FEEDBACK) {
      const imageIds = Array.from(new Set(normalized.map((f) => f.imageId)));
      console.debug('[feedback-store] loadFeedbacks', { count: normalized.length, imageIds });
    }
    const grouped = normalized.reduce<FeedbacksByImage>((acc, feedback) => {
      const key = feedback.imageId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(feedback);
      return acc;
    }, {});
    set({ feedbacksByImage: grouped });
  },

  addFeedback: (feedback) => set((state) => {
    const normalized = normalizeFeedbackPosition(feedback);
    const imageId = normalized.imageId;
    const existing = state.feedbacksByImage[imageId] || [];
    return {
      feedbacksByImage: {
        ...state.feedbacksByImage,
        [imageId]: [...existing, normalized]
      },
      pendingPosition: null,
      commentMode: 'view'
    };
  }),

  updateFeedback: (id, updates) => set((state) => {
    const newFeedbacksByImage = { ...state.feedbacksByImage };
    for (const imageId in newFeedbacksByImage) {
      newFeedbacksByImage[imageId] = newFeedbacksByImage[imageId].map(f =>
        f.id === id ? { ...f, ...updates } : f
      );
    }
    return { feedbacksByImage: newFeedbacksByImage };
  }),

  removeFeedback: (id) => set((state) => {
    const newFeedbacksByImage = { ...state.feedbacksByImage };
    for (const imageId in newFeedbacksByImage) {
      newFeedbacksByImage[imageId] = newFeedbacksByImage[imageId].filter(f => f.id !== id);
    }
    const newAnswersByFeedback = { ...state.answersByFeedback };
    delete newAnswersByFeedback[id];
    
    return { 
      feedbacksByImage: newFeedbacksByImage,
      answersByFeedback: newAnswersByFeedback,
      activeFeedbackId: state.activeFeedbackId === id ? null : state.activeFeedbackId
    };
  }),

  updateFeedbackPosition: (id, x, y) => set((state) => {
    const newFeedbacksByImage = { ...state.feedbacksByImage };
    for (const imageId in newFeedbacksByImage) {
      const index = newFeedbacksByImage[imageId].findIndex(f => f.id === id);
      if (index !== -1) {
        const feedback = newFeedbacksByImage[imageId][index];
        const updatedFeedback = { ...feedback, xPos: x, yPos: y };
        const newArray = [...newFeedbacksByImage[imageId]];
        newArray[index] = updatedFeedback;
        newFeedbacksByImage[imageId] = newArray;
        break; 
      }
    }
    return { feedbacksByImage: newFeedbacksByImage };
  }),

  loadAnswers: (answers) => {
    if (DEBUG_FEEDBACK) {
      const feedbackIds = Array.from(new Set(answers.map((a) => a.feedbackId)));
      console.debug('[feedback-store] loadAnswers', { count: answers.length, feedbackIds });
    }
    const grouped = answers.reduce<AnswersByFeedback>((acc, answer) => {
      const key = answer.feedbackId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(answer);
      return acc;
    }, {});
    set({ answersByFeedback: grouped });
  },

  addAnswer: (answer) => set((state) => {
    const feedbackId = answer.feedbackId;
    const existing = state.answersByFeedback[feedbackId] || [];
    return {
      answersByFeedback: {
        ...state.answersByFeedback,
        [feedbackId]: [...existing, answer]
      }
    };
  }),

  updateAnswer: (id, comment) => set((state) => {
    const newAnswersByFeedback = { ...state.answersByFeedback };
    for (const feedbackId in newAnswersByFeedback) {
      newAnswersByFeedback[feedbackId] = newAnswersByFeedback[feedbackId].map(a =>
        a.id === id ? { ...a, comment } : a
      );
    }
    return { answersByFeedback: newAnswersByFeedback };
  }),

  removeAnswer: (id) => set((state) => {
    const newAnswersByFeedback = { ...state.answersByFeedback };
    for (const feedbackId in newAnswersByFeedback) {
      newAnswersByFeedback[feedbackId] = newAnswersByFeedback[feedbackId].filter(a => a.id !== id);
    }
    return { answersByFeedback: newAnswersByFeedback };
  }),

  getFeedbacksForImage: (imageId) => get().feedbacksByImage[imageId] || [],
  getAnswersForFeedback: (feedbackId) => get().answersByFeedback[feedbackId] || [],
  canAddFeedback: (imageId) => {
    const feedbacks = get().feedbacksByImage[imageId] || [];
    return feedbacks.length < 3;
  }
}));
