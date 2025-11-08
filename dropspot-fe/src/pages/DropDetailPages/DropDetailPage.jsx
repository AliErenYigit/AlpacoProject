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

  // 📅 Tarihleri Türkiye saatine göre formatla
  const formatDate = (dateString) => {
    return dayjs(dateString)
      .locale("tr")
      .format("DD MMMM YYYY, HH:mm");
  };

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

    // 🔹 1️⃣ Mevcut durum kontrolü
    const { data: statusData } = await axiosClient.get(`/drops/${id}/status`);

    if (statusData.status === "waiting") {
      // Kullanıcı zaten beklemede
      await Swal.fire({
        icon: "info",
        title: "Already in Waitlist ⏳",
        text: "You have already joined this drop's waitlist.",
        confirmButtonColor: "#2563eb",
      });
      return; // ❌ join isteğini atma
    }
    else if(statusData.status === "left") {
      // Kullanıcı zaten claim etmiş
      await Swal.fire({
        icon: "info",
        title: "You already left ❌",
        text: "You have already left this drop's waitlist.",
        confirmButtonColor: "#2563eb",
      }); 
      return;
    }

 

    // 🔹 2️⃣ Eğer beklemede değilse join işlemi başlat
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

    // Önce kullanıcının gerçekten listede olup olmadığını kontrol et
    const { data: check } = await axiosClient.get(`/drops/${id}/status`);

    if (!check.in_waitlist) {
      await Swal.fire({
        icon: "info",
        title: "You are not in the waitlist ⚠️",
        text: "You cannot leave because you haven't joined this drop yet.",
        confirmButtonColor: "#2563eb",
      });
      return; // Fonksiyonu bitir
    }

    // Eğer listede ise onay al ve leave işlemi yap
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
    const msg =
      err.response?.data?.error ||
      (err.response?.status === 404
        ? "You are not in the waitlist!"
        : "Something went wrong.");
    Swal.fire({
      icon: "error",
      title: "Leave Failed ❌",
      text: msg,
      confirmButtonColor: "#ef4444",
    });
  } finally {
    setLoading(false);
  }
};
  // 🔹 Claim işlemi
  const claim = async () => {
    try {
      setLoading(true);
const { data: statusData } = await axiosClient.get(`/drops/${id}/status`);
         if (statusData.status === "claimed") {
      // Kullanıcı zaten claim etmişse
      await Swal.fire({
        icon: "info",
        title: "Already Claimed 🎁",
        text: "You have already claimed this drop.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
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

        {/* 🔹 Start ve End Tarihleri */}
        <p>
          <strong>Start Date:</strong> {formatDate(drop.start_at)}
        </p>
        <p>
          <strong>End Date:</strong> {formatDate(drop.end_at)}
        </p>

        {/* 🔹 Claim Window */}
        <p>
          <strong>Claim Window:</strong>{" "}
          {formatDate(drop.claim_window_start)} -{" "}
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
