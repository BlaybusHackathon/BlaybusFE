import { Box, Center, IconButton, Image, Text, HStack } from '@chakra-ui/react';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ChatIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageSliderProps {
    images: string[];
}

export const ImageSlider = ({ images }: ImageSliderProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    if (!images || images.length === 0) {
        return (
            <Center
                bg="gray.100"
                h="400px"
                borderRadius="md"
                color="gray.500"
                flexDirection="column"
            >
                <Text>제출된 이미지가 없습니다.</Text>
            </Center>
        );
    }

    return (
        <Box position="relative" width="full" maxW="600px" mx="auto" mb={20}>
            <Box
                position="relative"
                height="auto"
                minH="600px"
                borderRadius="24px"
                bg="#E5E7EB" // Gray background as placeholder
                overflow="hidden"
            >
                <AnimatePresence initial={false} mode='wait'>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Image
                            src={images[currentIndex]}
                            alt={`Submission ${currentIndex + 1}`}
                            objectFit="contain" // Contain to show full paper
                            w="100%"
                            h="auto"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Counter */}
                <Box
                    position="absolute"
                    top={6}
                    right={6}
                    fontSize="16px"
                    fontWeight="medium"
                    color="#4B5563"
                >
                    {currentIndex + 1}/{images.length}
                </Box>

                {/* Comment Overlay - Hardcoded as per design requirement */}
                <Box position="absolute" top="35%" right="20%" zIndex={10}>
                    <Box
                        bg="white"
                        px={4}
                        py={3}
                        borderRadius="12px"
                        boxShadow="lg"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        maxW="250px"
                    >
                        <Box color="blue.400">
                            {/* Beaming icon placeholder */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" fill="#60A5FA" />
                                <path d="M12 7V17M7 12H17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <path d="M8.5 8.5L15.5 15.5M15.5 8.5L8.5 15.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </Box>
                        <Text fontSize="14px" fontWeight="bold" color="#1F2937">
                            예문과 함께 다시 한 번 복습해보세요.
                        </Text>
                        {/* Triangle pointer */}
                        <Box
                            position="absolute"
                            left="-8px"
                            top="50%"
                            transform="translateY(-50%) rotate(45deg)"
                            w="16px"
                            h="16px"
                            bg="white"
                            borderRadius="2px"
                            zIndex={-1}
                        />
                    </Box>
                </Box>

            </Box>

            {/* Comments FAB - Moved Outside */}
            <Box position="absolute" bottom={-16} right={0} zIndex={5}>
                <HStack spacing={2} align="center">
                    <Text
                        fontSize="13px"
                        fontWeight="bold"
                        color="#3B82F6"
                        cursor="pointer"
                    >
                        코멘트
                    </Text>
                    <IconButton
                        aria-label="Comments"
                        icon={<ChatIcon boxSize={5} color="white" />}
                        isRound
                        w="48px" h="48px"
                        bg="#3B82F6"
                        _hover={{ bg: 'blue.600' }}
                        boxShadow="md"
                    />
                </HStack>
            </Box>

            {/* Navigation Controls */}
            {images.length > 1 && (
                <>
                    <IconButton
                        aria-label="Previous image"
                        icon={<ChevronLeftIcon w={6} h={6} color="#9CA3AF" />}
                        position="absolute"
                        left="-24px"
                        top="50%"
                        transform="translateY(-50%)"
                        onClick={handlePrev}
                        isRound
                        w="40px" h="40px"
                        bg="white"
                        boxShadow="md" // Softer shadow
                        _hover={{ bg: 'gray.50' }}
                        zIndex={2}
                        border="1px solid"
                        borderColor="gray.100"
                    />
                    <IconButton
                        aria-label="Next image"
                        icon={<ChevronRightIcon w={6} h={6} color="#9CA3AF" />}
                        position="absolute"
                        right="-24px"
                        top="50%"
                        transform="translateY(-50%)"
                        onClick={handleNext}
                        isRound
                        w="40px" h="40px"
                        bg="white"
                        boxShadow="md"
                        _hover={{ bg: 'gray.50' }}
                        zIndex={2}
                        border="1px solid"
                        borderColor="gray.100"
                    />
                </>
            )}
        </Box>
    );
};
