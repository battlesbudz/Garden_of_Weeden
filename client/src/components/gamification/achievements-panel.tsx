import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Star, Users, Calendar, Edit, MessageCircle, TrendingUp } from 'lucide-react';
import type { Achievement, UserAchievement } from '@shared/schema';

interface AchievementsPanelProps {
  className?: string;
}

const iconMap = {
  Trophy,
  Star,
  Users,
  Calendar,
  Edit,
  MessageCircle,
  TrendingUp,
} as const;

export function AchievementsPanel({ className }: AchievementsPanelProps) {
  const { data: allAchievements, isLoading: loadingAll } = useQuery<Achievement[]>({
    queryKey: ['/api/gamification/achievements'],
    enabled: true,
  });

  const { data: userAchievements, isLoading: loadingUser } = useQuery<(UserAchievement & { achievement: Achievement })[]>({
    queryKey: ['/api/gamification/user-achievements'],
    enabled: true,
  });

  if (loadingAll || loadingUser) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-battles-gold">Loading Achievements...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const unlockedIds = userAchievements?.map(ua => ua.achievementId) || [];
  const unlockedAchievements = allAchievements?.filter(a => unlockedIds.includes(a.id)) || [];
  const lockedAchievements = allAchievements?.filter(a => !unlockedIds.includes(a.id)) || [];

  const categories = {
    participation: 'Participation',
    community: 'Community',
    milestone: 'Milestones',
    knowledge: 'Knowledge'
  };

  const renderAchievement = (achievement: Achievement, isUnlocked: boolean) => {
    const IconComponent = iconMap[achievement.badgeIcon as keyof typeof iconMap] || Trophy;
    const unlockedDate = userAchievements?.find(ua => ua.achievementId === achievement.id)?.unlockedAt;

    return (
      <div
        key={achievement.id}
        className={`p-4 rounded-lg border transition-all ${
          isUnlocked
            ? 'bg-battles-gold/10 border-battles-gold/30 shadow-md'
            : 'bg-gray-50 border-gray-200 opacity-60'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${
            isUnlocked ? 'bg-battles-gold text-battles-black' : 'bg-gray-300 text-gray-500'
          }`}>
            <IconComponent className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`font-semibold ${isUnlocked ? 'text-battles-black' : 'text-gray-600'}`}>
                {achievement.name}
              </h4>
              {isUnlocked && (
                <Badge variant="outline" className="text-xs bg-battles-gold text-battles-black border-battles-gold">
                  Unlocked
                </Badge>
              )}
            </div>
            
            <p className={`text-sm mb-2 ${isUnlocked ? 'text-gray-700' : 'text-gray-500'}`}>
              {achievement.description}
            </p>
            
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {categories[achievement.category as keyof typeof categories] || achievement.category}
              </Badge>
              
              <div className="flex items-center gap-2">
                {achievement.pointsReward > 0 && (
                  <span className={`text-sm font-medium ${
                    isUnlocked ? 'text-battles-gold' : 'text-gray-500'
                  }`}>
                    +{achievement.pointsReward} pts
                  </span>
                )}
                {isUnlocked && unlockedDate && (
                  <span className="text-xs text-gray-500">
                    {new Date(unlockedDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-battles-gold">
          <Trophy className="h-5 w-5" />
          Achievements
          <Badge variant="outline" className="ml-auto bg-battles-gold text-battles-black border-battles-gold">
            {unlockedAchievements.length}/{(allAchievements?.length || 0)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="unlocked" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unlocked" className="text-battles-black data-[state=active]:bg-battles-gold">
              Unlocked ({unlockedAchievements.length})
            </TabsTrigger>
            <TabsTrigger value="locked" className="text-battles-black data-[state=active]:bg-battles-gold">
              Locked ({lockedAchievements.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="unlocked" className="mt-4">
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {unlockedAchievements.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No achievements unlocked yet!</p>
                    <p className="text-sm">Start participating to earn your first achievements.</p>
                  </div>
                ) : (
                  unlockedAchievements.map(achievement => renderAchievement(achievement, true))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="locked" className="mt-4">
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {lockedAchievements.map(achievement => renderAchievement(achievement, false))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}