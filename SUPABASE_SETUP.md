# Supabase Setup Instructions

To wire the auth system, you need to set up a Supabase project:

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (choose a region close to you)
3. In the project settings, copy your **Project URL** and **Anon Key**
4. Create a `.env.local` file in the project root with:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
5. In Supabase dashboard, go to **Authentication** and enable:
   - Email / Password
   - Google OAuth (optional)
   - GitHub OAuth (optional)
6. Install npm dependencies:
   ```bash
   npm install
   ```
7. Run the dev server:
   ```bash
   npm run dev
   ```

Once Supabase is set up, you can visit:
- `/signup` to create an account
- `/signin` to sign in
- `/profile` to view your profile (protected route)

---

## Next steps:

- (1) Set up the Supabase database schema (Users, Treks, Reviews, etc.)
- (2) Implement trek CRUD, listing, and search
- (3) Add map integration (Mapbox)
- (4) Implement image uploads to Supabase Storage
