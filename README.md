# AiGo — мобильный MVP

React Native (Expo SDK 57) прототип образовательной платформы для подростков 10–16 лет.

## Запуск

```bash
npm install
npx expo start
```

Отсканируйте QR-код приложением **Expo Go** (iOS / Android) или нажмите `w`, чтобы открыть в браузере.

## Структура

- `src/theme.ts` — токены (цвета, отступы, радиусы, типографика), совпадают с переменными в Figma
- `src/components/ui.tsx` — Button, Chip, ProgressBar, Steps, Card, Radio, Screen
- `src/screens/` — онбординг (Welcome → Age → Reality → Professions → Quiz → Insight → Interests), вкладки (Home, Path, Portfolio) и Lesson с AI Tutor
- `src/data/content.ts` — тексты, профессии, вопросы квиза, задание урока
- `src/state/AppState.tsx` — возраст, интересы, XP (в памяти, без бэкенда)

В вебе любой экран открывается по адресу: `/quiz`, `/lesson`, `/home` и т.д.
