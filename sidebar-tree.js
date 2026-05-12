/**
 * Sidebar Tree Module (Auto-fetch GitHub Pages version)
 */
(async function() {
    const USERNAME = "CheeseBroth-web"; // あなたのGitHubユーザー名

    // --- 1. スタイルの注入 ---
    const style = document.createElement('style');
    style.textContent = `
        #custom-sidebar {
            position: fixed; top: 0; left: 0;
            width: 240px; height: 100vh;
            background: #0d1117; color: #c9d1d9;
            border-right: 1px solid #30363d;
            z-index: 9999; padding: 20px 10px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            transform: translateX(-100%); transition: transform 0.3s ease;
            overflow-y: auto;
        }
        #custom-sidebar.open { transform: translateX(0); }

        #sidebar-toggle {
            position: fixed; top: 15px; left: 15px;
            z-index: 10000; background: #21262d;
            border: 1px solid #30363d; border-radius: 6px;
            color: #c9d1d9; padding: 5px 10px; cursor: pointer;
            transition: left 0.3s ease;
        }

        .tree-item { margin: 8px 0; list-style: none; }
        .tree-link { 
            text-decoration: none; color: #58a6ff; font-size: 14px;
            display: block; padding: 4px 8px; border-radius: 4px;
        }
        .tree-link:hover { background: #161b22; }
        .tree-parent { font-weight: bold; color: #f0f6fc; margin-bottom: 4px; display: block; border-bottom: 1px solid #30363d;}
        .tree-children { padding-left: 10px; margin-top: 4px; }
        
        /* 取得中のローディング表示用 */
        #sidebar-loading { font-size: 12px; color: #8b949e; padding: 10px; }
    `;
    document.head.appendChild(style);

    // --- 2. HTML構造の基本生成 ---
    const sidebar = document.createElement('div');
    sidebar.id = 'custom-sidebar';
    sidebar.innerHTML = `<div id="sidebar-loading">リポジトリ情報を取得中...</div>`;
    
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'sidebar-toggle';
    toggleBtn.textContent = '☰ Menu';

    document.body.appendChild(sidebar);
    document.body.appendChild(toggleBtn);

    // 開閉ロジック
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        toggleBtn.style.left = sidebar.classList.contains('open') ? '250px' : '15px';
    });

    // --- 3. 階層構造を生成する関数 ---
    function createTree(data) {
        const ul = document.createElement('ul');
        ul.style.padding = "0";
        data.forEach(item => {
            const li = document.createElement('li');
            li.className = 'tree-item';
            
            const link = document.createElement('a');
            link.href = item.url;
            link.textContent = item.title;
            link.className = item.children ? 'tree-link tree-parent' : 'tree-link';
            li.appendChild(link);

            if (item.children && item.children.length > 0) {
                const childContainer = document.createElement('div');
                childContainer.className = 'tree-children';
                childContainer.appendChild(createTree(item.children));
                li.appendChild(childContainer);
            }
            ul.appendChild(li);
        });
        return ul;
    }

    // --- 4. GitHub API から自動取得する処理 ---
    try {
        // GitHubから公開リポジトリの一覧を取得
        const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`);
        if (!response.ok) throw new Error('APIの取得に失敗しました');
        
        const repos = await response.json();
        
        // GitHub Pagesが有効になっているリポジトリだけを抽出
        const pagesRepos = repos
            .filter(repo => repo.has_pages)
            .map(repo => ({
                title: repo.name, // リポジトリ名をタイトルにする
                url: `https://${USERNAME}.github.io/${repo.name}/`
            }));

        // メニューの骨組みに自動取得したデータを組み込む
        const treeData = [
            {
                title: "🏠 Main Hub (GitHub)",
                url: `https://github.com/${USERNAME}/home`
            },
            {
                title: "🌐 My Pages Sites",
                url: "#",
                children: pagesRepos // ここに自動取得したリストが展開されます
            }
        ];

        // ローディング表示を消してメニューを描画
        sidebar.innerHTML = ''; 
        sidebar.appendChild(createTree(treeData));

    } catch (error) {
        console.error(error);
        sidebar.innerHTML = `<div style="color: #f85149; padding: 10px; font-size: 12px;">メニューの読み込みに失敗しました。<br>時間をおいてお試しください。</div>`;
    }
})();
