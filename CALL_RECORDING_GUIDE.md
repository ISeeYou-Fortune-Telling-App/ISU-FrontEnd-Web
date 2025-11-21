# Call Recording Guide

## Tổng quan

Recording feature đã được tích hợp vào cả audio và video calls. Người dùng có thể bắt đầu/dừng recording trong cuộc gọi.

## Cấu hình hiện tại

### 1. Recording Button trong UI

- ✅ `showRecordingButton(true)` - Hiển thị nút Recording trong giao diện CometChat
- ✅ `startRecordingOnCallStart(false)` - Không tự động bắt đầu recording (người dùng phải bấm nút)

### 2. Recording Listeners

Đã thêm 2 listeners để theo dõi trạng thái recording:

```typescript
onRecordingStarted: (event: any) => {
  console.log('🔴 Recording started by:', event.user);
},
onRecordingStopped: (event: any) => {
  console.log('⏹️ Recording stopped by:', event.user);
}
```

## Cách sử dụng

### Option 1: Sử dụng UI mặc định của CometChat (Đã setup)

Khi trong cuộc gọi, người dùng sẽ thấy nút Recording trong giao diện. Chỉ cần click để bắt đầu/dừng recording.

### Option 2: Tạo custom recording buttons

Nếu muốn tạo button riêng, sử dụng utility functions:

```typescript
import { startCallRecording, stopCallRecording } from '@/utils/callRecording';

// Bắt đầu recording
await startCallRecording();

// Dừng recording
await stopCallRecording();
```

## Ví dụ: Custom Recording Button Component

```typescript
import { useState } from 'react';
import { startCallRecording, stopCallRecording } from '@/utils/callRecording';

const CustomRecordingButton = () => {
  const [isRecording, setIsRecording] = useState(false);

  const handleToggleRecording = async () => {
    try {
      if (isRecording) {
        await stopCallRecording();
        setIsRecording(false);
      } else {
        await startCallRecording();
        setIsRecording(true);
      }
    } catch (error) {
      alert('Không thể thay đổi trạng thái recording');
    }
  };

  return (
    <button
      onClick={handleToggleRecording}
      className={`px-4 py-2 rounded ${isRecording ? 'bg-red-500' : 'bg-gray-500'}`}
    >
      {isRecording ? '⏹️ Dừng Recording' : '🔴 Bắt đầu Recording'}
    </button>
  );
};
```

## Tùy chỉnh

### Tự động bắt đầu recording khi call bắt đầu

Nếu muốn tự động recording mọi cuộc gọi, thay đổi:

```typescript
.startRecordingOnCallStart(true) // Thay false thành true
```

### Ẩn nút Recording (nếu dùng custom UI)

```typescript
.showRecordingButton(false) // Thay true thành false
```

## Files đã được cập nhật

1. ✅ `src/components/messages/VideoCall.tsx` - Thêm recording cho default calling
2. ✅ `src/components/messages/VideoCallUIKit.tsx` - Thêm recording cho UIKit calling
3. ✅ `src/utils/callRecording.ts` - Utility functions để control recording

## Lưu ý

- Recording chỉ hoạt động khi cuộc gọi đã được thiết lập (ongoing call)
- Cả 2 người trong cuộc gọi đều có thể bắt đầu/dừng recording
- Recording files sẽ được lưu trên CometChat server (kiểm tra CometChat Dashboard để xem recordings)
- Đảm bảo CometChat plan của bạn hỗ trợ recording feature (Beta feature)
