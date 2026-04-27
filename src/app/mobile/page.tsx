export default function MobilePreviewPage() {
  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-6 text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[28rem] flex-col">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold tracking-tight">Mobile Preview</h1>
            <p className="text-xs text-white/55">390 x 844 viewport</p>
          </div>
          <a
            href="/"
            className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 hover:border-white/30 hover:text-white"
          >
            Desktop
          </a>
        </div>

        <div className="mx-auto w-full max-w-[390px] flex-1 overflow-hidden rounded-[2rem] border border-white/15 bg-stone-50 shadow-2xl">
          <iframe
            title="RGuide mobile viewport"
            src="/"
            className="h-[844px] w-[390px] max-w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
