/**
 * Sidebar Tree Module
 * GitHubの派生サイトやリポジトリを階層表示する
 */
(function() {
    // --- 1. 階層データの定義 ---
    const treeData = [
        {
            title: "Main Hub",
            url: "https://github.com/CheeseBroth-web/home",
            children: [
                { title: "Modules (Assets)", url: "https://github.com/CheeseBroth-web/Modules" },
                { title: "Development-1", url: "https://github.com/CheeseBroth-web/DEVELOPMENT1" }
            ]
        },
        {
            title: "Project Alpha",
            url: "#",
            children: [
                { title: "Documentation", url: "#doc" },
                { title: "Release Build", url: "#release" }
            ]
        }
    ];

    // --- 2. スタイルの注入 ---
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
        }
        #custom-sidebar.open { transform: translateX(0); }

        /* 開閉用トグルボタン */
        #sidebar-toggle {
            position: fixed; top: 15px; left: 15px;
            z-index: 10000; background: #21262d;
            border: 1px solid #30363d; border-radius: 6px;
            color: #c9d1d9; padding: 5px 10px; cursor: pointer;
        }

        .tree-item { margin: 8px 0; list-style: none; }
        .tree-link { 
            text-decoration: none; color: #58a6ff; font-size: 14px;
            display: block; padding: 4px 8px; border-radius: 4px;
        }
        .tree-link:hover { background: #161b22; }
        
        .tree-parent { font-weight: bold; color: #f0f6fc; margin-bottom: 4px; display: block; }
        .tree-children { padding-left: 15px; border-left: 1px solid #30363d; margin-top: 4px; }
    `;
    document.head.appendChild(style);

    // --- 3. HTML構造の生成 ---
    const sidebar = document.createElement('div');
    sidebar.id = 'custom-sidebar';
    
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'sidebar-toggle';
    toggleBtn.textContent = '☰ Menu';

    // 階層構造を再帰的に生成する関数
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

            if (item.children) {
                const childContainer = document.createElement('div');
                childContainer.className = 'tree-children';
                childContainer.appendChild(createTree(item.children));
                li.appendChild(childContainer);
            }
            ul.appendChild(li);
        });
        return ul;
    }

    sidebar.appendChild(createTree(treeData));
    document.body.appendChild(sidebar);
    document.body.appendChild(toggleBtn);

    // --- 4. 動作ログ ---
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        toggleBtn.style.left = sidebar.classList.contains('open') ? '250px' : '15px';
    });
})();
