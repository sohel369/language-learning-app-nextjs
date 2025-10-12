import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uaijcvhvyurbnfmkqnqt.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaWpjdmh2eXVyYm5mbWtxbnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTU3NzksImV4cCI6MjA3NTc5MTc3OX0.FbBITvB9ITLt7L3e5BAiP4VYa0Qw7YCOx-SHHl1k8zY'
);

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  // Log the origin for debugging
  console.log('OAuth callback origin:', origin);

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // Create user profile if it doesn't exist
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (!existingProfile) {
        // Create new user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || "Guest",
              email: data.user.email,
              learning_language: 'ar', // Default to Arabic
              native_language: 'en', // Default to English
              level: 1,
              total_xp: 0,
              streak: 0
            }
          ]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }
    }

    // Redirect to homepage after successful authentication
    return NextResponse.redirect(`${origin}/`);
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

