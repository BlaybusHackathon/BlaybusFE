import { useRef, useState, useEffect } from 'react';
import { Box, useToast, useBreakpointValue } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { useTaskFeedbackStore } from '@/shared/stores/taskFeedbackStore';
import { calculatePercentPosition, getFeedbackPositionStyles } from '../model/feedbackUtils';
import { FeedbackPin } from './FeedbackPin';
import { FeedbackCard } from './FeedbackCard';
import { FeedbackInputForm } from './FeedbackInputForm';
import { UserRole } from '@/shared/constants/enums';
import { feedbackApi } from '../api/feedbackApi';

interface FeedbackOverlayProps {
  taskId: string;
  imageId: string;
  currentUserId: string;
  userRole: UserRole;
}

export const FeedbackOverlay = ({ taskId, imageId, currentUserId, userRole }: FeedbackOverlayProps) => {
  const DEBUG_FEEDBACK = import.meta.env.DEV;
  void taskId;
  const toast = useToast();
  const store = useTaskFeedbackStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const pendingPosition = store.pendingPosition;
  const setPendingPosition = store.setPendingPosition;
  const setCommentMode = store.setCommentMode;
  
  const feedbacks = store.getFeedbacksForImage(imageId);
  const isCreating = !!pendingPosition;
  const activeHoveredPinId =
    hoveredPinId && feedbacks.some((fb) => fb.id === hoveredPinId) ? hoveredPinId : null;
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;

  useEffect(() => {
    if (!pendingPosition) return;
    const handlePointerDown = (e: PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;
      if (container.contains(e.target as Node)) return;
      setPendingPosition(null);
      setCommentMode('view');
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [pendingPosition, setPendingPosition, setCommentMode]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (store.commentMode === 'create') {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = calculatePercentPosition(e.clientX, e.clientY, rect);
      store.setPendingPosition(pos);
    } else {
      if (DEBUG_FEEDBACK) {
        console.debug('[feedback-overlay] overlay reset', {
          imageId,
          activeFeedbackId: store.activeFeedbackId,
          feedbackCount: feedbacks.length,
        });
      }
      store.setActiveFeedback(null);
      store.setPendingPosition(null);
      store.setCommentMode('view');
    }
  };

  const handleCreateFeedback = async (
    content: string,
    payload: { imageUrl: string | null; file?: File | null }
  ) => {
    if (!pendingPosition) return;

    try {
      const created = await feedbackApi.createFeedback(imageId, {
        content,
        xPos: pendingPosition.x,
        yPos: pendingPosition.y,
        file: payload.file ?? null,
      });

      store.addFeedback(created);
      store.setPendingPosition(null);
      toast({ status: 'success', title: '피드백이 등록되었습니다.' });
    } catch {
      toast({ status: 'error', title: '피드백 등록 중 오류가 발생했습니다.'});
    }
  };

  const handlePositionChange = async (id: string, newX: number, newY: number) => {
    store.updateFeedbackPosition(id, newX, newY);
    const target = feedbacks.find((fb) => fb.id === id);
    try {
      await feedbackApi.updateFeedback(id, {
        content: target?.content ?? '',
        xPos: newX,
        yPos: newY,
      });
    } catch {
      // revert not handled yet
    }
  };

  const activeFeedbackData = feedbacks.find(fb => fb.id === store.activeFeedbackId);
  const activeFeedbackPosition = activeFeedbackData
    ? getFeedbackPositionStyles(activeFeedbackData.xPos, activeFeedbackData.yPos)
    : null;
  const feedbackAuthorName = activeFeedbackData?.mentorName ?? '멘토';
  const normalizeAuthorRole = (role?: string): UserRole => (
    role === 'MENTOR' || role === 'MENTEE' || role === 'WITH_DRAW' ? role : 'MENTEE'
  );

  return (
    <>
      <Box
        ref={containerRef}
        position="absolute"
        top={0}
        left={0}
        w="full"
        h="full"
        onClick={handleOverlayClick}
        cursor={store.commentMode === 'create' ? 'crosshair' : 'default'}
        zIndex={10}
      >
        <AnimatePresence>
          {feedbacks.map(fb => {
            const isActive = store.activeFeedbackId === fb.id;
            const isDimmed = (!!activeHoveredPinId && activeHoveredPinId !== fb.id) || isCreating;

            return (
              <FeedbackPin
                key={fb.id}
                feedback={fb}
                containerRef={containerRef}
                isDraggable={userRole === "MENTOR" && fb.mentorId === currentUserId && !isCreating}
                isDimmed={isDimmed}
                isHidden={isActive}
                onMouseEnter={() => !isCreating && setHoveredPinId(fb.id)}
                onMouseLeave={() => setHoveredPinId(null)}
                onPositionChange={handlePositionChange}
                onClick={() => {
                   if (isCreating) return;
                   store.setActiveFeedback(fb.id);
                   store.setCommentMode('view');
                   store.setPendingPosition(null);
                }}
              />
            );
          })}
        </AnimatePresence>
        
        {activeFeedbackData && activeFeedbackPosition && (
          <Box
            position="absolute"
            zIndex={200}
            display={isMobile ? 'flex' : undefined}
            justifyContent={isMobile ? 'center' : undefined}
            style={
              isMobile
                ? {
                    left: '12px',
                    right: '12px',
                    top: activeFeedbackData.yPos > 50 ? undefined : '12px',
                    bottom: activeFeedbackData.yPos > 50 ? '12px' : undefined,
                  }
                : { ...activeFeedbackPosition.positionStyles, ...activeFeedbackPosition.marginStyles }
            }
          >
            <FeedbackCard
              key={activeFeedbackData.id}
              feedback={{ ...activeFeedbackData, authorName: feedbackAuthorName, authorProfileUrl: null }}
              answers={store
                .getAnswersForFeedback(activeFeedbackData.id)
                .map((a) => ({
                  ...a,
                  authorName: a.authorName ?? 'User',
                  authorRole: normalizeAuthorRole(a.authorRole),
                  authorProfileUrl: null,
                }))}
              currentUserId={currentUserId}
              userRole={userRole}
              transformOrigin={activeFeedbackPosition.transformOrigin}
              onClose={() => {
                if (DEBUG_FEEDBACK) {
                  console.debug('[feedback-overlay] close', {
                    imageId,
                    activeFeedbackId: store.activeFeedbackId,
                    feedbackCount: feedbacks.length,
                  });
                }
                store.setActiveFeedback(null);
              }}
              onUpdateFeedback={async (c, payload) => {
                const updated = await feedbackApi.updateFeedback(activeFeedbackData.id, {
                  content: c,
                  imageUrl: payload.imageUrl,
                  xPos: activeFeedbackData.xPos,
                  yPos: activeFeedbackData.yPos,
                });
                if (!updated) return;
                store.updateFeedback(activeFeedbackData.id, { content: updated.content, imageUrl: updated.imageUrl });
              }}
              onDeleteFeedback={async () => {
                await feedbackApi.deleteFeedback(activeFeedbackData.id);
                store.removeFeedback(activeFeedbackData.id);
              }}
              onAddAnswer={async (c) => {
                const created = await feedbackApi.createComment(activeFeedbackData.id, c);
                store.addAnswer(created);
              }}
              onUpdateAnswer={async (id, c) => {
                const updated = await feedbackApi.updateComment(activeFeedbackData.id, id, c);
                if (!updated) return;
                store.updateAnswer(id, updated.comment);
              }}
              onDeleteAnswer={async (id) => {
                await feedbackApi.deleteComment(activeFeedbackData.id, id);
                store.removeAnswer(id);
              }}
            />
          </Box>
        )}

        <AnimatePresence>
          {pendingPosition && (
            <Box
              position="absolute"
              zIndex={200}
              onClick={(e) => e.stopPropagation()}
              display={isMobile ? 'flex' : undefined}
              justifyContent={isMobile ? 'center' : undefined}
              style={
                isMobile
                  ? {
                      left: '12px',
                      right: '12px',
                      top: pendingPosition.y > 50 ? undefined : '12px',
                      bottom: pendingPosition.y > 50 ? '12px' : undefined,
                    }
                  : {
                      ...getFeedbackPositionStyles(pendingPosition.x, pendingPosition.y)
                        .positionStyles,
                    }
              }
            >
              <FeedbackInputForm
                onSave={handleCreateFeedback}
                onCancel={() => { store.setPendingPosition(null); store.setCommentMode('view'); }}
              />
            </Box>
          )}
        </AnimatePresence>
      </Box>
    </>
  );
};




