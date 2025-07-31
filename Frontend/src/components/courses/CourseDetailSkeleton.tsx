export default function CourseDetailSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video/Image Skeleton */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200 animate-pulse" />
          
          {/* Tabs Skeleton */}
          <div className="space-y-4">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 h-8 bg-gray-200 rounded-md animate-pulse" />
              ))}
            </div>
            
            {/* Tab Content Skeleton */}
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
              </div>
              
              {/* Prerequisites Skeleton */}
              <div className="space-y-3 mt-6">
                <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <div className="bg-card rounded-xl border p-6 space-y-6 animate-pulse">
              {/* Price Skeleton */}
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-1/2" />
              </div>

              {/* Stats Grid Skeleton */}
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </div>
                ))}
              </div>

              {/* Badges Skeleton */}
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-full" />
                <div className="h-8 bg-gray-200 rounded w-full" />
              </div>

              {/* Button Skeleton */}
              <div className="h-12 bg-gray-200 rounded w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Related Courses Skeleton */}
      <div className="mt-16 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-6 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}