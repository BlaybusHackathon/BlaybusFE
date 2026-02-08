import { VStack, Text, Box } from '@chakra-ui/react';
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { TaskItem } from '@/features/task/ui/TaskItem';
import { TaskAddForm } from '@/features/task/ui/TaskAddForm';
import { useNavigate } from 'react-router-dom';
import { Task } from '@/entities/task/types';
import { canAddTask, canUseTimer } from '@/shared/lib/date';
import { isBefore, startOfDay } from 'date-fns';
import { useAuthStore } from '@/shared/stores/authStore';
import { taskApi } from '@/features/task/api/taskApi';
import type { Subject } from '@/shared/constants/enums';

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

  const handleToggle = async (task: Task) => {
    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    try {
      const updated = await taskApi.updateTask(task.id, { status: newStatus });
      updateTaskStatus(updated.id, updated.status);
    } catch (e) {
      console.error('Failed to update task status:', e);
    }
  };

  const handleAddTask = async (data: { title: string; subject: Subject }) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    try {
      const created = await taskApi.createMenteeTask({
        date: selectedDate,
        title: data.title,
        subject: data.subject,
      });
      addTask(created);
    } catch (e) {
      console.error('Failed to create task:', e);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskApi.deleteTask(taskId);
      deleteTask(taskId);
    } catch (e) {
      console.error('Failed to delete task:', e);
    }
  };

  return (
    <VStack spacing={3} justify={'center'} align="stretch">
      {tasks.length === 0 ? (
        <Text textAlign="center" color="gray.500" py={10}>
          등록된 할 일이 없습니다.
        </Text>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => void handleToggle(task)}
            onDelete={() => void handleDeleteTask(task.id)}
            onClick={() => handleTaskClick(task.id)}
            isTimerEnabled={isTimerEnabled} 
            isEditable={isEditable}
          />
        ))
      )}

      {isEditable && (
        <Box>
          <TaskAddForm 
            onSubmit={handleAddTask} 
            onCancel={() => {}} 
          />
        </Box>
      )}
    </VStack>
  );
};
