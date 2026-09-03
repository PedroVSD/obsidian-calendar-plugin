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

## Integrações Futuras (Stubs)
- `src/integrations/google.ts:1` - `eventToICS`, `downloadICS` (Fase 3a). OAuth stub.
- `src/integrations/email.ts:1` - `sendEmailReminder` via webhook (Fase 3b).

## Verificação
- [ ] `npm install` (pendente offline)
- [ ] `npm run lint` (svelte-check + eslint)
- [ ] `rollup -c` build
- [ ] Teste manual: criar evento em dia futuro, verificar dot colorido, trocar sort, verificar toast quando `remindBefore` atinge janela.
- [ ] Teste tema: alternar tema Obsidian claro/escuro.
- [ ] Teste persistência: reload Obsidian, verificar eventos restaurados.

## Próximos Passos (pós-MVP)
1. Context menu "Adicionar evento" em `src/ui/fileMenu.ts:3` / `src/view.ts:155`
2. Edição inline e drag & drop
3. ICS export botão na lista
4. Testes jest para `src/events/utils.ts`
5. Google OAuth com `client_id` configurável
