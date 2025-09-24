/**
 * Client-side Telegram settings storage
 * This is a temporary solution until the backend supports Telegram fields
 */

const TELEGRAM_SETTINGS_KEY = 'kitsu_telegram_settings'

export class TelegramSettings {
  static getUserSettings(userId) {
    const allSettings = JSON.parse(localStorage.getItem(TELEGRAM_SETTINGS_KEY) || '{}')
    return allSettings[userId] || {
      notifications_telegram_enabled: false,
      notifications_telegram_chat_id: ''
    }
  }

  static saveUserSettings(userId, settings) {
    const allSettings = JSON.parse(localStorage.getItem(TELEGRAM_SETTINGS_KEY) || '{}')
    allSettings[userId] = {
      notifications_telegram_enabled: settings.notifications_telegram_enabled === 'true' || settings.notifications_telegram_enabled === true,
      notifications_telegram_chat_id: settings.notifications_telegram_chat_id || ''
    }
    localStorage.setItem(TELEGRAM_SETTINGS_KEY, JSON.stringify(allSettings))
    console.log('💾 Telegram settings saved:', allSettings[userId])
    return true
  }

  static hasValidSettings(userId) {
    const settings = this.getUserSettings(userId)
    return settings.notifications_telegram_enabled && settings.notifications_telegram_chat_id
  }

  static getChatId(userId) {
    const settings = this.getUserSettings(userId)
    return settings.notifications_telegram_chat_id
  }

  static isEnabled(userId) {
    const settings = this.getUserSettings(userId)
    return settings.notifications_telegram_enabled
  }
}

export default TelegramSettings 