# Main-Grad (Student Frontend)

## Tech Stack
- **Framework:** Next.js 16.0.7 with App Router
- **Language:** TypeScript 5
- **UI:** React 19, Tailwind CSS 3.4, shadcn/ui
- **Forms:** React Hook Form + Zod validation
- **Package Manager:** npm

## Development
```bash
npm run dev      # Start dev server on port 3000
npm run build    # Production build
npm run lint     # Run ESLint
```

## Project Structure
```
app/             # Next.js App Router pages
components/      # React components (ui/ for shadcn)
hooks/           # Custom React hooks
lib/             # Utilities and API client
types/           # TypeScript interfaces
```

## Environment Variables (.env.local)
```
NEXT_PUBLIC_BASE_URL=http://localhost
NEXT_PUBLIC_UNIVERSITY_DASHBOARD_URL=http://localhost:3001
```

## API Integration
- Auth utilities in `lib/auth.ts`
- JWT tokens stored in localStorage
- Auto token refresh on 401

## Key Patterns
- Client components marked with "use client"
- Path alias: @/* for imports
- Dark mode via next-themes
