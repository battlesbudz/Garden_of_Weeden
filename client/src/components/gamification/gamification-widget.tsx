import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserStats } from './user-stats';
import { AchievementsPanel } from './achievements-panel';
import { Leaderboard } from './leaderboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Star, Award } from 'lucide-react';

interface GamificationWidgetProps {
  className?: string;
}

export function GamificationWidget({ className }: GamificationWidgetProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* User Stats Always Visible */}
      <UserStats />
      
      {/* Tabbed Interface for Details */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements" className="text-battles-black data-[state=active]:bg-battles-gold">
            <Trophy className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-battles-black data-[state=active]:bg-battles-gold">
            <Award className="h-4 w-4 mr-2" />
            Leaderboard
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="achievements" className="mt-4">
          <AchievementsPanel />
        </TabsContent>
        
        <TabsContent value="leaderboard" className="mt-4">
          <Leaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}