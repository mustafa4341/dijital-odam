# 🌌 Dijital Oda — Mustafa (Interactive 3D Portfolio)

Three.js kütüphanesi ve GLTF modelleme kullanılarak geliştirilmiş, tamamen kişiselleştirilmiş, interaktif ve sürükleyici bir **3D dijital portfolyo ve kişisel mekân** deneyimi. 

Bu proje, geleneksel 2D portfolyo sitelerinin ötesine geçerek ziyaretçilere Mustafa'nın dünyasını, projelerini, gelecek hedeflerini ve hatta kedisi Pixel'i keşfedebilecekleri yaşayan bir 3D oda deneyimi sunar.

---

## 🕹️ Kontroller & Gezinme

Oda içerisinde gezinmek ve etkileşime geçmek için aşağıdaki kontrolleri kullanabilirsiniz:
* **Sol Tık + Sürükle:** Odayı döndürün (Kamera açısını değiştirin)
* **Mouse Tekerleği (Scroll):** Yakınlaşın veya uzaklaşın
* **Sağ Tık + Sürükle:** Kamerayı kaydırın (Pan yapın)
* **WASD Tuşları:** Oda içinde serbestçe hareket edin
* **Çift Tıklama (Double Click):** Tıkladığınız nesneye kamerayı otomatik olarak odaklayın
* **Tek Tıklama:** Etkileşimli nesnelerle modal pencerelerini açın

---

## 🚀 Öne Çıkan Özellikler

### 1. 🖥️ Workstation (PC) Modalı
Odadaki bilgisayara tıklandığında açılan gelişmiş bir proje yönetim ve tanıtım panelidir. Mustafa'nın aktif ve tamamlanmış projelerini tüm teknik detaylarıyla sergiler:
* **🌱 FarmLog:** Yapay zekâ destekli akıllı tarım yönetim sistemi (ML, XGBoost, Prophet, Go, Flutter).
* **🎬 Magic Stream:** Go ve MongoDB altyapısıyla hazırlanmış full-stack film keşif platformu.
* **🔗 Zinciri Kırma:** Veri odaklı alışkanlık takip uygulaması (Go, PostgreSQL, Python, AI).
* **📖 AI Okuma ve Konuşma:** Supabase entegrasyonlu ve ses işleme özellikli İngilizce dil öğrenme platformu.
* **📊 Küçük İşletme Talep Tahmincisi:** Satış ve talep tahmini yapan makine öğrenmesi aracı (Python, Prophet, XGBoost).
* **Teknoloji Filtreleme & Hızlı Linkler:** GitHub, LinkedIn ve e-posta adreslerine doğrudan erişim.

### 2. 🤖 Mustafa'nın AI Asistanı
Ziyaretçilerin Mustafa hakkında merak ettikleri soruları (teknolojiler, hedefler, günlük rutin, kedisi Pixel vb.) yapay zekâya sorabileceği entegre bir chatbot arayüzü. Kolay etkileşim için hazır öneri butonları içerir.

### 3. 📟 Retro Terminal Modalı
Nostaljik bir görünüme sahip, işlevsel komut satırı simülatörü. Ziyaretçiler terminal komutları yazarak gizli özellikleri ve bilgileri tetikleyebilir:
* `help`: Kullanılabilir komutları listeler.
* `whoami`: Mustafa'nın kısa bir tanıtımını yazar.
* `cat pixel`: Mustafa'nın sevimli kedisi Pixel hakkında komik bilgileri gösterir.
* `sudo`: Eğlenceli bir erişim izni uyarısı tetikler.

### 4. 🌌 Gelecek Hedefleri (Yatak Modalı)
Odadaki yatağa tıklandığında açılan, arka planında hareketli yıldızlar ve kayan yıldız animasyonları barındıran özel bir vizyon alanı. 2026'dan 2030 yılına kadar uzanan kariyer ve yaşam hedeflerini şık bir zaman çizgisi (timeline) ile sunar.

### 5. 🔊 İnteraktif Ses Efektleri
Etkileşimi güçlendiren ses tasarımları:
* Arka planda çalınabilen Barış Manço - Yaz Dostum parçası.
* Kediye tıklandığında miyavlama efekti.
* Penguene tıklandığında eğlenceli penguen sesleri.

### 6. 🎨 Premium Görsel Tasarım (Glassmorphism & Neon)
* **Glassmorphism:** Yarı şeffaf, bulanık arka planlı cam pencerelerle modern bir görünüm.
* **Dinamik Yükleme Ekranı:** Özel SVG oda çizgileri ve yüzdesel yükleme barı ile kusursuz yükleme akışı.
* **Neon Efektleri & Animasyonlar:** Dikkat çekici hover animasyonları ve parlayan interaktif nesneler.

---

## 🤖 Yapay Zekâ (Gemini AI) Entegrasyonu & Kullanımı

Projede yer alan **Mustafa'nın AI Asistanı**, Google'ın güçlü yapay zekâ modeli olan **Gemini 2.5 Flash** API'si ile doğrudan entegre çalışır. Ziyaretçilerin Mustafa hakkında sorduğu sorulara anlık ve anlamlı yanıtlar üretilmesini sağlar.

### ⚙️ Çalışma Mantığı ve Teknik Yapı:
* **Client-Side İstekler:** Yapay zekâ sorguları, tarayıcı üzerinden doğrudan Google Generative Language API (`https://generativelanguage.googleapis.com`) uç noktasına (`generateContent`) gönderilir.
* **Sistem Promptu (System Instruction):** AI asistanının karakteri, davranış biçimi ve Mustafa hakkındaki tüm veriler (bildiği diller, projeleri, doğa yürüyüşü ve kamp hobileri, kedisi Pixel vb.) [js/config.js](file:///c:/Users/mmust/Desktop/internet%20proje/js/config.js) dosyasındaki sistem promptu ile önceden tanımlanmıştır. Asistan bu talimatlar doğrultusunda konuşur.
* **Dinamik Ayarlar ve LocalStorage:**
  * Geliştiriciler veya kullanıcılar, sohbet penceresindeki ayarlar panelini kullanarak kendi **Gemini API Anahtarını** ve **Sistem Talimatlarını** dinamik olarak güncelleyebilir.
  * Yapılan bu güncellemeler tarayıcının `localStorage` (yerel depolama) alanında (`gemini_api_key` ve `gemini_system_prompt` anahtarları altında) kalıcı olarak saklanır, böylece sayfa tekrar açıldığında ayarlar korunmuş olur.

---

## 🛠️ Kullanılan Teknolojiler

* **3D Grafik:** Three.js (WebGL 3D engine) & GLTFLoader
* **Arayüz (Frontend):** Modern HTML5, Vanilla JavaScript (ES6+ Modules)
* **Stil & Animasyon:** CSS3 (Cam efekti, Grid/Flexbox, Keyframes animasyonları, Responsive tasarım)
* **Paket Yönetimi & Sunucu:** Node.js, `http-server`

---

## 💻 Yerel Çalıştırma

Projeyi bilgisayarınızda yerel olarak çalıştırmak için:

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/mustafa4341/dijital-odam.git
   cd dijital-odam
   ```

2. Gerekli paketleri kurun ve geliştirici sunucusunu başlatın:
   ```bash
   npm install
   npm run dev
   ```

3. Tarayıcınızdan `http://localhost:8085` adresini açarak odada gezinebilirsiniz!
