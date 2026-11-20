<script setup lang="ts">
defineProps<{
  name: string
  title: string
  avatar: string
  research?: string
  email?: string
  homepage?: string
}>()
</script>

<template>
  <div class="mentor-card">
    <div class="mentor-avatar">
      <img :src="avatar" :alt="name" />
    </div>
    <div class="mentor-info">
      <div class="mentor-name">
        {{ name }}
        <span v-if="title" class="mentor-title">{{ title }}</span>
      </div>
      <p v-if="research" class="mentor-research">{{ research }}</p>
      <div class="mentor-links">
        <a v-if="email" :href="`mailto:${email}`">
          <Icon icon="mdi:email-outline" /> {{ email }}
        </a>
        
        <a v-if="homepage" :href="homepage" target="_blank">
          <Icon icon="mdi:link-variant" /> 个人主页
        </a>
        
      </div>
    </div>
  </div>
</template>

<style scoped>
.mentor-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  transition: box-shadow 0.2s, border-color 0.2s;
}

.mentor-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-color: var(--vp-c-brand-1);
}

.mentor-avatar {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--vp-c-brand-soft);
}

.mentor-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mentor-info {
  flex: 1;
  min-width: 0;
}

.mentor-name {
  font-size: 1.1em;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}

.mentor-title {
  font-size: 0.8em;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  margin-left: 6px;
}

.mentor-research {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  margin: 6px 0;
  line-height: 1.5;
}

.mentor-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 8px;
  font-size: 0.85em;
}

.mentor-links a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.mentor-links a:hover {
  text-decoration: underline;
}
</style>