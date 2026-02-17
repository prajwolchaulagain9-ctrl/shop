'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export default function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label="Loading..."
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col h-full">
      {/* Image skeleton */}
      <Skeleton className="h-72 w-full rounded-none" />
      
      {/* Content skeleton */}
      <div className="flex-1 flex flex-col p-6 space-y-4">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Description lines */}
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        
        {/* Price */}
        <Skeleton className="h-8 w-1/3" />
        
        {/* Button */}
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

export function OrderDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <Skeleton className="h-6 w-24 mb-4" />
          <Skeleton className="h-10 w-64" />
        </div>
        
        {/* Order details card */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" className="w-12 h-12" />
            <div className="flex-1">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          
          {/* Items */}
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4 p-4 border rounded-lg">
                <Skeleton className="w-20 h-20" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero skeleton */}
      <div className="bg-gradient-to-r from-red-900 to-red-700">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-8 w-1/2 mx-auto mb-4" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
        </div>
      </div>
      
      {/* Content section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-1 w-20 mx-auto mb-6" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-10 w-48 mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
          
          {/* Summary skeleton */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <Skeleton className="h-8 w-32 mb-4" />
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-16 h-16" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
