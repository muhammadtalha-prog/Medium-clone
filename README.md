# Medium Clone

A full-stack Medium clone built with Next.js, React 19, Prisma, PostgreSQL (Neon), NextAuth, and Cloudinary.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmuhammadtalha-prog%2FMedium-clone&env=DATABASE_URL,NEXTAUTH_SECRET,NEXTAUTH_URL,CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https%3A%2F%2Fgithub.com%2Fmuhammadtalha-prog%2FMedium-clone)

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

### Localhost Troubleshooting & Database Setup

If the application is not loading or errors are thrown when running on `localhost`:

1. **Verify Environment Variables (`.env`)**:
   Create a `.env` file in the root directory (you can copy `.env.example`) and fill in:
   * `DATABASE_URL`: A valid PostgreSQL connection string (e.g. Supabase, Neon PostgreSQL).
   * `NEXTAUTH_SECRET`: A secure base64 secret (e.g., run `openssl rand -base64 32` or type any secure random string).
   * `NEXTAUTH_URL`: Should be set to `http://localhost:3000` for local development.

2. **Generate Prisma Client**:
   If you get errors about missing Prisma modules, generate the Prisma client locally:
   ```bash
   npx prisma generate
   ```

3. **Push Database Schema**:
   If your database is empty or connection fails because tables are missing, push the database schema to your database instance:
   ```bash
   npx prisma db push
   ```

4. **Verify Database Connection**:
   You can run the built-in database connection test script to verify your database connection string works:
   ```bash
   node check_db.js
   ```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

