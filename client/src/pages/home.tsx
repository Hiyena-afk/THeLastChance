import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { ManageHandles } from "@/components/manage-handles";
import { ManageProblems } from "@/components/manage-problems";
import { UserCard } from "@/components/user-card";
import type { DashboardData } from "@/types/codeforces";

export default function Home() {
  const [showHandleModal, setShowHandleModal] = useState(false);
  const [showProblemModal, setShowProblemModal] = useState(false);

  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
    refetchInterval: 30000, // Refetch every 30 seconds for updated data
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onAddHandle={() => {}} onAddProblem={() => {}} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-6">
            <div className="text-center text-red-600">
              Error loading dashboard data. Please try again later.
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header 
        onAddHandle={() => setShowHandleModal(true)} 
        onAddProblem={() => setShowProblemModal(true)} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ManageHandles handles={dashboardData?.users.map(u => ({
            id: u.id,
            handle: u.handle,
            rating: u.rating,
            maxRating: u.maxRating,
            rank: u.rank,
            maxRank: u.maxRank,
            avatar: u.avatar,
            firstName: u.firstName,
            lastName: u.lastName,
            country: u.country,
            city: u.city,
            organization: u.organization,
            createdAt: u.createdAt,
          })) || []} />
          <ManageProblems problems={dashboardData?.problems || []} />
        </div>

        {/* Rankings Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Rankings</h2>
          <p className="text-gray-600">Ranked by number of problems solved</p>
        </div>

        {/* User Cards */}
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-start space-x-6">
                  <Skeleton className="w-20 h-20 rounded-xl" />
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div key={j} className="text-center">
                          <Skeleton className="h-8 w-12 mx-auto mb-1" />
                          <Skeleton className="h-4 w-16 mx-auto" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : dashboardData?.users.length === 0 ? (
          <Card className="p-6">
            <div className="text-center text-gray-500">
              No handles added yet. Add a Codeforces handle to get started!
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {dashboardData?.users.map((user, index) => (
              <UserCard key={user.handle} user={user} rank={index + 1} />
            ))}
          </div>
        )}

        {/* Summary Statistics */}
        {dashboardData && (
          <Card className="mt-8 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Statistics</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{dashboardData.totalUsers}</div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{dashboardData.totalProblems}</div>
                <div className="text-sm text-gray-500">Problems Tracked</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{dashboardData.totalSolved}</div>
                <div className="text-sm text-gray-500">Total Solved</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{dashboardData.averageRate}%</div>
                <div className="text-sm text-gray-500">Average Success Rate</div>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
