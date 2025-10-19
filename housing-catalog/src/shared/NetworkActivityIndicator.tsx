import React from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

export const NetworkActivityIndicator: React.FC = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const isLoading = isFetching > 0 || isMutating > 0;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`h-1 bg-blue-500 transition-all duration-300 ${
          isLoading ? "w-full opacity-100" : "w-0 opacity-0"
        }`}
        style={{
          background: "linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd)",
        }}
      >
        {isLoading && (
          <div
            className="h-full bg-white opacity-30 w-1/2 absolute animate-pulse"
            style={{
              animation: "shimmer 2s infinite",
            }}
          />
        )}
      </div>
    </div>
  );
};
