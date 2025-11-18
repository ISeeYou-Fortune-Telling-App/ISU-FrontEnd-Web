'use client';

import React, { useEffect, useState } from 'react';
import { CometChatUIKit, UIKitSettingsBuilder } from '@cometchat/chat-uikit-react';
import { CometChatCalls } from '@cometchat/calls-sdk-javascript';
import { COMETCHAT_CONSTANTS } from '@/config/cometchat.config';

interface CometChatProviderProps {
  children: React.ReactNode;
  userId?: string | null;
}

export const CometChatProvider: React.FC<CometChatProviderProps> = ({ children, userId }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initCometChat = async () => {
      if (!userId) return;

      try {
        // Initialize CometChat UI Kit
        const uiKitSettings = new UIKitSettingsBuilder()
          .setAppId(COMETCHAT_CONSTANTS.APP_ID)
          .setRegion(COMETCHAT_CONSTANTS.REGION)
          .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
          .subscribePresenceForAllUsers()
          .build();

        await CometChatUIKit.init(uiKitSettings);
        console.log('✅ [Provider] CometChat UI Kit initialized');

        // Login user
        let user;
        try {
          user = await CometChatUIKit.login(userId);
          console.log('✅ [Provider] User logged in:', user?.getName());
        } catch (loginError: any) {
          if (loginError?.code === 'USER_ALREADY_LOGGED_IN') {
            console.log('✅ [Provider] User already logged in');
            user = await CometChatUIKit.getLoggedinUser();
          } else {
            throw loginError;
          }
        }

        // Initialize CometChat Calls AFTER login
        try {
          const callAppSettings = new CometChatCalls.CallAppSettingsBuilder()
            .setAppId(COMETCHAT_CONSTANTS.APP_ID)
            .setRegion(COMETCHAT_CONSTANTS.REGION)
            .build();

          await CometChatCalls.init(callAppSettings);
          console.log('✅ [Provider] CometChat Calls initialized');
        } catch (callsError: any) {
          if (callsError?.message?.includes('already initialized')) {
            console.log('✅ [Provider] CometChat Calls already initialized');
          } else {
            console.error('❌ [Provider] Failed to init Calls:', callsError);
          }
        }

        setIsInitialized(true);
      } catch (error: any) {
        console.error('❌ [Provider] Failed to initialize CometChat:', error);
      }
    };

    initCometChat();
  }, [userId]);

  return <>{children}</>;
};
