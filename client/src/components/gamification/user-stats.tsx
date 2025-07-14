import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, TrendingUp, Calendar, Zap } from 'lucide-react';
import type { UserPoints } from '@shared/schema';

interface UserStatsProps {
  className?: string;
}

export function UserStats({ className }: UserStatsProps) {
  const { data: userPoints, isLoading } = useQuery<UserPoints>({
    queryKey: ['/api/gamification/points'],
    enabled: true,
  });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-battles-gold">Loading Stats...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userPoints) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-battles-gold">Welcome!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Start participating to earn points and achievements!</p>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = ((100 - userPoints.pointsToNextLevel) / 100) * 100;

  return (
    <Card className={`bg-gradient-to-br from-battles-gold/5 to-battles-black/5 border-battles-gold/20 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-battles-gold">
          <Trophy className="h-5 w-5" />
          Your Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level and Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Level {userPoints.currentLevel}</span>
            <span className="text-sm text-gray-600">
              {userPoints.pointsToNextLevel} points to next level
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-3"
          />
        </div>

        {/* Points Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-battles-gold/10 rounded-lg border border-battles-gold/20">
            <div className="flex items-center justify-center mb-1">
              <Star className="h-4 w-4 text-battles-gold mr-1" />
            </div>
            <div className="text-2xl font-bold text-battles-black">{userPoints.totalPoints}</div>
            <div className="text-xs text-gray-600">Total Points</div>
          </div>
          
          <div className="text-center p-3 bg-battles-gold/10 rounded-lg border border-battles-gold/20">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-battles-gold mr-1" />
            </div>
            <div className="text-2xl font-bold text-battles-black">{userPoints.weeklyPoints}</div>
            <div className="text-xs text-gray-600">This Week</div>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center justify-between p-3 bg-battles-black/5 rounded-lg border border-battles-black/10">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-battles-gold" />
            <span className="font-medium">Activity Streak</span>
          </div>
          <Badge variant="outline" className="bg-battles-gold text-battles-black border-battles-gold">
            {userPoints.streak} days
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-battles-black">{userPoints.monthlyPoints}</div>
            <div className="text-xs text-gray-600">Monthly</div>
          </div>
          <div>
            <div className="text-lg font-bold text-battles-black">{userPoints.currentLevel}</div>
            <div className="text-xs text-gray-600">Level</div>
          </div>
          <div>
            <div className="text-lg font-bold text-battles-black">
              {userPoints.streak > 0 ? '🔥' : '⭐'}
            </div>
            <div className="text-xs text-gray-600">Status</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}