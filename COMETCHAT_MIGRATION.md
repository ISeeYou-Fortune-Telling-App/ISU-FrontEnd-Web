# Migration từ Zego sang CometChat - Hướng dẫn

## ✅ Đã hoàn thành

### 1. Cài đặt CometChat SDK

```bash
npm install @cometchat/chat-sdk-javascript @cometchat/calls-sdk-javascript
```

### 2. Cấu hình môi trường

Đã tạo file `.env.local` với các biến:

```
NEXT_PUBLIC_COMETCHAT_APP_ID=167166294e6dd0180
NEXT_PUBLIC_COMETCHAT_AUTH_KEY=69eb85b8b28dbd77670ea910c6f54d4b4faeb92d
NEXT_PUBLIC_COMETCHAT_REGION=us
```

### 3. File đã chuyển đổi

- ✅ `src/config/cometchat.config.ts` - File cấu hình CometChat
- ✅ `src/components/messages/VideoCall.tsx` - Component video call dùng CometChat
- ✅ `src/hooks/useCometChatGlobalListener.ts` - Hook global listener cho CometChat
- ✅ `src/components/messages/MessageDetailPanel.tsx` - Đã xóa import Zego không dùng

## 🐛 Bug đã fix trong HTML mẫu của bạn

**Vấn đề**: Khi bấm call, không hiện màn hình video call

**Nguyên nhân**: Code HTML chỉ dùng `CometChat.initiateCall()` để gửi lời mời gọi, nhưng thiếu bước `CometChatCalls.startSession()` để bắt đầu cuộc gọi thực sự với UI.

**Giải pháp**: Đã implement đầy đủ workflow trong `VideoCall.tsx`:

1. `initiateCall()` - Gửi lời mời
2. Đợi `onOutgoingCallAccepted` callback
3. Gọi `startSession()` để hiển thị UI video call

## 📋 Cách sử dụng

### Tạo user trong CometChat Dashboard

Trước khi test, bạn cần tạo users trong CometChat Dashboard:

1. Truy cập https://app.cometchat.com
2. Vào mục "Users"
3. Tạo user với UID khớp với `currentUserId` và `targetUserId` trong app của bạn

### Sử dụng VideoCall Component

```tsx
import { VideoCall } from '@/components/messages/VideoCall';

<VideoCall
  conversationId="unique-room-id"
  currentUserId="user-123"
  currentUserName="John Doe"
  currentUserAvatar="https://..."
  targetUserId="user-456"
  targetUserName="Jane Smith"
  targetUserAvatar="https://..."
  onClose={() => setShowVideoCall(false)}
/>;
```

### Sử dụng Global Listener (Optional)

Nếu bạn muốn listen incoming calls ở global level:

```tsx
import { useCometChatGlobalListener } from '@/hooks/useCometChatGlobalListener';

function App() {
  const currentUserId = 'user-123';
  const currentUserName = 'John Doe';

  useCometChatGlobalListener({
    currentUserId,
    currentUserName,
    onIncomingCall: () => {
      console.log('Có cuộc gọi đến!');
      // Show notification, etc.
    },
  });

  return <div>...</div>;
}
```

## 🔄 Workflow của Video Call

1. User A bấm "Gọi Video"
2. `handleInitiateCall()` được gọi → `CometChat.initiateCall()`
3. User B nhận callback `onIncomingCallReceived`
4. User B auto-accept (hoặc có thể thêm dialog confirm)
5. User A nhận callback `onOutgoingCallAccepted`
6. Cả 2 users gọi `startCall()` → `CometChatCalls.startSession()`
7. UI video call hiện lên trong container

## 🔧 Các API chính đã dùng

### CometChat (Messaging)

- `CometChat.init()` - Khởi tạo SDK
- `CometChat.login()` - Đăng nhập user
- `CometChat.initiateCall()` - Bắt đầu cuộc gọi
- `CometChat.acceptCall()` - Chấp nhận cuộc gọi đến
- `CometChat.endCall()` - Kết thúc cuộc gọi
- `CometChat.addCallListener()` - Lắng nghe events

### CometChatCalls (Video/Audio)

- `CometChatCalls.init()` - Khởi tạo Calls SDK
- `CometChatCalls.startSession()` - Bắt đầu session với UI
- `CometChatCalls.endSession()` - Kết thúc session

## 🎯 Điểm khác biệt so với Zego

| Feature          | Zego               | CometChat                          |
| ---------------- | ------------------ | ---------------------------------- |
| SDK Installation | CDN scripts        | npm packages                       |
| Authentication   | Token generation   | Auth Key                           |
| Call Initiation  | sendCallInvitation | initiateCall                       |
| Call UI          | Auto render popup  | Manual startSession with container |
| Room concept     | Room ID            | Session ID                         |

## 🚀 Next Steps

1. Test video call giữa 2 users
2. Customize UI của call screen nếu cần
3. Thêm features: screen sharing, recording, etc.
4. Handle edge cases: network issues, permissions, etc.

## 📝 Notes

- CometChat yêu cầu users phải được tạo sẵn trong Dashboard hoặc qua API
- Auth Key chỉ nên dùng cho development, production nên dùng Auth Token
- Calls SDK cần camera/microphone permissions
- Test trên HTTPS hoặc localhost (WebRTC requirement)
