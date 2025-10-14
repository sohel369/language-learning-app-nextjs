import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Get Supabase configuration with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ufvuvkrinmkkoowngioe.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdnV2a3Jpbm1ra29vd25naW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDI0NjAsImV4cCI6MjA3NTExODQ2MH0.hl452FRWQmS51DQeL9AYZjfiinptZg2ewPWVjEhCaDc';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdnV2a3Jpbm1ra29vd25naW9lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU0MjQ2MCwiZXhwIjoyMDc1MTE4NDYwfQ.LXiIwSzsrqPxpiMm0CWJBuauOXhvzZapmM9tgW0-7O0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  font_size: 'small' | 'medium' | 'large' | 'xl';
  font_family: string;
  notifications_enabled: boolean;
  learning_reminders: boolean;
  achievement_notifications: boolean;
  live_session_alerts: boolean;
  security_alerts: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  sound_enabled: boolean;
  sound_effects: boolean;
  background_music: boolean;
  voice_guidance: boolean;
  sound_volume: number;
  high_contrast: boolean;
  reduced_motion: boolean;
  screen_reader: boolean;
  keyboard_navigation: boolean;
  daily_goal_minutes: number;
  reminder_time: string;
  preferred_difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  auto_advance: boolean;
  profile_visibility: 'public' | 'friends' | 'private';
  show_progress: boolean;
  show_achievements: boolean;
  show_streak: boolean;
  interface_language: string;
  learning_language: string;
  native_language: string;
  created_at: string;
  updated_at: string;
}

// GET - Fetch user settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .rpc('get_user_settings', { target_user_id: userId });

    if (error) {
      console.error('Error fetching user settings:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user settings' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No settings found for user' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0] as UserSettings
    });

  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - Update user settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, settings } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!settings) {
      return NextResponse.json(
        { success: false, error: 'Settings data is required' },
        { status: 400 }
      );
    }

    // Validate settings data
    const validSettings = validateSettings(settings);
    if (!validSettings.valid) {
      return NextResponse.json(
        { success: false, error: 'Invalid settings data', details: validSettings.errors },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .rpc('update_user_settings', {
        target_user_id: userId,
        new_theme: settings.theme,
        new_font_size: settings.font_size,
        new_font_family: settings.font_family,
        new_notifications_enabled: settings.notifications_enabled,
        new_learning_reminders: settings.learning_reminders,
        new_achievement_notifications: settings.achievement_notifications,
        new_live_session_alerts: settings.live_session_alerts,
        new_security_alerts: settings.security_alerts,
        new_email_notifications: settings.email_notifications,
        new_push_notifications: settings.push_notifications,
        new_sound_enabled: settings.sound_enabled,
        new_sound_effects: settings.sound_effects,
        new_background_music: settings.background_music,
        new_voice_guidance: settings.voice_guidance,
        new_sound_volume: settings.sound_volume,
        new_high_contrast: settings.high_contrast,
        new_reduced_motion: settings.reduced_motion,
        new_screen_reader: settings.screen_reader,
        new_keyboard_navigation: settings.keyboard_navigation,
        new_daily_goal_minutes: settings.daily_goal_minutes,
        new_reminder_time: settings.reminder_time,
        new_preferred_difficulty: settings.preferred_difficulty,
        new_auto_advance: settings.auto_advance,
        new_profile_visibility: settings.profile_visibility,
        new_show_progress: settings.show_progress,
        new_show_achievements: settings.show_achievements,
        new_show_streak: settings.show_streak,
        new_interface_language: settings.interface_language,
        new_learning_language: settings.learning_language,
        new_native_language: settings.native_language
      });

    if (error) {
      console.error('Error updating user settings:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update user settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0] as UserSettings,
      message: 'Settings updated successfully'
    });

  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create default settings for new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if settings already exist
    const { data: existingSettings, error: checkError } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing settings:', checkError);
      return NextResponse.json(
        { success: false, error: 'Failed to check existing settings' },
        { status: 500 }
      );
    }

    if (existingSettings) {
      return NextResponse.json(
        { success: false, error: 'Settings already exist for this user' },
        { status: 409 }
      );
    }

    // Create default settings
    const { data, error } = await supabase
      .from('user_settings')
      .insert([{ user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error('Error creating user settings:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create user settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data as UserSettings,
      message: 'Default settings created successfully'
    });

  } catch (error) {
    console.error('Settings creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to validate settings
function validateSettings(settings: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate theme
  if (settings.theme && !['light', 'dark', 'system'].includes(settings.theme)) {
    errors.push('Invalid theme value');
  }

  // Validate font size
  if (settings.font_size && !['small', 'medium', 'large', 'xl'].includes(settings.font_size)) {
    errors.push('Invalid font size value');
  }

  // Validate sound volume
  if (settings.sound_volume !== undefined && (settings.sound_volume < 0 || settings.sound_volume > 100)) {
    errors.push('Sound volume must be between 0 and 100');
  }

  // Validate daily goal minutes
  if (settings.daily_goal_minutes !== undefined && (settings.daily_goal_minutes < 1 || settings.daily_goal_minutes > 480)) {
    errors.push('Daily goal minutes must be between 1 and 480');
  }

  // Validate preferred difficulty
  if (settings.preferred_difficulty && !['easy', 'medium', 'hard', 'adaptive'].includes(settings.preferred_difficulty)) {
    errors.push('Invalid preferred difficulty value');
  }

  // Validate profile visibility
  if (settings.profile_visibility && !['public', 'friends', 'private'].includes(settings.profile_visibility)) {
    errors.push('Invalid profile visibility value');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
