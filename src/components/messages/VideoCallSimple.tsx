'use client';

import React, { useEffect, useRef } from 'react';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import { X } from 'lucide-react';

interface VideoCallSimpleProps {
  currentUserId: string;
  onClose: () => void;
  incomingCall?: any;
}

export const VideoCallSimple: React.FC<VideoCallSimpleProps> = ({
  currentUserId,
  onClose,
  incomingCall,
}) => {
  const [activeCall, setActiveCall] = React.useState<any>(incomingCall || null);
  const [callStatus, setCallStatus] = React.useState<string>('incoming');

  useEffect(() => {
    if (incomingCall) {
      setActiveCall(incomingCall);
    }
  }, [incomingCall]);

  useEffect(() => {
    // Setup call listener
    const listenerId = `call_simple_${Date.now()}`;

    CometChat.addCallListener(
      listenerId,
      new CometChat.CallListener({
        onCallEnded: () => {
          console.log('📴 Call ended');
          onClose();
        },
        onIncomingCallCancelled: () => {
          console.log('❌ Call cancelled');
          onClose();
        },
      }),
    );

    return () => {
      CometChat.removeCallListener(listenerId);
    };
  }, [onClose]);

  const handleAccept = async () => {
    if (!activeCall) return;

    try {
      console.log('📞 Accepting call...');
      await CometChat.acceptCall(activeCall.getSessionId());
      setCallStatus('ongoing');
      console.log('✅ Call accepted');

      // Open call in new window/tab
      const callUrl = `https://app.cometchat.com/calls/${activeCall.getSessionId()}`;
      window.open(callUrl, '_blank', 'width=1200,height=800');
    } catch (error) {
      console.error('❌ Error accepting call:', error);
      onClose();
    }
  };

  const handleReject = async () => {
    if (!activeCall) return;

    try {
      await CometChat.rejectCall(activeCall.getSessionId(), CometChat.CALL_STATUS.REJECTED);
      console.log('✅ Call rejected');
      onClose();
    } catch (error) {
      console.error('❌ Error rejecting call:', error);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-12 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700
                     flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>

          <h2 className="text-white text-2xl font-bold mb-2">
            {callStatus === 'incoming' ? 'Cuộc gọi đến' : 'Đang gọi...'}
          </h2>
          <p className="text-gray-400 text-lg">
            {activeCall?.getSender?.()?.getName() || 'Unknown'}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {activeCall?.getType() === 'audio' ? '📞 Cuộc gọi thoại' : '📹 Cuộc gọi video'}
          </p>
        </div>

        {callStatus === 'incoming' && (
          <div className="flex gap-6 justify-center">
            <button
              onClick={handleReject}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 
                         flex items-center justify-center transition-all hover:scale-110
                         shadow-lg"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <button
              onClick={handleAccept}
              className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 
                         flex items-center justify-center transition-all hover:scale-110
                         shadow-lg animate-pulse"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </button>
          </div>
        )}

        {callStatus === 'ongoing' && (
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">Cuộc gọi đã được mở trong cửa sổ mới</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-all"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
