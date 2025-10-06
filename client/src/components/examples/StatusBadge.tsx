import StatusBadge from '../StatusBadge';

export default function StatusBadgeExample() {
  return (
    <div className="flex flex-wrap gap-3 p-6">
      <StatusBadge status="on-time" />
      <StatusBadge status="delayed" />
      <StatusBadge status="failed" />
      <StatusBadge status="in-transit" />
      <StatusBadge status="delivered" />
      <StatusBadge status="active" />
      <StatusBadge status="idle" />
    </div>
  );
}
