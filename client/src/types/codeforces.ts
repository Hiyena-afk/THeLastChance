export interface UserWithStatus {
  id: number;
  handle: string;
  rating: number | null;
  maxRating: number | null;
  rank: string | null;
  maxRank: string | null;
  avatar: string | null;
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  city: string | null;
  organization: string | null;
  createdAt: number;
  solvedCount: number;
  totalProblems: number;
  solveRate: number;
  problemStatus: {
    problemId: string;
    solved: boolean;
  }[];
}

export interface DashboardData {
  users: UserWithStatus[];
  problems: {
    id: number;
    problemId: string;
    name: string | null;
    contestId: number | null;
    index: string | null;
    rating: number | null;
    tags: string[] | null;
    createdAt: number;
  }[];
  totalUsers: number;
  totalProblems: number;
  totalSolved: number;
  averageRate: number;
}
