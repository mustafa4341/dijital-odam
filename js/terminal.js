import { closeTerminalModal } from './ui.js?v=105';

function handleTerminalCommand(cmd) {
    addTerminalLine(`mustafa@dijital-oda:~$ ${cmd}`, 'user');
    
    const cmdClean = cmd.toLowerCase().trim();
    
    if (cmdClean === 'clear') {
        const output = document.getElementById('terminal-output');
        if (output) output.innerHTML = '';
        return;
    }
    
    if (cmdClean === 'help') {
        addTerminalLine("Mevcut Komutlar:");
        addTerminalLine("  help       ➔  Bu yardım menüsünü gösterir.");
        addTerminalLine("  about      ➔  Mustafa hakkında kısa bilgi verir.");
        addTerminalLine("  skills     ➔  Mustafa'nın teknik becerilerini listeler.");
        addTerminalLine("  neofetch   ➔  Sistem ve kullanıcı bilgilerini gösterir.");
        addTerminalLine("  matrix     ➔  Retro yeşil kod yağmuru simülasyonunu başlatır.");
        addTerminalLine("  clear      ➔  Ekranı temizler.");
        addTerminalLine("  exit       ➔  Terminal ekranından çıkar.");
        return;
    }
    
    if (cmdClean === 'exit') {
        closeTerminalModal();
        return;
    }
    
    if (cmdClean === 'about') {
        addTerminalLine("Mustafa — Geleceğin Yazılım Mühendisi & Veri Bilimcisi.");
        addTerminalLine("Açık kaynak yazılımları sever, lo-fi eşliğinde veri modelleri kurar.");
        addTerminalLine("En büyük ideali, kendi SaaS yapay zekâ girişimini hayata geçirmektir.");
        return;
    }
    
    if (cmdClean === 'skills') {
        addTerminalLine("Yetenek Seti & Odak Noktaları:");
        addTerminalLine("  - Languages  : Python, Go (Golang), Dart, SQL");
        addTerminalLine("  - Databases  : MongoDB, PostgreSQL, SQLite");
        addTerminalLine("  - Frameworks : React Native, Flutter, React.js");
        addTerminalLine("  - Data & AI  : Pandas, NumPy, Scikit-learn, XGBoost, Prophet");
        return;
    }
    
    if (cmdClean === 'neofetch') {
        addTerminalLine(`
<div class="neofetch-container">
  <div class="neofetch-logo">
    .--.
   |o_o |
   |:_/ |
  //   \\ \\
 (|     | )
/'\\_   _/\\'
\\___)=(___/
  </div>
  <div class="neofetch-info">
    <strong style="color:#a78bfa;">mustafa@dijital-oda</strong><br>
    ----------------------<br>
    <strong>OS</strong>: Mustafa OS v1.2.0 x86_64<br>
    <strong>Kernel</strong>: 6.12.0-dijital-oda<br>
    <strong>Uptime</strong>: 47 mins<br>
    <strong>Shell</strong>: bash 5.2.15<br>
    <strong>Terminal</strong>: OldPC-Retro-TTY1<br>
    <strong>CPU</strong>: PSX LowPoly Core (1) @ 3.50GHz<br>
    <strong>Memory</strong>: 64MB / 128MB (50%)<br>
    <strong>Active Pet</strong>: Pixel (Cat)
  </div>
</div>
        `, 'html');
        return;
    }
    
    if (cmdClean === 'matrix') {
        addTerminalLine("Matrix akışı yükleniyor... [Tamam]");
        let count = 0;
        const interval = setInterval(() => {
            const modal = document.getElementById('terminal-modal');
            const terminalModalActive = modal && modal.classList.contains('active');
            if (count > 10 || !terminalModalActive) {
                clearInterval(interval);
                return;
            }
            let line = "";
            for (let j = 0; j < 40; j++) {
                line += Math.random() > 0.5 ? "1" : "0";
            }
            addTerminalLine(line, 'matrix');
            count++;
        }, 150);
        return;
    }
    
    addTerminalLine(`mustafa-sh: ${cmd}: komut bulunamadı. Yardım için 'help' yazın.`, 'error');
}

function addTerminalLine(text, type = '') {
    const output = document.getElementById('terminal-output');
    if (!output) return;
    const p = document.createElement('p');
    p.style.margin = '4px 0';
    if (type === 'user') {
        p.style.color = '#fff';
    } else if (type === 'error') {
        p.style.color = '#fc5c57';
    } else if (type === 'matrix') {
        p.style.color = '#33ff33';
        p.style.opacity = '0.7';
    }
    
    if (type === 'html') {
        p.innerHTML = text;
    } else {
        p.textContent = text;
    }
    
    output.appendChild(p);
    output.scrollTop = output.scrollHeight;
}

// Robust event listener binding
function initTerminal() {
    const input = document.getElementById('terminal-input');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim();
                input.value = '';
                if (cmd) {
                    handleTerminalCommand(cmd);
                }
            }
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTerminal);
} else {
    initTerminal();
}
