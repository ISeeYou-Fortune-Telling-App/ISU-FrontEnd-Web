/**
 * Call Recording Utilities
 *
 * Provides methods to control call recording programmatically.
 * These can be used if you want to create custom recording buttons
 * instead of using the default CometChat UI buttons.
 */

import { CometChatCalls } from '@cometchat/calls-sdk-javascript';

/**
 * Start recording the current call
 * @returns Promise that resolves when recording starts
 */
export const startCallRecording = async (): Promise<void> => {
  try {
    await CometChatCalls.startRecording();
    console.log('🔴 Call recording started');
  } catch (error) {
    console.error('❌ Error starting recording:', error);
    throw error;
  }
};

/**
 * Stop recording the current call
 * @returns Promise that resolves when recording stops
 */
export const stopCallRecording = async (): Promise<void> => {
  try {
    await CometChatCalls.stopRecording();
    console.log('⏹️ Call recording stopped');
  } catch (error) {
    console.error('❌ Error stopping recording:', error);
    throw error;
  }
};

/**
 * Example: Custom recording button component usage
 *
 * import { startCallRecording, stopCallRecording } from '@/utils/callRecording';
 *
 * const [isRecording, setIsRecording] = useState(false);
 *
 * const handleToggleRecording = async () => {
 *   try {
 *     if (isRecording) {
 *       await stopCallRecording();
 *       setIsRecording(false);
 *     } else {
 *       await startCallRecording();
 *       setIsRecording(true);
 *     }
 *   } catch (error) {
 *     alert('Không thể thay đổi trạng thái recording');
 *   }
 * };
 */
