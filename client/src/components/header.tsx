import { Code, Plus, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onAddHandle: () => void;
  onAddProblem: () => void;
}

export function Header({ onAddHandle, onAddProblem }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Code className="text-white text-xl" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CodeTracker Pro</h1>
              <p className="text-sm text-gray-500">Competitive Programming Dashboard</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button onClick={onAddHandle} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2" size={16} />
              Add Handle
            </Button>
            <Button 
              onClick={onAddProblem} 
              variant="outline"
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <Puzzle className="mr-2" size={16} />
              Add Problem
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
