import { apiFetch } from '@/services/api';
import { isSingleResponse, isListResponse } from '@/types/response.type';
import {
  GetMessagesStatsResponse,
  MessagesStats,
  GetSearchConversationsResponse,
  GetMessagesByConversationResponse,
  ConversationSession,
  ConversationParams,
  CreateAdminConversationRequest,
  CreateAdminConversationResponse,
  SimpleUserInfo,
} from '@/types/messages/messages.type';

import { AccountService } from '@/services/account/account.service';
import type { UserAccount } from '@/types/account/account.type';

export const MessagesService = {
  getMessagesStats: async (): Promise<MessagesStats> => {
    const response = await apiFetch<GetMessagesStatsResponse>(
      '/admin/conversations/messages/statistics',
    );

    if (isSingleResponse<MessagesStats>(response)) {
      return response.data;
    }

    throw new Error('Không nhận được dữ liệu thống kê hợp lệ.');
  },

  getSearchConversations: async (params: ConversationParams): Promise<ConversationSession[]> => {
    const response = await apiFetch<GetSearchConversationsResponse>('/admin/conversations/search', {
      method: 'GET',
      params: {
        ...params,
        sortBy: 'sessionStartTime',
        type: 'ADMIN_CHAT',
        status: 'ACTIVE',
      },
    });

    if (isListResponse<ConversationSession>(response)) {
      return response.data;
    }

    throw new Error('Không nhận được dữ liệu hội thoại hợp lệ.');
  },

  getMessagesByConversation: async (
    conversationId: string,
    page = 1,
    limit = 50,
  ): Promise<GetMessagesByConversationResponse> => {
    const response = await apiFetch<GetMessagesByConversationResponse>(
      `/chat/conversations/${conversationId}/messages`,
      {
        method: 'GET',
        params: { page, limit, sortType: 'desc', sortBy: 'createdAt' },
      },
    );

    if (response?.data) return response;
    throw new Error('Không nhận được dữ liệu tin nhắn hợp lệ.');
  },

  create: async (body: CreateAdminConversationRequest) => {
    const response = await apiFetch<CreateAdminConversationResponse>('/admin/conversations', {
      method: 'POST',
      data: JSON.stringify(body),
    });

    if (isSingleResponse(response)) {
      return response.data;
    }

    throw new Error('Không nhận được dữ liệu hội thoại hợp lệ từ server.');
  },

  uploadChatFile: async (
    formData: FormData,
  ): Promise<{ data: { imagePath?: string; videoPath?: string } }> => {
    const response = await apiFetch<{
      statusCode: number;
      message: string;
      data: { imagePath?: string; videoPath?: string };
    }>('/chat/messages/file', {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: formData,
    });

    if (response?.data) return response;
    throw new Error('Không nhận được đường dẫn file hợp lệ từ server.');
  },
};

export const getSimpleUserList = async (): Promise<SimpleUserInfo[]> => {
  const response = await AccountService.getAccounts({
    page: 1,
    limit: 50, // hoặc tùy bạn muốn phân trang
  });

  // Map dữ liệu về dạng rút gọn
  return response.data.map((user: UserAccount) => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
  }));
};
