# Smart Bookmark App

A modern, real-time bookmark management application built with Next.js and Supabase. Organize, search, and revisit your important links with a clean, intuitive interface.

## 🚀 Features

- **Real-time Updates**: Instant synchronization across all devices using Supabase Realtime
- **Secure Authentication**: Google OAuth integration with Row Level Security (RLS)
- **Modern UI**: Clean, responsive design with Tailwind CSS v4
- **Server Actions**: Secure data mutations with Next.js Server Actions
- **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth with Google OAuth
- **Styling**: Tailwind CSS v4
- **Real-time**: Supabase Realtime subscriptions
- **Deployment**: Vercel-ready configuration

## 📦 Project Structure

```
src/
├── app/
│   ├── actions/
│   │   └── bookmarks.ts          # Server Actions for bookmark operations
│   ├── auth/
│   │   └── callback/route.ts    # Auth callback handler
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── auth/
│   │   └── AuthButtons.tsx      # Authentication UI components
│   └── bookmarks/
│       ├── BookmarkForm.tsx     # Add bookmark form
│       └── RealtimeBookmarks.tsx # Real-time bookmark list
└── lib/
    └── supabase/
        ├── client.ts            # Browser Supabase client
        └── server.ts            # Server Supabase client
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Supabase account
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smart-bookmark-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## 🗄️ Database Setup

### Supabase Table Schema

Create a `bookmarks` table in your Supabase database:

```sql
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own bookmarks" 
  ON bookmarks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" 
  ON bookmarks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks" 
  ON bookmarks FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
  ON bookmarks FOR DELETE 
  USING (auth.uid() = user_id);
```

### Enable Realtime

In Supabase dashboard:
1. Go to Database → Replication
2. Enable realtime for the `bookmarks` table
3. Set up publication for insert, update, and delete events

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to [Vercel](https://vercel.com)
   - Add environment variables in Vercel dashboard
   - Deploy automatically

### Environment Variables in Vercel

Add these to your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🔐 Authentication Setup

### Google OAuth Configuration

1. **Supabase Dashboard**
   - Go to Authentication → Providers
   - Enable Google OAuth
   - Add your Google OAuth credentials

2. **Google Cloud Console**
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`

## ⚡ Real-time Implementation

The real-time functionality is implemented using Supabase Realtime subscriptions:

### Key Components

1. **RealtimeBookmarks Component** ([src/components/bookmarks/RealtimeBookmarks.tsx](src/components/bookmarks/RealtimeBookmarks.tsx))
   - Subscribes to PostgreSQL changes using `postgres_changes`
   - Handles INSERT, UPDATE, and DELETE events
   - Maintains local state synchronized with database

2. **Server Actions** ([src/app/actions/bookmarks.ts](src/app/actions/bookmarks.ts))
   - Secure server-side operations
   - RLS enforcement for data security
   - Automatic revalidation after mutations

### Subscription Logic

```typescript
const channel = supabase
  .channel(`bookmarks-realtime-${userId}`)
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "bookmarks",
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      // Handle new bookmarks
    }
  )
  .on(
    "postgres_changes",
    {
      event: "DELETE",
      schema: "public",
      table: "bookmarks",
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      // Handle deleted bookmarks
    }
  )
  .subscribe();
```

## 🛡️ Row Level Security (RLS)

### Security Implementation

1. **Database Level**: RLS policies ensure users can only access their own data
2. **Application Level**: Server Actions validate user ownership before operations
3. **Client Level**: UI only displays authenticated user's bookmarks

### Server Action Security

```typescript
export async function deleteBookmark(bookmarkId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Authentication required" };
  }

  // RLS ensures only owner can delete
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", bookmarkId)
    .eq("user_id", user.id);
}
```

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode Support**: Automatic theme detection
- **Loading States**: Smooth user feedback during operations
- **Error Handling**: Comprehensive error messages and fallbacks
- **Minimalist Design**: Clean, distraction-free interface

## 🔧 Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify Google OAuth configuration
   - Check redirect URIs in both Supabase and Google Cloud Console

2. **Realtime Not Working**
   - Ensure realtime is enabled for the bookmarks table
   - Verify subscription filters match user ID format

3. **Build Errors**
   - Check all environment variables are set
   - Verify TypeScript types are correct

### Cookie Errors in Development

The app uses try-catch blocks around cookie operations in server components to prevent "Cookies can only be modified in Server Actions" errors during development.

## 📈 Performance Optimizations

- **Server Components**: Efficient data fetching on the server
- **Client-side State**: Minimal re-renders with optimized state management
- **Real-time Efficiency**: Batched updates and efficient subscription management
- **Bundle Optimization**: Tree shaking and code splitting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) for the amazing framework
- [Supabase](https://supabase.com) for the real-time database and auth
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Vercel](https://vercel.com) for seamless deployment
<img width="1018" height="697" alt="demo1" src="https://github.com/user-attachments/assets/2a74f91b-955e-4cd5-9805-bab3609bdbab" />

---<img width="797" height="799" alt="demo2" src="https://github.com/user-attachments/assets/2534bd7b-86f7-4e2e-bc8d-345e0eda45e6" />


Built with ❤️ using Next.js and Supabase
