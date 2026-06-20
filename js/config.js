// ── STATIC CONFIGURATIONS AND DATA ──────────────────

export const systemInstructionText = `
Sen Mustafa'nın 3D interaktif dijital odasındaki yapay zekâ asistanısın. Ziyaretçilerin Mustafa hakkında bilgi edinmelerine yardımcı oluyorsun.
Mustafa hakkında bilgiler:
- Kimdir: Bilgisayar mühendisliği / yazılım alanında veri bilimi ve veri mühendisliği odaklı hevesli bir geliştirici.
- Teknolojileri & Odak Noktası: 
  - Veri Bilimi & Veri Mühendisliği: Python (Pandas, NumPy, Scikit-learn, XGBoost, Prophet ile zaman serisi tahmini).
  - Backend & Veritabanı: Go (Golang) ve MongoDB ile ölçeklenebilir backend mimarileri.
  - Mobil Geliştirme: React Native (mobil arayüzler) ve Flutter.
  - Web Temelleri: HTML5, CSS3, JavaScript.
- Kedisi: Adı Pixel. Odanın asıl sahibi olduğunu iddia eden tatlı bir kedi. Bug avlamayı ve miyavlamayı sever.
- Hobilere / Dış Dünyaya Kaçış: 
  - Doğayı ve kamp yapmayı çok sever. Kocaeli ve Balıkesir yaylalarında kamp yapar.
  - Nüzhetiye Şelalesi ve Serindere gibi zorlu rotalarda trekking yapar.
  - Motosiklet sürmeyi sever, iki teker üzerinde yeni yollar keşfeder.
- İlgi alanları: Lo-Fi, Synthwave ve Klasik müzik dinler. Barış Manço'nun büyük bir hayranıdır ve onun hümanist felsefesini benimser. Türk Bayrağına büyük değer verir.
- Gelecek hedefleri: Kendi SaaS yapay zekâ mikro girişimlerini kurma hayali var.
- Açık Kaynak: Linux (Tux) ve terminal komutlarını sever. GitHub hesabı: https://github.com/mustafa4341

Sorulan sorulara samimi, bilgilendirici ve Türkçe yanıtlar ver. Yanıtlarını kısa ve temiz tut (en fazla 2-3 paragraf). Mustafa hakkında konuşurken üçüncü şahıs ("Mustafa...") olarak bahset.
`;

export const interactiveData = {
    'kedi': {
        icon: '🐱',
        title: 'Pixel',
        body: `
        <div style="text-align:center;">
            <p style="font-size: 1.1rem; font-weight: 500; color: #a78bfa; margin-bottom: 4px;">Pixel</p>
            <p style="font-size: 0.85rem; font-style: italic; color: var(--text-muted); margin-bottom: 16px;">Odanın gerçek sahibi.</p>
            <div style="display:flex; justify-content:space-around; background:rgba(255,255,255,0.02); border:1px solid var(--border-glass); border-radius:12px; padding:12px; margin-bottom:16px;">
                <div>
                    <span style="font-size:0.75rem; display:block; color:var(--text-muted); margin-bottom:4px;">Bug Avlandı</span>
                    <strong id="cat-bugs" style="font-size:1.4rem; color:#6ee7b7; font-family:var(--font-display);">47</strong>
                </div>
                <div style="border-left:1px solid rgba(255,255,255,0.08); padding-left:24px;">
                    <span style="font-size:0.75rem; display:block; color:var(--text-muted); margin-bottom:4px;">Miyav Sayısı</span>
                    <strong id="cat-meows" style="font-size:1.4rem; color:#4f8ef7; font-family:var(--font-display);">829</strong>
                </div>
            </div>
            <div class="cat-quote-box" id="cat-quote">"Miyav! Konsoldaki hatayı gördüm ama düzeltmeyeceğim, o senin işin."</div>
            <button class="cat-btn" id="cat-btn">🎲 Yeni Söz</button>
        </div>`
    },
    'hoparlor': {
        icon: '🔊',
        title: 'Müzik Dünyam (Spotify)',
        body: `
        <div>
            <p style="margin-bottom: 12px;">Müzik, Mustafa'nın kod yazarken odaklanmasını sağlayan en önemli yakıttır.</p>
            
            <div id="spotify-live-container" style="display:flex; align-items:center; gap:12px; background:rgba(30,215,96,0.08); border:1px solid rgba(30,215,96,0.25); border-radius:14px; padding:12px; margin-bottom:16px;">
                <span class="pulse-dot" style="background:#1ed760; box-shadow:0 0 10px #1ed760; width:8px; height:8px; flex-shrink:0;"></span>
                <div style="flex:1; min-width:0; text-align:left;">
                    <span style="font-size:0.7rem; display:block; color:#1ed760; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:2px;">Spotify Çalma Durumu</span>
                    <strong id="spotify-track-name" style="font-size:0.85rem; color:#fff; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Müzik Yükleniyor...</strong>
                    <span id="spotify-artist-name" style="font-size:0.78rem; color:var(--text-secondary); display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Spotify API aranıyor...</span>
                </div>
                <span style="font-size:1.5rem; color:#1ed760; margin-left:auto;"></span>
            </div>

            <div class="speaker-genres">
                <div class="genre-card active" data-genre="lofi">
                    <span class="genre-icon">🎧</span>
                    <span class="genre-name">Lo-fi</span>
                </div>
                <div class="genre-card" data-genre="my_list">
                    <span class="genre-icon">🎸</span>
                    <span class="genre-name">Benim Listem</span>
                </div>
                <div class="genre-card" data-genre="classical">
                    <span class="genre-icon">🎹</span>
                    <span class="genre-name">Klasik</span>
                </div>
            </div>
            
            <div id="spotify-embed-container" style="margin-top:16px; border-radius:12px; overflow:hidden; border:1px solid var(--border-glass); height:152px;">
                <iframe id="spotify-iframe" src="https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
        </div>`
    },
    'yatak': {
        icon: '🛏️',
        title: 'Gelecek Hedefleri',
        body: `
        <div>
            <p style="margin-bottom: 20px;">Uykunun ve hayallerin birleştiği yer. Mustafa'nın gelecek için çizdiği yol haritası:</p>
            <div class="timeline-list">
                <div class="timeline-item">
                    <div class="timeline-year">2026</div>
                    <div class="timeline-desc">Veri ve yapay zekâ temelleri. Python ekosisteminin (Pandas, Numpy) derinlemesine öğrenilmesi ve ilk veri odaklı projeler.</div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-year">2027</div>
                    <div class="timeline-desc">Machine Learning ve Derin Öğrenme modelleri geliştirme. NLP ve Görüntü İşleme üzerine pratik uygulamalar.</div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-year">2028</div>
                    <div class="timeline-desc">Kendi SaaS yapay zekâ mikro girişimimi hayata geçirme. Bağımsız geliştirici (Indie Hacker) olarak küresel projeler yayınlama.</div>
                </div>
            </div>
        </div>`
    },
    'gaz_lambasi': {
        icon: '🏮',
        title: 'İlham Kaynaklarım',
        body: `
        <div>
            <p style="font-style: italic; color: #f0f0f5; background: rgba(255,255,255,0.02); border-left: 3px solid #7a5cff; padding: 12px; margin-bottom: 20px; border-radius: 4px; line-height:1.5;">
                "Karanlığı aydınlatmak için tek bir kıvılcım yeterlidir. En büyük ilham, bilginin kendisidir."
            </p>
            <h3 style="font-family:var(--font-display); font-size:1rem; color:#fff; margin-bottom:10px;">Bana İlham Verenler</h3>
            <ul style="display:flex; flex-direction:column; gap:8px;">
                <li style="padding:10px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:8px; line-height:1.5;">
                    <strong>Mustafa Kemal Atatürk</strong> — Bilim, sanat ve çağdaşlık yolundaki vizyonuyla en büyük rehberim.
                </li>
                <li style="padding:10px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:8px; line-height:1.5;">
                    <strong>Alan Turing</strong> — Bilgisayar biliminin babası, sınırları zorlamanın ve analitik zekânın sembolü.
                </li>
                <li style="padding:10px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:8px; line-height:1.5;">
                    <strong>Richard Feynman</strong> — Karmaşık konuları en basit şekilde anlatma sanatı ve bilime olan merakı.
                </li>
            </ul>
        </div>`
    },
    'pencere': {
        icon: '🪟',
        title: 'Geleceğe Bakış',
        body: `
        <div>
            <p style="margin-bottom:16px;">Pencereden dışarı bakmak, sınırların ötesini düşünmektir. Mustafa'nın küresel hedefleri:</p>
            <div style="margin-bottom:18px;">
                <h4 style="color:#fff; font-size:0.9rem; margin-bottom:8px; display:flex; align-items:center; gap:6px;">✈️ Gitmek İstediğim Şehirler</h4>
                <div style="display:flex; gap:8px;">
                    <span style="background:rgba(79,142,247,0.1); border:1px solid rgba(79,142,247,0.2); padding:4px 10px; border-radius:12px; font-size:0.8rem; color:#4f8ef7; font-weight:500;">Tokyo</span>
                    <span style="background:rgba(79,142,247,0.1); border:1px solid rgba(79,142,247,0.2); padding:4px 10px; border-radius:12px; font-size:0.8rem; color:#4f8ef7; font-weight:500;">San Francisco</span>
                    <span style="background:rgba(79,142,247,0.1); border:1px solid rgba(79,142,247,0.2); padding:4px 10px; border-radius:12px; font-size:0.8rem; color:#4f8ef7; font-weight:500;">Amsterdam</span>
                </div>
            </div>
            <div>
                <h4 style="color:#fff; font-size:0.9rem; margin-bottom:8px; display:flex; align-items:center; gap:6px;">🏢 Çalışmak İstediğim Şirketler</h4>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <span style="background:rgba(110,231,183,0.1); border:1px solid rgba(110,231,183,0.2); padding:4px 10px; border-radius:12px; font-size:0.8rem; color:#6ee7b7; font-weight:500;">Google</span>
                    <span style="background:rgba(110,231,183,0.1); border:1px solid rgba(110,231,183,0.2); padding:4px 10px; border-radius:12px; font-size:0.8rem; color:#6ee7b7; font-weight:500;">OpenAI</span>
                    <span style="background:rgba(110,231,183,0.1); border:1px solid rgba(110,231,183,0.2); padding:4px 10px; border-radius:12px; font-size:0.8rem; color:#6ee7b7; font-weight:500;">Stripe</span>
                </div>
            </div>
        </div>`
    },
    'kaktus': {
        icon: '🌵',
        title: 'Dayanıklılık',
        body: `
        <div>
            <p style="margin-bottom:16px;">Kaktüs, en zorlu şartlarda dahi susuz ve ayakta kalabilen bir dayanıklılık sembolüdür. Kodlama yolculuğundaki hatalar ve dersler:</p>
            <div style="background:rgba(253,164,175,0.05); border:1px solid rgba(253,164,175,0.1); border-radius:12px; padding:14px; margin-bottom:16px;">
                <h4 style="color:#fda4af; font-size:0.88rem; margin-bottom:6px; display:flex; align-items:center; gap:6px;">⚠️ Çıkarılan Dersler (Failures & Lessons)</h4>
                <p style="font-size:0.85rem; line-height:1.5; color:var(--text-secondary); margin-bottom:0;">
                    "Birçok projem derleme hataları, API limitleri veya yanlış mantıksal kurgular yüzünden yarıda kaldı. Ancak öğrendim ki, her başarısız proje, bir sonraki başarılı projenin çimentosudur."
                </p>
            </div>
            <ul style="font-size:0.88rem;">
                <li>🌵 <strong>En Önemli Kural:</strong> Hızlı başarısız ol (Fail Fast), hatayı erken yakala ve asla denemekten vazgeçme.</li>
            </ul>
        </div>`
    },
    'dunya': {
        icon: '🌍',
        title: 'Doğaya Kaçış',
        body: `
        <div>
            <p style="margin-bottom: 14px;">Sürekli ekran başında değilim! Kodlardan uzaklaştığımda doğaya karışmayı seviyorum.</p>
            <ul style="display:flex; flex-direction:column; gap:10px;">
                <li>🏕️ <strong>Kamp Hayatı:</strong> Kocaeli ve Balıkesir yaylalarında doğa kampları yapmak.</li>
                <li>🥾 <strong>Trekking:</strong> Nüzhetiye Şelalesi ve Serindere gibi zorlu trekking rotalarını aşmak.</li>
                <li>🏍️ <strong>Motosiklet:</strong> İki teker üzerinde yeni yollar keşfetmek, rüzgarı hissetmek.</li>
            </ul>
        </div>`
    },
    'kahve': {
        icon: '☕',
        title: 'Günlük Rutin',
        body: `
        <div>
            <p style="margin-bottom:16px;">Kahve fincanım, Mustafa'nın kod ve günlük enerji döngüsünün yakıtıdır. Günlük dengeler:</p>
            
            <div class="progress-stat">
                <div class="stat-header"><span>☕ Kahve Tüketimi</span><span>6 / 8 Bardak</span></div>
                <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: 75%;"></div></div>
            </div>
            
            <div class="progress-stat">
                <div class="stat-header"><span>💻 Kodlama Süresi</span><span>7 / 8 Saat</span></div>
                <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: 87.5%; background:#7a5cff;"></div></div>
            </div>
            
            <div class="progress-stat">
                <div class="stat-header"><span>💤 Uyku Süresi</span><span>4 / 8 Saat</span></div>
                <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: 50%; background:#fda4af;"></div></div>
            </div>
            
            <p style="font-size:0.8rem; color:var(--text-muted); text-align:center; margin-top:12px;">"Kahve girer, kod çıkar. 🚀"</p>
        </div>`
    },
    'logolar': {
        icon: '⚙️',
        title: 'Teknoloji Yığınım & Odak Noktam',
        body: `
        <div>
            <p style="margin-bottom: 14px;">Genel yazılım geliştirmenin ötesinde, asıl tutkum <strong>Veri Bilimi ve Veri Mühendisliği</strong>.</p>
            <ul style="display:flex; flex-direction:column; gap:10px;">
                <li>🐍 <strong>Python:</strong> Makine öğrenmesi (XGBoost, Prophet), veri analizi ve AI entegrasyonları.</li>
                <li>🐹 <strong>Go & MongoDB:</strong> Güçlü, hızlı ve ölçeklenebilir backend mimarileri.</li>
                <li>⚛️ <strong>React Native:</strong> Fikirleri kullanıcıyla buluşturan modern mobil arayüzler.</li>
            </ul>
        </div>`
    },
    'penguen': {
        icon: '🐧',
        title: 'Sistem & Açık Kaynak',
        body: `
        <div>
            <p style="margin-bottom: 12px;">Sadece kod yazmayı değil, kodun üzerinde çalıştığı sistemleri anlamayı ve yönetmeyi de seviyorum.</p>
            <p style="margin-bottom: 14px;">IT destek süreçlerinden sunucu yapılandırmalarına kadar işin mutfağında olmak, açık kaynak dünyasının özgürlüğüyle kompleks problemleri çözmek bana büyük keyif veriyor.</p>
            <div style="background:rgba(0,255,0,0.02); border:1px solid rgba(51,255,51,0.2); border-radius:10px; padding:12px; text-align:left; font-family:monospace; font-size:0.8rem; color:#33ff33; margin:14px 0; text-shadow: 0 0 3px rgba(51,255,51,0.4);">
                $ neofetch --os "Linux / Bash"<br>
                $ sudo apt update && sudo apt upgrade -y<br>
                $ git commit -m "Açık kaynak harikadır!"
            </div>
        </div>`
    },
    'kitaplik': {
        icon: '📚',
        title: 'Okuduğum Kitaplar',
        body: `
        <div>
            <p style="margin-bottom:14px;">Mustafa'nın ufkunu genişleten, ona rehberlik eden kitaplar:</p>
            <ul style="display:flex; flex-direction:column; gap:8px;">
                <li>📖 <strong>Clean Code</strong> — Robert C. Martin (Yazılım Tasarımı)</li>
                <li>📖 <strong>The Pragmatic Programmer</strong> — Andy Hunt & Dave Thomas</li>
                <li>📖 <strong>Design Patterns</strong> — Gang of Four (Yazılım Desenleri)</li>
                <li>📖 <strong>Sapiens: Hayvanlardan Tanrılara</strong> — Yuval Noah Harari</li>
            </ul>
        </div>`
    },
    'bilgisayar': {
        icon: '💻',
        title: 'Üretim Merkezi & Projeler',
        body: `
        <div>
            <p style="margin-bottom: 14px;">Burası fikirlerin gerçeğe dönüştüğü yer. Son dönemde üzerine çalıştığım bazı projeler:</p>
            <ul style="display:flex; flex-direction:column; gap:10px; margin-bottom: 16px;">
                <li style="padding:12px; background:rgba(255,255,255,0.02); border:1px solid var(--border-glass); border-radius:8px;">
                    🌱 <strong>FarmLog:</strong> AI destekli akıllı tarım yönetim sistemi.
                </li>
                <li style="padding:12px; background:rgba(255,255,255,0.02); border:1px solid var(--border-glass); border-radius:8px;">
                    🚀 <strong>Code-Verse:</strong> Uzay temalı çevrimdışı Python eğitim platformu.
                </li>
                <li style="padding:12px; background:rgba(255,255,255,0.02); border:1px solid var(--border-glass); border-radius:8px;">
                    🎬 <strong>Magic Stream:</strong> Go ve MongoDB altyapılı film keşif platformu.
                </li>
            </ul>
            <p style="margin-bottom: 14px; font-size: 0.9rem; color: var(--text-secondary);">Burası senin aktif olarak çalıştığın, modern yazılım projelerini sergileyeceğin yer olmalı. Projelerimi incelemek için GitHub profilime göz atabilirsiniz:</p>
            <div style="text-align: center; margin-top: 16px;">
                <a href="https://github.com/mustafa4341" target="_blank" class="github-btn" style="display: inline-flex; align-items: center; gap: 8px; background: #fff; color: #000; font-weight: 600; padding: 10px 20px; border-radius: 20px; text-decoration: none; font-size: 0.85rem; transition: background 0.2s;">
                    <span>🐈 GitHub Linki</span>
                </a>
            </div>
        </div>`
    },
    'poster_bayrak': {
        icon: '🇹🇷',
        title: 'Şanlı Türk Bayrağımız',
        body: `
        <div style="text-align:center;">
            <p style="font-size:1.1rem; color:#fff; font-weight:bold; margin-bottom:8px;">Türk Bayrağı</p>
            <p style="font-size:0.9rem; line-height:1.6; color:var(--text-secondary); text-align:left;">
                Mustafa Kemal Atatürk'ün emaneti olan Türkiye Cumhuriyeti'ne olan bağlılığımızın ve milli değerlerimizin simgesi.
            </p>
            <blockquote style="border-left: 3px solid #fc5c57; padding-left:12px; font-style:italic; text-align:left; color:#fda4af; margin-top:14px; line-height:1.5;">
                "Ey yükselen yeni nesil! İstikbal sizindir. Cumhuriyeti biz kurduk, onu yükseltecek ve yaşatacak sizlersiniz." <br>— Mustafa Kemal Atatürk
            </blockquote>
        </div>`
    },
    'poster_manco': {
        icon: '👨‍🎤',
        title: 'Barış Manço Efsanesi',
        body: `
        <div style="text-align:center;">
            <p style="font-size:1.1rem; color:#fff; font-weight:bold; margin-bottom:8px;">Barış Manço</p>
            <p style="font-size:0.85rem; font-style:italic; color:var(--text-muted); margin-bottom:12px;">Müzisyen, Kültür Elçisi, Sanatçı.</p>
            <p style="font-size:0.9rem; line-height:1.6; color:var(--text-secondary); text-align:left;">
                Barış Manço'nun hümanist, birleştirici ve insani değerleri öğütleyen felsefesini benimsiyorum. Şarkıları, felsefesi ve insan sevgisiyle en büyük kültürel ilham kaynaklarımdan biridir.
            </p>
            <p style="font-size:0.85rem; color:#a78bfa; margin-top:14px; margin-bottom:14px; font-weight:500; font-family:var(--font-display);">🎵 "Yaz dostum, güzel sevmeyene adam denir mi?"</p>
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 14px; padding: 12px; background: rgba(167, 139, 250, 0.08); border: 1px solid rgba(167, 139, 250, 0.25); border-radius: 12px;">
                <span class="pulse-dot" style="background:#a78bfa; box-shadow:0 0 10px #a78bfa; width:8px; height:8px;"></span>
                <span style="font-size: 0.85rem; color: #a78bfa; font-weight: 500;">Yerel Ses Çalar Aktif — "Yaz Dostum" oynatılıyor</span>
            </div>
        </div>`
    },
    'poster_yol': {
        icon: '🗺️',
        title: 'Yazılım Yolculuğum',
        body: `
        <div>
            <p style="margin-bottom:18px; font-style: italic; color: #a78bfa; line-height: 1.6;">
                "Bu yol, yazılım öğrenme sürecimi temsil ediyor. Başlangıçta C# ile başladım, sonra Go, Flutter ve veri alanlarına yöneldim. Yolun sonu görünmüyor çünkü öğrenme süreci hiç bitmiyor."
            </p>
            <div class="timeline-list">
                <div class="timeline-item">
                    <div class="timeline-year">Ortaokul</div>
                    <div class="timeline-desc">Yazılıma duyulan ilk büyük merak ve temel C# programlama dili ile ilk kodlama denemeleri.</div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-year">Lise</div>
                    <div class="timeline-desc">Backend tarafında Go (Golang) ve mobil geliştirme tarafında Flutter teknolojileri ile tanışma ve projeler geliştirme.</div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-year">Üniversite</div>
                    <div class="timeline-desc">Veri bilimi ve veri mühendisliği alanlarına yönelme; Python, makine öğrenmesi ve veri analitiği üzerine yoğunlaşma.</div>
                </div>
            </div>
        </div>`
    }
};
