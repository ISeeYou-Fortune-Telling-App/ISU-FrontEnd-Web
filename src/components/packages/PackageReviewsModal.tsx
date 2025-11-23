'use client';
import React, { useState, useEffect } from 'react';
import { X, MessageCircle, ChevronRight, Send, Edit2, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { PackageService } from '@/services/packages/package.service';
import { ServiceReview } from '@/types/packages/package.type';

interface PackageReviewsModalProps {
  packageId: string;
  packageTitle: string;
  onClose: () => void;
}

export const PackageReviewsModal: React.FC<PackageReviewsModalProps> = ({
  packageId,
  packageTitle,
  onClose,
}) => {
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [selectedReview, setSelectedReview] = useState<ServiceReview | null>(null);
  const [replies, setReplies] = useState<ServiceReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Load top-level reviews
  useEffect(() => {
    loadReviews();
  }, [packageId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await PackageService.getReviews(packageId, {
        page: 1,
        limit: 20,
        sortType: 'desc',
        sortBy: 'createdAt',
      });
      setReviews(res.data);
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load replies when click on a review
  const loadReplies = async (reviewId: string) => {
    try {
      const res = await PackageService.getReviewReplies(reviewId, {
        page: 1,
        limit: 20,
        sortType: 'asc',
        sortBy: 'createdAt',
      });
      setReplies(res.data);
    } catch (err) {
      console.error('Error loading replies:', err);
    }
  };

  const handleReviewClick = (review: ServiceReview) => {
    setSelectedReview(review);
    loadReplies(review.reviewId);
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedReview) {
      console.warn('Gửi phản hồi bị chặn: không có nội dung hoặc bình luận gốc.');
      return;
    } // Lấy ID an toàn TRƯỚC KHI await (Điều này vẫn rất quan trọng)

    const parentId = selectedReview.reviewId; // Thêm kiểm tra phòng trường hợp ID không tồn tại

    if (!parentId) {
      console.error('Không thể phản hồi: Bình luận gốc không có ID.', selectedReview);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không tìm thấy ID của bình luận gốc.',
        icon: 'error',
      });
      return;
    }

    try {
      // Gọi API để tạo reply
      await PackageService.createReview(packageId, {
        comment: replyText,
        parentReviewId: parentId, // Dùng ID đã lưu
      });

      setReplyText(''); // Tải lại danh sách replies

      loadReplies(parentId);
    } catch (err) {
      console.error('Error sending reply:', err);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể gửi phản hồi',
        icon: 'error',
      });
    }
  };

  const handleEditReview = async (reviewId: string) => {
    if (!editText.trim()) return;

    try {
      await PackageService.updateReview(reviewId, {
        comment: editText,
      });
      setEditingReviewId(null);
      setEditText('');
      // Reload
      if (selectedReview) {
        loadReplies(selectedReview.reviewId);
      } else {
        loadReviews();
      }
    } catch (err) {
      console.error('Error editing review:', err);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể cập nhật bình luận',
        icon: 'error',
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Xác nhận xóa bình luận? Tất cả phản hồi cũng sẽ bị xóa.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await PackageService.deleteReview(reviewId);

      if (selectedReview && selectedReview.reviewId === reviewId) {
        setSelectedReview(null);
        setReplies([]);
        loadReviews(); // Tải lại danh sách bình luận chính
      } else if (selectedReview) {
        // Case 2: Bạn vừa xóa một PHẢN HỒI
        // Chỉ cần tải lại danh sách replies cho bình luận gốc hiện tại
        loadReplies(selectedReview.reviewId);
      } else {
        // Trường hợp dự phòng: tải lại danh sách chính
        loadReviews();
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể xóa bình luận',
        icon: 'error',
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Bình luận & Đánh giá
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{packageTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - 2 columns */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Reviews List */}
          <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4 space-y-3">
              {loading ? (
                <p className="text-center text-gray-500">Đang tải...</p>
              ) : reviews.length === 0 ? (
                <p className="text-center text-gray-500">Chưa có bình luận nào</p>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.reviewId}
                    onClick={() => handleReviewClick(review)}
                    className={`p-3 rounded-lg border cursor-pointer transition ${
                      selectedReview?.reviewId === review.reviewId
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={review.user.avatarUrl || '/default_avatar.jpg'}
                          alt={review.user.fullName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">
                            {review.user.fullName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(review.createdAt).toLocaleString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Replies */}
          <div className="w-1/2 flex flex-col">
            {selectedReview ? (
              <>
                {/* Selected Review Detail */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start space-x-3">
                    <img
                      src={selectedReview.user.avatarUrl || '/default_avatar.jpg'}
                      alt={selectedReview.user.fullName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedReview.user.fullName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(selectedReview.createdAt).toLocaleString('vi-VN')}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              setEditingReviewId(selectedReview.reviewId);
                              setEditText(selectedReview.comment);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title="Sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(selectedReview.reviewId)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {editingReviewId === selectedReview.reviewId ? (
                        <div className="mt-2">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-2 border rounded-lg text-sm"
                            rows={3}
                          />
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={() => handleEditReview(selectedReview.reviewId)}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={() => setEditingReviewId(null)}
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                          {selectedReview.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Replies List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {replies.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm">Chưa có phản hồi</p>
                  ) : (
                    replies.map((reply) => (
                      <div
                        key={reply.reviewId}
                        className="pl-4 border-l-2 border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start space-x-2">
                          <img
                            src={reply.user.avatarUrl || '/default_avatar.jpg'}
                            alt={reply.user.fullName}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm text-gray-900 dark:text-white">
                                  {reply.user.fullName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(reply.createdAt).toLocaleString('vi-VN')}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteReview(reply.reviewId)}
                                className="p-1 text-gray-400 hover:text-red-600"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                              {reply.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Reply Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Viết phản hồi..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
                                 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSendReply();
                      }}
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                                 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-1"
                    >
                      <Send className="w-4 h-4" />
                      <span>Gửi</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Chọn một bình luận để xem chi tiết</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
