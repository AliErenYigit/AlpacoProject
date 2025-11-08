import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import dayjs from "dayjs";
import "./AdminPanel.css";
import Swal from "sweetalert2";

import useAuth from "../../hooks/useAuth";

import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [drops, setDrops] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    capacity: "",
    start_at: "",
    end_at: "",
    claim_window_start: "",
    claim_window_end: "",
  });

  const fetchDrops = async () => {
    const res = await axiosClient.get("/drops");
    setDrops(res.data);
  };

  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Oturumunuz kapatıldı",
        text: "Lütfen yeniden giriş yapın.",
        confirmButtonText: "Giriş Sayfasına Git",
        confirmButtonColor: "#2563eb",
        allowOutsideClick: false,
      }).then(() => {
        logout();
        navigate("/login");
      });
      return;
    }

    if (user.role !== "admin") {
      Swal.fire({
        icon: "warning",
        title: "Oturumunuz kapatıldı",
        text: "Lütfen yeniden giriş yapınız.",
        confirmButtonText: "Ana Sayfaya Dön",
        confirmButtonColor: "#2563eb",
        allowOutsideClick: false,
      }).then(() => {
        navigate("/");
      });
    }
    fetchDrops();
  }, [user, logout, navigate]);

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createDrop = async () => {
    try {
      await axiosClient.post("/admin/drops", form);

      Swal.fire({
        icon: "success",
        title: "Drop created successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      setForm({
        title: "",
        description: "",
        capacity: "",
        start_at: "",
        end_at: "",
        claim_window_start: "",
        claim_window_end: "",
      });

      fetchDrops();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Create Failed",
        text: err.response?.data?.error || "Something went wrong.",
      });
    }
  };

const updateDrop = async (drop) => {
  try {
    // Eğer drop eksikse, backend'den tam veriyi çek
    const { data } = await axiosClient.get(`/admin/drops/${drop.id}`);
    console.log("Fetched drop data:", data);
    drop = data;
  } catch (e) {
    console.warn("Drop details could not be fetched, using local data.");
  }
  const { value: formValues } = await Swal.fire({
   title: '<h2 style="color:#1e3a8a; font-weight:700; margin-bottom:10px;">Edit Drop</h2>',
html: `
  <div style="
    display: flex;
    flex-direction: column;
    gap: 12px;
    text-align: left;
    font-family: 'Inter', sans-serif;
    padding: 0 8px;
    font-size: 0.9rem;
    max-width: 480px;
    margin-left: 0;          /* sola yaslama */
  ">

    <!-- Title -->
    <div>
      <label style="font-weight:600;">Title</label>
      <input id="swal-title" class="swal2-input"
        style="width:100%; height:36px; font-size:0.9rem; margin-left:0;"
        value="${drop?.title ?? ''}">
    </div>

    <!-- Description -->
    <div>
      <label style="font-weight:600;">Description</label>
      <input id="swal-description" class="swal2-input"
        style="width:100%; height:36px; font-size:0.9rem; margin-left:0;"
        value="${drop?.description ?? ''}">
    </div>

    <!-- Capacity -->
    <div>
      <label style="font-weight:600;">Capacity</label>
      <input id="swal-capacity" type="number" class="swal2-input"
        style="width:100%; height:36px; font-size:0.9rem; margin-left:0;"
        value="${drop?.capacity ?? ''}">
    </div>

    <!-- Start/End -->
    <div style="display:flex; gap:10px;">
      <div style="flex:1;">
        <label style="font-weight:600;">Start At</label>
        <input id="swal-start" type="datetime-local" class="swal2-input"
          style="width:100%; height:36px; font-size:0.9rem; margin-left:0;"
          value="${drop?.start_at ? dayjs(drop.start_at).format('YYYY-MM-DDTHH:mm') : ''}">
      </div>
      <div style="flex:1;">
        <label style="font-weight:600;">End At</label>
        <input id="swal-end" type="datetime-local" class="swal2-input"
          style="width:100%; height:36px; font-size:0.9rem; margin-left:0;"
          value="${drop?.end_at ? dayjs(drop.end_at).format('YYYY-MM-DDTHH:mm') : ''}">
      </div>
    </div>

    <!-- Claim Start/End -->
    <div style="display:flex; gap:10px;">
      <div style="flex:1;">
        <label style="font-weight:600;">Claim Start</label>
        <input id="swal-claim-start" type="datetime-local" class="swal2-input"
          style="width:100%; height:36px; font-size:0.9rem; margin-left:0;"
          value="${drop?.claim_window_start ? dayjs(drop.claim_window_start).format('YYYY-MM-DDTHH:mm') : ''}">
      </div>
      <div style="flex:1;">
        <label style="font-weight:600;">Claim End</label>
        <input id="swal-claim-end" type="datetime-local" class="swal2-input"
          style="width:100%; height:36px; font-size:0.9rem; margin-left:0;"
          value="${drop?.claim_window_end ? dayjs(drop.claim_window_end).format('YYYY-MM-DDTHH:mm') : ''}">
      </div>
    </div>
  </div>
`,
    showCancelButton: true,
    confirmButtonText: "💾 Save Changes",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#6b7280",
    background: "#f9fafb",
    width: "520px",
    heightAuto: true,
    scrollbarPadding: false,
    allowOutsideClick: false,
    customClass: {
      popup: "no-horizontal-scroll"
    },
    preConfirm: () => ({
      title: document.getElementById("swal-title").value,
      description: document.getElementById("swal-description").value,
      capacity: document.getElementById("swal-capacity").value,
      start_at: document.getElementById("swal-start").value,
      end_at: document.getElementById("swal-end").value,
      claim_window_start: document.getElementById("swal-claim-start").value,
      claim_window_end: document.getElementById("swal-claim-end").value,
    }),
  });

  if (formValues) {
    try {
      await axiosClient.put(`/admin/drops/${drop.id}`, formValues);
      await Swal.fire({
        icon: "success",
        title: "✅ Drop updated successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchDrops();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "❌ Update Failed",
        text: err.response?.data?.error || "Something went wrong.",
      });
    }
  }
};


    const deleteDrop = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This drop will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosClient.delete(`/admin/drops/${id}`);
      Swal.fire({
        icon: "success",
        title: "Drop deleted!",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchDrops();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err.response?.data?.error || "Something went wrong.",
      });
    }
  };

  return (
    <div className="admin-container">
      
      <div className="admin-box">
       <div className="admin-header">
        <h1 className="admin-title">Admin Panel</h1>
        {/* 🔹 Admin e-posta gösterimi */}
        <p className="admin-email">{user.email}</p>
      </div>
        {/* 🔹 Yeni Drop Oluşturma Formu */}
        <section className="drop-form">
          <h2>Create / Update Drop</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input name="description" value={form.description} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input
                name="capacity"
                type="number"
                value={form.capacity}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Start At</label>
              <input
                name="start_at"
                type="datetime-local"
                value={form.start_at}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>End At</label>
              <input
                name="end_at"
                type="datetime-local"
                value={form.end_at}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Claim Start</label>
              <input
                name="claim_window_start"
                type="datetime-local"
                value={form.claim_window_start}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Claim End</label>
              <input
                name="claim_window_end"
                type="datetime-local"
                value={form.claim_window_end}
                onChange={handleChange}
              />
            </div>
          </div>
          <button className="btn-primary" onClick={createDrop}>
            Create Drop
          </button>
        </section>

        {/* 🔹 Mevcut Droplar Listesi */}
        <section className="drop-list-section">
          <h2>Existing Drops</h2>
          <div className="drop-list">
            {drops.map((drop) => (
              <div className="drop-item" key={drop.id}>
                <div className="drop-info">
                  <h3>{drop.title}</h3>
                  <p>{drop.description}</p>

                  {/* 🔹 Yeni Eklenen Kısım */}
                 <p>
          <strong>Capacity:</strong> {drop.capacity}
        </p>
                  <p>
                    <strong>Start:</strong>{" "}
                    {dayjs(drop.start_at).format("DD MMM YYYY, HH:mm")}
                  </p>
                  <p>
                    <strong>End:</strong>{" "}
                    {dayjs(drop.end_at).format("DD MMM YYYY, HH:mm")}
                  </p>

                  <p>
                    <strong>Claim Window:</strong>{" "}
                    {dayjs(drop.claim_window_start).format("DD MMM YYYY, HH:mm")} -{" "}
                    {dayjs(drop.claim_window_end).format("HH:mm")}
                  </p>
                </div>
                <div className="drop-actions">
                  <button className="btn-edit" onClick={() => updateDrop(drop)}>Edit</button>
                  <button className="btn-delete" onClick={() => deleteDrop(drop.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
