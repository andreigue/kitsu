# Telegram Bot Integration for Kitsu

This feature adds Telegram notifications to Kitsu when tasks are assigned to users.

## Setup Instructions

### 1. Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Choose a name for your bot (e.g., "Kitsu Notifications")
4. Choose a username (e.g., "kitsu_notify_bot")
5. Save the bot token you receive

### 2. Configure the Bot Token

1. Go to Kitsu Settings page
2. In the "Integrations" section, you'll see "Telegram Bot Settings"
3. Enter your bot token
4. Click "Test Bot Connection" to verify it works

### 3. Get User Chat IDs

For each user who wants Telegram notifications:

1. Have them start a chat with your bot on Telegram
2. Send any message to the bot
3. Visit: `https://api.telegram.org/bot{YOUR_BOT_TOKEN}/getUpdates`
4. Look for the "chat" object and copy the "id" value
5. In Kitsu, edit the user's profile and add this ID to the "Telegram Chat ID" field

### 4. Test the Integration

1. In Settings, use the "Test Telegram Notifications" section
2. Fill in test data (person, chat ID, task, production)
3. Click "Send Test Notification"
4. Check Telegram for the message

## How It Works

- When a task is assigned in Kitsu, the system automatically sends a Telegram notification
- The notification includes:
  - Task name
  - Task type
  - Production name
  - A link back to Kitsu

## Files Modified

- `src/lib/telegram.js` - Telegram service
- `src/store/modules/tasks.js` - Integration with task assignment
- `src/components/modals/EditPersonModal.vue` - Added Telegram field
- `src/components/widgets/TelegramSettings.vue` - Bot configuration
- `src/components/widgets/TelegramTest.vue` - Testing interface
- `src/components/pages/Settings.vue` - Added to settings page
- `src/locales/en.js` - Added localization strings

## Environment Variables

The bot token is stored in localStorage for demo purposes. In production, you should:

1. Add `VITE_TELEGRAM_BOT_TOKEN` to your `.env` file
2. Or use proper environment variable management

## Troubleshooting

- **Bot not responding**: Check if the token is correct and bot is active
- **No notifications**: Verify the user has a valid Telegram Chat ID
- **API errors**: Check browser console for detailed error messages

## Security Notes

- Bot tokens should be kept secure
- Consider rate limiting for production use
- Validate chat IDs before sending messages 