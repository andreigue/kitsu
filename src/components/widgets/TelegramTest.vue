<template>
  <div class="telegram-test">
    <h3 class="title is-4">Test Telegram Notifications</h3>

    <div class="field">
      <label class="label">Test Person</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="testPerson.full_name"
          placeholder="Person name"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Telegram Chat ID</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="testPerson.telegram_chat_id"
          placeholder="123456789"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Test Task</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="testTask.full_name"
          placeholder="Task name (e.g., SH01)"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Task Type</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="testTask.task_type.name"
          placeholder="Task type (e.g., Animation)"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Production</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="testProduction.name"
          placeholder="Production name"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Test Notification</label>
      <div class="control">
        <button
          class="button is-success"
          @click="sendTestNotification"
          :class="{ 'is-loading': isSending }"
        >
          Send Test Notification
        </button>
      </div>
    </div>

    <div
      v-if="testResult"
      class="notification"
      :class="testResult.ok ? 'is-success' : 'is-danger'"
    >
      <button class="delete" @click="testResult = null"></button>
      <strong>{{ testResult.ok ? 'Success!' : 'Error' }}</strong>
      <p v-if="testResult.ok">Test notification sent successfully!</p>
      <p v-else>
        {{ testResult.error }}
      </p>
    </div>

    <div class="content mt4">
      <h4>How it works:</h4>
      <ol>
        <li>Fill in the test data above</li>
        <li>Click "Send Test Notification"</li>
        <li>Check your Telegram for the message</li>
        <li>This simulates what happens when a task is assigned in Kitsu</li>
      </ol>
    </div>
  </div>
</template>

<script>
import telegramService from '@/lib/telegram'

export default {
  name: 'telegram-test',

  data() {
    return {
      testPerson: {
        full_name: 'Romeo Aziz',
        telegram_chat_id: ''
      },
      testTask: {
        full_name: 'SH01',
        task_type: {
          name: 'Animation'
        }
      },
      testProduction: {
        name: 'Test Project'
      },
      isSending: false,
      testResult: null
    }
  },

  mounted() {
    // Load saved test data from localStorage
    const saved = localStorage.getItem('telegram_test_data')
    if (saved) {
      const data = JSON.parse(saved)
      this.testPerson = { ...this.testPerson, ...data.testPerson }
      this.testTask = { ...this.testTask, ...data.testTask }
      this.testProduction = { ...this.testProduction, ...data.testProduction }
    }
  },

  methods: {
    saveTestData() {
      const data = {
        testPerson: this.testPerson,
        testTask: this.testTask,
        testProduction: this.testProduction
      }
      localStorage.setItem('telegram_test_data', JSON.stringify(data))
    },

    async sendTestNotification() {
      if (!this.testPerson.telegram_chat_id) {
        this.testResult = {
          ok: false,
          error: 'Please enter a Telegram Chat ID'
        }
        return
      }

      this.isSending = true
      this.testResult = null

      try {
        const result = await telegramService.sendTaskAssignmentNotification(
          this.testPerson,
          this.testTask,
          this.testProduction
        )

        if (result) {
          this.testResult = { ok: true }
          this.saveTestData()
        } else {
          this.testResult = { ok: false, error: 'Failed to send notification' }
        }
      } catch (error) {
        this.testResult = { ok: false, error: error.message }
      } finally {
        this.isSending = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.telegram-test {
  padding: 1rem;

  .title {
    margin-bottom: 1.5rem;
  }

  .field {
    margin-bottom: 1rem;
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
  }
}
</style>
