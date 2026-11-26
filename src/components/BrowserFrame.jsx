/* eslint-disable react/prop-types */
const BrowserFrame = ({ src, alt, url, width = 1200, height = 750 }) => (
  <div className="rounded-xl overflow-hidden border border-border-bright bg-surface shadow-panel">
    <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-surface-2">
      <span className="flex gap-1.5" aria-hidden="true">
        <span className="w-2.5 h-2.5 rounded-full bg-text/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-text/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-text/15" />
      </span>
      {url && (
        <span className="flex-1 min-w-0 truncate text-center font-mono text-[10px] text-muted">
          {url}
        </span>
      )}
    </div>
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className="block w-full h-auto"
    />
  </div>
);

export default BrowserFrame;
