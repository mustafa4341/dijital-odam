const SPOTIFY_REFRESH_TOKEN = 'AQ.Ab8RN6L4r6DDio77Gd6irO5KqLT845WPNiBgJEDPCsKYhPcY_A';
export let SPOTIFY_CLIENT_ID = localStorage.getItem('spotify_client_id') || '';

async function getSpotifyAccessToken() {
    if (!SPOTIFY_CLIENT_ID) return null;
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: SPOTIFY_REFRESH_TOKEN,
                client_id: SPOTIFY_CLIENT_ID
            })
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.access_token;
    } catch (e) {
        console.error("Spotify Token Error:", e);
        return null;
    }
}

export async function updateLiveSpotifyStatus() {
    const trackNameEl = document.getElementById('spotify-track-name');
    const artistNameEl = document.getElementById('spotify-artist-name');
    if (!trackNameEl) return;
    
    if (!SPOTIFY_CLIENT_ID) {
        trackNameEl.textContent = "Müzik Oynatıcı Hazır";
        artistNameEl.innerHTML = "Aşağıdaki çalma listesinden müzik başlatabilirsiniz. <span id='setup-spotify-link' style='color:#1ed760; cursor:pointer; text-decoration:underline; font-size:0.75rem; margin-left:8px;'>⚙️ Canlı Spotify Bağla</span>";
        
        setTimeout(() => {
            const link = document.getElementById('setup-spotify-link');
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const cid = prompt("Lütfen Spotify Developer Dashboard'dan aldığınız Client ID'yi girin:");
                    if (cid) {
                        SPOTIFY_CLIENT_ID = cid.trim();
                        localStorage.setItem('spotify_client_id', SPOTIFY_CLIENT_ID);
                        updateLiveSpotifyStatus();
                    }
                });
            }
        }, 100);
        return;
    }
    
    trackNameEl.textContent = "Güncelleniyor...";
    artistNameEl.textContent = "Spotify aranıyor...";
    
    const accessToken = await getSpotifyAccessToken();
    if (!accessToken) {
        trackNameEl.textContent = "Bağlantı Hatası";
        artistNameEl.textContent = "Spotify token yenilenemedi. Lütfen Client ID'nizi kontrol edin.";
        return;
    }
    
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (response.status === 204 || response.status === 404) {
            const recentResponse = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (recentResponse.ok) {
                const recentData = await recentResponse.json();
                if (recentData.items && recentData.items.length > 0) {
                    const item = recentData.items[0].track;
                    trackNameEl.textContent = item.name;
                    artistNameEl.textContent = item.artists.map(a => a.name).join(', ') + " (Son Dinlenen)";
                } else {
                    trackNameEl.textContent = "Müzik Çalınmıyor";
                    artistNameEl.textContent = "Spotify şu an aktif değil.";
                }
            }
            return;
        }
        
        if (response.ok) {
            const data = await response.json();
            if (data.item) {
                trackNameEl.textContent = data.item.name;
                artistNameEl.textContent = data.item.artists.map(a => a.name).join(', ') + " (Şu An Çalıyor)";
            } else {
                trackNameEl.textContent = "Müzik Çalınmıyor";
                artistNameEl.textContent = "Spotify beklemede.";
            }
        } else {
            trackNameEl.textContent = "Veri Çekilemedi";
            artistNameEl.textContent = "Spotify API hata kodu: " + response.status;
        }
    } catch (e) {
        console.error("Spotify API Currently Playing Error:", e);
        trackNameEl.textContent = "Bağlantı Hatası";
        artistNameEl.textContent = "Spotify API'sine erişilemedi.";
    }
}
