import { CSSProperties } from 'react';

const PREVIEW_MAX_LENGTH = 20;

export const extractPreviewText = (content: string): string => {
  const tagPattern = /<강조>([^<]+)<\/강조>/g;
  const markdownPattern = /\*\*([^*]+)\*\*/g;
  const tagMatches = [...content.matchAll(tagPattern)];
  const markdownMatches = [...content.matchAll(markdownPattern)];
  
  if (tagMatches.length > 0) {
    return tagMatches[0][1];
  }
  if (markdownMatches.length > 0) {
    return markdownMatches[0][1];
  }
  
  const plainText = content
    .replace(tagPattern, '$1')
    .replace(markdownPattern, '$1');
  if (plainText.length <= PREVIEW_MAX_LENGTH) {
    return plainText;
  }
  return plainText.slice(0, PREVIEW_MAX_LENGTH) + '...';
};

export const parseEmphasis = (content: string): string => {
  return content
    .replace(/<강조>([^<]+)<\/강조>/g, '<strong>$1</strong>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  
  return date.toLocaleDateString('ko-KR', { 
    month: 'short', 
    day: 'numeric' 
  });
};

export const calculatePercentPosition = (
  clientX: number,
  clientY: number,
  containerRect: DOMRect
): { x: number; y: number } => {
  const x = ((clientX - containerRect.left) / containerRect.width) * 100;
  const y = ((clientY - containerRect.top) / containerRect.height) * 100;
  return {
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y))
  };
};

export const getFeedbackPositionStyles = (xPos: number, yPos: number) => {
  const isRightSide = xPos > 50;
  const isBottomSide = yPos > 50;

  const positionStyles: CSSProperties = {
    left: isRightSide ? undefined : `${xPos}%`,
    right: isRightSide ? `${100 - xPos}%` : undefined,
    top: isBottomSide ? undefined : `${yPos}%`,
    bottom: isBottomSide ? `${100 - yPos}%` : undefined,
  };

  const transformOrigin = `${isBottomSide ? 'bottom' : 'top'} ${isRightSide ? 'right' : 'left'}`;

  const marginStyles: CSSProperties = {
    marginTop: isBottomSide ? 0 : '12px',
    marginBottom: isBottomSide ? '12px' : 0,
    marginLeft: isRightSide ? 0 : '12px',
    marginRight: isRightSide ? '12px' : 0,
  };

  return { positionStyles, transformOrigin, marginStyles };
};

export const getPinPositionStyles = (xPos: number, yPos: number) => {
  const isRightSide = xPos > 50;
  
  const containerStyle: CSSProperties = {
    position: 'absolute',
    left: `${xPos}%`,
    top: `${yPos}%`,
    width: 0, 
    height: 0,
    display: 'flex', 
    alignItems: 'center',
    justifyContent: isRightSide ? 'flex-end' : 'flex-start',
    overflow: 'visible', 
    marginLeft: isRightSide ? '-12px' : '12px',
  };

  const visualStyle: CSSProperties = {
    position: 'relative',
    width: 'max-content', 
    flexShrink: 0,       
    whiteSpace: 'nowrap',
  };

  const pointerStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: isRightSide ? undefined : '-6px', 
    right: isRightSide ? '-6px' : undefined,
    transform: 'translateY(-50%) rotate(45deg)',
  };

  const flexDirection = isRightSide ? 'row-reverse' : 'row';
  const transformOrigin = isRightSide ? 'right center' : 'left center';

  return { containerStyle, visualStyle, pointerStyle, flexDirection, transformOrigin };
};
