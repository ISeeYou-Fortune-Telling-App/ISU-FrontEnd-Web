'use client'
import React from 'react';
import { X, ThumbsUp, ThumbsDown, MessageCircle, Flag, Image as ImageIcon, EyeOff, Trash2 } from 'lucide-react';
import { Badge } from '../common/Badge';

interface Post {
  id: number;
  author: string;
  postedAt: string;
  title: string;
  fullContent: string;
  categories: string[];
  likes: number;
  comments: number;
  dislikes: number;
  reports: number;
}

interface PostDetailModalProps {
  post: Post | null;
  onClose: () => void;
  onReject?: (id: number) => void;   
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-md h-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col rounded-l-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{post.author}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{post.postedAt}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tiêu đề bài viết</p>
            <input
              type="text"
              value={post.title}
              readOnly
              className="w-full p-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nội dung bài viết</p>
            <div className="w-full p-3 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 space-y-2">
              {post.fullContent.split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Danh mục</p>
            <div className="flex flex-wrap gap-2">
              {post.categories.map((cat, i) => (
                <Badge key={i} type="expertise" value={cat} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Media</p>
            <div className="w-full h-36 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-dashed">
              <ImageIcon className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          <div className="flex justify-around items-center text-sm pt-2">
            <span className="flex items-center space-x-1 text-blue-600">
              <ThumbsUp className="w-5 h-5" /> <span>{post.likes}</span>
            </span>
            <span className="flex items-center space-x-1 text-yellow-500">
              <MessageCircle className="w-5 h-5" /> <span>{post.comments}</span>
            </span>
            <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
              <ThumbsDown className="w-5 h-5" /> <span>{post.dislikes}</span>
            </span>
            <span className="flex items-center space-x-1 text-red-500">
              <Flag className="w-5 h-5" /> <span>{post.reports}</span>
            </span>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
          <button className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center space-x-2">
            <EyeOff className="w-4 h-4" />
            <span>Ẩn bài viết</span>
          </button>
          <button className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center space-x-2">
            <Trash2 className="w-4 h-4" />
            <span>Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
