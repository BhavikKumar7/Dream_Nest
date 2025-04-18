import { useEffect, useState } from "react";
import "../styles/List.scss";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/admin/users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      } else {
        console.error("Failed to delete user");
      }
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  const handleViewBookings = (userId) => {
    navigate(`/admin/users/${userId}/bookings`);
  };

  // Filter users to exclude those with role 'host'
  const filteredUsers = users.filter((user) => user.role !== "host");

  return (
    <>
      <Navbar />
      <h1 className="title-list">Admin - User Management</h1>
      <div className="list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.id} className="user-card">
              <h3>{user.firstName} {user.lastName}</h3>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
              <div className="admin-buttons">
                <button onClick={() => handleViewBookings(user.id)}>View Bookings</button>
                <button onClick={() => handleDelete(user.id)}>Delete User</button>
              </div>
            </div>
          ))
        ) : (
          <p>No users available to show.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UserList;
