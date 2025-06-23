import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Handle } from "@shared/schema";

interface ManageHandlesProps {
  handles: Handle[];
}

export function ManageHandles({ handles }: ManageHandlesProps) {
  const [handleInput, setHandleInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addHandleMutation = useMutation({
    mutationFn: async (handle: string) => {
      const res = await apiRequest("POST", "/api/handles", { handle });
      return res.json();
    },
    onSuccess: () => {
      setHandleInput("");
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Success",
        description: "Handle added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add handle",
        variant: "destructive",
      });
    },
  });

  const deleteHandleMutation = useMutation({
    mutationFn: async (handle: string) => {
      await apiRequest("DELETE", `/api/handles/${handle}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Success",
        description: "Handle removed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove handle",
        variant: "destructive",
      });
    },
  });

  const handleAddHandle = () => {
    if (!handleInput.trim()) return;
    addHandleMutation.mutate(handleInput.trim());
  };

  const handleDeleteHandle = (handle: string) => {
    deleteHandleMutation.mutate(handle);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserPlus className="text-primary mr-2" size={20} />
          Manage Handles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter Codeforces handle..."
            value={handleInput}
            onChange={(e) => setHandleInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddHandle()}
            className="flex-1"
          />
          <Button 
            onClick={handleAddHandle}
            disabled={addHandleMutation.isPending || !handleInput.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            {addHandleMutation.isPending ? "Adding..." : "Add"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {handles.map((handle) => (
            <Badge
              key={handle.handle}
              variant="secondary"
              className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium flex items-center"
            >
              {handle.handle}
              <button
                onClick={() => handleDeleteHandle(handle.handle)}
                disabled={deleteHandleMutation.isPending}
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
