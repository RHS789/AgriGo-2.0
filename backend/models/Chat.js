const { firebaseDB } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

const { firebaseDB } = require('../config/firebase');

class Chat {
  // Send a message
  static async sendMessage(messageData) {
    const {
      booking_id,
      sender_id,
      sender_name,
      message,
      sender_role
    } = messageData;

    try {
      const messageId = uuidv4();
      const timestamp = new Date().toISOString();

      const messageRef = firebaseDB
        .ref(`chats/${booking_id}/${messageId}`);

      await messageRef.set({
        id: messageId,
        sender_id,
        sender_name,
        sender_role,
        message,
        timestamp,
        read: false
      });

      return {
        id: messageId,
        booking_id,
        sender_id,
        sender_name,
        sender_role,
        message,
        timestamp,
        read: false
      };
    } catch (error) {
      throw error;
    }
  }

  // Get all messages for a booking
  static async getMessages(bookingId) {
    try {
      const messagesRef = firebaseDB.ref(`chats/${bookingId}`);

      return new Promise((resolve, reject) => {
        messagesRef.once('value', (snapshot) => {
          const messages = snapshot.val();

          if (!messages) {
            resolve([]);
            return;
          }

          const messageArray = Object.values(messages);
          const sortedMessages = messageArray.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );

          resolve(sortedMessages);
        }, (error) => {
          reject(error);
        });
      });
    } catch (error) {
      throw error;
    }
  }

  // Mark messages as read
  static async markAsRead(bookingId, messageIds) {
    try {
      const updates = {};

      messageIds.forEach((messageId) => {
        updates[`chats/${bookingId}/${messageId}/read`] = true;
      });

      await firebaseDB.ref().update(updates);

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Set up real-time listener for messages
  static onMessagesChange(bookingId, callback) {
    try {
      const messagesRef = firebaseDB.ref(`chats/${bookingId}`);

      messagesRef.on('child_added', (snapshot) => {
        const message = snapshot.val();
        callback(message);
      });

      return () => messagesRef.off('child_added');
    } catch (error) {
      throw error;
    }
  }

  // Delete chat (delete all messages for a booking)
  static async deleteChat(bookingId) {
    try {
      const chatRef = firebaseDB.ref(`chats/${bookingId}`);
      await chatRef.remove();

      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Chat;
