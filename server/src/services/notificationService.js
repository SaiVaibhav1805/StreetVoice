import { getFirebase } from '../config/firebase.js';

export const sendPushNotification = async (fcmToken, payload) => {
  const admin = getFirebase();
  if (!admin) {
    console.warn('Firebase Admin SDK not initialized. Mocking push notification.');
    return;
  }

  try {
    const message = {
      token: fcmToken,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {},
    };

    const response = await admin.messaging().send(message);
    console.log('Successfully sent push notification message:', response);
    return response;
  } catch (error) {
    console.error('Failed to send push notification:', error.message);
  }
};

export default { sendPushNotification };
