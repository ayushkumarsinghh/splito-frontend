import { useState, useEffect } from "react";
import axios from "axios";
import { createPortal } from "react-dom";

export default function Settle({ token, refresh }) {
  const [toUsername, setToUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [payeeUpi, setPayeeUpi] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchPendingRequests();
  }, [refresh]);

  const fetchPendingRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/settlements/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const initiatePayment = async () => {
    setError("");
    if (!toUsername || !amount) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/users/username/${toUsername.trim()}/payment-info`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.upiId) {
        setPayeeUpi(res.data.upiId);
      } else {
        setPayeeUpi(null);
      }
      
      setShowQrModal(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const confirmSent = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/api/settle`,
        {
          toUsername: toUsername.trim(),
          amount: Number(amount),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setToUsername("");
      setAmount("");
      setShowQrModal(false);
      refresh();
      alert("Payment request sent!");
    } catch (err) {
      setError(err.response?.data?.message || "Settlement failed");
    } finally {
      setLoading(false);
    }
  };

  const respondToRequest = async (id, status) => {
    try {
      await axios.post(
        `${API_URL}/api/settlements/${id}/respond`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPendingRequests();
      refresh();
    } catch (err) {
      alert("Failed to respond to request");
    }
  };

  const upiLink = payeeUpi ? `upi://pay?pa=${payeeUpi}&pn=${toUsername}&am=${amount}&cu=INR` : "";
  const qrCodeUrl = payeeUpi ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}` : null;

  return (
    <div className="settle-form">
      <h3>Settle Up</h3>
      <p className="text-meta" style={{ marginBottom: "var(--s-16)" }}>Pay back what you owe.</p>

      <div className="form-group">
        <label className="input-label">Recipient Username</label>
        <input
          className="input-field"
          placeholder="johndoe"
          value={toUsername}
          onChange={(e) => setToUsername(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="input-label">Amount (₹)</label>
        <input
          className="input-field"
          placeholder="e.g. 250"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {error && (
        <div className="text-danger" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem", textAlign: "center", fontSize: "0.85rem", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
          {error}
        </div>
      )}

      <button 
        className="btn btn-primary" 
        onClick={initiatePayment} 
        disabled={loading}
        style={{ width: "100%", marginBottom: "var(--s-24)" }}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {/* Pending Requests Section */}
      {pendingRequests.length > 0 && (
        <div style={{ marginTop: "var(--s-16)" }}>
          <h4>Pending Confirmations</h4>
          {pendingRequests.map(req => (
            <div key={req._id} className="card" style={{ padding: "var(--s-16)", marginBottom: "var(--s-8)", background: "rgba(255,255,255,0.02)" }}>
              <p style={{ fontSize: "0.9rem", marginBottom: "var(--s-8)" }}>
                <strong>{req.from.username}</strong> paid you <span className="text-success">₹{req.amount}</span>
              </p>
              <div style={{ display: "flex", gap: "var(--s-8)" }}>
                <button className="btn btn-primary" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={() => respondToRequest(req._id, "completed")}>Confirm</button>
                <button className="btn btn-outline" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={() => respondToRequest(req._id, "declined")}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal using Portal */}
      {showQrModal && createPortal(
        <div className="modal-overlay fade-in">
          <div className="card" style={{ maxWidth: "400px", width: "90%", textAlign: "center" }}>
            <h3 style={{ marginTop: 0 }}>Pay {toUsername}</h3>
            
            {payeeUpi ? (
              <>
                <p className="text-meta">Scan with any UPI app</p>
                <div style={{ background: "white", padding: "1rem", borderRadius: "1rem", display: "inline-block", margin: "1.5rem 0" }}>
                  <img src={qrCodeUrl} alt="UPI QR Code" style={{ width: "200px", height: "200px" }} />
                </div>
                <div className="h2" style={{ margin: "0 0 4px" }}>₹{amount}</div>
                <p className="text-meta">UPI ID: {payeeUpi}</p>
              </>
            ) : (
              <div style={{ padding: "2rem 0" }}>
                <p>This user hasn't added a UPI ID.</p>
                <p className="text-meta">Pay them directly via cash or other means.</p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-8)", marginTop: "var(--s-24)" }}>
              <button className="btn btn-primary" onClick={confirmSent} disabled={loading}>
                {loading ? "Sending..." : "I have paid them"}
              </button>
              <button className="btn btn-outline" onClick={() => setShowQrModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
