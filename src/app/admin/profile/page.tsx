'use client';

import React, { useEffect, useState } from 'react';
import { AccountService } from '@/services/account/account.service';
import {
  Camera,
  Loader2,
  X,
  Phone,
  Mars,
  Venus,
  CalendarFold,
  NotepadText,
  CircleCheck,
  User2,
} from 'lucide-react';

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    gender: '',
    birthDate: '',
    profileDescription: '',
    status: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      const data = await AccountService.getCurrentUser();
      setUser(data);
      setFormData({
        fullName: data.fullName ?? '',
        phone: data.phone ?? '',
        gender: data.gender ?? '',
        birthDate: data.birthDate ?? '',
        profileDescription: data.profileDescription ?? '',
        status: data.status ?? '',
      });
    };
    loadProfile();
  }, []);

  // 📸 Upload avatar or cover
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    console.log('>>> Upload type:', type);
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setIsUploading(true);
    try {
      if (type === 'avatar') await AccountService.uploadAvatar(file);
      else await AccountService.uploadCover(file);
      const updated = await AccountService.getCurrentUser();
      setUser(updated);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // ✏️ Update profile via modal
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await AccountService.updateProfile?.(formData);
      const updated = await AccountService.getCurrentUser();
      setUser(updated);
      setShowModal(false);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return <p className="text-center text-gray-500 mt-10">Đang tải thông tin...</p>;

  return (
    <div className="w-full bg-white dark:bg-gray-900 overflow-hidden dark:border-gray-700">
      {/* Cover */}
      <div className="relative h-72 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <img
          src={user.coverUrl || '/default_cover.jpg'}
          alt="Cover"
          className="w-full h-full object-cover pointer-events-none"
        />
        <label className="absolute bottom-3 right-3 z-10 bg-black/60 hover:bg-black/80 text-white px-3 py-2 rounded-lg text-sm cursor-pointer flex items-center space-x-1 transition">
          <Camera className="w-4 h-4" />
          <span>Đổi ảnh bìa</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleUpload(e, 'cover')}
          />
        </label>
      </div>

      {/* Avatar + Basic Info */}
      <div className="relative -mt-12 flex flex-col items-center text-center px-6 pb-6">
        <div className="relative">
          <img
            src={user.avatarUrl || '/default_avatar.png'}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
          />
          <label className="absolute bottom-0 right-0 bg-cyan-500 hover:bg-cyan-400 text-white p-1.5 rounded-full cursor-pointer shadow-md">
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUpload(e, 'avatar')}
            />
          </label>
        </div>

        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          {user.fullName || 'Chưa có tên'}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">{user.role}</p>
      </div>

      {/* Info Section */}
      <div className="px-8 pb-8 text-gray-700 dark:text-gray-300 space-y-4 text-md">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-cyan-500" />
          <p>
            <b>Số điện thoại:</b> {user.phone || 'Chưa cập nhật'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user.gender === 'MALE' ? (
            <Mars className="w-4 h-4 text-blue-400" />
          ) : user.gender === 'FEMALE' ? (
            <Venus className="w-4 h-4 text-pink-400" />
          ) : (
            <User2 className="w-4 h-4 text-gray-400" />
          )}
          <p>
            <b>Giới tính:</b> {user.gender || 'Chưa rõ'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CalendarFold className="w-4 h-4 text-amber-400" />
          <p>
            <b>Ngày sinh:</b> {user.birthDate?.slice(0, 10) || 'Chưa cập nhật'}
          </p>
        </div>

        <div className="flex items-start gap-2">
          <NotepadText className="w-4 h-4 text-green-500 mt-0.5" />
          <p>
            <b>Mô tả:</b> {user.profileDescription || 'Chưa có mô tả'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CircleCheck
            className={`w-4 h-4 ${
              user.status === 'ACTIVE'
                ? 'text-green-500'
                : user.status === 'INACTIVE'
                ? 'text-yellow-400'
                : 'text-red-500'
            }`}
          />
          <p>
            <b>Trạng thái:</b> {user.status || 'Không xác định'}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-6 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-medium rounded-lg shadow-sm transition"
        >
          Chỉnh sửa thông tin
        </button>
      </div>

      {/* Modal Edit Profile */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg p-6 relative shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Cập nhật thông tin cá nhân
            </h3>

            {/* Form */}
            <div className="space-y-4">
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 outline-none"
                placeholder="Họ và tên"
              />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 outline-none"
                placeholder="Số điện thoại"
              />
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 outline-none"
              >
                <option value="">Giới tính</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
              <input
                type="date"
                value={formData.birthDate?.slice(0, 10)}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 outline-none"
              />
              <textarea
                rows={3}
                value={formData.profileDescription}
                onChange={(e) => setFormData({ ...formData, profileDescription: e.target.value })}
                className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 outline-none"
                placeholder="Mô tả bản thân..."
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 outline-none"
              >
                <option value="">Trạng thái</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white hover:opacity-80"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-400 transition disabled:opacity-60 flex items-center justify-center space-x-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
