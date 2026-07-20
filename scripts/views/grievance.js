// grievance.js
import { Storage } from '../storage.js';
import { Auth } from '../auth.js';
import { UI } from '../utils.js';
import { NotifCenter } from '../notifications.js';

export const Grievance = {
  render() {
    const data = Storage.getAppData();
    const user = Auth.currentUser;
    const isOfficer = Auth.isOfficer();
    const isGrievance = Auth.isGrievance();

    let grievances = data.grievances || [];
    // if user is not officer, only show their own
    if (!isOfficer && !isGrievance) {
      grievances = grievances.filter(g => g.memberId === user.studentId);
    }

    let html = `
      <section class="grievance-header">
        <p class="eyebrow">ADVISORY & GRIEVANCE</p>
        <h2>${isOfficer || isGrievance ? 'Manage Grievances' : 'My Grievances'}</h2>
        <p>${isOfficer || isGrievance ? 'Review and resolve student concerns.' : 'Submit concerns confidentially.'}</p>
      </section>
      ${!isOfficer && !isGrievance ? `
        <button class="btn-primary" style="margin-bottom:16px;width:auto;padding:12px 24px;" id="new-grievance-btn">
          <span class="material-symbols-rounded">add</span> Submit New Grievance
        </button>
      ` : ''}
      <div class="grievance-tabs">
        <button class="tab-btn active" data-filter="all">All</button>
        <button class="tab-btn" data-filter="submitted">Submitted</button>
        <button class="tab-btn" data-filter="in-review">In Review</button>
        <button class="tab-btn" data-filter="resolved">Resolved</button>
      </div>
      <div id="grievance-list">
        ${grievances.length === 0 ? UI.emptyState('No grievances found.', 'gavel') : ''}
        ${grievances.map(g => this.renderCard(g, isOfficer || isGrievance)).join('')}
      </div>
    `;

    document.getElementById('content').innerHTML = html;

    // tabs
    document.querySelectorAll('.grievance-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.grievance-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterList(btn.dataset.filter);
      });
    });

    // new grievance button
    document.getElementById('new-grievance-btn')?.addEventListener('click', () => this.showForm());
  },

  renderCard(g, isAdmin) {
    const statusMap = {
      submitted: '🟡 Submitted',
      'in-review': '🔵 In Review',
      resolved: '🟢 Resolved'
    };
    return `
      <div class="grievance-card" data-status="${g.status}">
        <div class="grievance-meta">
          <strong>${g.anonymous ? 'Anonymous' : g.memberId}</strong>
          <span class="status-badge ${g.status}">${statusMap[g.status] || g.status}</span>
          <small>${new Date(g.createdAt).toLocaleDateString()}</small>
        </div>
        <h4>${UI.sanitize(g.title)}</h4>
        <p>${UI.sanitize(g.description)}</p>
        ${g.notes ? `<div class="grievance-notes"><strong>Officer Notes:</strong> ${UI.sanitize(g.notes)}</div>` : ''}
        ${g.resolution ? `<div class="grievance-resolution"><strong>Resolution:</strong> ${UI.sanitize(g.resolution)}</div>` : ''}
        ${isAdmin && g.status !== 'resolved' ? `
          <div class="grievance-actions">
            <button class="btn-outline" data-update="${g.id}" data-status="in-review">Mark In Review</button>
            <button class="btn-primary" data-resolve="${g.id}">Resolve</button>
          </div>
        ` : ''}
        ${isAdmin && g.status === 'resolved' ? `<button class="btn-outline" data-update="${g.id}" data-status="submitted">Reopen</button>` : ''}
      </div>
    `;
  },

  filterList(status) {
    const cards = document.querySelectorAll('#grievance-list .grievance-card');
    cards.forEach(card => {
      const cardStatus = card.dataset.status;
      const show = status === 'all' || cardStatus === status;
      card.style.display = show ? '' : 'none';
    });
  },

  showForm() {
    UI.modal(`
      <h3>Submit a Grievance</h3>
      <form id="grievance-form">
        <div class="form-group">
          <label>Title</label>
          <input type="text" id="grievance-title" placeholder="Brief title" required>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea id="grievance-desc" rows="4" placeholder="Describe your concern..." required></textarea>
        </div>
        <div class="form-group checkbox">
          <label>
            <input type="checkbox" id="grievance-anonymous"> Submit anonymously
          </label>
        </div>
        <button type="submit" class="btn-primary">Submit</button>
        <button type="button" class="text-btn" data-close-modal>Cancel</button>
      </form>
    `);

    document.getElementById('grievance-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('grievance-title').value.trim();
      const description = document.getElementById('grievance-desc').value.trim();
      const anonymous = document.getElementById('grievance-anonymous').checked;
      if (!title || !description) return UI.toast('Please fill all fields.', 'error');

      const g = {
        memberId: Auth.currentUser.studentId,
        title,
        description,
        anonymous,
        status: 'submitted',
        notes: '',
        resolution: ''
      };
      Storage.addGrievance(g);
      UI.toast('Grievance submitted successfully.', 'success');
      UI.closeModal();
      this.render();
      Storage.updateQuestProgress('grievance');
    });
  },

  updateStatus(id, status) {
    Storage.updateGrievance(id, { status });
    UI.toast(`Status updated to ${status}.`, 'info');
    this.render();
  },

  resolve(id) {
    UI.modal(`
      <h3>Resolve Grievance</h3>
      <form id="resolve-form">
        <div class="form-group">
          <label>Resolution Details</label>
          <textarea id="resolution-text" rows="3" placeholder="Explain how this was resolved..." required></textarea>
        </div>
        <button type="submit" class="btn-primary">Resolve</button>
        <button type="button" class="text-btn" data-close-modal>Cancel</button>
      </form>
    `);
    document.getElementById('resolve-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const resolution = document.getElementById('resolution-text').value.trim();
      if (!resolution) return UI.toast('Please provide resolution details.', 'error');
      Storage.updateGrievance(id, { status: 'resolved', resolution });
      UI.toast('Grievance resolved.', 'success');
      UI.closeModal();
      this.render();
    });
  }
};

// Bind global actions for inline click handlers
window.__updateGrievance = (id, status) => Grievance.updateStatus(id, status);
window.__resolveGrievance = (id) => Grievance.resolve(id);
window.__showGrievanceForm = () => Grievance.showForm();