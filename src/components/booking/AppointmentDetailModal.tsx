'use client'
import React, { useState } from 'react';
import { X, Calendar, User, Clock, Check, Ban, DollarSign, Eye } from 'lucide-react'; 

import { Badge, BadgeType, BadgeStatus } from '../common/Badge'; 

// 3. DetailItem (Không thay đổi)
interface DetailItemProps { label: string; value: string | number; Icon?: React.FC<any>; iconColor?: string; }
const DetailItem: React.FC<DetailItemProps> = ({ label, value, Icon, iconColor = 'text-gray-500' }) => {
    return (
        <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</span>
            <div className="flex items-center">
                {Icon && <Icon className={`w-5 h-5 inline mr-2 ${iconColor}`} />}
                <span className="font-medium text-gray-900 dark:text-white">{value}</span>
            </div>
        </div>
    );
};

// =================================================================
// INTERFACE VÀ DỮ LIỆU CHO MODAL LỊCH HẸN
// =================================================================
export interface AppointmentDetail {
    id: number;
    clientName: string;
    seerName: string;
    service: string;
    dateTime: string;
    duration: string;
    status: 'Hoàn thành' | 'Chờ xác nhận' | 'Đang diễn ra' | 'Bị hủy' | string;
    paymentStatus: 'Đã thanh toán' | 'Chờ thanh toán' | 'Đã hoàn tiền' | string; // Thêm 'Đã hoàn tiền' để match logic
    note: string;
    cancellationReason?: string; // Chỉ có khi Bị hủy
    confirmationTime?: string;
}

interface AppointmentDetailModalProps {
    appointment: AppointmentDetail | null;
    onClose: () => void;
    onConfirm: (id: number) => void;
    onCancel: (id: number, reason: string) => void;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({ appointment, onClose, onConfirm, onCancel }) => {
    const [reason, setReason] = useState('');
    const useScrollLock = (locked: boolean) => {}; 
    useScrollLock(!!appointment);

    if (!appointment) return null;

    const isPendingConfirmation = appointment.status === 'Chờ xác nhận';
    const isCancelled = appointment.status === 'Bị hủy';

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleConfirm = () => onConfirm(appointment.id);
    const handleCancel = () => onCancel(appointment.id, reason);

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-end"
            onClick={handleBackdropClick}
        >
            <div
                className="w-full max-w-md h-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-grow overflow-y-auto p-6 pb-20 space-y-5">
                    
                    {/* TIÊU ĐỀ LỊCH HẸN VÀ NÚT TẮT */}
                    <div className="pb-4 border-b border-dashed dark:border-gray-700">
                        <div className='flex justify-between items-start'>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-snug pr-4">Chi tiết Lịch hẹn</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 flex-shrink-0">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400 pt-1">
                                Dịch vụ: **{appointment.service}**
                            </p>
                        </div>
                    </div>

                    {/* THÔNG TIN CHUNG */}
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem Icon={User} label="Khách hàng" value={appointment.clientName} />
                        <DetailItem Icon={User} label="Nhà Tiên tri" value={appointment.seerName} />
                        <DetailItem Icon={Calendar} label="Thời gian" value={appointment.dateTime} />
                        <DetailItem Icon={Clock} label="Thời lượng" value={appointment.duration} />
                    </div>

                    {/* TRẠNG THÁI */}
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Trạng thái</p>
                            {/* Dùng Badge chung cho Status */}
                            <Badge type="status" value={appointment.status as BadgeStatus} /> 
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Thanh toán</p>
                            {/* Dùng Badge chung cho Payment Status */}
                            <Badge type="payment" value={appointment.paymentStatus} />
                        </div>
                    </div>

                    {/* GHI CHÚ */}
                    <div className="space-y-1 pt-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mb-1"><Eye className="w-4 h-4 mr-1" /> Ghi chú từ khách</p>
                        <p className="text-sm italic text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                            {appointment.note || 'Không có ghi chú.'}
                        </p>
                    </div>

                    {/* LÝ DO HỦY / THỜI GIAN XÁC NHẬN */}
                    {(isCancelled && appointment.cancellationReason) && (
                        <div className="space-y-1 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-red-500 dark:text-red-400">Lý do hủy</p>
                            <p className="text-sm italic text-red-800 dark:text-red-200">{appointment.cancellationReason}</p>
                        </div>
                    )}
                    {appointment.confirmationTime && (
                         <div className="space-y-1 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Thời điểm xác nhận</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{appointment.confirmationTime}</p>
                        </div>
                    )}

                    {/* KHU VỰC HỦY/XÁC NHẬN */}
                    {isPendingConfirmation && (
                         <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Lý do từ chối (bắt buộc nếu từ chối)</p>
                            <textarea
                                className="w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 resize-none h-20"
                                placeholder="Nhập lý do từ chối lịch hẹn..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </div>
                    )}
                    
                </div> {/* END: CONTENT CUỘN ĐƯỢC */}

                {/* 3. Action Footer (CỐ ĐỊNH) */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    {isPendingConfirmation ? (
                        <div className="flex space-x-3">
                            <button onClick={handleConfirm} className="flex-1 py-3 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700">
                                <Check className="w-5 h-5" />
                                <span>Xác nhận</span>
                            </button>
                            <button onClick={handleCancel} disabled={!reason} className={`flex-1 py-3 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2 ${!reason ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}>
                                <Ban className="w-5 h-5" />
                                <span>Từ chối</span>
                            </button>
                        </div>
                    ) : (
                        <button onClick={onClose} className="w-full py-3 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                            Đóng
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};