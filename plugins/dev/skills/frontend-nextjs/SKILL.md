---
name: frontend-nextjs
description: "Develop, maintain, and debug Next.js applications with React, TypeScript, and modern frontend patterns for production-ready web applications. Use when: Creating new Next.js projects or features, Implementing pages, API routes, or server components, Setting up routing, layouts, or navigation, Integrating with APIs or backend services, Optimizing performance (SSR, SSG, ISR), Debugging Next.js build, routing, or rendering issues, Implementing authentication or state management."
metadata:
  category: dev
---

## Purpose
Develop, maintain, and debug Next.js applications with React, TypeScript, and modern frontend patterns for production-ready web applications.

## When to Use
- Creating new Next.js projects or features
- Implementing pages, API routes, or server components
- Setting up routing, layouts, or navigation
- Integrating with APIs or backend services
- Optimizing performance (SSR, SSG, ISR)
- Debugging Next.js build, routing, or rendering issues
- Implementing authentication or state management

## Inputs Required
- Feature requirements or design specifications
- Existing codebase structure (if extending)
- API endpoints or backend integration needs
- Design system or UI component requirements
- Performance or SEO requirements
- Deployment target (Vercel, self-hosted, etc.)

## Outputs Produced
- Next.js pages, components, or API routes
- TypeScript types and interfaces
- Routing configuration and layouts
- API integration code (fetch, SWR, React Query)
- Styling (CSS modules, Tailwind, styled-components)
- Error handling and loading states
- Performance optimizations (images, fonts, code splitting)
- Testing structure or examples

## Workflow
1. Determine page structure and routing needs (App Router vs Pages Router).
2. Create TypeScript types for data models and props.
3. Implement page components with proper Next.js patterns.
4. Set up API routes if needed (server-side endpoints).
5. Integrate with backend APIs (fetch, SWR, or React Query).
6. Add styling (prefer Tailwind or CSS modules).
7. Implement error boundaries and loading states.
8. Optimize images, fonts, and code splitting.
9. Add metadata for SEO if needed.
10. Test routing, API integration, and error handling.

## Constraints & Guardrails
- Use TypeScript for type safety - avoid `any` types.
- Follow Next.js App Router patterns (if using App Router).
- Use Next.js Image component for optimized images.
- Implement proper error boundaries and loading states.
- Use server components when possible (App Router).
- Never expose API keys or secrets in client components.
- Follow React best practices (hooks, component composition).
- Optimize bundle size (code splitting, dynamic imports).

## Integration Points
- API Debugging Skill (for API integration issues)
- Python Refactor Skill (for code structure improvements)
- FastAPI Development Skill (for backend integration)

## Example Usage
**Input**: "Create a Next.js page that displays a list of tasks from a FastAPI backend"
**Output**:
```typescript
// app/tasks/page.tsx (App Router)
import { Task } from '@/types/task';

async function getTasks(): Promise<Task[]> {
  const res = await fetch('http://api.example.com/tasks', {
    cache: 'no-store', // or 'force-cache' for SSG
  });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export default async function TasksPage() {
  const tasks = await getTasks();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="border p-2 rounded">
            <h2 className="font-semibold">{task.title}</h2>
            <p className="text-gray-600">{task.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**With Client Component for Interactivity:**
```typescript
// app/tasks/components/TaskList.tsx
'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types/task';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}
```

## Anti-Patterns
- Using client components when server components would work
- Not handling loading and error states
- Exposing API keys in client-side code
- Not optimizing images (using regular `<img>` instead of Next.js Image)
- Mixing App Router and Pages Router patterns
- Not using TypeScript or using `any` types excessively
- Not implementing proper error boundaries
- **Fetching in useEffect when server components can do it** - Prefer server-side data fetching
- **Not using proper cache strategies** - Understand `cache`, `revalidate`, `no-store` options
- **Client-side API calls to external services** - Use API routes as proxy for security
