import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import AdminDropForm from "../../components/AdminDropForm";

export default function AdminPanel() {
  const [drops, setDrops] = useState([]);

  const loadDrops = async () => {
    const res = await axiosClient.get("/drops");
    setDrops(res.data);
  };

  useEffect(() => {
    loadDrops();
  }, []);

  const handleDelete = async (id) => {
    await axiosClient.delete(`/admin/drops/${id}`);
    loadDrops();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel</h2>
      <AdminDropForm onSave={loadDrops} />
      <ul>
        {drops.map((d) => (
          <li key={d.id}>
            {d.title} <button onClick={() => handleDelete(d.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
