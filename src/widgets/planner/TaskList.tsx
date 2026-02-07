import { VStack, Text, Box } from '@chakra-ui/react';
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { TaskItem } from '@/features/task/ui/TaskItem';
import { TaskAddForm } from '@/features/task/ui/TaskAddForm';
import { useNavigate } from 'react-router-dom';
import { Task } from '@/entities/task/types';
import { canAddTask, canUseTimer } from '@/shared/lib/date';
import { isBefore, startOfDay } from 'date-fns';
import { useAuthStore } from '@/shared/stores/authStore';

export const TaskList = () => {
  const { tasks, selectedDate, updateTaskStatus, deleteTask, addTask } = usePlannerStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const isEditable = canAddTask(selectedDate);
  const isTimerEnabled = canUseTimer(selectedDate);

  const handleTaskClick = (taskId: string) => {
    const today = startOfDay(new Date());
    const taskDateObj = startOfDay(new Date(selectedDate));

    if (isBefore(taskDateObj, today)) {
      navigate(`/mentee/task/${taskId}`);
    } else {
      navigate(`/mentee/task/${taskId}/submit`);
    }
  };

  const handleToggle = (task: Task) => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    updateTaskStatus(task.id, newStatus);
  };

  const handleAddTask = (data: { title: string; subject: any }) => {
    // [수정] 유저가 없으면 중단 (안전장치)
    if (!user) {
      console.error("User not logged in");
      return;
    }

    const newTask: Task = {
      id: `new-${Date.now()}`,
      title: data.title,
      subject: data.subject,
      taskDate: selectedDate,
      status: 'PENDING',
      isMandatory: false,
      isMentorChecked: false,
      menteeId: user.id, // [수정] 'mentee-1' -> user.id 동적 할당
      recurringGroupId: null,
      contentId: null,
      weaknessId: null,
    };
    addTask(newTask);
  };

  return (
    <VStack spacing={3} justify={'center'} align="stretch" p={2}>
      {tasks.length === 0 ? (
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
        <Box mt={2}>
          <TaskAddForm 
            onSubmit={handleAddTask} 
            onCancel={() => {}} 
          />
        </Box>
      )}
    </VStack>
  );
};