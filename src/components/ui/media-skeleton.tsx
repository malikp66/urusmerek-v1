import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

type MediaSkeletonProps = {
  isVisible: boolean
  className?: string
}

function MediaSkeleton({ isVisible, className }: MediaSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 h-full w-full transition-opacity duration-300 ease-out",
        className,
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <Skeleton className="h-full w-full" />
    </div>
  )
}

export { MediaSkeleton }
