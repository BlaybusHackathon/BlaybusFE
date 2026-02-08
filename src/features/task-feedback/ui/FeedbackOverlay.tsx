import { useRef, useState, useEffect } from 'react';
import { 
  Box, 
  useToast, 
  useBreakpointValue, 
  Drawer, 
  DrawerOverlay, 
  DrawerContent, 
  DrawerBody 
} from '@chakra-ui/react';
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

  useEffect(() => {
    setHoveredPinId(null);
  }, [imageId]);
  
  
  const feedbacks = store.getFeedbacksForImage(imageId);
  const isCreating = !!store.pendingPosition;

  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;

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
    if (!store.pendingPosition) return;

    try {
      const created = await feedbackApi.createFeedback(imageId, {
        content,
        xPos: store.pendingPosition.x,
        yPos: store.pendingPosition.y,
        file: payload.file ?? null,
      });

      store.addFeedback(created);
      store.setPendingPosition(null);
      toast({ status: 'success', title: '??쒕갚???濡??????' });
    } catch {
      toast({ status: 'error', title: '??쒕갚??????????' });
    }
  };

  const handlePositionChange = async (id: string, newX: number, newY: number) => {
    store.updateFeedbackPosition(id, newX, newY);
    try {
      await feedbackApi.updateFeedback(id, { xPos: newX, yPos: newY });
    } catch {
      // revert not handled yet
    }
  };

  const activeFeedbackData = feedbacks.find(fb => fb.id === store.activeFeedbackId);

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
            const isDimmed = (!!hoveredPinId && hoveredPinId !== fb.id) || isCreating;

            return (
              <FeedbackPin
                key={fb.id}
                feedback={fb}
                containerRef={containerRef}
                isDraggable={userRole === "MENTOR" && fb.mentorId === currentUserId && !isCreating}
                isDimmed={isDimmed}
                isHidden={isActive && !isMobile}
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
        
        {!isMobile && activeFeedbackData && (
             <FeedbackCard
                key={activeFeedbackData.id}
                feedback={{ ...activeFeedbackData, authorName: '멘토', authorProfileUrl: null }}
                answers={store.getAnswersForFeedback(activeFeedbackData.id).map(a => ({...a, authorName: 'User', authorRole: "MENTEE", authorProfileUrl: null}))}
                currentUserId={currentUserId}
                userRole={userRole}
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
                  const updated = await feedbackApi.updateFeedback(activeFeedbackData.id, { content: c, imageUrl: payload.imageUrl });
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
        )}

        <AnimatePresence>
          {store.pendingPosition && (
            <Box 
              position="absolute" 
              zIndex={200}
              onClick={(e) => e.stopPropagation()}
              style={{ ...getFeedbackPositionStyles(store.pendingPosition.x, store.pendingPosition.y).positionStyles }}
            >
              <FeedbackInputForm
                onSave={handleCreateFeedback}
                onCancel={() => { store.setPendingPosition(null); store.setCommentMode('view'); }}
              />
            </Box>
          )}
        </AnimatePresence>
      </Box>

      <Drawer
        isOpen={isMobile && !!activeFeedbackData}
        placement="bottom"
        onClose={() => store.setActiveFeedback(null)}
        trapFocus={false} 
        blockScrollOnMount={false} 
      >
        <DrawerOverlay bg="blackAlpha.300" />
        <DrawerContent borderTopRadius="20px" maxH="80vh">
          <DrawerBody p={0}>
             {activeFeedbackData && (
                 <FeedbackCard
                    feedback={{ ...activeFeedbackData, authorName: '멘토', authorProfileUrl: null }}
                    answers={store.getAnswersForFeedback(activeFeedbackData.id).map(a => ({...a, authorName: 'User', authorRole: "MENTEE", authorProfileUrl: null}))}
                    currentUserId={currentUserId}
                    userRole={userRole}
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
                      const updated = await feedbackApi.updateFeedback(activeFeedbackData.id, { content: c, imageUrl: payload.imageUrl });
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
                    isMobileView={true} 
                 />
             )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};




