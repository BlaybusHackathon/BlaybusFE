import { Box, Center, IconButton, Image, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
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
        <Box position="relative" width="full" maxW="600px" mx="auto" mb={8}>
            <Box
                position="relative"
                height="500px"
                overflow="hidden"
                borderRadius="xl"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
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
                            objectFit="contain" // 비율 유지하며 전체 표시
                            maxH="100%"
                            maxW="100%"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Index Indicator */}
                <Box position="absolute" top={4} right={4} bg="rgba(0,0,0,0.6)" color="white" px={3} py={1} borderRadius="full" fontSize="sm">
                    {currentIndex + 1} / {images.length}
                </Box>
            </Box>

            {/* Controls */}
            {images.length > 1 && (
                <>
                    <IconButton
                        aria-label="Previous image"
                        icon={<ChevronLeftIcon w={6} h={6} />}
                        position="absolute"
                        left="-20px"
                        top="50%"
                        transform="translateY(-50%)"
                        onClick={handlePrev}
                        isRound
                        boxShadow="md"
                        bg="white"
                        _hover={{ bg: 'gray.100' }}
                        zIndex={2}
                    />
                    <IconButton
                        aria-label="Next image"
                        icon={<ChevronRightIcon w={6} h={6} />}
                        position="absolute"
                        right="-20px"
                        top="50%"
                        transform="translateY(-50%)"
                        onClick={handleNext}
                        isRound
                        boxShadow="md"
                        bg="white"
                        _hover={{ bg: 'gray.100' }}
                        zIndex={2}
                    />
                </>
            )}
        </Box>
    );
};
