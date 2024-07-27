import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { plumeTheme } from 'vuepress-theme-plume'
import * as path from 'node:path'

export default defineUserConfig({
  base: '/ipaclab/',
  lang: 'zh-CN',
  locales: {
    '/': { lang: 'zh-CN', title: '智能精准分析化学实验室' },
    '/en/': { lang: 'en-US', title: 'IPAC Lab' }
  },
  theme: plumeTheme(),
  bundler: viteBundler(),
  source: path.resolve(__dirname, '../'),
  public: path.resolve(__dirname, 'public'),
  head: [
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
  ],
}) as UserConfig