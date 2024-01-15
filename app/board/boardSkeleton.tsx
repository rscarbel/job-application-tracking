import { Skeleton } from "primereact/skeleton";
import React from "react";

const BoardSkeleton: React.FC = () => {
  const sizingClasses = "sm:w-1/2 md:w-1/3 lg:w-1/4";

  return (
    <div className="flex flex-wrap p-4">
      <div className={`w-full ${sizingClasses} p-2`}>
        <div className="bg-gray-200 rounded p-4 max-h-[600px] overflow-y-auto">
          {[...Array(7)].map((_, index) => (
            <div key={index} className="mb-2">
              <Skeleton width="100%" height="80px" />
            </div>
          ))}
        </div>
      </div>
      <div className={`w-full ${sizingClasses} p-2`}>
        <div className="bg-gray-200 rounded p-4 max-h-[600px] overflow-y-auto">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="mb-2">
              <Skeleton width="100%" height="80px" />
            </div>
          ))}
        </div>
      </div>
      <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 flex flex-col">
        <div className={`w-full ${sizingClasses} p-2 min-w-full`}>
          <div className="bg-gray-200 rounded p-4 max-h-[600px] overflow-y-auto">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="mb-2">
                <Skeleton width="100%" height="80px" />
              </div>
            ))}
          </div>
        </div>
        <div className={`w-full ${sizingClasses} p-2 min-w-full`}>
          <div className="bg-gray-200 rounded p-4 max-h-[600px] overflow-y-auto">
            <div key={"offer"} className="mb-2">
              <Skeleton width="100%" height="80px" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 flex flex-col">
        <div className={`w-full ${sizingClasses} p-2 min-w-full`}>
          <div className="bg-gray-200 rounded p-4 max-h-[600px] overflow-y-auto">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="mb-2">
                <Skeleton width="100%" height="80px" />
              </div>
            ))}
          </div>
        </div>
        <div className={`w-full ${sizingClasses} p-2 min-w-full`}>
          <div className="bg-gray-200 rounded p-4 max-h-[600px] overflow-y-auto">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="mb-2">
                <Skeleton width="100%" height="80px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardSkeleton;
