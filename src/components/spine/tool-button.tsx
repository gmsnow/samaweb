export function ToolButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-slate-900/80 text-white/70 shadow-lg backdrop-blur-xl transition-colors hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  );
}
