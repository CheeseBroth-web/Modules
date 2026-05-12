/**
 * BGM Selector Component
 * 使い方: 読み込みたいHTMLの </body> 直前に <script src="bgm-player.js"></script> を追加
 */
(function() {
    // --- 1. CSSの注入 ---
    const style = document.createElement('style');
    style.textContent = `
        #bgm-trigger {
            position: fixed; bottom: 15px; right: 15px;
            width: 40px; height: 40px;
            background-color: #469382; color: white;
            border-radius: 50%; border: none; cursor: pointer;
            font-size: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 9999; display: flex; align-items: center; justify-content: center;
            transition: all 0.2s;
        }
        #bgm-trigger:hover { transform: scale(1.1); background-color: #3d8172; }
        
        #bgm-panel {
            position: fixed; bottom: 65px; right: 15px;
            width: 220px; max-height: 300px;
            background: #ffffff; border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            display: none; flex-direction: column;
            z-index: 9998; overflow: hidden;
            font-family: sans-serif; border: 1px solid #eee;
        }
        .bgm-header {
            padding: 10px 12px; background: #fdfdfd;
            border-bottom: 1px solid #eee; font-size: 13px;
            font-weight: bold; color: #469382;
        }
        .bgm-list {
            overflow-y: auto; flex-grow: 1; padding: 8px;
        }
        .bgm-list::-webkit-scrollbar { width: 4px; }
        .bgm-list::-webkit-scrollbar-thumb { background-color: #ddd; border-radius: 4px; }
        
        .bgm-option {
            display: block; width: 100%; padding: 8px 10px; margin-bottom: 4px;
            text-align: left; border: 1px solid transparent; border-radius: 5px;
            background: #fcfcfc; cursor: pointer; font-size: 12px;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            transition: 0.2s; color: #333;
        }
        .bgm-option:hover { background: #f0f7f5; }
        .bgm-option.playing { background: #469382; color: white; }
        
        .bgm-footer { padding: 8px; background: #fdfdfd; border-top: 1px solid #eee; }
        #bgm-stop-btn {
            width: 100%; padding: 6px; font-size: 11px;
            border: 1px solid #ccc; border-radius: 4px;
            background: white; color: #666; cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // --- 2. HTMLの生成 ---
    const container = document.createElement('div');
    container.id = 'bgm-player-container';
    
    // 曲リストの定義（ここを書き換えるだけで曲を増やせます）
    const songs = [
        { name: '01. Early Morning', url: 'url1.mp3' },
        { name: '02. Modern Pop Fusion', url: 'url2.mp3' },
        { name: '03. Urban Chill', url: 'url3.mp3' },
        { name: '04. Rain & Piano', url: 'url4.mp3' },
        { name: '05. Lo-fi Beats', url: 'url5.mp3' },
        { name: '06. Midnight Groove', url: 'url6.mp3' },
        { name: '07. Acoustic Session', url: 'url7.mp3' },
        { name: '08. Electric Night', url: 'url8.mp3' },
        { name: '09. Calm Sunset', url: 'url9.mp3' },
        { name: '10. Deep Sea Ambient', url: 'url10.mp3' }
    ];

    const songButtons = songs.map(song => 
        `<button class="bgm-option" data-src="${song.url}">${song.name}</button>`
    ).join('');

    container.innerHTML = `
        <button id="bgm-trigger">♪</button>
        <div id="bgm-panel">
            <div class="bgm-header">Music Select</div>
            <div class="bgm-list">${songButtons}</div>
            <div class="bgm-footer">
                <button id="bgm-stop-btn">BGM Stop</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // --- 3. ロジック ---
    const trigger = document.getElementById('bgm-trigger');
    const panel = document.getElementById('bgm-panel');
    const options = document.querySelectorAll('.bgm-option');
    const stopBtn = document.getElementById('bgm-stop-btn');

    let currentAudio = new Audio();
    currentAudio.loop = true;

    // 開閉
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = panel.style.display === 'flex';
        panel.style.display = isVisible ? 'none' : 'flex';
        trigger.textContent = isVisible ? '♪' : '×';
    });

    // 再生
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const src = option.getAttribute('data-src');
            if (currentAudio.src.includes(src) && !currentAudio.paused) return;

            currentAudio.src = src;
            currentAudio.play();

            options.forEach(opt => opt.classList.remove('playing'));
            option.classList.add('playing');
        });
    });

    // 停止
    stopBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentAudio.pause();
        options.forEach(opt => opt.classList.remove('playing'));
    });

    // 枠外クリックで閉じる
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            panel.style.display = 'none';
            trigger.textContent = '♪';
        }
    });

})();