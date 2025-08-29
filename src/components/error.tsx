"use client";

import { AlertCircle } from "lucide-react";

interface ErrorComponentProps {
  error: string;
}

export function ErrorComponent({ error }: ErrorComponentProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <span className="text-red-700 text-sm">{error}</span>
      </div>
    </div>
  );
}
