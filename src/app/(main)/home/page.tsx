import TopBar from "@/src/components/layout/TopBar";

export default function Home() {
  return (
    <div className="w-full sm:max-w-[600px] mx-auto min-h-[50vh]">
      <TopBar />
      {/* Your main content */}
      <div className="pb-20">
        {/* This is where your feed/content would go */}
        <div className="p-4">
          <h1 className="text-2xl font-bold">Welcome to Echo</h1>
          {/* Example content that scrolls */}
          <div className="space-y-4 mt-4">
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <p>Post content #{i + 1}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}