import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import "./DropDetailPage.css";

export default function DropDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drop, setDrop] = useState(null);
  const [claimCode, setClaimCode] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Drop detayını getir
  useEffect(() => {
    axiosClient
      .get(`/drops/${id}`)
      .then((res) => setDrop(res.data))
      .catch(() =>
        Swal.fire({
          icon: "error",
          title: "Drop not found",
          text: "The requested drop could not be found.",
          confirmButtonColor: "#2563eb",
        })
      );
  }, [id]);

  // 🔹 Waitlist'e katıl
  const join = async () => {
    try {
      setLoading(true);
      await axiosClient.post(`/drops/${id}/join`);
      Swal.fire({
        icon: "success",
        title: "Joined Successfully 🎉",
        text: "You have been added to the waitlist!",
        confirmButtonColor: "#2563eb",
        timer: 2000,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Join Failed ❌",
        text: err.response?.data?.error || "Something went wrong.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Waitlist'ten ayrıl
  const leave = async () => {
    try {
      setLoading(true);
      const confirm = await Swal.fire({
        title: "Leave Waitlist?",
        text: "Are you sure you want to leave the waitlist?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Leave",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#ef4444",
      });
      if (!confirm.isConfirmed) return;

      await axiosClient.post(`/drops/${id}/leave`);
      Swal.fire({
        icon: "success",
        title: "Left Successfully 👋",
        text: "You have left the waitlist.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Leave Failed ❌",
        text: err.response?.data?.error || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Claim işlemi
  const claim = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.post(`/drops/${id}/claim`);
      setClaimCode(res.data.claim_code);
      Swal.fire({
        icon: "success",
        title: "Claim Successful 🎁",
        html: `
          <p>You have successfully claimed your drop!</p>
          <p><strong>Claim Code:</strong></p>
          <p style="font-size: 1.2rem; color: #2563eb; font-weight: bold;">${res.data.claim_code}</p>
        `,
        confirmButtonText: "OK",
        confirmButtonColor: "#2563eb",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Claim Failed ❌",
        text: err.response?.data?.error || "Something went wrong.",
      });
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
            <strong>Your claim code:</strong>{" "}
            <span style={{ color: "#2563eb" }}>{claimCode}</span>
          </div>
        )}

        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Drops
        </button>
      </div>
    </div>
  );
}
