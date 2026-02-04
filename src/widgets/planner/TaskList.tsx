import { useState } from 'react';
import { VStack, Text, Button, Box } from '@chakra-ui/react';
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { TaskItem } from '@/features/task/ui/TaskItem';
import { TaskAddForm } from '@/features/task/ui/TaskAddForm';
import { useNavigate } from 'react-router-dom';
import { Task } from '@/entities/task/types';
import { AddIcon } from '@chakra-ui/icons';
import { canAddTask, canUseTimer } from '@/shared/lib/date';

export const TaskList = () => {
  const { tasks, selectedDate, updateTaskStatus, deleteTask, addTask } = usePlannerStore();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const isEditable = canAddTask(selectedDate);
  const isTimerEnabled = canUseTimer(selectedDate);

  const handleTaskClick = (taskId: string) => {
    navigate(`/mentee/task/${taskId}`);
  };

  const handleToggle = (task: Task) => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    updateTaskStatus(task.id, newStatus);
  };

  const handleAddTask = (data: { title: string; subject: any }) => {
    const newTask: Task = {
      id: `new-${Date.now()}`,
      title: data.title,
      subject: data.subject,
      taskDate: selectedDate,
      status: 'PENDING',
      isMandatory: false,
      isMentorChecked: false,
      menteeId: 'mentee-1',
      recurringGroupId: null,
      contentId: null,
      weaknessId: null,
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
            onToggle={() => handleToggle(task)}
            onDelete={() => deleteTask(task.id)}
            onClick={() => handleTaskClick(task.id)}
            isTimerEnabled={isTimerEnabled}
            isEditable={isEditable}
          />
        ))
      )}

      {isEditable && (
        isAdding ? (
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
        )
      )}
    </VStack>
  );
};