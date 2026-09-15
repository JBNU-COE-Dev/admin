import { apiClient } from './client';
import { ActivityPostResponseDto, AdminMemberDto, Page } from '@/types';

const BASE = '/api/admin/users';

export const adminUsersApi = {
  getList: async (params?: {
    page?: number;
    size?: number;
    search?: string;
  }): Promise<Page<AdminMemberDto>> => {
    const response = await apiClient.get<Page<AdminMemberDto>>(BASE, { params });
    return response.data;
  },

  getById: async (userId: number): Promise<AdminMemberDto> => {
    const response = await apiClient.get<AdminMemberDto>(`${BASE}/${userId}`);
    return response.data;
  },

  getPosts: async (
    userId: number,
    params?: { page?: number; size?: number }
  ): Promise<Page<ActivityPostResponseDto>> => {
    const response = await apiClient.get<Page<ActivityPostResponseDto>>(
      `${BASE}/${userId}/posts`,
      { params }
    );
    return response.data;
  },
};
