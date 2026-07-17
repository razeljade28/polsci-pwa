// ================================================================
// VIEW: Learning (with all 6 constitutions)
// ================================================================
const Learning = {
  currentTab: 'constitution', // default to 1987

  render() {
    const data = Storage.getAppData();
    const resources = data.learningResources || {};

    const tabs = [
      { id: 'constitution', label: '1987 Constitution', icon: 'gavel' },
      { id: 'constitution1899', label: '1899 Malolos', icon: 'history' },
      { id: 'constitution1935', label: '1935 Commonwealth', icon: 'history' },
      { id: 'constitution1943', label: '1943 Occupation', icon: 'history' },
      { id: 'constitution1973', label: '1973 Marcos', icon: 'history' },
      { id: 'constitution1986', label: '1986 Freedom', icon: 'history' },
      { id: 'bylaws', label: 'By-Laws', icon: 'menu_book' },
      { id: 'news', label: 'News', icon: 'newspaper' },
      { id: 'government', label: 'Government', icon: 'account_balance' },
      { id: 'reviewer', label: 'Reviewer', icon: 'school' },
    ];

    let html = `
      <h3 style="margin-bottom:16px;">📚 Learning Center</h3>
      <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;overflow-x:auto;padding-bottom:4px;max-height:180px;overflow-y:auto;">
        ${tabs.map(t => `
          <button class="tab-btn ${this.currentTab === t.id ? 'active' : ''}" data-tab="${t.id}" style="padding:10px 18px;border-radius:16px;border:none;background:${this.currentTab === t.id ? 'var(--primary)' : 'white'};color:${this.currentTab === t.id ? 'white' : 'var(--text)'};font-weight:600;font-size:0.85rem;display:flex;align-items:center;gap:6px;box-shadow:${this.currentTab === t.id ? '0 8px 20px rgba(117,153,84,0.3)' : 'var(--shadow)'};transition:.3s;cursor:pointer;">
            <span class="material-symbols-rounded" style="font-size:18px;">${t.icon}</span>
            ${t.label}
          </button>
        `).join('')}
      </div>
      <div class="card" id="learning-content">
        ${this.renderTab(this.currentTab, resources)}
      </div>
    `;

    document.getElementById('content').innerHTML = html;

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentTab = btn.dataset.tab;
        this.render();
        // Track quest progress for reading
        Storage.updateQuestProgress('read');
      });
    });
  },

  renderTab(tab, resources) {
    const content = resources[tab] || 'Content not yet available.';
    const titles = {
      'constitution': '📜 1987 Constitution (Present)',
      'constitution1899': '📜 1899 Malolos Constitution',
      'constitution1935': '📜 1935 Commonwealth Constitution',
      'constitution1943': '📜 1943 Japanese Occupation Constitution',
      'constitution1973': '📜 1973 Marcos Constitution',
      'constitution1986': '📜 1986 Freedom Constitution (Provisional)',
      'bylaws': '📋 By-Laws',
      'news': '📰 Latest News',
      'government': '🏛️ Government Updates',
      'reviewer': '📖 Reviewer'
    };

    return `
      <h4>${titles[tab] || tab}</h4>
      <div style="margin-top:12px;line-height:1.8;color:var(--text-light);white-space:pre-wrap;max-height:400px;overflow-y:auto;padding-right:8px;">
        ${sanitizeHTML(content)}
      </div>
      ${tab === 'reviewer' ? `
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border);">
          <p style="font-weight:600;color:var(--text);">📝 Download Reviewer</p>
          <button class="btn-primary" style="width:auto;padding:10px 20px;display:inline-flex;gap:8px;margin-top:8px;" onclick="window.__downloadReviewer()">
            <span class="material-symbols-rounded" style="font-size:20px;">download</span> Download PDF
          </button>
        </div>
      ` : ''}
    `;
  }
};
export {
  Storage,
  Auth,
  UI,
  NotifCenter,
  Gamification,
  Dashboard,
  Events,
  Profile,
  Leaderboard,
  Grievance,
  Learning,
  Officer,
  App
};