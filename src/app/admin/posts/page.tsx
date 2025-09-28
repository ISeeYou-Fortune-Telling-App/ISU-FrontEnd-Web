// src/app/admin/posts/page.tsx
import React from 'react';

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý Bài viết</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Duyệt, chỉnh sửa và quản lý các bài viết trên News Feed.
      </p>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 h-96 flex items-center justify-center">
        [Placeholder: Bảng Quản lý Bài viết và Lọc]
      </div>
    </div>
  );
}