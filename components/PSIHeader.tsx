export default function PSIHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <a
            href="https://psychedelicsafety.institute/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 leading-tight">Psychedelic</span>
              <span className="text-xl font-bold text-gray-900 leading-tight">Safety</span>
              <span className="text-xl font-bold text-gray-900 leading-tight">Institute</span>
            </div>
          </a>

          {/* Go Home Link */}
          <a
            href="https://psychedelicsafety.institute/"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </header>
  );
}
