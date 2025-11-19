import React, { useState, useEffect } from "react";

export default function App() {
  const rows = 5;
  const cols = 8;
  const seatPrice = 50000; // 50 ming so'm

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  const [cardNumber, setCardNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load from localStorage
  useEffect(() => {
    const booked = JSON.parse(localStorage.getItem("bookedSeats")) || [];
    const selected = JSON.parse(localStorage.getItem("selectedSeats")) || [];
    setBookedSeats(booked);
    setSelectedSeats(selected);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
  }, [selectedSeats]);

  const toggleSeat = (id) => {
    if (bookedSeats.includes(id)) return;

    setSelectedSeats((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  const handleOrder = () => {
    setError("");
    setSuccess("");

    if (!cardNumber || !fullName || !age) {
      setError("Iltimos barcha maydonlarni to'ldiring.");
      return;
    }

    if (age < 18) {
      setError("Chipta olish uchun kamida 18 yosh bo'lishi shart.");
      return;
    }

    if (selectedSeats.length === 0) {
      setError("Hech qanday joy tanlanmagan.");
      return;
    }

    const updated = [...bookedSeats, ...selectedSeats];

    setBookedSeats(updated);
    localStorage.setItem("bookedSeats", JSON.stringify(updated));

    setSelectedSeats([]);
    localStorage.removeItem("selectedSeats");

    setSuccess("Buyurtma muvaffaqiyatli amalga oshirildi!");
  };

  return (
    <div style={{ padding: 30, maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Chipta Sotib Olish Tizimi</h1>

      {/* SEAT MAP */}
      <div style={{ marginTop: 20 }}>
        {[...Array(rows)].map((_, r) => (
          <div key={r} style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {[...Array(cols)].map((_, c) => {
              const id = `${r}-${c}`;
              const booked = bookedSeats.includes(id);
              const selected = selectedSeats.includes(id);

              return (
                <button
                  key={id}
                  onClick={() => toggleSeat(id)}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 6,
                    border: "1px solid black",
                    background: booked ? "gray" : selected ? "dodgerblue" : "white",
                    color: booked || selected ? "white" : "black",
                    cursor: booked ? "not-allowed" : "pointer",
                  }}
                >
                  {c + 1}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Price */}
      <h2 style={{ textAlign: "center", marginTop: 20 }}>
        Umumiy narx: {selectedSeats.length * seatPrice} so'm
      </h2>

      {/* Payment Form */}
      <div style={{ background: "#f2f2f2", padding: 20, borderRadius: 10, marginTop: 20 }}>
        <h3>To'lov ma'lumotlari</h3>

        <input
          type="text"
          placeholder="Karta raqami"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 10 }}
        />

        <input
          type="text"
          placeholder="To'liq ismingiz"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 10 }}
        />

        <input
          type="number"
          placeholder="Yosh (18+)"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 10 }}
        />

        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
        {success && <p style={{ color: "green", marginTop: 10 }}>{success}</p>}

        <button
          onClick={handleOrder}
          style={{
            width: "100%",
            marginTop: 15,
            background: "dodgerblue",
            padding: 12,
            borderRadius: 8,
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Buyurtma Berish
        </button>
      </div>
    </div>
  );
}
