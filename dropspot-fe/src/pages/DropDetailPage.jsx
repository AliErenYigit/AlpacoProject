import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import dayjs from "dayjs";

export default function DropDetailPage() {
  const { id } = useParams();
  const [drop, setDrop] = useState(null);
  const [claimCode, setClaimCode] = useState(null);

  useEffect(() => {
    axiosClient.get(`/drops/${id}`).then((res) => setDrop(res.data));
  }, [id]);

  const join = async () => {
    await axiosClient.post(`/drops/${id}/join`);
    alert("Joined waitlist!");
  };

  const leave = async () => {
    await axiosClient.post(`/drops/${id}/leave`);
    alert("Left waitlist!");
  };

  const claim = async () => {
    try {
      const res = await axiosClient.post(`/drops/${id}/claim`);
      setClaimCode(res.data.claim_code);
      alert("🎉 Claim successful!");
    } catch (err) {
      alert(err.response?.data?.error || "claim_failed");
    }
  };

  if (!drop) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{drop.title}</h2>
      <p>{drop.description}</p>
      <p>Capacity: {drop.capacity}</p>
      <p>
        Claim Window: {dayjs(drop.claim_window_start).format("HH:mm")} -{" "}
        {dayjs(drop.claim_window_end).format("HH:mm")}
      </p>

      <div style={{ marginTop: "10px" }}>
        <button onClick={join}>Join Waitlist</button>
        <button onClick={leave}>Leave Waitlist</button>
        <button onClick={claim}>Claim</button>
      </div>

      {claimCode && (
        <div style={{ marginTop: 10 }}>
          <strong>Your claim code:</strong> {claimCode}
        </div>
      )}
    </div>
  );
}
