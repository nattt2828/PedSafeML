function StatusCard({ title, value, variant = "default", unit = "" }) {
  // Auto-detect color variant from value if not explicitly passed
  const getVariant = () => {
    if (variant !== "default") return variant;
    const v = String(value).toLowerCase();
    if (v === "active" || v === "online") return "green";
    if (v === "detected" || v === "orange") return "amber";
    if (v === "not detected" || v === "off") return "muted";
    if (!isNaN(value) && value !== "") return "blue";
    return "default";
  };

  const resolvedVariant = getVariant();

  const dotClass = {
    green:   "dot-green",
    amber:   "dot-orange pulse-dot",
    muted:   "dot-muted",
    blue:    "dot-blue",
    default: "dot-muted",
  }[resolvedVariant];

  const valueClass = {
    green:   "sc-value sc-green",
    amber:   "sc-value sc-orange",
    muted:   "sc-value sc-muted",
    blue:    "sc-value sc-blue mono",
    default: "sc-value",
  }[resolvedVariant];

  return (
    <div className="status-card-item">
      <span className="sc-label">{title}</span>
      <span className={valueClass}>
        <span className={`sc-dot ${dotClass}`}></span>
        {value}
        {unit && <span className="sc-unit">{unit}</span>}
      </span>
    </div>
  );
}

export default StatusCard;