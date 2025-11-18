'use client';

import { useEffect, useRef } from 'react';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import { CometChatCalls } from '@cometchat/calls-sdk-javascript';
import { COMETCHAT_CONSTANTS } from '@/config/cometchat.config';

interface UseCometChatGlobalListenerProps {
  currentUserId: string | null;
  currentUserName: string | null;
  onIncomingCall?: (callData: {
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    callObject: any;
  }) => void;
}

export const useCometChatGlobalListener = ({
  currentUserId,
  currentUserName,
  onIncomingCall,
}: UseCometChatGlobalListenerProps) => {
  const callListenerRef = useRef<string>('');
  const isInitializedRef = useRef<boolean>(false);
  const onIncomingCallRef = useRef(onIncomingCall);

  // Cập nhật ref khi callback thay đổi
  useEffect(() => {
    onIncomingCallRef.current = onIncomingCall;
  }, [onIncomingCall]);

  useEffect(() => {
    if (!currentUserId || !currentUserName) {
      console.log('⏭️ [CometChat Global] Skipping init - missing required data');
      return;
    }

    if (isInitializedRef.current) {
      console.log('⏭️ [CometChat Global] Already initialized');
      return;
    }

    console.log('🚀 [CometChat Global] Starting initialization...', {
      currentUserId,
      currentUserName,
    });

    const initCometChat = async () => {
      try {
        // Initialize CometChat
        const appSetting = new CometChat.AppSettingsBuilder()
          .subscribePresenceForAllUsers()
          .setRegion(COMETCHAT_CONSTANTS.REGION)
          .autoEstablishSocketConnection(true)
          .build();

        await CometChat.init(COMETCHAT_CONSTANTS.APP_ID, appSetting);
        console.log('✅ [CometChat Global] CometChat initialized successfully');

        // Login user with Auth Key
        try {
          const user = await CometChat.login(currentUserId, COMETCHAT_CONSTANTS.AUTH_KEY);
          console.log('✅ [CometChat Global] User logged in:', user.getName());
        } catch (loginError: any) {
          // If user is already logged in, that's fine
          if (loginError.code === 'USER_ALREADY_LOGGED_IN') {
            console.log('✅ [CometChat Global] User already logged in');
          } else {
            throw loginError;
          }
        }

        // Initialize Calls SDK
        const callAppSettings = new CometChatCalls.CallAppSettingsBuilder()
          .setAppId(COMETCHAT_CONSTANTS.APP_ID)
          .setRegion(COMETCHAT_CONSTANTS.REGION)
          .build();

        await CometChatCalls.init(callAppSettings);
        console.log('✅ [CometChat Global] CometChat Calls initialized');

        // Setup global call listener
        const listenerId = `global_call_listener_${Date.now()}`;
        callListenerRef.current = listenerId;

        CometChat.addCallListener(
          listenerId,
          new CometChat.CallListener({
            onIncomingCallReceived: (call: any) => {
              const sender = call.getSender();
              console.log('📞 [CometChat Global] Incoming call received:', {
                from: sender.getName(),
                type: call.getType(),
                sessionId: call.getSessionId(),
              });

              // Trigger callback if provided
              if (onIncomingCallRef.current) {
                onIncomingCallRef.current({
                  senderId: sender.getUid(),
                  senderName: sender.getName(),
                  senderAvatar: sender.getAvatar(),
                  callObject: call,
                });
              }
            },
            onOutgoingCallAccepted: (call: any) => {
              console.log('✅ [CometChat Global] Outgoing call accepted');
            },
            onOutgoingCallRejected: (call: any) => {
              console.log('❌ [CometChat Global] Outgoing call rejected');
            },
            onIncomingCallCancelled: (call: any) => {
              console.log('❌ [CometChat Global] Incoming call cancelled');
            },
            onCallEnded: (call: any) => {
              console.log('📴 [CometChat Global] Call ended');
            },
          }),
        );

        isInitializedRef.current = true;
        console.log('✅ [CometChat Global] Global listener setup complete');
      } catch (error) {
        console.error('❌ [CometChat Global] Failed to initialize:', error);
      }
    };

    initCometChat();

    return () => {
      console.log('🧹 [CometChat Global] Cleaning up...');
      if (callListenerRef.current) {
        CometChat.removeCallListener(callListenerRef.current);
        callListenerRef.current = '';
      }
      isInitializedRef.current = false;
    };
  }, [currentUserId, currentUserName]);

  return null;
};
