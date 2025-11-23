/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Phone, PhoneOff } from 'lucide-react';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import { CometChatCalls } from '@cometchat/calls-sdk-javascript';
import { COMETCHAT_CONSTANTS } from '@/config/cometchat.config';

interface VideoCallProps {
  conversationId: string;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
  targetUserId: string;
  targetUserName: string;
  targetUserAvatar?: string;
  onClose: () => void;
  isIncomingCall?: boolean;
  incomingCallObject?: any;
}

export const VideoCall: React.FC<VideoCallProps> = ({
  conversationId,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  targetUserId,
  targetUserName,
  targetUserAvatar,
  onClose,
  isIncomingCall = false,
  incomingCallObject,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [currentCall, setCurrentCall] = useState<any>(null);
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(isIncomingCall);
  const containerRef = useRef<HTMLDivElement>(null);
  const callListenerRef = useRef<string>('');

  // Set incoming call object when component mounts
  useEffect(() => {
    if (incomingCallObject) {
      console.log('✅ [VideoCall] Setting incoming call object:', incomingCallObject);
      setCurrentCall(incomingCallObject);
      setIsWaitingForAnswer(true);
    }
  }, [incomingCallObject]);

  // Debug log
  useEffect(() => {
    console.log('🔍 [VideoCall] State:', {
      isIncomingCall,
      hasIncomingCallObject: !!incomingCallObject,
      hasCurrentCall: !!currentCall,
      isWaitingForAnswer,
      isInCall,
    });
  }, [isIncomingCall, incomingCallObject, currentCall, isWaitingForAnswer, isInCall]);

  // Initialize CometChat
  useEffect(() => {
    const initCometChat = async () => {
      try {
        // Check if already initialized
        let isAlreadyInit = false;
        try {
          const loggedInUser = await CometChat.getLoggedinUser();
          if (loggedInUser) {
            console.log('✅ CometChat already initialized, user:', loggedInUser.getName());
            isAlreadyInit = true;
          }
        } catch (e) {
          // Not initialized yet
        }

        if (!isAlreadyInit) {
          const appSetting = new CometChat.AppSettingsBuilder()
            .subscribePresenceForAllUsers()
            .setRegion(COMETCHAT_CONSTANTS.REGION)
            .autoEstablishSocketConnection(true)
            .build();

          await CometChat.init(COMETCHAT_CONSTANTS.APP_ID, appSetting);
          console.log('✅ CometChat initialized successfully');

          // Login user with Auth Key
          try {
            const user = await CometChat.login(currentUserId, COMETCHAT_CONSTANTS.AUTH_KEY);
            console.log('✅ User logged in:', user.getName(), 'UID:', user.getUid());
          } catch (loginError: any) {
            if (loginError.code === 'USER_ALREADY_LOGGED_IN') {
              console.log('✅ User already logged in');
            } else {
              throw loginError;
            }
          }

          // Initialize Calls SDK (npm package API)
          const callAppSettings = new CometChatCalls.CallAppSettingsBuilder()
            .setAppId(COMETCHAT_CONSTANTS.APP_ID)
            .setRegion(COMETCHAT_CONSTANTS.REGION)
            .build();

          await CometChatCalls.init(callAppSettings);
          console.log('✅ CometChat Calls initialized');
        }

        setIsInitialized(true);

        // Setup call listener FIRST
        const listenerId = `call_listener_${Date.now()}`;
        callListenerRef.current = listenerId;

        CometChat.addCallListener(
          listenerId,
          new CometChat.CallListener({
            onIncomingCallReceived: (call: any) => {
              console.log('📞 [VideoCall] Incoming call received:', call);
              setCurrentCall(call);
              setIsWaitingForAnswer(true);
            },
            onOutgoingCallAccepted: (call: any) => {
              console.log('✅ Outgoing call accepted:', call);
              startCall(call);
            },
            onOutgoingCallRejected: (call: any) => {
              console.log('❌ Outgoing call rejected:', call);
              setCurrentCall(null);
              setIsInCall(false);
              setIsWaitingForAnswer(false);
              onClose();
            },
            onIncomingCallCancelled: (call: any) => {
              console.log('❌ Incoming call cancelled:', call);
              setCurrentCall(null);
              setIsInCall(false);
              setIsWaitingForAnswer(false);
              onClose();
            },
            onCallEnded: (call: any) => {
              console.log('📴 Call ended:', call);
              setCurrentCall(null);
              setIsInCall(false);
              setIsWaitingForAnswer(false);
              onClose();
            },
          }),
        );

        // After setting up listener, try to fetch active call if this is incoming
        if (isIncomingCall) {
          console.log('🔍 [VideoCall] Fetching active incoming call...');
          try {
            const activeCall = await CometChat.getActiveCall();
            if (activeCall) {
              console.log('✅ [VideoCall] Found active call:', activeCall);
              setCurrentCall(activeCall);
            } else {
              console.log('⚠️ [VideoCall] No active call found, waiting for listener...');
            }
          } catch (error) {
            console.error('❌ [VideoCall] Error fetching active call:', error);
          }
        }
      } catch (error) {
        console.error('❌ Failed to initialize CometChat:', error);
      }
    };

    initCometChat();

    return () => {
      // Cleanup
      if (callListenerRef.current) {
        CometChat.removeCallListener(callListenerRef.current);
      }
      if (currentCall) {
        endCall();
      }
    };
  }, [currentUserId]);

  const startCall = async (call: any) => {
    try {
      if (!containerRef.current) {
        console.error('❌ Container ref not ready');
        return;
      }

      console.log('🎬 Starting call session...', {
        sessionId: call.getSessionId(),
        type: call.getType(),
        container: containerRef.current,
      });

      setIsInCall(true);
      setCurrentCall(call);
      setIsWaitingForAnswer(false);

      const sessionId = call.getSessionId();
      const isAudioOnly = call.getType() === 'audio';

      // Build call settings
      const callSettings = new CometChatCalls.CallSettingsBuilder()
        .enableDefaultLayout(true)
        .setIsAudioOnlyCall(isAudioOnly)
        .build();

      // Start the call session - SDK will handle token generation automatically
      await CometChatCalls.startSession(sessionId, callSettings, containerRef.current);
      console.log('✅ Call session started with UI', { isAudioOnly });
    } catch (error: any) {
      console.error('❌ Error starting call:', {
        error,
        message: error?.message,
        code: error?.code,
        details: error?.details,
      });
      setIsInCall(false);
      setIsWaitingForAnswer(false);
    }
  };

  const handleInitiateCall = async () => {
    if (!isInitialized) {
      console.error('CometChat not initialized');
      return;
    }

    try {
      const callType = CometChat.CALL_TYPE.VIDEO;
      const receiverType = CometChat.RECEIVER_TYPE.USER;

      const call = new CometChat.Call(targetUserId, callType, receiverType);

      console.log('📞 Initiating call to:', targetUserId);
      const outgoingCall = await CometChat.initiateCall(call);
      console.log('✅ Call initiated:', outgoingCall);

      setCurrentCall(outgoingCall);
    } catch (error) {
      console.error('❌ Failed to initiate call:', error);
    }
  };

  const handleAcceptCall = async () => {
    if (!currentCall) {
      console.error('❌ No current call to accept');
      return;
    }
    try {
      console.log('📞 Accepting call...', {
        sessionId: currentCall.getSessionId(),
        type: currentCall.getType(),
      });

      const acceptedCall = await CometChat.acceptCall(currentCall.getSessionId());
      console.log('✅ Call accepted:', acceptedCall);

      // Small delay to ensure everything is ready
      await new Promise((resolve) => setTimeout(resolve, 500));

      await startCall(acceptedCall);
    } catch (error) {
      console.error('❌ Error accepting call:', error);
      setIsWaitingForAnswer(false);
    }
  };

  const handleRejectCall = async () => {
    if (!currentCall) return;
    try {
      const status = CometChat.CALL_STATUS.REJECTED;
      await CometChat.rejectCall(currentCall.getSessionId(), status);
      console.log('✅ Call rejected');
      setCurrentCall(null);
      setIsWaitingForAnswer(false);
      onClose();
    } catch (error) {
      console.error('❌ Error rejecting call:', error);
    }
  };

  const endCall = async () => {
    try {
      if (currentCall) {
        const sessionId = currentCall.getSessionId();
        await CometChat.endCall(sessionId);
        CometChatCalls.endSession();
        console.log('✅ Call ended');
      }
      setCurrentCall(null);
      setIsInCall(false);
      setIsWaitingForAnswer(false);
    } catch (error) {
      console.error('❌ Error ending call:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[90vw] h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-400 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <img
              src={targetUserAvatar || '/default_avatar.jpg'}
              alt={targetUserName}
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {targetUserName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isInCall ? 'Đang gọi...' : 'Video Call'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {isInCall ? (
              <button
                onClick={() => {
                  endCall();
                  onClose();
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition flex items-center gap-2"
              >
                <PhoneOff className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Kết thúc</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Video Container */}
        <div className="flex-1 bg-gray-900 relative">
          {/* CometChat UI Container */}
          <div
            ref={containerRef}
            className="w-full h-full"
            style={{ display: isInCall ? 'block' : 'none' }}
          ></div>

          {/* Floating End Call Button - Always visible during call */}
          {isInCall && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
              <button
                onClick={() => {
                  endCall();
                  onClose();
                }}
                className="px-8 py-4 bg-red-500 hover:bg-red-600 rounded-full shadow-2xl
                           flex items-center gap-3 transition-all hover:scale-105"
              >
                <PhoneOff className="w-6 h-6 text-white" />
                <span className="text-white font-semibold text-lg">Kết thúc cuộc gọi</span>
              </button>
            </div>
          )}

          {/* Incoming Call - Show accept/reject buttons */}
          {!isInCall && isWaitingForAnswer && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10">
              <div className="text-center">
                <p className="text-white text-2xl font-semibold mb-2">Cuộc gọi đến</p>
                <p className="text-white/80 text-lg">{targetUserName}</p>
                {currentCall && (
                  <p className="text-white/60 text-sm mt-2">
                    {currentCall.getType() === 'audio' ? '📞 Cuộc gọi thoại' : '📹 Cuộc gọi video'}
                  </p>
                )}
              </div>
              {currentCall ? (
                <div className="flex gap-6">
                  <button
                    onClick={handleRejectCall}
                    className="px-8 py-4 text-xl font-semibold rounded-2xl bg-red-500 hover:bg-red-600
                               text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all
                               flex items-center gap-3"
                  >
                    <PhoneOff className="w-6 h-6" />
                    Từ chối
                  </button>
                  <button
                    onClick={handleAcceptCall}
                    className="px-8 py-4 text-xl font-semibold rounded-2xl bg-green-500 hover:bg-green-600
                               text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all
                               flex items-center gap-3"
                  >
                    <Phone className="w-6 h-6" />
                    Chấp nhận
                  </button>
                </div>
              ) : (
                <p className="text-white/60 text-sm">Đang tải thông tin cuộc gọi...</p>
              )}
            </div>
          )}

          {/* Call Button - Show when not in call and not waiting */}
          {!isInCall && !isWaitingForAnswer && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <button
                onClick={handleInitiateCall}
                disabled={!isInitialized}
                className="px-8 py-4 text-xl font-semibold rounded-2xl bg-gradient-to-r from-blue-500 to-green-400 
                           text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                           flex items-center gap-3"
              >
                <Phone className="w-6 h-6" />
                {!isInitialized ? 'Đang khởi tạo...' : 'Gọi Video'}
              </button>
              {currentCall && !isInCall && !isWaitingForAnswer && (
                <p className="text-white/80 mt-4 text-sm">Đang gọi...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
