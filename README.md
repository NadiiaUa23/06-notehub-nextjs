# NoteHub Next.js — короткий конспект проєкту

## Що ми зробили

Ми перенесли старий React SPA-проєкт NoteHub на Next.js App Router та
реалізували:

- SSR + CSR
- маршрутизацію через App Router
- TanStack Query
- HydrationBoundary
- динамічні маршрути
- глобальний layout
- loading/error handling
- роботу з API через axios
- TypeScript типізацію
- деплой на Vercel

---

# Архітектура проєкту

## Структура

```txt
app/
components/
lib/
types/
```

---

# App Router

## Сторінки

```txt
/               -> Home page
/notes          -> список нотаток
/notes/[id]     -> деталі нотатки
```

---

# Layout

## app/layout.tsx

Глобальний layout містить:

- Header
- Footer
- TanStackProvider

```tsx
<TanStackProvider>
  <Header />
  <main>{children}</main>
  <Footer />
</TanStackProvider>
```

---

# TanStack Query

## Що важливо

Для роботи useQuery потрібен:

```tsx
<QueryClientProvider>
```

Тому створили:

```txt
components/TanStackProvider/TanStackProvider.tsx
```

---

# SSR + Hydration

## Схема роботи

### Server Component

```tsx
page.tsx;
```

робить:

```tsx
prefetchQuery();
```

перед рендером сторінки.

---

### Client Component

```tsx
Notes.client.tsx;
```

отримує кешовані дані через:

```tsx
useQuery();
```

---

# HydrationBoundary

Використовується для передачі кешу із сервера на клієнт.

```tsx
<HydrationBoundary state={dehydrate(queryClient)}>
```

---

# API

## lib/api.ts

Тут:

- fetchNotes
- fetchNoteById
- createNote
- deleteNote

---

# HTTP

## lib/http.ts

```ts
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
```

---

# Важливе про env у Next.js

## Vite

```ts
import.meta.env;
```

## Next.js

```ts
process.env.NEXT_PUBLIC_...
```

---

# Дуже важливо

Для client-side env:

```txt
NEXT_PUBLIC_
```

обов’язковий.

---

# Vercel

## Environment Variables

На Vercel `.env.local` НЕ працює автоматично.

Потрібно вручну додати:

```txt
Settings → Environment Variables
```

---

# Loading

## app/loading.tsx

Глобальний loader:

```tsx
<p>Loading, please wait...</p>
```

---

# Error Handling

## app/notes/error.tsx

```tsx
<p>Could not fetch the list of notes. {error.message}</p>
```

---

# Dynamic Route

## app/notes/[id]

Next.js автоматично створює динамічний маршрут.

```txt
/notes/123
```

---

# useParams

Для отримання id:

```tsx
const params = useParams<{ id: string }>();
```

---

# View details

У NoteList додали:

```tsx
<Link href={`/notes/${n.id}`}>View details</Link>
```

---

# Типізація

## types/note.ts

Всі типи винесені окремо.

---

# React Query

## useQuery

Для отримання даних:

```tsx
useQuery();
```

---

## useMutation

Для create/delete:

```tsx
useMutation();
```

---

## invalidateQueries

Для оновлення кешу:

```tsx
queryClient.invalidateQueries();
```

---

# Основні помилки, які були

## 1. No QueryClient set

Причина:

```txt
не було QueryClientProvider
```

---

## 2. 401 / 403

Причина:

```txt
env змінна або токен
```

---

## 3. import.meta.env

Це Vite-синтаксис.

У Next.js треба:

```ts
process.env;
```

---

## 4. app/loading.tsx не показувався

Причина:

```txt
CSR loading ≠ SSR loading
```

---

# Головна різниця між React SPA і Next.js

## React SPA

Все рендериться на клієнті.

---

## Next.js

Можна:

- SSR
- CSR
- SSG
- streaming
- hydration

---

# Що запам’ятати на майбутнє

## Якщо робиш Next.js + API

1. Створити `http.ts`
2. Додати env
3. Створити api.ts
4. Додати QueryClientProvider
5. Розділяти:
   - server component
   - client component

6. Для SSR використовувати:
   - prefetchQuery
   - HydrationBoundary

7. Для dynamic routes:
   - `[id]`

8. Для loading/error:
   - loading.tsx
   - error.tsx

---

# Важлива логіка Next.js

## Server Component

Може:

- fetch data
- працювати з SSR
- НЕ має useState/useEffect

---

## Client Component

Має:

```tsx
'use client';
```

і може:

- useState
- useEffect
- useQuery
- DOM interactions

---

# Висновок

Ми побудували повноцінний Next.js CRUD-додаток із:

- SSR
- CSR
- TanStack Query
- App Router
- Dynamic Routes
- Error Boundaries
- Loading UI
- API Layer
- TypeScript
- Vercel deploy

# NoteHub Next.js — Project Summary

## What We Built

We migrated the old React SPA version of NoteHub to Next.js App Router and
implemented:

- SSR + CSR
- App Router navigation
- TanStack Query
- HydrationBoundary
- Dynamic routes
- Global layout
- Loading and error handling
- API integration with axios
- TypeScript typing
- Vercel deployment

---

# Project Structure

## Main folders

```txt
app/
components/
lib/
types/
```

---

# App Router Pages

## Routes

```txt
/               -> Home page
/notes          -> Notes list
/notes/[id]     -> Single note details
```

---

# Global Layout

## app/layout.tsx

The global layout contains:

- Header
- Footer
- TanStackProvider

```tsx
<TanStackProvider>
  <Header />
  <main>{children}</main>
  <Footer />
</TanStackProvider>
```

---

# TanStack Query

## Important

To use `useQuery`, the application must be wrapped with:

```tsx
<QueryClientProvider>
```

We created:

```txt
components/TanStackProvider/TanStackProvider.tsx
```

---

# SSR + Hydration

## Workflow

### Server Component

```tsx
page.tsx;
```

performs:

```tsx
prefetchQuery();
```

before rendering the page.

---

### Client Component

```tsx
Notes.client.tsx;
```

receives cached data through:

```tsx
useQuery();
```

---

# HydrationBoundary

Used to transfer React Query cache from server to client.

```tsx
<HydrationBoundary state={dehydrate(queryClient)}>
```

---

# API Layer

## lib/api.ts

Contains:

- fetchNotes
- fetchNoteById
- createNote
- deleteNote

---

# HTTP Configuration

## lib/http.ts

```ts
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
```

---

# Environment Variables in Next.js

## Vite

```ts
import.meta.env;
```

## Next.js

```ts
process.env.NEXT_PUBLIC_...
```

---

# Important Rule

For client-side environment variables:

```txt
NEXT_PUBLIC_
```

is required.

---

# Vercel Deployment

## Environment Variables

`.env.local` does NOT work automatically on Vercel.

You must manually add variables in:

```txt
Settings → Environment Variables
```

---

# Loading State

## app/loading.tsx

Global loader:

```tsx
<p>Loading, please wait...</p>
```

---

# Error Handling

## app/notes/error.tsx

```tsx
<p>Could not fetch the list of notes. {error.message}</p>
```

---

# Dynamic Routes

## app/notes/[id]

Next.js automatically creates dynamic routes.

Example:

```txt
/notes/123
```

---

# useParams

Used to get dynamic id values:

```tsx
const params = useParams<{ id: string }>();
```

---

# View Details Link

Inside NoteList:

```tsx
<Link href={`/notes/${n.id}`}>View details</Link>
```

---

# TypeScript

## types/note.ts

All interfaces and types are stored separately.

---

# React Query

## useQuery

Used for fetching data:

```tsx
useQuery();
```

---

## useMutation

Used for create/delete actions:

```tsx
useMutation();
```

---

## invalidateQueries

Used for cache updates:

```tsx
queryClient.invalidateQueries();
```

---

# Main Issues We Faced

## 1. No QueryClient set

Cause:

```txt
Missing QueryClientProvider
```

---

## 2. 401 / 403 Errors

Cause:

```txt
Environment variable or invalid token
```

---

## 3. import.meta.env

This syntax belongs to Vite.

In Next.js we use:

```ts
process.env;
```

---

## 4. app/loading.tsx did not appear

Cause:

```txt
CSR loading ≠ SSR loading
```

---

# Main Difference Between React SPA and Next.js

## React SPA

Everything renders on the client.

---

## Next.js

Supports:

- SSR
- CSR
- SSG
- Streaming
- Hydration

---

# Important Things to Remember

## When building a Next.js app with API integration:

1. Create `http.ts`
2. Add environment variables
3. Create `api.ts`
4. Add QueryClientProvider
5. Separate:
   - server components
   - client components

6. For SSR use:
   - prefetchQuery
   - HydrationBoundary

7. For dynamic routes use:
   - `[id]`

8. For loading and errors use:
   - loading.tsx
   - error.tsx

---

# Important Next.js Logic

## Server Component

Can:

- fetch data
- work with SSR
- cannot use useState/useEffect

---

## Client Component

Must contain:

```tsx
'use client';
```

and can use:

- useState
- useEffect
- useQuery
- DOM interactions

---

# Final Result

We built a fully functional Next.js CRUD application with:

- SSR
- CSR
- TanStack Query
- App Router
- Dynamic Routes
- Error Boundaries
- Loading UI
- API Layer
- TypeScript
- Vercel deployment
