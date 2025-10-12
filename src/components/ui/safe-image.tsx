import * as React from "react";
import Image, { ImageProps } from "next/image";

import { cn } from "@/lib/utils";
import { MediaSkeleton } from "@/components/ui/media-skeleton";

type SafeImageProps = ImageProps & {
  containerClassName?: string;
  skeletonClassName?: string;
  /** Optional custom fallback when the image fails to load. */
  fallback?: React.ReactNode;
};

const SafeImage = React.forwardRef<HTMLImageElement, SafeImageProps>(
  (props, ref) => {
    const {
      className,
      containerClassName,
      skeletonClassName,
      fallback,
      onLoad,
      onError,
      alt = "",
      ...imageProps
    } = props;
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);

    React.useEffect(() => {
      setIsLoaded(false);
      setHasError(false);
    }, [imageProps.src]);

    const shouldShowSkeleton = !isLoaded || hasError;

    const handleLoadingComplete = React.useCallback(
      (img: HTMLImageElement) => {
        setIsLoaded(true);
        onLoad?.(img);
      },
      [onLoad]
    );

    const handleError = React.useCallback(
      (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setHasError(true);
        setIsLoaded(false);
        onError?.(event);
      },
      [onError]
    );

    return (
      <div className={cn("relative block", containerClassName)}>
        <MediaSkeleton
          isVisible={shouldShowSkeleton}
          className={cn("rounded-lg", skeletonClassName)}
        />
        {!hasError ? (
          <Image
            ref={ref}
            alt={alt}
            {...imageProps}
            onLoad={handleLoadingComplete}
            onError={handleError}
            className={cn(
              "transition-opacity duration-300 ease-out",
              className,
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        ) : (
          fallback ?? null
        )}
      </div>
    );
  }
);

SafeImage.displayName = "SafeImage";

export { SafeImage };
