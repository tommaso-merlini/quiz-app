import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return <SubjectsSkeleton />;
}

function SubjectsSkeleton() {
  return (
    <div>
      <div className="flex flex-row justify-between mb-6">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <SubjectCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

function SubjectCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}
