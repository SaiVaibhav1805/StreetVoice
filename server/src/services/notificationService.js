export const sendPushNotification = async (fcmToken, payload) => {
  console.log('[NotificationService] Mocking push notification:', {
    token: fcmToken,
    title: payload.title,
    body: payload.body,
    data: payload.data || {},
  });
  return 'mock-notification-id';
};

export default { sendPushNotification };
