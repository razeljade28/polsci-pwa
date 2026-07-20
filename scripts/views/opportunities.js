import { Storage } from '../storage.js';
import { Auth } from '../auth.js';
import { UI, sanitizeHTML } from '../utils.js';

export const Opportunities = {
  render() {
    const data = Storage.getAppData();
    const userId = Auth.currentUser?.studentId;
    const items = [...data.opportunities].sort((a,b) => new Date(a.deadline) - new Date(b.deadline));

    let html = `
      <section class="opps-header">
        <p class="eyebrow">SMC CAREERS BOARD</p>
        <h2>Opportunities & Internships</h2>
        <p>Curated public leadership fellowships, civic volunteer networks, and internships exclusive to Political Science students.</p>
      </section>

      <div class="opps-filters">
        ${['All Board','Scholarships','Internships','Debates','Volunteer Work'].map(label => `
          <button class="filter-btn ${label === 'All Board' ? 'active' : ''}" data-filter="${label.replace(' ', '').toLowerCase()}">${label}</button>
        `).join('')}
      </div>

      <div id="opps-list">
        ${items.map(item => `
          <article class="opps-card" data-type="${item.type.toLowerCase()}">
            <div class="opps-type">${item.type.toUpperCase()}</div>
            <h4>${sanitizeHTML(item.title)}</h4>
            <p class="opps-org">${sanitizeHTML(item.organization)}</p>
            <p class="opps-desc">${sanitizeHTML(item.description)}</p>
            <div class="opps-footer">
              <span>📅 Due: ${item.deadline}</span>
              <button class="track-btn ${item.savedBy?.includes(userId) ? 'saved' : ''}" onclick="window.__saveOpportunity('${item.id}')">
                ${item.savedBy?.includes(userId) ? '★ Tracked' : '☆ Track Deadline'}
              </button>
            </div>
          </article>
        `).join('')}
      </div>
    `;

    document.getElementById('content').innerHTML = html;

    document.querySelectorAll('.opps-filters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.opps-filters .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('#opps-list .opps-card').forEach(card => {
          const type = card.dataset.type || '';
          card.style.display = filter === 'allboard' || type === filter ? '' : 'none';
        });
      });
    });
  },

  save(id) {
    const data = Storage.getAppData();
    const item = data.opportunities.find(x => x.id === id);
    const userId = Auth.currentUser?.studentId;
    if (!item || !userId) return;
    item.savedBy ||= [];
    if (item.savedBy.includes(userId)) {
      item.savedBy = item.savedBy.filter(x => x !== userId);
    } else {
      item.savedBy.push(userId);
    }
    Storage.saveAppData(data);
    UI.toast({ message: item.savedBy.includes(userId) ? 'Opportunity saved.' : 'Removed from saved.', type: 'success' });
    this.render();
  }
};