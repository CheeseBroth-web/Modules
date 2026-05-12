/**
 * BGM Selector Component (v2.0)
 * Repository: https://github.com/CheeseBroth-web/Modules
 * Color Theme: #469382
 */
(function() {
    // --- 1. 基本設定（ここを編集して曲を管理） ---
    const REPO_URL = "https://raw.githubusercontent.com/CheeseBroth-web/Modules/main";
    const PRIMARY_COLOR = "#469382"; // あなたの象徴色

    const songs = [
        { name: '01. Track One', filename: 'track1.mp3' },
        { name: '02. Track Two', filename: 'track2.mp3' },
        { name: '03. Track Three', filename: 'track3.mp3' },
        // 新しい曲を追加する場合は、ここに { name: '...', filename: '...' } を増やすだけ
    ];

    // --- 2. CSSの注入（名前の衝突を防ぐため接頭辞 bgmp- を使用） ---
    const style = document.createElement('style');
    style.textContent = `
        #bgmp-trigger {
            position: fixed; bottom: 15px; right: 15px;
            width: 42px; height: 42px;
            background-color: ${PRIMARY_COLOR}; color: white;
            border-radius: 50%; border: none; cursor: pointer;
            font-size: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            z-index: 99999; display: flex; align-items: center; justify-content: center;
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        #bgmp-trigger:hover { transform: scale(1.1); filter: brightness(1.1); }
        
        #bgmp-panel {
            position: fixed; bottom: 70px; right: 15px;
            width: 220px; max-height: 320px;
            background: #ffffff; border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            display: none; flex-direction: column;
            z-index: 99998; overflow: hidden;
            font-family: 'Helvetica Neue', Arial, sans-serif;
            border: 1px solid rgba(0,0,0,0.05);
        }
        .bgmp-header {
            padding: 12px; background: #fafafa;
            border-bottom: 1px solid #eee; font-size: 13px;
            font-weight: bold; color: ${PRIMARY_COLOR};
        }
        .bgmp-list {
            overflow-y: auto; flex-grow: 1; padding: 10px;
            background: #fff;
        }
        .bgmp-list::-webkit-scrollbar { width: 4px; }
        .bgmp-list::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
        
        .bgmp-option {
            display: block; width: 100%; padding: 10px; margin-bottom: 5px;
            text-align: left; border: 1px solid transparent; border-radius: 6px;
            background: #f8f8f8; cursor: pointer; font-size: 12px;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            transition: 0.2s; color: #444;
        }
        .bgmp-option:hover { background: #f0f7f5; border-color: ${PRIMARY_COLOR}44; }
        .bgmp-option.playing { background: ${PRIMARY_COLOR}; color: white; font-weight: bold; }
        
        .bgmp-footer { padding: 8px; background: #fafafa; border-top: 1px solid #eee; }
        #bgmp-stop-btn {
            width: 100%; padding: 7px; font-size: 11px;
            border: 1px solid #ddd; border-radius: 4px;
            background: white; color: #777; cursor: pointer;
            transition: 0.2s;
        }
        #bgmp-stop-btn:hover { background: #f0f0f0; color: #333; }
    `;
    document.head.appendChild(style);

    // --- 3. HTML構造の生成 ---
    const container = document.createElement('div');
    container.id = 'bgmp-app-root';
    
    const songButtons = songs.map(song => 
        `<button class="bgmp-option" data-src="${REPO_URL}/music/${song.filename}">${song.name}</button>`
    ).join('');

    container.innerHTML = `
        <button id="bgmp-trigger" title="BGM再生">♪</button>
        <div id="bgmp-panel">
            <div class="bgmp-header">BGM Selection</div>
            <div class="bgmp-list">${songButtons}</div>
            <div class="bgmp-footer">
                <button id="bgmp-stop-btn">Stop Music</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // --- 4. 制御ロジック ---
    const trigger = document.getElementById('bgmp-trigger');
    const panel = document.getElementById('bgmp-panel');
    const options = document.querySelectorAll('.bgmp-option');
    const stopBtn = document.getElementById('bgmp-stop-btn');

    let currentAudio = new Audio();
    currentAudio.loop = true;

    // パネル開閉
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = panel.style.display === 'flex';
        panel.style.display = isVisible ? 'none' : 'flex';
        trigger.textContent = isVisible ? '♪' : '×';
        trigger.style.backgroundColor = isVisible ? PRIMARY_COLOR : "#333";
    });

    // 曲の再生
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const src = option.getAttribute('data-src');
            
            // 再生中の曲を再度押した場合は一時停止/再開の切り替え
            if (currentAudio.src === src) {
                if (currentAudio.paused) {
                    currentAudio.play();
                    option.classList.add('playing');
                } else {
                    currentAudio.pause();
                    option.classList.remove('playing');
                }
                return;
            }

            currentAudio.src = src;
            currentAudio.play().catch(err => console.error("再生に失敗しました:", err));

            options.forEach(opt => opt.classList.remove('playing'));
            option.classList.add('playing');
        });
    });

    // 停止
    stopBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentAudio.pause();
        currentAudio.src = ""; // ソースをクリア
        options.forEach(opt => opt.classList.remove('playing'));
    });

    // 画面外クリックで閉じる
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            panel.style.display = 'none';
            trigger.textContent = '♪';
            trigger.style.backgroundColor = PRIMARY_COLOR;
        }
    });
})();
