import { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart, FaExclamationTriangle, FaCheckCircle, FaSearch, FaTimes, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import React from "react";

// axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export default function Home() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [sort, setSort] = useState("name,asc");
  const [loading, setLoading] = useState(false);
const [bankNumber, setBankNumber] = useState("");
  const [bank, setBank] = useState(""); // menyimpan value seperti "Mandiri|123-456-7890"
  const [paymentMethod, setPaymentMethod] = useState(""); // COD atau Bank
// Tambahkan ini di bagian state (ganti bank menjadi bankName agar konsisten)
const [bankName, setBankName] = useState(""); // Bank yang dipilih jika paymentMethod = 'Transfer Bank'
const [orderPlaced, setOrderPlaced] = useState(false); // status pesanan sudah dibuat atau belum

  // modal state
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // checkout form
  const [userId, setUserId] = useState(1);
  const [receiverName, setReceiverName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  

  // error handling
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // search state
  const [searchActive, setSearchActive] = useState(false);

  // dummy image
  const foodImages = {
    1: "/Nasi Goreng Spesial.jpg",
    2: "/Mie Ayam Jamur.jpg",
    3: "/Sate Ayam.jpg",
    4: "/Gado Gado.jpg",
    5: "/Rendang Daging.jpg",
    6: "public/Ayam Bakar Taliwang.jpg",
    7: "public/soto ayam.jpeg",
    8: "public/bakso malang.jpeg",
    9: "public/nasi uduk.jpeg",
    10: "public/nasi campur.jpeg",
    11: "public/burger daging.jpeg",
    12: "public/Hotdog Keju.jpeg",
    13: "public/French Fries.jpeg",
    14: "public/Chicken Nugget.jpeg",
    15: "public/Pizza Mini.jpeg",
    16: "public/Fried Chicken.jpeg",
    17: "public/Cheese Stick.jpeg",
    18: "public/Onion Rings.jpeg",
    19: "public/Spaghetti Bolognese.jpeg",
    20: "public/Mozarella Burger.jpeg",
    21: "public/es campur.jpeg",
    22: "public/Pudding Cokelat.jpeg",
    23: "public/kue lapis.jpeg",
    24: "public/Brownies Kukus.jpeg",
    25: "public/es teler.jpeg",
    26: "public/kue cubit.jpeg",
    27: "public/Pancake.jpeg",
    28: "public/Donat Cokelat.jpeg",
    29: "public/Kue Soes.jpeg",
    30: "public/mochi.jpeg",
    31: "public/es teh manis.jpeg",
    32: "public/jus jeruk.jpeg",
    33: "public/kopi tubruk.jpeg",
    34: "public/es kopi susu.jpeg",
    35: "public/teh tarik.jpeg",
    36: "public/jus alpukat.jpeg",
    39: "public/Smoothies Strawberry.jpeg",
    40: "public/Milkshake Cokelat.jpeg",
    43: "public/dimsum mentai.jpeg",
    38: "public/air mineral.jpeg",
    37: "public/cappucino.jpeg",
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  // fetch kategori
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Gagal fetch kategori:", err.message);
        setCategories([]);
        setErrorMessage("Gagal memuat kategori makanan");
      }
    };
    fetchCategories();
  }, []);

  // fetch makanan
  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const params = { page, size: 8, sort };
        if (categoryId) params.categoryId = categoryId;
        if (search) params.search = search;

        const res = await api.get("/foods", { params });
        
        if (res.data && Array.isArray(res.data.content)) {
          setFoods(res.data.content);
          setTotalPages(res.data.totalPages || 1);
        } else if (Array.isArray(res.data)) {
          setFoods(res.data);
          setTotalPages(1);
        } else {
          setFoods([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Gagal fetch foods:", err.message);
        setFoods([]);
        setTotalPages(1);
        setErrorMessage("Gagal memuat daftar makanan");
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, [page, search, categoryId, sort]);

const addToCart = (food) => {
    const existing = cart.find((item) => item.food.id === food.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { food, quantity: 1, price: food.price }]); // <-- tambahkan price
    }
    setSuccessMessage(`${food.name} ditambahkan ke keranjang`);
};

  const removeFromCart = (foodId) => {
    const foodName = cart.find(item => item.food.id === foodId)?.food.name;
    setCart(cart.filter((item) => item.food.id !== foodId));
    setSuccessMessage(`${foodName} dihapus dari keranjang`);
  };

  const updateQuantity = (foodId, qty) => {
    setCart(
      cart.map((item) =>
        item.food.id === foodId ? { ...item, quantity: Math.max(1, qty) } : item
      )
    );
  };

// bagian hitung totalPrice
const totalPrice = cart.reduce(
  (sum, item) =>
    sum + (item.food.price ? item.food.price : 0) * (item.quantity ? item.quantity : 0),
  0
);
const handleCheckout = async () => {
  // Validasi input wajib
  if (!receiverName || !address || !paymentMethod) {
    alert("Mohon isi semua field wajib!");
    return;
  }
  if (paymentMethod === "Transfer Bank" && !bankName) {
    alert("Mohon pilih bank untuk pembayaran Transfer Bank!");
    return;
  }
  if (cart.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  setSaving(true);

  try {
    // Susun payload pesanan
    const orderPayload = {
      userId, // kirim userId ke backend
      receiverName,
      phone,
      address,
      city,
      note,
      paymentMethod,
      bankName: paymentMethod === "Transfer Bank" ? bankName : null,
      items: cart.map(item => ({
        foodId: item.food.id,
        quantity: item.quantity,
        price: item.food.price,
      })),
      totalPrice,
      orderDate: new Date().toISOString(),
    };

    // Kirim data ke backend
    const response = await axios.post("http://localhost:8080/api/orders", orderPayload);

    if (response.status === 201 || response.status === 200) {
      alert("Pesanan berhasil dibuat!");
      setCart([]);          // Kosongkan cart setelah checkout
      setCheckoutOpen(false);
      setReceiverName("");
      setPhone("");
      setAddress("");
      setCity("");
      setNote("");
      setPaymentMethod("");
      setBankName("");
    } else {
      alert("Terjadi kesalahan saat memproses pesanan.");
    }
  } catch (error) {
    console.error("Checkout error:", error);
    alert("Gagal melakukan checkout. Silakan coba lagi.");
  } finally {
    setSaving(false);
  }
};


  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Notification Messages */}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center justify-between w-96 shadow-lg z-50">
          <div className="flex items-center">
            <FaExclamationTriangle className="mr-2" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage("")} className="text-red-700 font-bold">×</button>
        </div>
      )}
      
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center justify-between w-96 shadow-lg z-50">
          <div className="flex items-center">
            <FaCheckCircle className="mr-2" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage("")} className="text-green-700 font-bold">×</button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {searchActive ? (
              <div className="flex items-center w-full">
                <button 
                  onClick={() => setSearchActive(false)}
                  className="mr-3 text-gray-600"
                >
                  <FaArrowLeft />
                </button>
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Cari makanan..."
                    className="w-full border border-orange-400 p-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(0);
                    }}
                    autoFocus
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  {search && (
                    <button 
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-3 text-gray-400"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center">
                  <div className="bg-orange-500 text-white p-2 rounded-full mr-3">
                    <FaShoppingCart />
                  </div>
                  <h1 className="text-2xl font-bold text-orange-500">ZharfaFood</h1>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSearchActive(true)}
                    className="p-2 text-gray-600 md:hidden"
                  >
                    <FaSearch />
                  </button>
                  <button
                    className="relative bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
                    onClick={() => setCartOpen(true)}
                  >
                    <FaShoppingCart className="text-lg" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-white text-orange-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {cart.reduce((a, b) => a + b.quantity, 0)}
                      </span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Top Video/Banner Section */}
      <div className="relative w-full h-68 md:h-[28rem] overflow-hidden bg-orange-50">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="/mixkit-ingredients-for-preparing-meat-balls-3800-hd-ready.mp4"
            type="video/mp4"
          />
          <source
            src="/mixkit-ingredients-for-preparing-meat-balls-3800-hd-ready.webm"
            type="video/webm"
          />
          Your browser does not support the video tag.
        </video>

        {/* Overlay text */}
        <div className="absolute inset-0 white bg-opacity-30 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              Selamat Datang di ZharfaFood
            </h1>
            <p className="text-lg md:text-2xl">
              Pesan makanan favorit Anda dengan mudah dan cepat
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar for Desktop */}
      <div className="bg-white py-4 shadow-md hidden md:block">
        <div className="container mx-auto px-4">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Cari makanan..."
              className="w-full border border-gray-300 p-3 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
            <FaSearch className="absolute left-4 top-4 text-gray-400" />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="absolute right-4 top-4 text-gray-400"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white py-4 shadow-sm sticky top-16 z-30 md:static">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto pb-2 space-x-4 hide-scrollbar">
            <button
              className={`whitespace-nowrap px-4 py-2 rounded-full ${!categoryId ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setCategoryId(null)}
            >
              Semua
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={`whitespace-nowrap px-4 py-2 rounded-full ${categoryId === c.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => {
                  setCategoryId(c.id);
                  setPage(0);
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end items-start z-50 p-4 md:items-center md:justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg mt-16 md:mt-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Keranjang Belanja</h2>
              <button onClick={() => setCartOpen(false)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaShoppingCart className="text-3xl text-gray-400" />
                </div>
                <p className="text-gray-500">Keranjang masih kosong</p>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.food.id}
                    className="flex justify-between items-center border-b pb-3"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{item.food.name}</p>
                      <p className="text-sm text-gray-500">
                        Rp {item.food.price.toLocaleString("id-ID")}
                      </p>
                      <div className="flex items-center mt-1">
                        <button
                          className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() =>
                            updateQuantity(item.food.id, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() =>
                            updateQuantity(item.food.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        Rp{" "}
                        {(item.food.price * item.quantity).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                      <button
                        className="text-red-500 text-sm hover:text-red-700 mt-1"
                        onClick={() => removeFromCart(item.food.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Ongkos Kirim:</span>
                  <span className="font-semibold">Rp 10,000</span>
                </div>
                <div className="flex justify-between mb-4 border-t pt-2">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-lg font-bold text-orange-500">
                    Rp {(totalPrice + 10000).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <button
                    className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300 flex-1"
                    onClick={() => setCartOpen(false)}
                  >
                    Lanjut Belanja
                  </button>
                  <button
                    className="bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 flex-1"
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
{/* Checkout Modal */}
{checkoutOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
    <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
        <button
          onClick={() => setCheckoutOpen(false)}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Nama Penerima */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">
          Nama Penerima: <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-orange-300 focus:border-orange-300 focus:outline-none"
          value={receiverName}
          onChange={(e) => setReceiverName(e.target.value)}
          placeholder="Masukkan nama penerima"
        />
      </div>

      {/* Nomor Telepon */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">Nomor Telepon:</label>
        <input
          type="text"
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-orange-300 focus:border-orange-300 focus:outline-none"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Masukkan nomor telepon"
        />
      </div>

      {/* Alamat */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">
          Alamat: <span className="text-red-500">*</span>
        </label>
        <textarea
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-orange-300 focus:border-orange-300 focus:outline-none resize-none"
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Masukkan alamat lengkap pengiriman"
        />
      </div>

      {/* Kota */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">Kota:</label>
        <input
          type="text"
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-orange-300 focus:border-orange-300 focus:outline-none"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Masukkan kota"
        />
      </div>

      {/* Maps Embed */}
      {(address || city) && (
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">Lokasi di Maps:</label>
          <iframe
            key={address + city}
            width="100%"
            height="250"
            className="border rounded-lg"
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${encodeURIComponent(address + ' ' + city)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          ></iframe>
        </div>
      )}

      {/* Catatan */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">Catatan:</label>
        <textarea
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-orange-300 focus:border-orange-300 focus:outline-none resize-none"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Catatan untuk pesanan (opsional)"
        ></textarea>
      </div>

      {/* Metode Pembayaran */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">
          Metode Pembayaran: <span className="text-red-500">*</span>
        </label>
        <select
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-orange-300 focus:border-orange-300 focus:outline-none"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="">-- Pilih Metode --</option>
          <option value="COD">COD (Bayar di tempat)</option>
          <option value="Transfer Bank">Transfer Bank</option>
        </select>
      </div>

      {/* Pilihan Bank */}
      {paymentMethod === "Transfer Bank" && (
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Pilih Bank: <span className="text-red-500">*</span>
          </label>
          <select
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-orange-300 focus:border-orange-300 focus:outline-none"
            value={bank}
            onChange={(e) => {
              setBank(e.target.value);
              const [name, number] = e.target.value.split("|");
              setBankName(name);
              setBankNumber(number);
            }}
          >
            <option value="">-- Pilih Bank --</option>
            <option value="Mandiri|123-456-7890">Mandiri (No. Rek: 123-456-7890)</option>
            <option value="BCA|987-654-3210">BCA (No. Rek: 987-654-3210)</option>
            <option value="BNI|111-222-3334">BNI (No. Rek: 111-222-3334)</option>
            <option value="BRI|555-666-7778">BRI (No. Rek: 555-666-7778)</option>
          </select>

          {bank && (
            <p className="mt-2 text-sm text-blue-600">
              Silahkan transfer ke <strong>{bankName}</strong> No. Rek <strong>{bankNumber}</strong> dalam waktu 5 menit.
            </p>
          )}
        </div>
      )}

      {/* Ringkasan Pesanan */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
        <p className="font-semibold mb-2 text-gray-700">Ringkasan Pesanan:</p>
        {cart.map(item => (
          <div key={item.food.id} className="flex justify-between text-sm mb-1 text-gray-800">
            <span>{item.food.name} x {item.quantity}</span>
            <span>Rp {(item.food.price * item.quantity).toLocaleString("id-ID")}</span>
          </div>
        ))}
        <div className="border-t mt-2 pt-2 font-bold flex justify-between text-gray-900">
          <span>Total:</span>
          <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
        </div>
      </div>

      {/* Tombol Batal & Pesan Sekarang */}
      <div className="flex justify-between gap-3">
        <button
          className="bg-gray-200 text-gray-800 px-5 py-3 rounded-lg hover:bg-gray-300 flex-1"
          onClick={() => setCheckoutOpen(false)}
          disabled={saving}
        >
          Batal
        </button>
        <button
          className="bg-orange-500 text-white px-5 py-3 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 flex-1 flex items-center justify-center"
          onClick={handleCheckout}
          disabled={
            saving ||
            !receiverName ||
            !address ||
            !paymentMethod ||
            (paymentMethod === "Transfer Bank" && (!bankName || !bankNumber)) ||
            cart.length === 0
          }
        >
          {saving ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          ) : "Pesan Sekarang"}
        </button>
      </div>
    </div>
  </div>
)}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Food List */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Menu Makanan</h2>
            <div className="relative">
              <select
                className="border p-2 pl-10 pr-8 rounded-lg w-full focus:ring-2 focus:ring-orange-300 focus:border-orange-300 focus:outline-none appearance-none bg-white"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(0);
                }}
              >
                <option value="name,asc">Nama A-Z</option>
                <option value="name,desc">Nama Z-A</option>
                <option value="price,asc">Harga Termurah</option>
                <option value="price,desc">Harga Termahal</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-40 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && foods.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaSearch className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">Tidak ada makanan yang ditemukan.</p>
              <p className="text-gray-400 mt-2">Coba kata kunci pencarian atau kategori yang berbeda.</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.isArray(foods) && foods.map((food) => (
              <div key={food.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={foodImages[food.id] || "/default.jpg"}
                    alt={food.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjM1ZW0iIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {food.category?.name}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-sm mb-1 text-gray-800 line-clamp-1">{food.name}</h3>
                  <p className="text-orange-500 font-semibold text-base mb-3">
                    Rp {food.price?.toLocaleString("id-ID")}
                  </p>
                  <button
                    className="w-full bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
                    onClick={() => addToCart(food)}
                  >
                    + Tambah
                  </button>
                </div>
              </div>
            ))}
          </div>
{/* Pagination - Very Simple Version (Always show first 4 pages) */}
{totalPages > 1 && (
  <div className="flex justify-center mt-8 gap-2">
    {/* Previous Button */}
    <button
      disabled={page === 0}
      onClick={() => setPage(page - 1)}
      className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors flex items-center"
    >
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Sebelumnya
    </button>

    {/* Always show first 4 pages or all pages if less than 4 */}
    {[...Array(Math.min(totalPages, 4)).keys()].map((num) => (
      <button
        key={num}
        onClick={() => setPage(num)}
        className={`px-4 py-2 border rounded-lg ${
          page === num ? "bg-orange-500 text-white" : "hover:bg-gray-100"
        } transition-colors min-w-[44px]`}
      >
        {num + 1}
      </button>
    ))}

    {/* Show ellipsis if there are more than 4 pages */}
    {totalPages > 4 && (
      <span className="px-2 py-2">...</span>
    )}

    {/* Next Button */}
    <button
      disabled={page === totalPages - 1}
      onClick={() => setPage(page + 1)}
      className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors flex items-center"
    >
      Selanjutnya
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
)}
        </div>


        {/* Riwayat Pesanan */}

<div className="md:hidden fixed bottom-4 right-4 z-30">
  <button
    className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
    onClick={() => navigate("/riwayat")}
    title="Lihat Riwayat Pesanan"
  >
    {/*Riwayat*/}

  </button>
</div>
      </main>
    </div>
  );
}