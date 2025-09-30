// src/types/certificate.ts

export type CertificateStatus = 'Đã duyệt' | 'Chờ duyệt' | 'Đã từ chối';

// Interface gốc (Dữ liệu từ API/Mock data)
export interface TableCertificate {
    id: number;
    name: string;
    seer: string; // Tên Nhà tiên tri (dùng cho cột bảng)
    category: string;
    date: string; // Ngày nộp (dùng cho cột bảng)
    status: CertificateStatus;
    
    issueDate: string;
    expiryDate: string;
    organization: string;
    description: string;
    fileUrl: string;
    fileName: string;
    reviewerNote: string;
    reviewTime?: string;
}

// Interface chi tiết cho Modal (Kế thừa từ TableCert và thêm các trường cần thiết)
export interface ModalCertificate extends TableCertificate {
    // Các trường được gán thêm trong handleView
    uploadedBy: string; // Tên người nộp (lấy từ seer)
    uploadTime: string; // Thời gian nộp (lấy từ date)
}