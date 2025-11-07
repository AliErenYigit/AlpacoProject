import React from "react";
import { useNavigate } from "react-router-dom";
import "./DropCard.css";

export default function DropCard({ drop }) {
  const navigate = useNavigate();
  // Tarihleri Türkiye saatine göre formatla
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
  const handleClick = () => {
    navigate(`/drops/${drop.id}`); // Drop detay sayfasına yönlendir
  };
  return (
    <div className="drop-card" onClick={handleClick}>
      <h2>{drop.title}</h2>
      <p>{drop.description}</p>
      <p>
        <strong>Claim Window:</strong>
        <br />
        {formatDate(drop.claim_window_start)} - {formatDate(drop.claim_window_end)}
      </p>
    </div>
  );
}
