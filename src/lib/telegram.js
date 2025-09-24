/**
 * Telegram Bot Service for Kitsu notifications
 */

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
const TELEGRAM_API_BASE = 'https://api.telegram.org/bot'

class TelegramService {
  constructor() {
    if (!TELEGRAM_BOT_TOKEN) {
      console.warn(
        'Telegram bot token not configured. Notifications will not be sent.'
      )
    }
  }

  /**
   * Send a message to a user via Telegram
   * @param {string} chatId - The user's Telegram chat ID
   * @param {string} message - The message to send
   * @returns {Promise} - API response
   */
  async sendMessage(chatId, message) {
    console.log('📡 Bot token configured:', !!TELEGRAM_BOT_TOKEN)
    if (!TELEGRAM_BOT_TOKEN) {
      console.warn('Cannot send Telegram message: bot token not configured')
      return null
    }

    try {
      const url = `${TELEGRAM_API_BASE}${TELEGRAM_BOT_TOKEN}/sendMessage`
      console.log('🚀 Sending to URL:', url)
      console.log('📋 Payload:', { chat_id: chatId, text: message })
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      })

      const result = await response.json()
      console.log('📥 Telegram API response:', result)

      if (!result.ok) {
        console.error('Telegram API error:', result.description)
        return null
      }

      console.log('✅ Message sent successfully!')
      return result
    } catch (error) {
      console.error('Failed to send Telegram message:', error)
      return null
    }
  }

  /**
   * Send task assignment notification
   * @param {Object} person - The person being assigned
   * @param {Object} task - The task being assigned
   * @param {Object} production - The production context
   * @returns {Promise} - API response
   */
  async sendTaskAssignmentNotification(person, task, production) {
    console.log('🔔 Attempting to send Telegram notification:', {
      person: person.full_name,
      chat_id: person.notifications_telegram_chat_id || person.telegram_chat_id,
      telegram_enabled: person.notifications_telegram_enabled,
      task: task.full_name || task.name
    })
    
    const chatId = person.notifications_telegram_chat_id || person.telegram_chat_id
    if (!chatId) {
      console.log(`No Telegram chat ID for person ${person.full_name}`)
      return null
    }

    const message = this.formatTaskAssignmentMessage(person, task, production)
    console.log('📨 Sending message:', message)
    return this.sendMessage(chatId, message)
  }

  /**
   * Format task assignment message
   * @param {Object} person - The person being assigned
   * @param {Object} task - The task being assigned
   * @param {Object} production - The production context
   * @returns {string} - Formatted message
   */
  formatTaskAssignmentMessage(person, task, production) {
    const taskName = task.full_name || task.name || 'Unknown Task'
    const productionName = production?.name || 'Unknown Production'
    const taskType = task.task_type?.name || 'Unknown Type'

    return (
      `🎯 <b>New Task Assignment</b>\n\n` +
      `You have been assigned to: <b>${taskName}</b>\n` +
      `Type: ${taskType}\n` +
      `Production: ${productionName}\n\n` +
      `Please check Kitsu for more details.`
    )
  }

  /**
   * Test bot connection
   * @returns {Promise} - API response
   */
  async testConnection() {
    if (!TELEGRAM_BOT_TOKEN) {
      return { ok: false, error: 'Bot token not configured' }
    }

    try {
      const response = await fetch(
        `${TELEGRAM_API_BASE}${TELEGRAM_BOT_TOKEN}/getMe`
      )
      return await response.json()
    } catch (error) {
      console.error('Failed to test Telegram connection:', error)
      return { ok: false, error: error.message }
    }
  }
}

export default new TelegramService()
