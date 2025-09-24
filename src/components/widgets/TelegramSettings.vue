<template>
  <div class="telegram-settings">
    <h3 class="title is-4">Telegram Bot Settings</h3>

    <div class="field">
      <label class="label">Bot Status</label>
      <div class="control">
        <p class="help">Bot token is configured and ready to use</p>
      </div>
    </div>

    <div class="field">
      <label class="label">Test Connection</label>
      <div class="control">
        <button
          class="button is-info"
          @click="testConnection"
          :class="buttonClass"
        >
          Test Bot Connection
        </button>
      </div>
    </div>

    <div
      v-if="connectionResult"
      class="notification"
      :class="getNotificationClass"
    >
      <button class="delete" @click="connectionResult = null"></button>
      <strong>{{ connectionResult.ok ? 'Success!' : 'Error' }}</strong>
      <p v-if="connectionResult.ok">
        Bot connected successfully! Bot name:
        {{ connectionResult.result && connectionResult.result.first_name }}
      </p>
      <p v-else>
        {{ connectionResult.error }}
      </p>
    </div>

    <div class="field">
      <label class="label">How to get your Chat ID</label>
      <div class="content">
        <ol>
          <li>Start a chat with your bot on Telegram</li>
          <li>Send any message to the bot</li>
          <li>
            Visit:
            <code>https://api.telegram.org/bot{YOUR_BOT_TOKEN}/getUpdates</code>
          </li>
          <li>Look for the "chat" object and copy the "id" value</li>
          <li>Add this ID to your user profile in Kitsu</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import telegramService from '@/lib/telegram'

export default {
  name: 'telegram-settings',

  data() {
    return {
      isTesting: false,
      connectionResult: null
    }
  },

  computed: {
    getNotificationClass() {
      return this.connectionResult && this.connectionResult.ok
        ? 'is-success'
        : 'is-danger'
    },
    buttonClass() {
      return { 'is-loading': this.isTesting }
    }
  },

  methods: {
    async testConnection() {
      this.isTesting = true
      this.connectionResult = null

      try {
        const result = await telegramService.testConnection()
        this.connectionResult = result
      } catch (error) {
        this.connectionResult = { ok: false, error: error.message }
      } finally {
        this.isTesting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.telegram-settings {
  padding: 1rem;

  .title {
    margin-bottom: 1.5rem;
  }

  .field {
    margin-bottom: 1.5rem;
  }

  .notification {
    margin-top: 1rem;
  }

  .content {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;

    ol {
      margin-left: 1.5rem;

      li {
        margin-bottom: 0.5rem;
      }
    }

    code {
      background: #e4e4e4;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-family: monospace;
    }
  }
}
</style>
