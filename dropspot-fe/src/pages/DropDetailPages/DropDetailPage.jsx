import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import dayjs from "dayjs";
import "./DropDetailPage.css";

export default function DropDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drop, setDrop] = useState(null);
  const [claimCode, setClaimCode] = useState(null);
  const [loading, setLoading] = useState(false);

  // Drop detayını getir
  useEffect(() => {
    axiosClient
      .get(`/drops/${id}`)
      .then((res) => setDrop(res.data))
      .catch(() => alert("Drop not found"));
  }, [id]);

  // Waitlist'e katıl
  const join = async () => {
    try {
      setLoading(true);
      await axiosClient.post(`/drops/${id}/join`);
      alert("✅ Joined waitlist!");
    } catch (err) {
      alert(err.response?.data?.error || "join_failed");
    } finally {
      setLoading(false);
    }
  };

  // Waitlist'ten ayrıl
  const leave = async () => {
    try {
      setLoading(true);
      await axiosClient.post(`/drops/${id}/leave`);
      alert("👋 Left waitlist!");
    } catch (err) {
      alert(err.response?.data?.error || "leave_failed");
    } finally {
      setLoading(false);
    }
  };

  // Claim işlemi
  const claim = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.post(`/drops/${id}/claim`);
      setClaimCode(res.data.claim_code);
      alert("🎉 Claim successful!");
    } catch (err) {
      alert(err.response?.data?.error || "claim_failed");
    } finally {
      setLoading(false);
    }
  };

  if (!drop) return <p className="loading-text">Loading drop details...</p>;

  return (
    <div className="drop-detail-container">
      <div className="drop-detail-box">
        <h1>{drop.title}</h1>
        <p className="desc">{drop.description}</p>
        <p>
          <strong>Capacity:</strong> {drop.capacity}
        </p>
        <p>
          <strong>Claim Window:</strong>{" "}
          {dayjs(drop.claim_window_start).format("DD MMMM YYYY, HH:mm")} -{" "}
          {dayjs(drop.claim_window_end).format("HH:mm")}
        </p>

        <div className="button-group">
          <button disabled={loading} className="join" onClick={join}>
            Join Waitlist
          </button>
          <button disabled={loading} className="leave" onClick={leave}>
            Leave Waitlist
          </button>
          <button disabled={loading} className="claim" onClick={claim}>
            Claim
          </button>
        </div>

        {claimCode && (
          <div className="claim-code-box">
            <strong>Your claim code:</strong> <span>{claimCode}</span>
          </div>
        )}

        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Drops
        </button>
      </div>
    </div>
  );
}
