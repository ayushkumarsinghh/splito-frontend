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
      // Fetch payee info to see if they have UPI
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
      alert("Payment request sent! The recipient must confirm it to update balances.");
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
    <div className="action-form" style={{ border: "none", padding: 0, background: "transparent" }}>
      <h3>Settle Up</h3>
      <p className="text-muted" style={{ fontSize: "0.9rem", marginBottom: "1.5rem" }}>Pay back what you owe.</p>

      <div className="input-group">
        <label className="input-label">Recipient Username</label>
        <input
          className="input-field"
          placeholder="johndoe"
          value={toUsername}
          onChange={(e) => setToUsername(e.target.value)}
        />
      </div>

      <div className="input-group">
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
        className="btn" 
        onClick={initiatePayment} 
        disabled={loading}
        style={{ background: "var(--success)", color: "white", marginBottom: "2rem" }}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {/* Pending Requests Section */}
      {pendingRequests.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h4 style={{ marginBottom: "1rem" }}>Pending Confirmations</h4>
          {pendingRequests.map(req => (
            <div key={req._id} style={{ background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "8px", marginBottom: "0.5rem", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span><strong>{req.from.username}</strong> paid you ₹{req.amount}</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn btn-success btn-sm" onClick={() => respondToRequest(req._id, "completed")}>Confirm Received</button>
                <button className="btn btn-outline btn-sm" onClick={() => respondToRequest(req._id, "declined")}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal using Portal */}
      {showQrModal && createPortal(
        <div className="group-detail-overlay fade-in">
          <div className="glass-panel group-detail-panel" style={{ maxWidth: "400px", textAlign: "center" }}>
            <h3 style={{ marginTop: 0 }}>Pay {toUsername}</h3>
            
            {payeeUpi ? (
              <>
                <p className="text-muted">Scan with any UPI app</p>
                <div style={{ background: "white", padding: "1rem", borderRadius: "1rem", display: "inline-block", marginBottom: "1.5rem" }}>
                  <img src={qrCodeUrl} alt="UPI QR Code" style={{ width: "200px", height: "200px" }} />
                </div>
                <p style={{ fontWeight: 600, fontSize: "1.2rem" }}>₹{amount}</p>
                <p className="text-muted" style={{ fontSize: "0.85rem" }}>UPI ID: {payeeUpi}</p>
              </>
            ) : (
              <div style={{ padding: "2rem 0" }}>
                <p>This user hasn't added a UPI ID.</p>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>Pay them directly via cash or other means.</p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1.5rem" }}>
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
