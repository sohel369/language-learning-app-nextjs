'use client';

import { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, Star, Flame, Target, RefreshCw, Users, TrendingUp } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  total_xp: number;
  streak: number;
  level: number;
  avatar_url?: string;
  rank: number;
  tier: string;
  last_activity: string;
}

interface UserRank {
  rank: number;
  total_users: number;
  percentile: number;
}

interface LeaderboardStats {
  total_users: number;
  total_xp: number;
  avg_xp: number;
  max_xp: number;
  avg_streak: number;
  max_streak: number;
}

interface LiveLeaderboardProps {
  userId?: string;
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export default function LiveLeaderboard({ 
  userId, 
  limit = 10, 
  autoRefresh = true, 
  refreshInterval = 30000 
}: LiveLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [leaderboardType, setLeaderboardType] = useState<'all' | 'weekly' | 'monthly'>('all');

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: limit.toString(),
        type: leaderboardType
      });

      if (userId) {
        params.append('userId', userId);
      }

      const response = await fetch(`/api/leaderboard?${params}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch leaderboard');
      }

      setLeaderboard(data.data.leaderboard);
      setUserRank(data.data.userRank);
      setStats(data.data.stats);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [leaderboardType, limit, userId]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchLeaderboard, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, leaderboardType, limit, userId]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {rank}
        </span>;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Master':
        return 'text-purple-400';
      case 'Expert':
        return 'text-blue-400';
      case 'Advanced':
        return 'text-green-400';
      case 'Intermediate':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading && leaderboard.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-center space-x-2">
          <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
          <span className="text-white">Loading leaderboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="text-center">
          <div className="text-red-400 mb-2">Failed to load leaderboard</div>
          <div className="text-white/70 text-sm mb-4">{error}</div>
          <button
            onClick={fetchLeaderboard}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Trophy className="w-6 h-6 mr-2" />
            Live Leaderboard
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchLeaderboard}
              disabled={loading}
              className="p-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            {lastUpdated && (
              <span className="text-white/70 text-sm">
                Updated {formatTimeAgo(lastUpdated.toISOString())}
              </span>
            )}
          </div>
        </div>

        {/* Leaderboard Type Selector */}
        <div className="flex space-x-2 mb-4">
          {[
            { value: 'all', label: 'All Time' },
            { value: 'weekly', label: 'This Week' },
            { value: 'monthly', label: 'This Month' }
          ].map(type => (
            <button
              key={type.value}
              onClick={() => setLeaderboardType(type.value as any)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                leaderboardType === type.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.total_users}</div>
              <div className="text-white/70 text-sm">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.max_xp.toLocaleString()}</div>
              <div className="text-white/70 text-sm">Highest XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.avg_xp}</div>
              <div className="text-white/70 text-sm">Avg XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.max_streak}</div>
              <div className="text-white/70 text-sm">Max Streak</div>
            </div>
          </div>
        )}

        {/* User Rank */}
        {userRank && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Your Rank</div>
                <div className="text-white/80 text-sm">
                  #{userRank.rank} of {userRank.total_users} users
                </div>
                <div className="text-white/80 text-sm">
                  Top {userRank.percentile}% of all learners
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">#{userRank.rank}</div>
                <div className="text-white/80 text-sm">Rank</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard List */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="space-y-3">
          {leaderboard.map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${
                index < 3 
                  ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {/* Rank */}
              <div className="flex-shrink-0">
                {getRankIcon(user.rank)}
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium truncate">{user.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getTierColor(user.tier)} bg-white/10`}>
                    {user.tier}
                  </span>
                </div>
                <div className="text-white/70 text-sm">
                  Level {user.level} • {user.total_xp.toLocaleString()} XP
                </div>
                <div className="text-white/50 text-xs">
                  {formatTimeAgo(user.last_activity)}
                </div>
              </div>

              {/* Stats */}
              <div className="flex-shrink-0 text-right">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-white font-bold">{user.total_xp.toLocaleString()}</div>
                    <div className="text-white/70 text-xs">XP</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center space-x-1 text-orange-400">
                      <Flame className="w-4 h-4" />
                      <span className="font-bold">{user.streak}</span>
                    </div>
                    <div className="text-white/70 text-xs">Streak</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <div className="text-white/70">No users found</div>
            <div className="text-white/50 text-sm">Start learning to appear on the leaderboard!</div>
          </div>
        )}
      </div>
    </div>
  );
}
