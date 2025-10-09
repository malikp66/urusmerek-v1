This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

Create a `.env.local` file in the project root if it does not exist and define the required variables:

```bash
NODE_ENV=development # development | test | production
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
REDIS_URL=redis://USER:PASSWORD@HOST:PORT
JWT_SECRET=super-long-secret-string-at-least-32-chars
APP_URL=http://localhost:3000
LOG_LEVEL=info # debug | info | warn | error (defaults to info if omitted)
IP_HASH_SALT=long-random-string-min-16-chars
NEXT_PUBLIC_MAINTENANCE_MODE=false
```

- `LOG_LEVEL` controls the verbosity of the shared logger and is optional—if you leave it empty it falls back to `info`.
- `IP_HASH_SALT` is used to hash visitor IP addresses for click tracking privacy. Supply a unique random string (at least 16 characters). When unset it reuses `JWT_SECRET`, but a dedicated salt is recommended.

Switch the `NEXT_PUBLIC_MAINTENANCE_MODE` value to `true` whenever the site needs to enter maintenance mode. When active, the public `banner.png` (desktop) and `banner-mobile.png` (mobile) assets are served as the only response.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
