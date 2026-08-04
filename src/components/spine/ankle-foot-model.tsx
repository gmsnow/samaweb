const BIO_DIGITAL_WIDGET_URL =
  "https://human.biodigital.com/widget/?be=2bsT&background.colors=0,0,0,1,0,0,0,1&initial.hand-hint=true&ui-info=true&ui-fullscreen=true&ui-center=false&ui-dissect=true&ui-zoom=true&ui-help=true&ui-tools-display=primary&uaid=3ndz6";

export function AnkleFootModel() {
  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-950 sm:h-[680px] lg:h-[800px]">
      <iframe
        src={BIO_DIGITAL_WIDGET_URL}
        title="Nerves, Arteries, and Ligaments of the Ankle and Foot"
        allow="fullscreen; autoplay; xr-spatial-tracking"
        allowFullScreen
        loading="lazy"
        className="h-full w-full border-0"
      />
    </div>
  );
}
