import { useEffect, useRef, useState } from 'react';
import { Box, Textarea, Flex, IconButton, Image } from '@chakra-ui/react';
import TextareaAutosize from 'react-textarea-autosize';
import { CloseIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { ImageIcon, BorderIcon } from '@/shared/ui/icons';

interface FeedbackInputFormProps {
  initialContent?: string;
  initialImageUrl?: string | null;
  onSave: (content: string, payload: { imageUrl: string | null; file?: File | null }) => void;
  onCancel: () => void;
  allowFile?: boolean;
}

export const FeedbackInputForm = ({ 
  initialContent = '', 
  initialImageUrl = null, 
  onSave, 
  onCancel,
  allowFile = true,
}: FeedbackInputFormProps) => {
  const [content, setContent] = useState(initialContent);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isBoldMode, setIsBoldMode] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const toggleEmphasis = () => {
    setIsBoldMode(!isBoldMode);
    const el = textareaRef.current;
    if (!el) {
      setContent((prev) => prev + ' **??** ');
      return;
    }

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const before = content.slice(0, start);
    const after = content.slice(end);

    if (start == end) {
      const next = `${before}****${after}`;
      setContent(next);
      requestAnimationFrame(() => {
        if (!textareaRef.current) return;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + 2, start + 2);
      });
      return;
    }

    const selected = content.slice(start, end);
    const next = `${before}**${selected}**${after}`;
    setContent(next);
    requestAnimationFrame(() => {
      if (!textareaRef.current) return;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(start + 2, end + 2);
    });
  };

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const handleImageUpload = () => {
    if (!allowFile) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selected = e.target.files[0];
    const nextUrl = URL.createObjectURL(selected);
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setObjectUrl(nextUrl);
    setFile(selected);
    setImageUrl(nextUrl);
  };

  const handleSave = () => {
    if (!content.trim()) return;
    onSave(content, { imageUrl, file });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Box 
      bg="white" 
      borderRadius="12px" 
      boxShadow="0px 4px 12px rgba(0, 0, 0, 0.15)" 
      border="1px solid" 
      borderColor="gray.100" 
      minW="300px"
      overflow="hidden"
      position="relative"
    >
      <IconButton
        aria-label="Close"
        icon={<CloseIcon boxSize={2.5} color="gray.400" />}
        size="xs"
        variant="ghost"
        position="absolute"
        top={2}
        right={2}
        onClick={onCancel}
        _hover={{ bg: 'gray.50', color: 'gray.600' }}
      />
      <Box p={3}>
        <Textarea
          as={TextareaAutosize}
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="피드백을 입력하세요..."
          size="sm"
          variant="unstyled" 
          resize="none"
          minRows={3}
          autoFocus
          p={0}
          fontSize="sm"
          lineHeight="1.5"
        />
        
        {imageUrl && (
          <Box position="relative" mt={3} display="inline-block">
            <Image 
              src={imageUrl} 
              alt="Attachment" 
              maxH="120px" 
              borderRadius="lg" 
              objectFit="cover" 
              border="1px solid"
              borderColor="gray.100"
            />
            <IconButton
              aria-label="Remove Image"
              icon={<CloseIcon boxSize={2} />}
              size="xs"
              position="absolute"
              top={1}
              right={1}
              colorScheme="blackAlpha"
              isRound
              onClick={() => {
                if (objectUrl) URL.revokeObjectURL(objectUrl);
                setObjectUrl(null);
                setFile(null);
                setImageUrl(null);
              }}
            />
          </Box>
        )}
      </Box>

      <Flex 
        justify="space-between" 
        align="center" 
        px={2} 
        py={2} 
        borderTop="1px solid" 
        borderColor="gray.50"
        bg="gray.50"
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <Flex gap={1}>
          <IconButton
            aria-label="Upload Image"
            icon={<ImageIcon size={24} color='#394250' />}
            size="sm"
            variant="ghost"
            color="gray.500"
            _hover={{ bg: 'white', color: 'blue.500', boxShadow: 'sm' }}
            onClick={handleImageUpload}
            isDisabled={!!imageUrl || !allowFile}
          />
          <IconButton
            aria-label="Bold"
            icon={<BorderIcon size={24} color='#394250'/>}
            size="sm"
            variant={isBoldMode ? 'solid' : 'ghost'}
            colorScheme={isBoldMode ? 'blue' : 'gray'}
            color={isBoldMode ? 'white' : 'gray.500'}
            _hover={{ bg: isBoldMode ? 'blue.600' : 'white', color: isBoldMode ? 'white' : 'blue.500', boxShadow: 'sm' }}
            onClick={toggleEmphasis}
          />
        </Flex>

        <IconButton
          aria-label="Save"
          icon={<ArrowForwardIcon boxSize={4} />}
          size="sm"
          colorScheme="blue"
          variant="solid"
          isRound
          isDisabled={!content.trim()}
          onClick={handleSave}
          boxShadow="sm"
        />
      </Flex>
    </Box>
  );
};
