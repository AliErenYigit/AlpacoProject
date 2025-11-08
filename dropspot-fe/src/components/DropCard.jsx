import React from "react";
import { useNavigate } from "react-router-dom";
import "./DropCard.css";

export default function DropCard({ drop }) {
  const navigate = useNavigate();

  // 📅 Tarihleri Türkiye saatine göre formatla
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("tr-TR", {
      timeZone: "Europe/Istanbul",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 🧭 Sadece aktif droplara yönlendirme izni ver
  const handleClick = () => {
    if (drop.status !== "active") return;
    navigate(`/drops/${drop.id}`);
  };

  // 💡 CSS class'ı durumuna göre değiştir
  const statusClass = {
    active: "active-drop",
    upcoming: "upcoming-drop",
    ended: "ended-drop",
  }[drop.status || "upcoming"];

  // 🔖 Görsel durum etiketi
  const statusLabel = {
    active: "🔥 Active",
    upcoming: "⏳ Upcoming",
    ended: "🚫 Ended",
  }[drop.status || "upcoming"];

  // 💬 Tooltip metni
  const tooltip =
    drop.status === "active"
      ? "Detayları görmek için tıklayın"
      : drop.status === "upcoming"
      ? "Bu drop henüz başlamadı"
      : "Bu drop sona erdi";

  return (
    <div
      className={`drop-card ${statusClass}`}
      onClick={handleClick}
      title={tooltip}
      style={{
        cursor: drop.status === "active" ? "pointer" : "not-allowed",
        opacity: drop.status === "active" ? 1 : 0.6,
        transition: "all 0.2s ease",
      }}
    >
      <div className="drop-card-header">
        <h2 className="drop-title">{drop.title}</h2>
        <span className={`drop-status ${drop.status}`}>{statusLabel}</span>
      </div>

      <p className="drop-description">{drop.description}</p>

      {/* 🔹 Başlangıç ve bitiş tarihleri */}
      <div className="drop-dates">
        <p>
          <strong>Start:</strong> {formatDate(drop.start_at)}
        </p>
        <p>
          <strong>End:</strong> {formatDate(drop.end_at)}
        </p>
      </div>

      {/* 🔹 Claim Window bilgisi */}
      <div className="drop-claim">
        <p>
          <strong>Claim Window:</strong>
          <br />
          {formatDate(drop.claim_window_start)} -{" "}
          {formatDate(drop.claim_window_end)}
        </p>
      </div>
    </div>
  );
}
