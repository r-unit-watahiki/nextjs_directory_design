export default function DashboardLoading() {
  return (
    <div>
      <div className="h-9 w-48 bg-gray-200 rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow">
            <div className="h-7 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-9 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
