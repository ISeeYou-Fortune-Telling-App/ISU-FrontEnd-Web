'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X, Phone, PhoneOff, Video, Mic } from 'lucide-react';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import { CometChatCalls } from '@cometchat/calls-sdk-javascript';
import { COMETCHAT_CONSTANTS } from '@/config/cometchat.config';

interface VideoCallProps {
  currentUserId: string;
  targetUserId: string;
  targetUserName: string;
  targetUserAvatar?: string;
  onClose: () => void;
  isIncomingCall?: boolean;
  incomingCallObject?: any;
}

export const VideoCall: React.FC<VideoCallProps> = ({
  currentUserId,
  targetUserId,
  targetUserName,
  targetUserAvatar,
  onClose,
  isIncomingCall = false,
  incomingCallObject,
}) => {
  const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);
  const [currentCall, setCurrentCall] = useState<any>(incomingCallObject || null);
  const [showIncomingCallScreen, setShowIncomingCallScreen] = useState(isIncomingCall);
  const [showOngoingCallScreen, setShowOngoingCallScreen] = useState(false);
  const [showOutgoingCallScreen, setShowOutgoingCallScreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const callListenerRef = useRef<string>('');
  const sessionIdRef = useRef<string>('');

  // Initialize and get logged in user
  useEffect(() => {
    const initUser = async () => {
      try {
        const user = await CometChat.getLoggedinUser();
        if (user) {
          setLoggedInUser(user);
          console.log('✅ Logged in user:', user.getName());
        }
      } catch (error) {
        console.error('❌ Error getting logged in user:', error);
      }
    };
    initUser();
  }, []);

  // Set incoming call
  useEffect(() => {
    if (incomingCallObject) {
      console.log('✅ Setting incoming call:', incomingCallObject);
      setCurrentCall(incomingCallObject);
      setShowIncomingCallScreen(true);
    }
  }, [incomingCallObject]);

  // Setup call listeners
  useEffect(() => {
    const listenerId = `call_listener_${Date.now()}`;
    callListenerRef.current = listenerId;

    CometChat.addCallListener(
      listenerId,
      new CometChat.CallListener({
        onIncomingCallReceived: (call: any) => {
          console.log('📞 Incoming call received:', call);
          setCurrentCall(call);
          setShowIncomingCallScreen(true);
        },
        onOutgoingCallAccepted: (call: any) => {
          console.log('✅ Outgoing call accepted:', call);
          setCurrentCall(call);
          setShowOutgoingCallScreen(false);
          setShowOngoingCallScreen(true);

          // Đợi container được render rồi mới start call
          setTimeout(() => {
            startOngoingCall(call);
          }, 500);
        },
        onOutgoingCallRejected: (call: any) => {
          console.log('❌ Outgoing call rejected:', call);
          setShowOutgoingCallScreen(false);
          onClose();
        },
        onIncomingCallCancelled: (call: any) => {
          console.log('❌ Incoming call cancelled:', call);
          setShowIncomingCallScreen(false);
          onClose();
        },
      }),
    );

    return () => {
      if (callListenerRef.current) {
        CometChat.removeCallListener(callListenerRef.current);
      }
    };
  }, [onClose]);

  const getCallBuilder = useCallback(
    (call: any) => {
      const isAudioOnly = call.getType() === 'audio';
      const sessionId = call.getSessionId();

      const callSettings = new CometChatCalls.CallSettingsBuilder()
        .enableDefaultLayout(true)
        .setIsAudioOnlyCall(isAudioOnly)
        .showRecordingButton(true) // Show recording button in UI
        .startRecordingOnCallStart(false) // Don't auto-start recording (user can click button)
        .setCallListener(
          new CometChatCalls.OngoingCallListener({
            onCallEnded: () => {
              console.log('📴 Call ended');
              CometChatCalls.endSession();
              CometChat.clearActiveCall();
              setShowOngoingCallScreen(false);
              onClose();
            },
            onCallEndButtonPressed: () => {
              console.log('🔴 End call button pressed');
              CometChat.endCall(sessionId)
                .then(() => {
                  CometChatCalls.endSession();
                  setShowOngoingCallScreen(false);
                  onClose();
                })
                .catch((err) => {
                  console.error('❌ Error ending call:', err);
                });
            },
            onRecordingStarted: () => {
              console.log('🔴 Recording started');
            },
            onRecordingStopped: () => {
              console.log('⏹️ Recording stopped');
            },
            onError: (error: any) => {
              console.error('❌ Call error:', error);
            },
          }),
        )
        .build();

      return callSettings;
    },
    [onClose],
  );

  const startOngoingCall = useCallback(
    (call: any) => {
      try {
        if (!containerRef.current) {
          console.error('❌ Container ref not ready');
          return;
        }

        const sessionId = call.getSessionId();
        sessionIdRef.current = sessionId;

        console.log('🎬 Starting ongoing call...', {
          sessionId,
          type: call.getType(),
        });

        // Get call settings
        const callSettings = getCallBuilder(call);

        // Get auth token and generate call token (exactly like CometChat UIKit)
        if (loggedInUser) {
          const authToken = loggedInUser.getAuthToken();
          console.log('🔑 Generating call token with logged in user...');

          CometChatCalls.generateToken(sessionId, authToken).then(
            (res: any) => {
              console.log('✅ Token generated:', res);
              if (containerRef.current) {
                CometChatCalls.startSession(res?.token, callSettings, containerRef.current);
                console.log('✅ Call session started');
              } else {
                console.error('❌ Container still not ready after delay');
              }
            },
            (err: any) => {
              console.error('❌ Error generating token:', err);
              setShowOngoingCallScreen(false);
              onClose();
            },
          );
        } else {
          console.log('🔑 Getting logged in user first...');
          CometChat.getLoggedinUser().then((user: any) => {
            const authToken = user!.getAuthToken();
            console.log('🔑 Generating call token...');

            CometChatCalls.generateToken(sessionId, authToken).then(
              (res: any) => {
                console.log('✅ Token generated:', res);
                if (containerRef.current) {
                  CometChatCalls.startSession(res?.token, callSettings, containerRef.current);
                  console.log('✅ Call session started');
                } else {
                  console.error('❌ Container still not ready after delay');
                }
              },
              (err: any) => {
                console.error('❌ Error generating token:', err);
                setShowOngoingCallScreen(false);
                onClose();
              },
            );
          });
        }
      } catch (error) {
        console.error('❌ Error starting ongoing call:', error);
        setShowOngoingCallScreen(false);
        onClose();
      }
    },
    [getCallBuilder, onClose, loggedInUser],
  );

  const handleInitiateVideoCall = async () => {
    try {
      // Request permissions
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      const callType = CometChat.CALL_TYPE.VIDEO;
      const receiverType = CometChat.RECEIVER_TYPE.USER;
      const call = new CometChat.Call(targetUserId, callType, receiverType);

      console.log('📞 Initiating video call to:', targetUserId);
      const outgoingCall = await CometChat.initiateCall(call);
      console.log('✅ Call initiated:', outgoingCall);

      setCurrentCall(outgoingCall);
      setShowOutgoingCallScreen(true);
    } catch (error) {
      console.error('❌ Failed to initiate call:', error);
      alert('Không thể thực hiện cuộc gọi. Vui lòng kiểm tra quyền camera/microphone.');
    }
  };

  const handleInitiateAudioCall = async () => {
    try {
      // Request permissions
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const callType = CometChat.CALL_TYPE.AUDIO;
      const receiverType = CometChat.RECEIVER_TYPE.USER;
      const call = new CometChat.Call(targetUserId, callType, receiverType);

      console.log('📞 Initiating audio call to:', targetUserId);
      const outgoingCall = await CometChat.initiateCall(call);
      console.log('✅ Call initiated:', outgoingCall);

      setCurrentCall(outgoingCall);
      setShowOutgoingCallScreen(true);
    } catch (error) {
      console.error('❌ Failed to initiate call:', error);
      alert('Không thể thực hiện cuộc gọi. Vui lòng kiểm tra quyền microphone.');
    }
  };

  const handleAcceptCall = async () => {
    if (!currentCall) {
      console.error('❌ No current call to accept');
      return;
    }

    try {
      // Request permissions
      const isVideoCall = currentCall.getType() === 'video';
      await navigator.mediaDevices.getUserMedia({
        video: isVideoCall,
        audio: true,
      });

      console.log('📞 Accepting call...');
      const acceptedCall = await CometChat.acceptCall(currentCall.getSessionId());
      console.log('✅ Call accepted:', acceptedCall);

      // Set state to show ongoing call screen FIRST (this will render the container)
      setShowOngoingCallScreen(true);
      setShowIncomingCallScreen(false);
      setCurrentCall(acceptedCall);

      // Wait for container to be rendered and call to be fully accepted
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Now start the call (container should be ready now)
      startOngoingCall(acceptedCall);
    } catch (error) {
      console.error('❌ Error accepting call:', error);
      alert('Không thể chấp nhận cuộc gọi. Vui lòng kiểm tra quyền camera/microphone.');
      setShowIncomingCallScreen(false);
    }
  };

  const handleRejectCall = async () => {
    if (!currentCall) return;

    try {
      await CometChat.rejectCall(currentCall.getSessionId(), CometChat.CALL_STATUS.REJECTED);
      console.log('✅ Call rejected');
      setShowIncomingCallScreen(false);
      onClose();
    } catch (error) {
      console.error('❌ Error rejecting call:', error);
      onClose();
    }
  };

  const handleCancelCall = async () => {
    if (!currentCall) return;

    try {
      await CometChat.rejectCall(currentCall.getSessionId(), CometChat.CALL_STATUS.CANCELLED);
      console.log('✅ Call cancelled');
      setShowOutgoingCallScreen(false);
      onClose();
    } catch (error) {
      console.error('❌ Error cancelling call:', error);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      {/* Ongoing Call Screen */}
      {showOngoingCallScreen && (
        <div className="w-full h-full relative">
          <div ref={containerRef} className="w-full h-full" />
          {/* Không hiển thị nút X khi đang trong cuộc gọi - phải bấm End Call trong giao diện CometChat */}
        </div>
      )}

      {/* Incoming Call Screen */}
      {showIncomingCallScreen && !showOngoingCallScreen && currentCall && (
        <div className="flex flex-col items-center justify-center gap-8 p-8">
          <div className="text-center">
            <h2 className="text-white text-3xl font-bold mb-2">Cuộc gọi đến</h2>
            <p className="text-white/80 text-xl">{targetUserName}</p>
            <p className="text-white/60 text-sm mt-2">
              {currentCall.getType() === 'audio' ? '📞 Cuộc gọi thoại' : '📹 Cuộc gọi video'}
            </p>
          </div>

          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
            <img
              src={targetUserAvatar || '/default_avatar.jpg'}
              alt={targetUserName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex gap-8">
            <button
              onClick={handleRejectCall}
              className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 
                         flex items-center justify-center transition-all hover:scale-110
                         shadow-2xl"
            >
              <PhoneOff className="w-10 h-10 text-white" />
            </button>

            <button
              onClick={handleAcceptCall}
              className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-600 
                         flex items-center justify-center transition-all hover:scale-110
                         shadow-2xl animate-pulse"
            >
              <Phone className="w-10 h-10 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Outgoing Call Screen */}
      {showOutgoingCallScreen && !showOngoingCallScreen && currentCall && (
        <div className="flex flex-col items-center justify-center gap-8 p-8">
          <div className="text-center">
            <h2 className="text-white text-3xl font-bold mb-2">{targetUserName}</h2>
            <p className="text-white/80 text-xl">Đang gọi...</p>
          </div>

          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
            <img
              src={targetUserAvatar || '/default_avatar.jpg'}
              alt={targetUserName}
              className="w-full h-full object-cover"
            />
          </div>

          <button
            onClick={handleCancelCall}
            className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 
                       flex items-center justify-center transition-all hover:scale-110
                       shadow-2xl"
          >
            <PhoneOff className="w-10 h-10 text-white" />
          </button>
        </div>
      )}

      {/* Initial Screen - Choose call type */}
      {!showIncomingCallScreen && !showOutgoingCallScreen && !showOngoingCallScreen && (
        <div className="flex flex-col items-center justify-center gap-8 p-8">
          <div className="text-center">
            <h2 className="text-white text-3xl font-bold mb-2">{targetUserName}</h2>
            <p className="text-white/80 text-lg">Chọn loại cuộc gọi</p>
          </div>

          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
            <img
              src={targetUserAvatar || '/default_avatar.jpg'}
              alt={targetUserName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex gap-6">
            <button
              onClick={handleInitiateAudioCall}
              className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl
                         bg-blue-500 hover:bg-blue-600 transition-all hover:scale-105
                         shadow-xl"
            >
              <Mic className="w-12 h-12 text-white" />
              <span className="text-white font-semibold text-lg">Gọi thoại</span>
            </button>

            <button
              onClick={handleInitiateVideoCall}
              className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl
                         bg-green-500 hover:bg-green-600 transition-all hover:scale-105
                         shadow-xl"
            >
              <Video className="w-12 h-12 text-white" />
              <span className="text-white font-semibold text-lg">Gọi video</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="mt-4 px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600
                       text-white transition-all"
          >
            Hủy
          </button>
        </div>
      )}
    </div>
  );
};
