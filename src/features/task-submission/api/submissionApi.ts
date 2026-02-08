import { apiClient } from '@/shared/api/base';
import { USE_MOCK } from '@/shared/mocks/mockEnv';
import { mockApi } from '@/shared/mocks/mockApi';

export const submissionApi = {
  submit: async (taskId: string, memo: string, files: File[]) => {
    if (USE_MOCK) return mockApi.submission.submit(taskId, memo, files);
    const form = new FormData();
    if (memo !== undefined) form.append('comment', memo);
    files.forEach((file) => form.append('files', file));

    return apiClient.post(`/tasks/${taskId}/submissions`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteSubmission: async (submissionId: string): Promise<void> => {
    if (USE_MOCK) return mockApi.submission.deleteSubmission(submissionId);
    await apiClient.delete(`/tasks/submissions/${submissionId}`);
  },
};
