import { systemInstructionText } from './config.js?v=108';

// DOM Elements
const apiKeyInput = document.getElementById('api-key-input');
const apiPromptInput = document.getElementById('api-prompt-input');
const apiKeySave = document.getElementById('api-key-save');
const apiKeyContainer = document.getElementById('api-key-container');
const aiSettingsToggle = document.getElementById('ai-settings-toggle');
const aiMessages = document.getElementById('ai-messages');
const aiChatInput = document.getElementById('ai-chat-input');
const aiChatSend = document.getElementById('ai-chat-send');
const aiTyping = document.getElementById('ai-typing');

export let geminiApiKey = localStorage.getItem('gemini_api_key') || 'AQ.Ab8RN6L4r6DDio77Gd6irO5KqLT845WPNiBgJEDPCsKYhPcY_A';
export let customSystemPrompt = localStorage.getItem('gemini_system_prompt') || systemInstructionText.trim();

// Load saved settings
if (apiKeyInput) apiKeyInput.value = geminiApiKey;
if (apiPromptInput) apiPromptInput.value = customSystemPrompt;

// Hide API settings container by default
if (apiKeyContainer) {
    apiKeyContainer.style.display = 'none';
}

if (aiSettingsToggle) {
    aiSettingsToggle.addEventListener('click', (e) => {
        e.preventDefault();
        if (apiKeyContainer) {
            apiKeyContainer.style.display = apiKeyContainer.style.display === 'none' ? 'block' : 'none';
        }
    });
}

if (apiKeySave) {
    apiKeySave.addEventListener('click', () => {
        const valKey = apiKeyInput ? apiKeyInput.value.trim() : '';
        const valPrompt = apiPromptInput ? apiPromptInput.value.trim() : '';
        
        geminiApiKey = valKey;
        customSystemPrompt = valPrompt;
        
        localStorage.setItem('gemini_api_key', valKey);
        localStorage.setItem('gemini_system_prompt', valPrompt);
        
        if (apiKeyContainer) apiKeyContainer.style.display = 'none';
        addBotMessage("Ayarlarınız başarıyla kaydedildi! Hazır prompt ve API anahtarı güncellendi.");
    });
}

// Send actions
function handleSendMessage() {
    if (!aiChatInput) return;
    const text = aiChatInput.value.trim();
    if (!text) return;
    
    aiChatInput.value = '';
    addUserMessage(text);
    
    if (aiTyping) aiTyping.style.display = 'flex';
    scrollToBottom();
    
    getAIResponse(text);
}

if (aiChatSend) {
    aiChatSend.addEventListener('click', handleSendMessage);
}
if (aiChatInput) {
    aiChatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });
}

document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const text = chip.textContent;
        addUserMessage(text);
        if (aiTyping) aiTyping.style.display = 'flex';
        scrollToBottom();
        getAIResponse(text);
    });
});

// Helper functions
export function addUserMessage(text) {
    if (!aiMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'ai-message user';
    msgDiv.innerHTML = `<div class="message-content">${escapeHTML(text)}</div>`;
    aiMessages.appendChild(msgDiv);
    scrollToBottom();
}

export function addBotMessage(text) {
    if (!aiMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'ai-message bot';
    msgDiv.innerHTML = `<div class="message-content">${text}</div>`;
    aiMessages.appendChild(msgDiv);
    scrollToBottom();
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

function scrollToBottom() {
    if (aiMessages) aiMessages.scrollTop = aiMessages.scrollHeight;
}

// ── GET AI RESPONSE (Fetch to Gemini API) ──────
export async function getAIResponse(userText) {
    if (geminiApiKey && geminiApiKey.trim().length > 5) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': geminiApiKey
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: userText
                                }
                            ]
                        }
                    ],
                    systemInstruction: {
                        parts: [
                            {
                                text: customSystemPrompt
                            }
                        ]
                    }
                })
            });
            
            if (!response.ok) throw new Error("API error occurred.");
            
            const data = await response.json();
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Üzgünüm, cevap üretemedim.";
            
            let formatted = textResponse
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>');
                
            simulateTypingEffect(formatted);
        } catch (e) {
            console.error("Gemini API Error:", e);
            simulateOfflineResponse(userText, true);
        }
    } else {
        simulateOfflineResponse(userText);
    }
}

function simulateTypingEffect(htmlText) {
    if (aiTyping) aiTyping.style.display = 'none';
    if (!aiMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'ai-message bot';
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    msgDiv.appendChild(contentDiv);
    aiMessages.appendChild(msgDiv);
    
    contentDiv.innerHTML = htmlText;
    scrollToBottom();
}

function simulateOfflineResponse(text, isErrorFallback = false) {
    setTimeout(() => {
        if (aiTyping) aiTyping.style.display = 'none';
        
        let response = "";
        if (isErrorFallback) {
            response = "⚠️ Gemini API isteği başarısız oldu. API anahtarınız hatalı olabilir veya kota sınırı aşılmış olabilir. Çevrimdışı simülatör modu ile devam ediyorum:<br><br>";
        }
        
        const textLC = text.toLowerCase();
        
        if (textLC.includes("teknoloji") || textLC.includes("dil") || textLC.includes("yazılım") || textLC.includes("frontend") || textLC.includes("react") || textLC.includes("python") || textLC.includes("go") || textLC.includes("mongo")) {
            response += "Mustafa asıl tutku alanı olan <strong>Veri Bilimi & Veri Mühendisliği</strong> çalışmalarında <strong>Python (Pandas, Numpy, XGBoost, Prophet)</strong> kullanıyor. Backend tarafında ise <strong>Go (Golang) ve MongoDB</strong> teknolojilerini, frontend/mobil tarafında ise <strong>React Native</strong> ekosistemini benimsemiştir.";
        } else if (textLC.includes("hedef") || textLC.includes("gelecek") || textLC.includes("yol haritası") || textLC.includes("kariyer") || textLC.includes("plan")) {
            response += "Mustafa'nın gelecek planları veri mühendisliği ve yapay zekâyı birleştiren SaaS mikro girişimleri üzerine kuruludur:<br>• <strong>2026:</strong> Veri analitiği ve ML temelleri (Prophet, XGBoost).<br>• <strong>2027:</strong> Gelişmiş ML modelleri ve veri mühendisliği hatları.<br>• <strong>2028:</strong> Kendi bağımsız SaaS girişimlerini hayata geçirmek.";
        } else if (textLC.includes("kedi") || textLC.includes("pixel")) {
            response += "Mustafa'nın kedisinin adı <strong>Pixel</strong>'dir. Kendisi odanın asıl sahibi olduğunu iddia eder, bug avlama sayısı 47, miyavlama sayısı ise 829'u bulmuştur. Mustafa kod yazarken ona yoldaşlık eder.";
        } else if (textLC.includes("rutin") || textLC.includes("günlük") || textLC.includes("kahve")) {
            response += "Mustafa güne bir fincan kahve ile başlar. Günlük rutini yaklaşık olarak 6/8 bardak kahve tüketimi, 7/8 saat yoğun kodlama ve kalan sürede 4/8 saat uyku döngüsünden oluşur.";
        } else if (textLC.includes("kamp") || textLC.includes("trekking") || textLC.includes("hobi") || textLC.includes("doğa") || textLC.includes("motosiklet") || textLC.includes("motor")) {
            response += "Mustafa boş zamanlarında tamamen ekranlardan uzaklaşıp doğaya kaçmayı sever. 🏕️ <strong>Kocaeli ve Balıkesir yaylalarında</strong> kamp yapar, 🥾 <strong>Nüzhetiye Şelalesi ve Serindere</strong> gibi zorlu trekking rotalarında yürür ve 🏍️ <strong>motosikletiyle</strong> yeni yollar keşfeder.";
        } else if (textLC.includes("müzik") || textLC.includes("hoparlör") || textLC.includes("lofi") || textLC.includes("synthwave") || textLC.includes("barış") || textLC.includes("manco")) {
            response += "Mustafa kod yazarken <strong>Lo-Fi</strong>, <strong>Synthwave</strong> ve odaklanma için <strong>Klasik müzik</strong> dinlemeyi sever. Ayrıca duvardaki <strong>Barış Manço</strong> posteri, onun en sevdiği sanatçılardan birinin felsefesini benimsediğini simgeler.";
        } else if (textLC.includes("linux") || textLC.includes("tux") || textLC.includes("açık kaynak")) {
            response += "Mustafa açık kaynak kod felsefesini ve Linux işletim sistemini çok seviyor. Odadaki Tux pengueni de bu sevginin bir simgesi. Yerdeki bilgisayardan terminali açarak komut satırı deneyimine göz atabilirsiniz!";
        } else if (textLC.includes("kimdir") || textLC.includes("mustafa") || textLC.includes("nerede") || textLC.includes("okuyor") || textLC.includes("github")) {
            response += "Mustafa, yazılım geliştirme, veri bilimi ve veri mühendisliği konularına tutkulu bir geliştirici. GitHub üzerinden projelerini inceleyebilirsiniz: <a href='https://github.com/mustafa4341' target='_blank'>github.com/mustafa4341</a>";
        } else {
            response += "Merhaba! Ben Mustafa'nın odasındaki AI asistanıyım. Yazdığınız konuyu tam anlayamadım ama Mustafa'nın <strong>teknolojileri</strong>, <strong>gelecek hedefleri</strong>, kedisi <strong>Pixel</strong> veya <strong>doğa hobileri</strong> hakkında sorular sorabilirsiniz. Dilerseniz hazır soru çipleriyle başlayabilirsiniz!";
        }
        
        simulateTypingEffect(response);
    }, 1200);
}
