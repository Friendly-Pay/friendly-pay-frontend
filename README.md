# friendly-pay-frontend

> Telegram Mini App for Friendly Pay: virtual and physical cards, top-ups, IBAN account and KYC, all inside the Telegram chat.

<br>
<h5 align="center">
  <a href="#how-it-works">How it works</a> ⁃
  <a href="#getting-started">Getting started</a> ⁃
  <a href="#deployment">Deployment</a>
</h5>
<br>

The app opens from a Telegram bot button and runs in the Telegram WebView. Telegram `initData` is the login: the backend verifies it and issues a session, so there is no password screen. From there the user passes onboarding and KYC (Sumsub), buys a card, tops it up and manages an IBAN account.

## How it works

```
Telegram bot ──▶ WebView (Mini App) ──▶ React SPA ──▶ REST API
                       │                    │
                 initData, MainButton,   Sumsub WebSDK (KYC)
                 BackButton, haptics,
                 CloudStorage
```

The Telegram bridge is loaded in `index.html` before the app: it expands the viewport, locks orientation, requests fullscreen on mobile and hides the native header. React components wrap `MainButton`, `BackButton` and haptics so screens use them like ordinary props. Outside Telegram (local browser) the app runs with a dev `initData` stub.

| Route | Screen |
|---|---|
| `/onboarding`, `/auth/*` | Onboarding, login by Telegram contact and email code |
| `/sumsub/start` | KYC through Sumsub WebSDK |
| `/new-product`, `/payments/pay-new-card` | Pick a card plan and pay for it |
| `/payments/topup` | Top up a card, wait for the result |
| `/bank/account` | IBAN account, transfers from it |
| `/user/profile` | Profile, friends, legal |

## Tech stack

| | |
|---|---|
| App | React 18, TypeScript, Vite, SCSS modules |
| State and data | Zustand, TanStack Query, axios, react-hook-form |
| Telegram | `telegram-web-app.js`, `@types/telegram-web-app` |
| KYC | `@sumsub/websdk` |
| UI | Alfa core-components, framer-motion, keen-slider, sonner |
| i18n | i18next |

## Project structure

```
index.html            Telegram WebApp bootstrap
src/
  views/              screens by feature: Auth, Onboarding, Home, Payment, Iban, Sumsub, Profile
  components/         shared UI, Telegram buttons, modals, stories
  states/             zustand stores: auth, user, cards, payment, iban, sumsub
  hooks/telegram/     MainButton, scroll fixes
  uikit/              inputs, dialogs, primitives
  localization/       translations
vite.s3.plugin.ts     upload of the build to S3 / CDN
```

## Getting started

```bash
pnpm install
pnpm dev
```

The dev server listens on port 5174 with any host allowed, so it can be exposed through a tunnel and opened from a Telegram bot as a Mini App.

## Deployment

Production build is served from a CDN: assets are uploaded to S3 by the Vite plugin, and `index.html` points to the CDN base URL.

```bash
pnpm build
```
