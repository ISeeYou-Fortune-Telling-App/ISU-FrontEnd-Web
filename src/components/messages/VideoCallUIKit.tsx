'use client';

import React, { useEffect } from 'react';
import { CometChatCalls } from '@cometchat/calls-sdk-javascript';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import { COMETCHAT_CONSTANTS } from '@/config/cometchat.config';

interface VideoCallUIKitProps {
  currentUserId: string;
  onClose: () => void;
  incomingCall?: any;
}

export const VideoCallUIKit: React.FC<VideoCallUIKitProps> = ({
  currentUserId,
  onClose,
  incomingCall,
}) => {
  const [activeCall, setActiveCall] = React.useState<any>(incomingCall || null);
  const [isAccepting, setIsAccepting] = React.useState(false);
  const [sessionStarted, setSessionStarted] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (incomingCall) {
      setActiveCall(incomingCall);
    }
  }, [incomingCall]);

  useEffect(() => {
    // Setup call listener
    const listenerId = `call_ui_${Date.now()}`;

    CometChat.addCallListener(
      listenerId,
      new CometChat.CallListener({
        onCallEnded: () => {
          console.log('📴 Call ended');
          onClose();
        },
      }),
    );

    return () => {
      CometChat.removeCallListener(listenerId);
    };
  }, [onClose]);

  const handleAccept = async () => {
    if (isAccepting || sessionStarted) {
      console.log('⏭️ Already accepting or session started');
      return;
    }

    if (!activeCall) {
      console.error('❌ No active call');
      return;
    }

    if (!containerRef.current) {
      console.error('❌ Container ref not ready');
      return;
    }

    setIsAccepting(true);

    try {
      console.log('📞 Accepting call...', {
        sessionId: activeCall.getSessionId(),
        type: activeCall.getType(),
        status: activeCall.getStatus(),
      });

      const acceptedCall = await CometChat.acceptCall(activeCall.getSessionId());
      console.log('✅ Call accepted, starting session...', acceptedCall);

      // Wait a bit for the call to be fully accepted
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const isAudioOnly = acceptedCall.getType() === 'audio';
      const callSettings = new CometChatCalls.CallSettingsBuilder()
        .enableDefaultLayout(true)
        .setIsAudioOnlyCall(isAudioOnly)
        .build();

      console.log('🎬 Ensuring CometChat Calls is initialized...');

      // Reinit CometChat Calls to ensure it has the latest auth token
      try {
        const callAppSettings = new CometChatCalls.CallAppSettingsBuilder()
          .setAppId(COMETCHAT_CONSTANTS.APP_ID)
          .setRegion(COMETCHAT_CONSTANTS.REGION)
          .build();

        await CometChatCalls.init(callAppSettings);
        console.log('✅ CometChat Calls initialized/reinitialized');
      } catch (initError: any) {
        console.log('⚠️ CometChat Calls init:', initError?.message);
      }

      console.log('🎬 Starting CometChat Calls session...', {
        sessionId: acceptedCall.getSessionId(),
        isAudioOnly,
        container: containerRef.current,
      });

      await CometChatCalls.startSession(
        acceptedCall.getSessionId(),
        callSettings,
        containerRef.current,
      );

      setSessionStarted(true);
      console.log('✅ Call session started successfully');
    } catch (error: any) {
      console.error('❌ Error accepting call:', {
        error,
        message: error?.message,
        code: error?.code,
        details: error?.details,
      });
      setIsAccepting(false);
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
      <div className="w-full h-full relative">
        <div ref={containerRef} className="w-full h-full" />

        {/* Incoming call overlay */}
        {activeCall && !sessionStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
            <div className="text-center">
              <h2 className="text-white text-3xl font-bold mb-2">Cuộc gọi đến</h2>
              <p className="text-white/80 text-xl">
                {activeCall.getSender?.()?.getName() || 'Unknown'}
              </p>
              <p className="text-white/60 text-sm mt-2">
                {activeCall.getType() === 'audio' ? '📞 Cuộc gọi thoại' : '📹 Cuộc gọi video'}
              </p>
            </div>

            <div className="flex gap-8">
              <button
                onClick={handleReject}
                className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 
                           flex items-center justify-center transition-all hover:scale-110
                           shadow-2xl"
              >
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
                  />
                </svg>
              </button>

              <button
                onClick={handleAccept}
                disabled={isAccepting}
                className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-600 
                           flex items-center justify-center transition-all hover:scale-110
                           shadow-2xl animate-pulse disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-10 h-10 text-white"
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
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gray-800/80 hover:bg-gray-700
                     flex items-center justify-center transition-all z-50"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
