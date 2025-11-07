import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function DropCard({ drop }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        borderRadius: "8px",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/drops/${drop.id}`)}
    >
      <h3>{drop.title}</h3>
      <p>{drop.description}</p>
      <p>
        Claim Window: {dayjs(drop.claim_window_start).format("HH:mm")} -{" "}
        {dayjs(drop.claim_window_end).format("HH:mm")}
      </p>
    </div>
  );
}
