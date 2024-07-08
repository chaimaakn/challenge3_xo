const UserSchemaModle = require('../database/modles/users.js');

async function addNotification(userId, message) {
    try {
        const updatedUser = await UserSchemaModle.findByIdAndUpdate(
            userId,
            { $push: { notifications: { message } } },
            { new: true }
        );
        if (!updatedUser) {
            console.log('User not found when adding notification');
            return false;
        }
        console.log('Notification added successfully');
        return true;
    } catch (error) {
        console.error('Error adding notification:', error);
        return false;
    }
}

module.exports = { addNotification };