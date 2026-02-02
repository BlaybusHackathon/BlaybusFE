import { useState } from 'react';
import { VStack, Text, Button, Box } from '@chakra-ui/react';
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { TaskItem } from '@/features/task/ui/TaskItem';
import { TaskAddForm } from '@/features/task/ui/TaskAddForm';
import { useNavigate } from 'react-router-dom';
import { Task } from '@/entities/task/types';
import { AddIcon } from '@chakra-ui/icons';

export const TaskList = () => {
  const { tasks, selectedDate, toggleTaskComplete, deleteTask, addTask } = usePlannerStore();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const handleTaskClick = (taskId: string) => {
    navigate(`/mentee/task/${taskId}`);
  };

  const handleAddTask = (data: { title: string; subject: any }) => {
    const newTask: Task = {
      id: `new-${Date.now()}`,
      title: data.title,
      subject: data.subject,
      date: selectedDate, // 현재 선택된 날짜로 등록
      isFixed: false,
      isCompleted: false,
      menteeId: 'mentee-1', // 임시 ID
      createdBy: 'MENTEE',
    };
    addTask(newTask);
    setIsAdding(false);
  };

  return (
    <VStack spacing={3} align="stretch" pb={20}>
      {tasks.length === 0 && !isAdding ? (
        <Text textAlign="center" color="gray.500" py={10}>
          등록된 할 일이 없습니다.
        </Text>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => toggleTaskComplete(task.id)}
            onDelete={() => deleteTask(task.id)}
            onClick={() => handleTaskClick(task.id)}
          />
        ))
      )}

      {isAdding ? (
        <Box mt={2}>
          <TaskAddForm onSubmit={handleAddTask} onCancel={() => setIsAdding(false)} />
        </Box>
      ) : (
        <Button 
          leftIcon={<AddIcon />} 
          colorScheme="blue" 
          variant="outline" 
          w="full" 
          onClick={() => setIsAdding(true)}
          mt={2}
        >
          할 일 추가하기
        </Button>
      )}
    </VStack>
  );
};