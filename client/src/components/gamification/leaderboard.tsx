import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Crown, Medal, Award } from 'lucide-react';
import type { Leaderboard as LeaderboardType, User } from '@shared/schema';

interface LeaderboardProps {
  className?: string;
}

type TimeFrame = 'weekly' | 'monthly' | 'allTime';

export function Leaderboard({ className }: LeaderboardProps) {
  const [timeframe, setTimeframe] = useState<TimeFrame>('allTime');

  const { data: leaderboard, isLoading } = useQuery<(LeaderboardType & { user: User })[]>({
    queryKey: ['/api/gamification/leaderboard', { timeframe }],
    enabled: true,
  });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-battles-gold">Loading Leaderboard...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <Trophy className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border-yellow-500/50';
      case 2:
        return 'bg-gradient-to-r from-gray-300/20 to-gray-500/20 border-gray-400/50';
      case 3:
        return 'bg-gradient-to-r from-amber-400/20 to-amber-600/20 border-amber-500/50';
      default:
        return 'bg-battles-gold/5 border-battles-gold/20';
    }
  };

  const getPointsForTimeframe = (entry: LeaderboardType & { user: User }) => {
    switch (timeframe) {
      case 'weekly':
        return entry.weeklyPoints;
      case 'monthly':
        return entry.monthlyPoints;
      default:
        return entry.allTimePoints;
    }
  };

  const timeframeLabels = {
    weekly: 'This Week',
    monthly: 'This Month',
    allTime: 'All Time'
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-battles-gold">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
        
        {/* Timeframe Selector */}
        <div className="flex gap-1 mt-3">
          {(Object.keys(timeframeLabels) as TimeFrame[]).map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className={timeframe === tf ? "bg-battles-gold text-battles-black hover:bg-battles-gold/90" : ""}
            >
              {timeframeLabels[tf]}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {leaderboard && leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => {
                const rank = index + 1;
                const points = getPointsForTimeframe(entry);
                
                return (
                  <div
                    key={entry.user.id}
                    className={`p-3 rounded-lg border transition-all hover:shadow-md ${getRankStyle(rank)}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8">
                        {getRankIcon(rank)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-battles-black">
                            {entry.user.firstName} {entry.user.lastName}
                          </span>
                          {rank <= 3 && (
                            <Badge variant="outline" className="text-xs bg-battles-gold text-battles-black border-battles-gold">
                              #{rank}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {entry.user.email}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-battles-gold">
                          {points.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          points
                        </div>
                      </div>
                      
                      {rank > 3 && (
                        <div className="text-sm font-medium text-gray-500 min-w-[2rem] text-center">
                          #{rank}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No leaderboard data yet!</p>
                <p className="text-sm">Be the first to earn points and claim the top spot.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}