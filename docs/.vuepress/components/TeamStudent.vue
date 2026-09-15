<script setup lang="ts">
defineProps<{
  name: string
  grade?: string
  research?: string
  avatar?: string
  email?: string
}>()
</script>

<template>
  <div class="student-card">
    <div class="student-avatar">
      <img v-if="avatar" :src="avatar" :alt="name" />
      <div v-else class="student-avatar-placeholder">
        {{ name.charAt(0) }}
      </div>
    </div>
    <div class="student-name">{{ name }}</div>
    <div v-if="grade" class="student-grade">{{ grade }}</div>
    <p v-if="research" class="student-research">{{ research }}</p>
    <a v-if="email" :href="`mailto:${email}`" class="student-email">
      <Icon icon="mdi:email-outline" /> {{ email }}
    </a>
  </div>
</template>

<style scoped>
.student-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  transition: box-shadow 0.2s, transform 0.2s;
}

.student-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.student-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 12px;
  border: 2px solid var(--vp-c-brand-soft);
}

.student-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.student-avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 1.5em;
  font-weight: 700;
}

.student-name {
  font-size: 1em;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.student-grade {
  font-size: 0.8em;
  color: var(--vp-c-brand-1);
  margin: 2px 0 6px;
}

.student-research {
  font-size: 0.82em;
  color: var(--vp-c-text-2);
  line-height: 1.4;
  margin: 0 0 8px;
}

.student-email {
  font-size: 0.78em;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  word-break: break-all;
}

.student-email:hover {
  text-decoration: underline;
}
</style>