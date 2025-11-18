import React, { useState } from 'react';
import { Ticket, Armchair, CheckCircle } from 'lucide-react';

const TicketBookingSystem = () => {
  // Zal o'lchamlari: 8 qator, har birida 10 joy
  const ROWS = 8;
  const SEATS_PER_ROW = 10;
  const SEAT_PRICE = 50000; // har bir joy narxi (so'm)
  
  // State: tanlangan joylar va sotilgan joylar
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [soldSeats, setSoldSeats] = useState(['3-4', '3-5', '4-5', '4-6', '5-5']); // Demo uchun ba'zi joylar sotilgan
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Foydalanuvchi ma'lumotlari
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [errors, setErrors] = useState({});

  // Joy holati: bo'sh, tanlangan yoki sotilgan
  const getSeatStatus = (row, seat) => {
    const seatId = `${row}-${seat}`;
    if (soldSeats.includes(seatId)) return 'sold';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  // Joyni tanlash/bekor qilish
  const toggleSeat = (row, seat) => {
    const seatId = `${row}-${seat}`;
    
    // Agar joy sotilgan bo'lsa, tanlab bo'lmaydi
    if (soldSeats.includes(seatId)) return;
    
    if (selectedSeats.includes(seatId)) {
      // Joyni olib tashlash
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      // Joyni qo'shish
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // Umumiy narxni hisoblash
  const totalPrice = selectedSeats.length * SEAT_PRICE;

  // Karta raqamini formatlash (4 ta raqamdan keyin bo'sh joy)
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g);
    return formatted ? formatted.join(' ') : cleaned;
  };

  // Karta raqamini o'zgartirish
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(formatCardNumber(value));
  };

  // Ma'lumotlarni tekshirish
  const validateForm = () => {
    const newErrors = {};
    
    // Ism tekshirish
    if (!fullName.trim()) {
      newErrors.fullName = "Ism va familiyani kiriting";
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = "Ism kamida 3 ta harfdan iborat bo'lishi kerak";
    }
    
    // Yosh tekshirish
    if (!age) {
      newErrors.age = "Yoshni kiriting";
    } else if (parseInt(age) < 18) {
      newErrors.age = "18 yoshdan kichik bo'lsa chipta sotib olish mumkin emas!";
    } else if (parseInt(age) > 120) {
      newErrors.age = "Yoshni to'g'ri kiriting";
    }
    
    // Karta raqami tekshirish
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (!cleanCard) {
      newErrors.cardNumber = "Karta raqamini kiriting";
    } else if (cleanCard.length !== 16) {
      newErrors.cardNumber = "Karta raqami 16 ta raqamdan iborat bo'lishi kerak";
    }
    
    // Joylar tekshirish
    if (selectedSeats.length === 0) {
      newErrors.seats = "Kamida bitta joy tanlang";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Buyurtma berish
  const handleBooking = () => {
    if (validateForm()) {
      setSoldSeats([...soldSeats, ...selectedSeats]);
      setShowConfirmation(true);
      
      // Ma'lumotlarni tozalash
      setSelectedSeats([]);
      setFullName('');
      setAge('');
      setCardNumber('');
      setErrors({});
      
      // 4 sekunddan keyin xabarni yashirish
      setTimeout(() => setShowConfirmation(false), 4000);
    }
  };

  // Joy rang va uslubini aniqlash
  const getSeatStyle = (status) => {
    const baseStyle = "w-8 h-8 m-1 rounded-t-lg cursor-pointer transition-all duration-200 flex items-center justify-center text-xs font-bold";
    
    switch(status) {
      case 'sold':
        return `${baseStyle} bg-red-500 text-white cursor-not-allowed opacity-60`;
      case 'selected':
        return `${baseStyle} bg-green-500 text-white shadow-lg scale-110`;
      default:
        return `${baseStyle} bg-blue-400 text-white hover:bg-blue-500 hover:scale-105`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Sarlavha */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Ticket className="w-10 h-10 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">Chipta Sotib Olish Tizimi</h1>
          </div>
          <p className="text-purple-200">Kino yoki Konsert</p>
        </div>

        {/* Ekran */}
        <div className="mb-8">
          <div className="bg-gradient-to-b from-gray-300 to-gray-400 h-3 rounded-t-lg shadow-2xl mx-auto w-3/4"></div>
          <p className="text-center text-white mt-2 font-semibold">EKRAN / SAHNA</p>
        </div>

        {/* Zalning interaktiv xaritasi */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {Array.from({ length: ROWS }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex items-center justify-center mb-2">
                  {/* Qator raqami */}
                  <span className="text-white font-bold w-8 text-center">{rowIndex + 1}</span>
                  
                  {/* Joylar */}
                  <div className="flex">
                    {Array.from({ length: SEATS_PER_ROW }).map((_, seatIndex) => {
                      const status = getSeatStatus(rowIndex + 1, seatIndex + 1);
                      return (
                        <button
                          key={seatIndex}
                          onClick={() => toggleSeat(rowIndex + 1, seatIndex + 1)}
                          className={getSeatStyle(status)}
                          disabled={status === 'sold'}
                          title={`Qator ${rowIndex + 1}, Joy ${seatIndex + 1}`}
                        >
                          <Armchair className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Qator raqami (o'ng tomon) */}
                  <span className="text-white font-bold w-8 text-center">{rowIndex + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Izoh */}
          <div className="flex justify-center gap-6 mt-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-400 rounded-t-lg"></div>
              <span className="text-white">Bo'sh</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-t-lg"></div>
              <span className="text-white">Tanlangan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded-t-lg opacity-60"></div>
              <span className="text-white">Sotilgan</span>
            </div>
          </div>
        </div>

        {/* Ma'lumot va to'lov paneli */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          {/* Foydalanuvchi ma'lumotlari formasi */}
          <div className="mb-6 border-b border-gray-200 pb-6">
            <h3 className="text-xl font-bold mb-4 text-purple-900">Shaxsiy ma'lumotlar</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Ism */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ism va Familiya *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Akmal Karimov"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.fullName 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-purple-500'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Yosh */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Yosh (18+) *
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                  min="18"
                  max="120"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.age 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-purple-500'
                  }`}
                />
                {errors.age && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">{errors.age}</p>
                )}
              </div>

              {/* Karta raqami */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Karta raqami *
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="8600 1234 5678 9012"
                  maxLength="19"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 font-mono ${
                    errors.cardNumber 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-purple-500'
                  }`}
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                )}
              </div>
            </div>
            {errors.seats && (
              <p className="text-red-500 text-sm mt-3 font-semibold">{errors.seats}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Tanlangan joylar */}
            <div>
              <h3 className="text-xl font-bold mb-3 text-purple-900">Tanlangan joylar</h3>
              {selectedSeats.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map(seat => (
                    <span key={seat} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Qator {seat.split('-')[0]}, Joy {seat.split('-')[1]}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Hech qanday joy tanlanmagan</p>
              )}
            </div>

            {/* Narx ma'lumoti */}
            <div>
              <h3 className="text-xl font-bold mb-3 text-purple-900">Umumiy narx</h3>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Joylar soni:</span>
                  <span className="font-bold text-purple-900">{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Joy narxi:</span>
                  <span className="font-bold text-purple-900">{SEAT_PRICE.toLocaleString()} so'm</span>
                </div>
                <div className="border-t border-purple-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-lg text-purple-900">Jami:</span>
                    <span className="font-bold text-2xl text-purple-900">{totalPrice.toLocaleString()} so'm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buyurtma tugmasi */}
          <button
            onClick={handleBooking}
            className="w-full mt-6 py-4 rounded-lg font-bold text-lg transition-all duration-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Buyurtma berish
          </button>
        </div>

        {/* Tasdiqlash xabari */}
        {showConfirmation && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-bounce">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-bold">Buyurtma muvaffaqiyatli bajarildi!</p>
              <p className="text-sm text-green-100">Chiptalaringiz sotib olindi</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketBookingSystem;
