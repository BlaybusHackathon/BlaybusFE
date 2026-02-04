import { usePlannerStore } from '@/shared/stores/plannerStore';
import { logsToGridState } from '../model/studyTimeUtils';
import { StudyTimeGridView } from './StudyTimeGridView';

export const StudyTimeGrid = () => {
  const { tasks, taskLogs } = usePlannerStore();
  const gridState = logsToGridState(taskLogs, tasks);

  return <StudyTimeGridView gridState={gridState} />;
};