import { controls } from './scene.js?v=108';
import { interactiveData } from './config.js?v=108';
import { updateLiveSpotifyStatus } from './spotify.js?v=108';
import { addBotMessage } from './chat.js?v=108';

export let isModalOpen = false;
export let currentActiveModalKey = null;
export let isBlockingClicks = false;

// Local Audio Playback Setup
let currentPlayingAudio = null;
const mancoAudio = new Audio("./Baris-Manco-Yaz-Dostum.mp3");
const penguinAudio = new Audio("./sondangsirait419-pinguin-220042.mp3");
const meowAudio = new Audio("./freesound_community-cat-meow-14536.mp3");

function stopAllAudio() {
    if (currentPlayingAudio) {
        currentPlayingAudio.pause();
        currentPlayingAudio = null;
    }
}

// DOM Elements
export const tooltip = document.getElementById('tooltip');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalIcon = document.getElementById('modal-icon');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalAiAsk = document.getElementById('modal-ai-ask');

const aiChatModal = document.getElementById('ai-chat-modal');
const aiChatClose = document.getElementById('ai-chat-close');
const aiChatInput = document.getElementById('ai-chat-input');

const terminalModal = document.getElementById('terminal-modal');
const terminalClose = document.getElementById('terminal-close');

const yatakModal = document.getElementById('yatak-modal');
const yatakClose = document.getElementById('yatak-close');
const fadeOverlay = document.getElementById('fade-overlay');

const workstationModal = document.getElementById('workstation-modal');
const workstationClose = document.getElementById('workstation-close');

// ── OPEN / CLOSE MODAL ─────────────────────────
export function openModal(key) {
    if (isBlockingClicks) return;
    currentActiveModalKey = key;

    stopAllAudio();

    // Special Modals Interception
    if (key === 'eski_bilgisayar') {
        openTerminalModal();
        return;
    }
    if (key === 'robot_ai') {
        openAIChatModal();
        return;
    }
    if (key === 'yatak') {
        openYatakModal();
        return;
    }
    if (key === 'bilgisayar') {
        openWorkstationModal();
        return;
    }

    // Play specific local audio
    if (key === 'poster_manco') {
        mancoAudio.currentTime = 27;
        mancoAudio.play().catch(e => console.warn("Audio play failed:", e));
        currentPlayingAudio = mancoAudio;
    } else if (key === 'penguen') {
        penguinAudio.currentTime = 0;
        penguinAudio.play().catch(e => console.warn("Audio play failed:", e));
        currentPlayingAudio = penguinAudio;
    }

    const data = interactiveData[key];
    if (!data) return;

    modalIcon.textContent = data.icon;
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.body;
    modalOverlay.classList.add('active');
    isModalOpen = true;
    controls.enabled = false;
    tooltip.classList.remove('visible');

    initDynamicContent(key);
}

export function closeModal() {
    stopAllAudio();
    if (modalOverlay) modalOverlay.classList.remove('active');
    isModalOpen = false;
    currentActiveModalKey = null;
    
    isBlockingClicks = true;
    setTimeout(() => {
        isBlockingClicks = false;
    }, 400);
    controls.enabled = true;
}

// ── TERMINAL MODAL ───────────────────────────
export function openTerminalModal() {
    closeModal();
    if (terminalModal) terminalModal.classList.add('active');
    isModalOpen = true;
    controls.enabled = false;
    tooltip.classList.remove('visible');
    
    setTimeout(() => {
        const input = document.getElementById('terminal-input');
        if (input) input.focus();
    }, 300);
}

export function closeTerminalModal() {
    stopAllAudio();
    if (terminalModal) terminalModal.classList.remove('active');
    isModalOpen = false;
    
    isBlockingClicks = true;
    setTimeout(() => {
        isBlockingClicks = false;
    }, 400);
    controls.enabled = true;
}

// ── AI CHAT MODAL ────────────────────────────
export function openAIChatModal() {
    const fromObjectKey = currentActiveModalKey;
    closeModal();
    
    if (aiChatModal) aiChatModal.classList.add('active');
    isModalOpen = true;
    controls.enabled = false;
    tooltip.classList.remove('visible');
    
    if (fromObjectKey) {
        const title = interactiveData[fromObjectKey]?.title || fromObjectKey;
        addBotMessage(`Görüyorum ki "${title}" nesnesini inceliyordunuz. Bu nesne veya Mustafa hakkında merak ettiğiniz başka bir şey varsa bana sorabilirsiniz!`);
    }
    
    setTimeout(() => {
        if (aiChatInput) aiChatInput.focus();
    }, 300);
}

export function closeAIChatModal() {
    stopAllAudio();
    if (aiChatModal) aiChatModal.classList.remove('active');
    isModalOpen = false;
    
    isBlockingClicks = true;
    setTimeout(() => {
        isBlockingClicks = false;
    }, 400);
    controls.enabled = true;
}

// ── STARRY FUTURE GOALS MODAL (Yatak) ───────────
export function openYatakModal() {
    console.log("openYatakModal called");
    if (isBlockingClicks) {
        console.log("Clicks blocked, returning");
        return;
    }
    try {
        closeModal();
        isBlockingClicks = true;
        if (fadeOverlay) {
            console.log("Activating fadeOverlay");
            fadeOverlay.classList.add('active');
        } else {
            console.warn("fadeOverlay is null");
        }
        
        setTimeout(() => {
            try {
                if (yatakModal) {
                    console.log("Activating yatakModal");
                    yatakModal.classList.add('active');
                } else {
                    console.warn("yatakModal is null");
                }
                isModalOpen = true;
                controls.enabled = false;
                if (tooltip) tooltip.classList.remove('visible');
                
                if (fadeOverlay) {
                    console.log("Deactivating fadeOverlay");
                    fadeOverlay.classList.remove('active');
                }
            } catch (err) {
                console.error("Error in openYatakModal transition timeout:", err);
            } finally {
                setTimeout(() => {
                    isBlockingClicks = false;
                    console.log("isBlockingClicks set to false (open)");
                }, 800);
            }
        }, 800);
    } catch (e) {
        console.error("Error in openYatakModal:", e);
        isBlockingClicks = false;
    }
}

export function closeYatakModal() {
    console.log("closeYatakModal called");
    if (isBlockingClicks) {
        console.log("Clicks blocked, returning (close)");
        return;
    }
    try {
        isBlockingClicks = true;
        if (fadeOverlay) {
            console.log("Activating fadeOverlay (close)");
            fadeOverlay.classList.add('active');
        }
        
        setTimeout(() => {
            try {
                if (yatakModal) {
                    console.log("Deactivating yatakModal");
                    yatakModal.classList.remove('active');
                }
                isModalOpen = false;
                
                if (fadeOverlay) {
                    console.log("Deactivating fadeOverlay (close)");
                    fadeOverlay.classList.remove('active');
                }
            } catch (err) {
                console.error("Error in closeYatakModal transition timeout:", err);
            } finally {
                setTimeout(() => {
                    isBlockingClicks = false;
                    controls.enabled = true;
                    console.log("isBlockingClicks set to false (close)");
                }, 800);
            }
        }, 800);
    } catch (e) {
        console.error("Error in closeYatakModal:", e);
        isBlockingClicks = false;
        controls.enabled = true;
    }
}

// ── WORKSTATION MODAL ─────────────────────────
export function openWorkstationModal() {
    if (isBlockingClicks) return;
    currentActiveModalKey = 'bilgisayar';
    stopAllAudio();
    
    if (workstationModal) {
        workstationModal.classList.add('active');
        isModalOpen = true;
        controls.enabled = false;
        if (tooltip) tooltip.classList.remove('visible');
    }
}

export function closeWorkstationModal() {
    stopAllAudio();
    if (workstationModal) {
        workstationModal.classList.remove('active');
        isModalOpen = false;
        currentActiveModalKey = null;
    }
    isBlockingClicks = true;
    setTimeout(() => {
        isBlockingClicks = false;
    }, 400);
    controls.enabled = true;
}

// ── DYNAMIC CONTENT INITIALIZERS ──────────────
function initDynamicContent(key) {
    if (key === 'kedi') {
        const bugsEl = document.getElementById('cat-bugs');
        const meowsEl = document.getElementById('cat-meows');
        const quoteEl = document.getElementById('cat-quote');
        const btnEl = document.getElementById('cat-btn');
        
        let bugCount = 47;
        let meowCount = 829;
        
        const catQuotes = [
            "Miyav! Konsoldaki hatayı gördüm ama düzeltmeyeceğim, o senin işin.",
            "Mustafa dün gece yine bir hata arıyordu, ben de klavyeye oturarak yardım ettim.",
            "Miyav! Kod derlenirken (compile) göz kırpma, şansı bozarsın.",
            "Uykum var ama Mustafa'nın kodlamasını izlemek de fena değil.",
            "Mama kabım boşalıyor, bu bir production hatasıdır (P0 critical)!",
            "Miyav! Bug avlama sırası bende mi?"
        ];
        
        if (btnEl) {
            btnEl.addEventListener('click', () => {
                // Play meow sound
                meowAudio.currentTime = 0;
                meowAudio.play().catch(e => console.warn("Audio play failed:", e));

                bugCount += Math.floor(Math.random() * 3);
                meowCount += 1;
                if (bugsEl) bugsEl.textContent = bugCount;
                if (meowsEl) meowsEl.textContent = meowCount;
                
                const randomQuote = catQuotes[Math.floor(Math.random() * catQuotes.length)];
                if (quoteEl) {
                    quoteEl.style.opacity = 0;
                    setTimeout(() => {
                        quoteEl.textContent = `"${randomQuote}"`;
                        quoteEl.style.opacity = 1;
                    }, 150);
                }
            });
        }
    }
    
    if (key === 'hoparlor') {
        const iframe = document.getElementById('spotify-iframe');
        const cards = document.querySelectorAll('.genre-card');
        
        const genrePlaylists = {
            lofi: "37i9dQZF1DWWQRwui0ExPn",
            my_list: "46jrKdjHELOlhyUjicNdyN",
            classical: "37i9dQZF1DWV7EzJMK2F7S"
        };
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const genre = card.dataset.genre;
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                
                if (iframe) {
                    iframe.src = `https://open.spotify.com/embed/playlist/${genrePlaylists[genre]}?utm_source=generator&theme=0`;
                }
            });
        });
        
        updateLiveSpotifyStatus();
    }
}

// ── BIND CLOSE LISTENERS (Click & Touch) ───────
if (modalClose) {
    modalClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
    });
    modalClose.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
    }, { passive: false });
}
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            e.stopPropagation();
            closeModal();
        }
    });
    modalOverlay.addEventListener('touchstart', (e) => {
        if (e.target === modalOverlay) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        }
    }, { passive: false });
}

if (terminalClose) {
    terminalClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeTerminalModal();
    });
    terminalClose.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeTerminalModal();
    }, { passive: false });
}
if (terminalModal) {
    terminalModal.addEventListener('click', (e) => {
        if (e.target === terminalModal) {
            e.stopPropagation();
            closeTerminalModal();
        } else {
            const input = document.getElementById('terminal-input');
            if (input) input.focus();
        }
    });
    terminalModal.addEventListener('touchstart', (e) => {
        if (e.target === terminalModal) {
            e.preventDefault();
            e.stopPropagation();
            closeTerminalModal();
        }
    }, { passive: false });
}

if (aiChatClose) {
    aiChatClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAIChatModal();
    });
    aiChatClose.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeAIChatModal();
    }, { passive: false });
}
if (aiChatModal) {
    aiChatModal.addEventListener('click', (e) => {
        if (e.target === aiChatModal) {
            e.stopPropagation();
            closeAIChatModal();
        }
    });
    aiChatModal.addEventListener('touchstart', (e) => {
        if (e.target === aiChatModal) {
            e.preventDefault();
            e.stopPropagation();
            closeAIChatModal();
        }
    }, { passive: false });
}

if (modalAiAsk) {
    modalAiAsk.addEventListener('click', openAIChatModal);
}

if (yatakClose) {
    yatakClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeYatakModal();
    });
    yatakClose.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeYatakModal();
    }, { passive: false });
}
if (yatakModal) {
    yatakModal.addEventListener('click', (e) => {
        if (e.target === yatakModal) {
            e.stopPropagation();
            closeYatakModal();
        }
    });
    yatakModal.addEventListener('touchstart', (e) => {
        if (e.target === yatakModal) {
            e.preventDefault();
            e.stopPropagation();
            closeYatakModal();
        }
    }, { passive: false });
}

if (workstationClose) {
    workstationClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeWorkstationModal();
    });
    workstationClose.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeWorkstationModal();
    }, { passive: false });
}
if (workstationModal) {
    workstationModal.addEventListener('click', (e) => {
        if (e.target === workstationModal) {
            e.stopPropagation();
            closeWorkstationModal();
        }
    });
    workstationModal.addEventListener('touchstart', (e) => {
        if (e.target === workstationModal) {
            e.preventDefault();
            e.stopPropagation();
            closeWorkstationModal();
        }
    }, { passive: false });
}

// Workstation Sidebar Menu scrolling
const menuItems = document.querySelectorAll('.workstation-sidebar .menu-item');
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = item.dataset.target;
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        if (target === 'all') {
            const scrollArea = document.querySelector('.workstation-content');
            if (scrollArea) scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const card = document.getElementById(`card-${target}`);
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

const workstationAiBtn = document.getElementById('workstation-ai-btn');
if (workstationAiBtn) {
    workstationAiBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeWorkstationModal();
        setTimeout(() => {
            openAIChatModal();
        }, 300);
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (isModalOpen) {
            closeModal();
            closeAIChatModal();
            closeTerminalModal();
            closeYatakModal();
            closeWorkstationModal();
        }
    }
});
