import React, { useEffect } from "react";
import useDropStore from "../../store/useDropStore";
import useAuth from "../../hooks/useAuth";
import DropCard from "../../components/DropCard";
import "./DropListPage.css";

export default function DropListPage() {
  const { drops, fetchDrops } = useDropStore();
  const { user } = useAuth();

  useEffect(() => {
    fetchDrops();
  }, [fetchDrops]);

  return (
    <div className="drop-list-container">
      {/* 🔹 Üst başlık alanı */}
     

      <div className="drop-list-box">
         <div className="drop-header-bar">
        <div className="drop-header-left">
          <span role="img" aria-label="fire" className="drop-icon">🔥</span>
          <h1 className="drop-title">Drops</h1>
        </div>
        {user && <p className="drop-email">{user.email}</p>}
      </div>
        <div className="drop-list-items">
          {drops.length > 0 ? (
            drops.map((drop) => <DropCard key={drop.id} drop={drop} />)
          ) : (
            <p className="no-drops">No active drops available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
