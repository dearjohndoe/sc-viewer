"use client";

import { Copy, ExternalLink } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { useState } from "react";

interface RenderFieldProps {
  label: string;
  value: string;
  url?: string;
  copy?: string;
}

export function RenderField({ label, value, url, copy }: RenderFieldProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  return (
    <div className="mb-3">
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-gray-600 min-w-0 mr-4">
          {label}
        </span>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-sm text-gray-900 break-all">
            {value}
          </span>
          {copy && (
            <button
              onClick={() => copyToClipboard(copy, setCopiedKey)}
              className={`transition-colors duration-200 ${
                copiedKey === copy
                  ? "text-green-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </button>
          )}
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
              title="Open link"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
