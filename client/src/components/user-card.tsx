import { Crown, Medal, Award, CheckCircle, XCircle, Star, Trophy, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UserWithStatus } from "@/types/codeforces";

interface UserCardProps {
  user: UserWithStatus;
  rank: number;
}

export function UserCard({ user, rank }: UserCardProps) {
  const getRankIcon = () => {
    switch (rank) {
      case 1:
        return <Crown className="text-white" size={20} />;
      case 2:
        return <Medal className="text-white" size={20} />;
      case 3:
        return <Award className="text-white" size={20} />;
      default:
        return null;
    }
  };

  const getRankBadgeClass = () => {
    switch (rank) {
      case 1:
        return "w-12 h-12 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center shadow-lg";
      case 2:
        return "w-12 h-12 bg-gradient-to-br from-silver to-gray-500 rounded-full flex items-center justify-center shadow-lg";
      case 3:
        return "w-12 h-12 bg-gradient-to-br from-bronze to-amber-700 rounded-full flex items-center justify-center shadow-lg";
      default:
        return "w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-lg";
    }
  };

  const getRankText = () => {
    switch (rank) {
      case 1:
        return "#1";
      case 2:
        return "#2";
      case 3:
        return "#3";
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = () => {
    switch (rank) {
      case 1:
        return "text-gold";
      case 2:
        return "text-silver";
      case 3:
        return "text-bronze";
      default:
        return "text-gray-600";
    }
  };

  const getRankBadgeColor = () => {
    switch (rank) {
      case 1:
        return "bg-gold/20 text-gold";
      case 2:
        return "bg-silver/20 text-silver";
      case 3:
        return "bg-bronze/20 text-bronze";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStars = () => {
    if (rank === 1) return 3;
    if (rank === 2) return 2;
    if (rank === 3) return 1;
    return 0;
  };

  const getAchievements = () => {
    const achievements = [];
    
    if (user.solveRate === 100 && user.totalProblems > 0) {
      achievements.push({
        icon: Trophy,
        text: "Perfect Score",
        color: "bg-gold/20 text-gold"
      });
    }
    
    if (user.solvedCount === user.totalProblems && user.totalProblems > 0) {
      achievements.push({
        icon: Flame,
        text: "All Solved",
        color: "bg-purple-100 text-purple-700"
      });
    }
    
    if (rank === 1) {
      achievements.push({
        icon: Medal,
        text: "Top Performer",
        color: "bg-blue-100 text-blue-700"
      });
    } else if (rank === 2) {
      achievements.push({
        icon: Medal,
        text: "Silver Rank",
        color: "bg-silver/20 text-silver"
      });
    } else if (rank === 3) {
      achievements.push({
        icon: Award,
        text: "Bronze Rank",
        color: "bg-bronze/20 text-bronze"
      });
    }
    
    if (user.solveRate >= 50 && user.totalProblems > 0) {
      achievements.push({
        icon: CheckCircle,
        text: "Good Progress",
        color: "bg-green-100 text-green-700"
      });
    } else if (user.totalProblems > 0) {
      achievements.push({
        icon: Star,
        text: "Getting Started",
        color: "bg-blue-100 text-blue-700"
      });
    }
    
    return achievements;
  };

  // Generate a placeholder avatar based on the handle
  const getAvatarUrl = () => {
    if (user.avatar) return user.avatar;
    // Generate a consistent placeholder based on handle hash
    const hash = user.handle.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const imageId = Math.abs(hash) % 1000;
    return `https://images.unsplash.com/photo-150${imageId}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150`;
  };

  return (
    <Card className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative">
      <div className="absolute top-4 right-4">
        <div className={getRankBadgeClass()}>
          {getRankIcon()}
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-start space-x-6">
          <img
            src={getAvatarUrl()}
            alt={`${user.handle} profile picture`}
            className="w-20 h-20 rounded-xl object-cover shadow-md"
            onError={(e) => {
              // Fallback to a different placeholder if the first one fails
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${user.handle}&size=150&background=6366f1&color=fff`;
            }}
          />
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{user.handle}</h3>
              <Badge className={`px-3 py-1 ${getRankBadgeColor()} rounded-full text-sm font-semibold`}>
                {getRankText()}
              </Badge>
              <div className="flex space-x-1">
                {Array.from({ length: getStars() }).map((_, i) => (
                  <Star key={i} className={getRankColor()} size={16} fill="currentColor" />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getRankColor()}`}>{user.solvedCount}</div>
                <div className="text-sm text-gray-500">Solved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">{user.totalProblems}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{user.solveRate}%</div>
                <div className="text-sm text-gray-500">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{user.rating || 'N/A'}</div>
                <div className="text-sm text-gray-500">CF Rating</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Problem Status */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">Problem Status</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {user.problemStatus.map((problem) => (
              <div
                key={problem.problemId}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  problem.solved
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {problem.solved ? (
                    <CheckCircle className="text-green-600" size={16} />
                  ) : (
                    <XCircle className="text-red-600" size={16} />
                  )}
                  <a
                    href={`https://codeforces.com/problemset/problem/${problem.problemId.match(/(\d+)/)?.[1]}/${problem.problemId.match(/[A-Z]\d*/)?.[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-mono text-sm font-medium hover:underline ${
                      problem.solved ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {problem.problemId}
                  </a>
                </div>
                <span className={`text-xs font-medium ${
                  problem.solved ? 'text-green-600' : 'text-red-600'
                }`}>
                  {problem.solved ? 'Solved' : 'Unsolved'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">Achievements</h4>
          <div className="flex flex-wrap gap-2">
            {getAchievements().map((achievement, index) => (
              <Badge
                key={index}
                className={`px-3 py-1 ${achievement.color} rounded-full text-sm font-medium flex items-center`}
              >
                <achievement.icon className="mr-1" size={12} />
                {achievement.text}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
