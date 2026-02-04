import { VStack, Flex } from '@chakra-ui/react';
import { Weakness } from '@/entities/weakness/types';
import { WeaknessItem } from './WeaknessItem';
import { AddWeaknessButton } from './AddWeaknessButton';

interface Props {
  weaknesses: Weakness[];
  
  editingId: string | null; 
  isAdding: boolean;       
  
  onAddClick: () => void;   
  onEditMode: (id: string) => void;  
  onCancel: () => void;    
  onSave: (id: string, title: string, fileName?: string) => void;
  onDelete: (id: string) => void; 
}

export const WeaknessList = ({ 
  weaknesses, 
  editingId, 
  isAdding, 
  onAddClick, 
  onEditMode, 
  onCancel, 
  onSave, 
  onDelete 
}: Props) => {
  return (
    <VStack spacing={3} align="stretch">
      {weaknesses.length === 0 && !isAdding && (
        <Flex 
          h="100px" 
          justify="center" 
          align="center" 
          color="gray.400" 
          fontSize="sm"
        >
          등록된 보완점이 없습니다.
        </Flex>
      )}

      {weaknesses.map((item) => (
        <WeaknessItem
          key={item.id}
          weakness={item}
          isEditing={editingId === item.id} 
          
          onEditMode={() => onEditMode(item.id)}
          onCancel={onCancel}
          onSave={onSave}
          onDelete={onDelete}
        />
      ))}
      
      {isAdding ? (
        <WeaknessItem
          weakness={{
             id: 'temp-new',
             title: '',
             subject: 'KOREAN', 
             menteeId: '',
             inforId: '',
             contentId: '',
          }}
          isEditing={true}     
          onEditMode={() => {}} 
          onCancel={onCancel}
          onSave={onSave}
          onDelete={onCancel}   
        />
      ) : (
        <AddWeaknessButton onClick={onAddClick} />
      )}
    </VStack>
  );
};