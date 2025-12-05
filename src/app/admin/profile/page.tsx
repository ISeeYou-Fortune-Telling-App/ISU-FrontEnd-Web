'use client';

import React, { useEffect, useState } from 'react';
import { AccountService } from '@/services/account/account.service';
import { Camera, Loader2, Settings } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    gender: '',
    birthDate: '',
    profileDescription: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await AccountService.getCurrentUser();
      setUser(response.data);
      setFormData({
        fullName: response.data.fullName ?? '',
        phone: response.data.phone ?? '',
        gender: response.data.gender ?? '',
        birthDate: response.data.birthDate ?? '',
        profileDescription: response.data.profileDescription ?? '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setIsUploading(true);
    try {
      await AccountService.uploadAvatar(file);
      await loadProfile();
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đã cập nhật ảnh đại diện',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error('Upload error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể tải ảnh lên',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await AccountService.updateProfile(formData);
      await loadProfile();
      setIsEditing(false);
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đã cập nhật thông tin',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error('Update failed:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể cập nhật thông tin',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-400 dark:border-gray-700 p-8 mb-6">
        <div className="flex items-center gap-8">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={user.avatarUrl || '/default_avatar.jpg'}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
              onError={(e) => {
                e.currentTarget.src = '/default_avatar.jpg';
              }}
            />
            <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition">
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Camera className="w-5 h-5" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadAvatar}
                disabled={isUploading}
              />
            </label>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {user.fullName || 'Chưa có tên'}
              </h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                {isEditing ? 'Hủy' : 'Chỉnh sửa'}
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-medium text-gray-900 dark:text-white">Email:</span>{' '}
                {user.email}
              </p>
              <p>
                <span className="font-medium text-gray-900 dark:text-white">Vai trò:</span>{' '}
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                  {user.role}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-900 dark:text-white">Trạng thái:</span>{' '}
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    user.status === 'ACTIVE'
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {user.status}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-400 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Chỉnh sửa thông tin
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Nhập họ và tên"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Giới tính
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  value={formData.birthDate?.slice(0, 10)}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mô tả
              </label>
              <textarea
                rows={3}
                value={formData.profileDescription}
                onChange={(e) => setFormData({ ...formData, profileDescription: e.target.value })}
                className="w-full px-4 py-2 border border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Viết vài dòng về bản thân..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Display */}
      {!isEditing && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-400 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Thông tin chi tiết
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex">
              <span className="w-32 text-gray-600 dark:text-gray-400">Số điện thoại:</span>
              <span className="text-gray-900 dark:text-white">{user.phone || 'Chưa cập nhật'}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-600 dark:text-gray-400">Giới tính:</span>
              <span className="text-gray-900 dark:text-white">
                {user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
              </span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-600 dark:text-gray-400">Ngày sinh:</span>
              <span className="text-gray-900 dark:text-white">
                {user.birthDate
                  ? new Date(user.birthDate).toLocaleDateString('vi-VN')
                  : 'Chưa cập nhật'}
              </span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-600 dark:text-gray-400">Mô tả:</span>
              <span className="text-gray-900 dark:text-white">
                {user.profileDescription || 'Chưa có mô tả'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
