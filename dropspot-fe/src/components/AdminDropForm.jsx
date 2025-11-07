import { useState } from "react";
import axiosClient from "../api/axiosClient";

export default function AdminDropForm({ onSave }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    capacity: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axiosClient.post("/admin/drops", form);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
   
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        type="number"
        placeholder="Capacity"
        value={form.capacity}
        onChange={(e) => setForm({ ...form, capacity: e.target.value })}
      />
      <button type="submit">Add Drop</button>
    </form>
  );
}
