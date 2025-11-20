package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"
)

// --- STRUKTUR DATA ---

// Data Reservasi
type Reservation struct {
	Name    string    `json:"name"`
	Email   string    `json:"email"`
	Number  string    `json:"number"`
	Message string    `json:"message"`
	Date    time.Time `json:"date"` // Kita gunakan format waktu Go yang benar
}

// Data untuk Login
type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// --- DATABASE SEMENTARA (IN-MEMORY) ---
var (
	reservations []Reservation
	mutex        sync.Mutex // Agar aman saat diakses banyak orang bersamaan (Concurrency safe)
)

func main() {
	// 1. Serve File Statis (HTML, CSS, JS, Gambar)
	fs := http.FileServer(http.Dir("./"))
	http.Handle("/", fs)

	// 2. API Endpoints
	http.HandleFunc("/api/booking", handleBooking)                               // Untuk user umum booking
	http.HandleFunc("/api/login", handleLogin)                                   // Untuk admin login
	http.HandleFunc("/api/admin/reservations", adminMiddleware(getReservations)) // Data khusus admin (dilindungi)

	fmt.Println("Server berjalan di http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// --- HANDLERS ---

// 1. Handle Booking (User Mengirim Data)
func handleBooking(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var newRes Reservation
	// Decode data JSON dari frontend
	err := json.NewDecoder(r.Body).Decode(&newRes)
	if err != nil {
		http.Error(w, "Data tidak valid", http.StatusBadRequest)
		return
	}

	// Set waktu server saat ini
	newRes.Date = time.Now()

	// Simpan ke database (pakai mutex biar aman dari race condition)
	mutex.Lock()
	reservations = append(reservations, newRes)
	mutex.Unlock()

	// Kirim respon sukses
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Reservasi berhasil disimpan"})
}

// 2. Handle Login (Cek Password)
func handleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		http.Error(w, "Input salah", http.StatusBadRequest)
		return
	}

	// LOGIKA VALIDASI LOGIN
	if creds.Username == "admin" && creds.Password == "nafandra123" {
		// Jika benar, kita beri "Cookie" sebagai tanda pengenal
		expiration := time.Now().Add(1 * time.Hour) // Login berlaku 1 jam
		cookie := http.Cookie{
			Name:    "session_token",
			Value:   "admin-sudah-login-rahasia",
			Expires: expiration,
			Path:    "/", // Berlaku untuk semua halaman
		}
		http.SetCookie(w, &cookie)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Login berhasil"})
	} else {
		http.Error(w, "Username atau Password salah!", http.StatusUnauthorized)
	}
}

// 3. Get Reservations (Mengambil Data - Hanya Admin)
func getReservations(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	mutex.Lock()
	defer mutex.Unlock()

	json.NewEncoder(w).Encode(reservations)
}

// --- MIDDLEWARE (Satpam) ---
// Fungsi ini bertugas mencegat request ke halaman admin.
// Jika tidak punya cookie login, ditolak.
func adminMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Cek apakah ada cookie "session_token"
		c, err := r.Cookie("session_token")
		if err != nil || c.Value != "admin-sudah-login-rahasia" {
			http.Error(w, "Akses Ditolak: Anda harus login dulu", http.StatusUnauthorized)
			return
		}
		// Jika lolos, lanjut ke handler asli
		next(w, r)
	}
}
