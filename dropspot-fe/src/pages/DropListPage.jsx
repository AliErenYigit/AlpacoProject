import { useEffect } from "react";
import useDropStore from "../store/useDropStore";
import DropCard from "../components/DropCard";

export default function DropListPage() {
  const { drops, fetchDrops } = useDropStore();

  useEffect(() => {
    fetchDrops();
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Active Drops</h2>
      <div style={{ display: "grid", gap: "20px" }}>
        {drops.map((drop) => (
          <DropCard key={drop.id} drop={drop} />
        ))}
      </div>
    </div>
  );
}
