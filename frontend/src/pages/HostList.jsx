import { useEffect, useState } from "react";
import "../styles/List.scss";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";


const HostList = () => {
    const [hosts, setHosts] = useState([]);
    const navigate = useNavigate();
  
    // Fetch all hosts
    const fetchHosts = async () => {
      try {
        const response = await fetch("http://localhost:3001/admin/hosts");
        const data = await response.json();
        setHosts(data);
      } catch (err) {
        console.error("Error fetching hosts:", err.message);
      }
    };
  
    useEffect(() => {
      fetchHosts();
    }, []);
  
    const handleDelete = async (hostId) => {
      try {
        const response = await fetch(`http://localhost:3001/admin/hosts/${hostId}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          setHosts((prev) => prev.filter((host) => host.id !== hostId));
        } else {
          console.error("Failed to delete host");
        }
      } catch (err) {
        console.error("Delete error:", err.message);
      }
    };
  
    const handleViewListings = (hostId) => {
      navigate(`/admin/hosts/${hostId}/listings`);
    };
  
    return (
      <>
        <Navbar />
        <h1 className="title-list">Admin - Host Management</h1>
        <div className="list">
          {hosts.map((host) => (
            <div key={host.id} className="user-card">
              <h3>{host.firstName} {host.lastName}</h3>
              <p>Email: {host.email}</p>
              <p>Role: {host.role}</p>
              <div className="admin-buttons">
                <button onClick={() => handleViewListings(host.id)}>View Listings</button>
                <button onClick={() => handleDelete(host.id)}>Delete Host</button>
              </div>
            </div>
          ))}
        </div>
        <Footer />
      </>
    );
  };

export default HostList
