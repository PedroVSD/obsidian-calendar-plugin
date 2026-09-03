# MVP - Progresso da Agenda

> Branch `main` | 2026-09-02

Este arquivo documenta cada etapa executada do MVP descrito em `PLANO_AGENDA.md`.

## Etapa 1 - Modelo de Dados [CONCLUÍDA]
**Arquivos:**
- `src/events/types.ts:1` - `CalendarEvent`, `EventsRecord`, `RepeatRule`, `SortBy`, `COMMON_TIMEZONES`, `getSystemTimezone()`
- `src/events/utils.ts:1` - `generateId`, `getEventDateTime`, `getTimeUntil`, `formatTimeUntil`, `sortEvents`, `expandRepeatForDate`
- `src/events/store.ts:1` - `eventsStore` (writable + add/update/delete), `eventsCountByDate`

Decisão: armazenamento `Record<YYYY-MM-DD, CalendarEvent[]>` simples, compatível com `saveData` JSON.

## Etapa 2 - Persistência [CONCLUÍDA]
**Arquivos:**
- `src/settings.ts:9` - `ISettings` ampliado com `events`, `defaultEventColor`, `defaultTimezone`, `defaultRemindBefore`, `enableEventNotifications`
- `src/settings.ts:33` - `defaultSettings` tipado
- `src/settings.ts:105+` - nova seção "Agenda / Events" com 4 settings UI
- `src/main.ts:4,31,95` - `eventsStore` sync bidirecional via subscribe + `loadOptions` hidrata store
- `src/ui/stores.ts:60` - `selectedDate` store

## Etapa 3 - Dots Coloridos [CONCLUÍDA]
- `src/ui/sources/events.ts:1` - `eventsSource: ICalendarSource` lê `eventsStore` e gera dots com `color`
- `src/ui/sources/index.ts:5` - export
- `src/view.ts:21,92` - inclui `eventsSource` no array `sources`

## Etapa 4 - Modal de Evento [CONCLUÍDA]
- `src/ui/EventModal.svelte:1` - formulário completo: título*, descrição, horário*, timezone, cor, lembrete, local, pessoas, repetir, email. Usa `svelte/store` settings p/ defaults. Validação título/horário.
- `src/ui/eventModal.ts:1` - `openEventModal(app, dateStr, existing?)` wrapper `Modal` + `EventModalComponent`. Lógica add vs update via `eventsStore`.

## Etapa 5 - Lista Abaixo do Calendário [CONCLUÍDA]
- `src/ui/EventList.svelte:1` - lista do dia selecionado, sort por `timeUntil` (default) ou `name`, countdown via `formatTimeUntil`, nav dia anterior/próximo, botão "+ Novo", empty state, edit/delete. Intervalo 60s atualiza `now`.

## Etapa 6 - Integração Calendar/View [CONCLUÍDA]
- `src/ui/Calendar.svelte:13,28,55` - importa `selectedDate`, `EventList`, `eventsStore`, `startNotifier`; `selectedDateStr` derivado, `handleClickDay` seta `selectedDate`, `tick` reage a `$eventsStore`, inicia notifier se habilitado, renderiza `<EventList>` abaixo.
- `src/view.ts:92` - sources já inclui eventsSource.

## Etapa 7 - Toast e Notifier [CONCLUÍDA]
- `src/ui/toast.ts:1` - `showCalendarToast` com container fixo, animação slide, borderLeftColor, snooze.
- `src/events/notifier.ts:1` - `startNotifier` check a cada 60s, janela `remindAt` -> `eventTime+60s`, deduplicação via `Map`, respeita `enableEventNotifications`.

## Etapa 8 - Tema Obsidian [CONCLUÍDA]
- `styles.css:12` - variáveis `var(--background-primary)` etc., toast e modal seguem tema claro/escuro automaticamente, sem cores hard-coded.
- `Calendar.svelte` e `EventList.svelte` usam `var(--text-normal)` etc.
- Toast usa `var(--font-interface)`.

## Fase 2 - Pós-MVP [CONCLUÍDA 2026-09-02]
- `src/ui/fileMenu.ts:1` - `showDayMenu` com "Adicionar evento" (sempre visível, mesmo sem nota) + `src/view.ts:157` `onContextMenuDay` atualizado
- `src/ui/EventList.svelte:1` - botões `⤓ ICS` por evento e `⤓ ICS` exportar dia todo via `src/integrations/google.ts:19` `downloadICS`
- `src/settings.ts:25,42` - `googleSyncEnabled`, `googleClientId`, `googleCalendarId`, `emailEnabled`, `emailWebhookUrl` + UI `addGoogleSyncSetting`/`addEmailWebhookSetting`
- `src/events/notifier.ts:1` - hook email: se `ev.emailReminder && emailEnabled`, chama `src/integrations/email.ts:12` `sendEmailReminder` via webhook
- `src/events/__tests__/utils.test.ts:1` - 8 testes jest (`formatTimeUntil`, `sortEvents`, `getTimeUntil`) - `npm test` PASS
- `styles.css:12` mantém tema Obsidian

## Fase 3 - Clique e Seleção [CONCLUÍDA 2026-09-02]
- `src/settings.ts:11` `requireCtrlToCreateNote` (default true) + UI `Exigir Ctrl para criar nota`
- `src/view.ts:260` e `src/view.ts:287` só cria daily/weekly note se `Ctrl/Cmd` pressionado quando setting ativo
- `src/ui/sources/selected.ts:1` `selectedDateSource` + `src/view.ts:23` `selectedDateSource` em sources
- `src/ui/Calendar.svelte:35` re-render ao mudar `selectedDate`; `styles.css:34` `.day.agenda-selected` borda `var(--interactive-accent)` seguindo tema

## Verificação
- [x] `npm install` (659 pacotes)
- [x] `npx eslint . --ext .ts` 0 errors
- [x] `rollup -c` `created main.js in 4.2s` (215K)
- [x] `npm test` 8 passed
- [x] Teste manual: clique seleciona com borda, Ctrl+clique cria nota, evento/dot/sort/toast/ICS/context menu
- [x] Tema claro/escuro OK (variáveis CSS)
- [x] Branch `main` (antes `master`), `PLANO_AGENDA.md:1` e `README.md:1` atualizados

## Próximos Passos Opcionais
1. Drag & drop entre dias
2. Google OAuth real (fetch calendar/v3)
3. Visão semanal de eventos
