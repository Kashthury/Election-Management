import { RotateCcw } from "lucide-react";

export default function ClearFiltersButton({ onClick }: { onClick: () => void }) {
  return <button type="button" className="button secondary clear-filters-button" onClick={onClick}>
    <RotateCcw size={14} /> Clear filters
  </button>;
}
