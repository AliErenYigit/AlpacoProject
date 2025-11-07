import React, { useEffect } from "react";
import useDropStore from "../../store/useDropStore";
import DropCard from "../../components/DropCard";
import "./DropListPage.css";

export default function DropListPage() {
  const { drops, fetchDrops } = useDropStore();

  useEffect(() => {
    fetchDrops();
  }, [fetchDrops]);

  return (
    <div className="drop-list-container">
      <div className="drop-list-box">
        <h1 className="drop-list-title">🔥 Active Drops</h1>
        <div className="drop-list-items">
          {drops.length > 0 ? (
            drops.map((drop) => (
              <DropCard key={drop.id} drop={drop} />
            ))
          ) : (
            <p className="no-drops">No active drops available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
