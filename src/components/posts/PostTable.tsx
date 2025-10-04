'use client'
import React, { useState } from 'react';
import { Search, Eye, X as XIcon, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { Badge } from '../common/Badge';
import { PostDetailModal } from './PostDetailModal';

const mockPosts = Array.from({ length: 97 }).map((_, i) => ({
  id: i + 1,
  author: 'Minh Tuệ',
  title: `Bài viết ${i + 1}`,   
  content: `Bài viết ${i + 1} ngắn gọn...`,
  fullContent: `Đây là nội dung chi tiết của bài viết ${i + 1}.`,
  category: i % 4 === 0 ? 'Cung Hoàng Đạo' : i % 4 === 1 ? 'Ngũ Hành' : i % 4 === 2 ? 'Tarot' : 'Nhân Tướng Học',
  categories: i % 2 === 0 ? ['Cung Hoàng Đạo', 'Ngũ Hành'] : ['Tarot'],
  status: i % 4 === 0 ? 'Đang hoạt động' : i % 4 === 1 ? '2 báo cáo' : i % 4 === 2 ? 'Đã ẩn' : 'Ngưng hoạt động',
  likes: 45,
  dislikes: 45,
  comments: 45,
  reports: i % 5,   
  postedAt: `16:30 10/0${(i % 9) + 1}/2020`
}));


type PostType = typeof mockPosts[0];
type StatusFilterType = 'Tất cả' | 'Đang hoạt động' | '2 báo cáo' | 'Đã ẩn' | 'Ngưng hoạt động';

const ITEMS_PER_PAGE = 10;

export const PostTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<StatusFilterType>('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);

  // Filter
  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch =
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedFilter === 'Tất cả' || post.status === selectedFilter;
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredPosts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const goToNextPage = () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
  const goToPrevPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));

  const handleReject = (post: PostType) => {
    console.log("❌ Đã từ chối bài viết:", post.id, post.title);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên Nhà tiên tri hoặc nội dung..."
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4">
        <div className="inline-flex border border-gray-300 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700">
          {['Tất cả', 'Đang hoạt động', '2 báo cáo', 'Đã ẩn', 'Ngưng hoạt động'].map(status => (
            <button
              key={status}
              onClick={() => { setSelectedFilter(status as StatusFilterType); setCurrentPage(1); }}
              className={`px-4 py-1 text-sm font-medium rounded-lg transition-colors 
                ${selectedFilter === status
                  ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Tác giả</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Nội dung</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Danh mục</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Tương tác</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Ngày đăng</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentPosts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">{post.author}</td>
                <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-300">{post.content}</td>
                <td className="px-6 py-3 whitespace-nowrap"><Badge type="expertise" value={post.category} /></td>
                <td className="px-6 py-3 whitespace-nowrap"><Badge type="status" value={post.status} /></td>

                {/* Cột Tương tác */}
                <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center justify-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4 text-blue-500" />
                      <span>{post.likes}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <ThumbsDown className="w-4 h-4 text-red-500" />
                      <span>{post.dislikes}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4 text-yellow-500" />
                      <span>{post.comments}</span>
                    </span>
                  </div>
                </td>

                <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400">{post.postedAt}</td>

                {/* Thao tác */}
                <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleReject(post)}
                    className="text-red-500 hover:text-red-700 p-1 transition-colors"
                    title="Từ chối bài viết"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">{currentPage}/{totalPages}</span>
          <button onClick={goToPrevPage} disabled={currentPage === 1}
            className={`p-1 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors ${
              currentPage === 1
                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}
            className={`p-1 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors ${
              currentPage === totalPages
                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal */}
      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
};
