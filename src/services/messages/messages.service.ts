import { apiFetch } from '@/services/api-client';
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
    // Tạo object mới với JSON parse/stringify để tránh frozen object
    const queryParams: Record<string, any> = {
      page: params.page,
      limit: params.limit,
      sortBy: 'lastMessageTime',
      sortType: params.sortType,
      type: 'ADMIN_CHAT',
      status: 'ACTIVE',
    };

    // Chỉ thêm participantName nếu có giá trị
    if (params.participantName) {
      queryParams.participantName = params.participantName;
    }

    const response = await apiFetch<GetSearchConversationsResponse>('/admin/conversations/search', {
      method: 'GET',
      params: queryParams,
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

  sendMessage: async (data: {
    conversationId: string;
    textContent?: string;
    imagePath?: string;
    videoPath?: string;
  }): Promise<any> => {
    const formData = new FormData();
    formData.append('conversationId', data.conversationId);
    if (data.textContent) formData.append('textContent', data.textContent);
    if (data.imagePath) formData.append('imagePath', data.imagePath);
    if (data.videoPath) formData.append('videoPath', data.videoPath);

    const response = await apiFetch<{
      statusCode: number;
      message: string;
      data: any;
    }>('/chat/messages', {
      method: 'POST',
      data: formData,
    });

    if (response?.data) return response.data;
    throw new Error('Không thể gửi tin nhắn.');
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

  markAsRead: async (conversationId: string): Promise<void> => {
    try {
      const response = await apiFetch<{ statusCode: number; message: string }>(
        `/chat/conversations/${conversationId}/mark-read`,
        { method: 'POST' },
      );
      if (response.statusCode !== 200) {
        console.warn('⚠️ Mark-read response:', response);
      }
    } catch (err) {
      console.error('❌ Lỗi khi đánh dấu đã đọc:', err);
    }
  },

  endChatSession: async (conversationId: string): Promise<void> => {
    const response = await apiFetch<{ statusCode: number; message: string }>(
      `/chat/conversations/${conversationId}/end`,
      { method: 'POST' },
    );

    if (response.statusCode !== 1073741824) {
      throw new Error(response.message || 'Không thể kết thúc phiên chat');
    }
  },

  extendChatSession: async (conversationId: string, additionalMinutes: number): Promise<void> => {
    const response = await apiFetch<{ statusCode: number; message: string }>(
      `/chat/conversations/${conversationId}/extend?additionalMinutes=${additionalMinutes}`,
      { method: 'POST' },
    );

    if (response.statusCode !== 1073741824) {
      throw new Error(response.message || 'Không thể gia hạn phiên chat');
    }
  },

  deleteMessage: async (messageId: string): Promise<void> => {
    const response = await apiFetch<{ statusCode: number; message: string }>(
      `/chat/messages/${messageId}`,
      { method: 'DELETE' },
    );

    if (response.statusCode !== 200) {
      throw new Error(response.message || 'Không thể xóa tin nhắn');
    }
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
