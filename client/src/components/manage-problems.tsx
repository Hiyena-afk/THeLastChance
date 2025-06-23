import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Puzzle, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Problem } from "@shared/schema";

interface ManageProblemsProps {
  problems: Problem[];
}

export function ManageProblems({ problems }: ManageProblemsProps) {
  const [problemInput, setProblemInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addProblemMutation = useMutation({
    mutationFn: async (problemId: string) => {
      const res = await apiRequest("POST", "/api/problems", { problemId });
      return res.json();
    },
    onSuccess: () => {
      setProblemInput("");
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Success",
        description: "Problem added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add problem",
        variant: "destructive",
      });
    },
  });

  const deleteProblemMutation = useMutation({
    mutationFn: async (problemId: string) => {
      await apiRequest("DELETE", `/api/problems/${problemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Success",
        description: "Problem removed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove problem",
        variant: "destructive",
      });
    },
  });

  const handleAddProblem = () => {
    if (!problemInput.trim()) return;
    addProblemMutation.mutate(problemInput.trim());
  };

  const handleDeleteProblem = (problemId: string) => {
    deleteProblemMutation.mutate(problemId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Puzzle className="text-secondary mr-2" size={20} />
          Manage Problems
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter problem ID (e.g., 119A, 2023A)..."
            value={problemInput}
            onChange={(e) => setProblemInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddProblem()}
            className="flex-1 focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
          <Button 
            onClick={handleAddProblem}
            disabled={addProblemMutation.isPending || !problemInput.trim()}
            className="bg-secondary hover:bg-secondary/90"
          >
            {addProblemMutation.isPending ? "Adding..." : "Add"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {problems.map((problem) => (
            <Badge
              key={problem.problemId}
              variant="secondary"
              className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium flex items-center"
            >
              {problem.problemId}
              <button
                onClick={() => handleDeleteProblem(problem.problemId)}
                disabled={deleteProblemMutation.isPending}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <X size={12} />
              </button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
