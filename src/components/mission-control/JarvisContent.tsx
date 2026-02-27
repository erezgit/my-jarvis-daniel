export default function JarvisContent() {
  return (
    <div className="h-full flex flex-col justify-between p-1">
      <div className="text-base font-semibold text-[#58a6ff]">
        Root Cause Found
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-5">
        <div className="text-base font-semibold text-[#e6edf3]">Running in FakeRest demo mode</div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-sm text-[#ef4444]">Bug</span>
            <span className="text-sm text-[#8b949e]">npm run dev:demo → FakeRest, not real DB</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-sm text-[#f0883e]">Proof</span>
            <span className="text-sm text-[#8b949e]">Log: ra-data-fakerest + demo.example.org</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-sm text-[#3fb950]">Fix</span>
            <span className="text-sm text-[#8b949e]">Update FakeRest generator with GTD data</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-[#58a6ff]">Fixing now...</div>
    </div>
  );
}
