import { Storage } from '../storage.js';
import { Auth } from '../auth.js';
import { Gamification } from '../gamification.js';
import { UI, sanitizeHTML } from '../utils.js';

export const Officer = {
  renderDashboard() {
    if (!Auth.isOfficer()) return;
    const data = Storage.getAppData();
    const total = data.members.length;
    const avgExp = Math.round(data.members.reduce((s, m) => s + m.exp, 0) / total) || 0;
    const pendingGrievances = data.grievances.filter(g => g.status !== 'resolved').length;
    const gradeRequests = data.members.filter(m => m.gradeConvRequested).length;
    const topMembers = [...data.members].sort((a,b) => b.exp - a.exp).slice(0, 5);

    let html = `
      <section class="admin-header">
        <p class="eyebrow">ADMINISTRATIVE AUTHORIZATION ACCESS</p>
        <h2>Officer Operations Desk</h2>
        <p>Active Officer: ${sanitizeHTML(Auth.currentUser.name)} (${sanitizeHTML(Auth.currentUser.position || 'Officer')})</p>
      </section>

      <div class="admin-actions">
        <button onclick="window.__showAnnouncementForm()">📢 Broadcast Announcement</button>
        <button onclick="window.__createEvent()">📅 Create Board Event</button>
        <button onclick="window.__awardBadge()">🏅 Award Honors Badge</button>
        <button onclick="window.__viewGrievances()">📋 Grievances & Grade Requests</button>
      </div>

      <div class="analytics-grid">
        <div class="analytics-card">
          <span class="material-symbols-rounded">groups</span>
          <strong>${total}</strong>
          <span>Total Students</span>
          <small>SMIC PolSci Enrollees</small>
        </div>
        <div class="analytics-card">
          <span class="material-symbols-rounded">trending_up</span>
          <strong>${avgExp}</strong>
          <span>Average Standing</span>
          <small>App‑wide member average</small>
        </div>
        <div class="analytics-card">
          <span class="material-symbols-rounded">gavel</span>
          <strong>${pendingGrievances}</strong>
          <span>Pending Grievances</span>
          <small>${data.grievances.length} submitted overall</small>
        </div>
        <div class="analytics-card">
          <span class="material-symbols-rounded">assignment</span>
          <strong>${gradeRequests}</strong>
          <span>Grade Requests</span>
          <small>Pending officer review</small>
        </div>
      </div>

      <section class="active-enrollment">
        <h3>Active Enrollment Standings</h3>
        ${topMembers.map((m, i) => `
          <div class="enrollment-item">
            <span class="rank">#${i+1}</span>
            <div>
              <strong>${sanitizeHTML(m.name)}</strong>
              <small>${sanitizeHTML(m.course)} · ID: ${sanitizeHTML(m.studentId)}</small>
            </div>
            <span class="exp">${m.exp} EXP</span>
          </div>
        `).join('')}
      </section>
    `;

    document.getElementById('content').innerHTML = html;
  },

  // ---- Announcement ----
  showAnnouncementForm() {
    UI.modal(`
      <h3>Broadcast Announcement</h3>
      <form id="announcement-form">
        <div class="form-group">
          <label>Message</label>
          <textarea id="announcement-text" rows="3" placeholder="Enter your announcement..."></textarea>
        </div>
        <button type="submit" class="btn-primary">Publish</button>
        <button type="button" class="text-btn" data-close-modal>Cancel</button>
      </form>
    `);
    document.getElementById('announcement-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const text = document.getElementById('announcement-text').value.trim();
      if (!text) return UI.toast('Please enter a message.', 'error');
      Storage.addAnnouncement(text);
      UI.toast('Announcement published.', 'success');
      UI.closeModal();
    });
  },

  // ---- Create Event ----
  createEvent() {
    UI.modal(`
      <h3>Create New Event</h3>
      <form id="event-form">
        <div class="form-group"><label>Title</label><input id="ev-title" required></div>
        <div class="form-group"><label>Date</label><input id="ev-date" type="date" required></div>
        <div class="form-group"><label>Type</label>
          <select id="ev-type">
            <option>assembly</option><option>competition</option><option>sports</option><option>volunteer</option>
          </select>
        </div>
        <div class="form-group"><label>Location</label><input id="ev-location" required></div>
        <div class="form-group"><label>Description</label><textarea id="ev-desc" rows="3"></textarea></div>
        <div class="form-group"><label>EXP Reward</label><input id="ev-exp" type="number" value="50"></div>
        <div class="form-group"><label>Capacity</label><input id="ev-capacity" type="number" value="50"></div>
        <button type="submit" class="btn-primary">Create Event</button>
        <button type="button" class="text-btn" data-close-modal>Cancel</button>
      </form>
    `);
    document.getElementById('event-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const event = {
        title: document.getElementById('ev-title').value.trim(),
        date: document.getElementById('ev-date').value,
        type: document.getElementById('ev-type').value,
        location: document.getElementById('ev-location').value.trim(),
        description: document.getElementById('ev-desc').value.trim(),
        exp: parseInt(document.getElementById('ev-exp').value) || 50,
        capacity: parseInt(document.getElementById('ev-capacity').value) || 50,
        rsvps: {}
      };
      if (!event.title || !event.date || !event.location) return UI.toast('Please fill all required fields.', 'error');
      Storage.addEvent(event);
      UI.toast('Event created successfully.', 'success');
      UI.closeModal();
    });
  },

  // ---- Award Badge ----
  showAwardBadge() {
    const data = Storage.getAppData();
    const members = data.members;
    const badges = Gamification.getBadgeDefinitions();
    const badgeOptions = badges.map(b => `<option value="${b.id}">${b.name}</option>`).join('');

    UI.modal(`
      <h3>Award Badge to Member</h3>
      <form id="badge-form">
        <div class="form-group">
          <label>Member</label>
          <select id="badge-member">
            ${members.map(m => `<option value="${m.studentId}">${m.name} (${m.studentId})</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Badge</label>
          <select id="badge-select">${badgeOptions}</select>
        </div>
        <button type="submit" class="btn-primary">Award</button>
        <button type="button" class="text-btn" data-close-modal>Cancel</button>
      </form>
    `);
    document.getElementById('badge-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const studentId = document.getElementById('badge-member').value;
      const badgeId = document.getElementById('badge-select').value;
      const member = data.members.find(m => m.studentId === studentId);
      if (!member) return UI.toast('Member not found.', 'error');
      if (member.badges.includes(badgeId)) return UI.toast('Member already has this badge.', 'warning');
      member.badges.push(badgeId);
      Storage.saveAppData(data);
      UI.toast('Badge awarded!', 'success');
      UI.closeModal();
    });
  },

  // ---- Grievances ----
  renderGrievances() {
    // This is called from the admin nav; we'll just navigate to grievance view
    // but we can also show a dedicated list. For simplicity, we'll redirect to Grievance view.
    window.__nav('grievance');
  },

  // ---- Grade Requests ----
  renderGradeRequests() {
    const data = Storage.getAppData();
    const requests = data.members.filter(m => m.gradeConvRequested);
    let html = `
      <section class="admin-header">
        <p class="eyebrow">ADMIN</p>
        <h2>Grade Conversion Requests</h2>
      </section>
      ${requests.length === 0 ? UI.emptyState('No pending grade requests.', 'assignment') : ''}
      ${requests.map(m => `
        <div class="grade-request-item" style="background:var(--surface);padding:16px;border-radius:var(--radius-sm);margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <strong>${sanitizeHTML(m.name)}</strong> (${m.studentId})<br>
            <small>EXP: ${m.exp} | ${m.attendance?.length || 0} events attended</small>
          </div>
          <div>
            <button class="btn-primary" style="width:auto;padding:6px 16px;display:inline-flex;" onclick="window.__approveGrade('${m.studentId}')">Approve</button>
            <button class="btn-outline" style="width:auto;padding:6px 16px;display:inline-flex;border-color:#E57373;color:#E57373;" onclick="window.__rejectGrade('${m.studentId}')">Reject</button>
          </div>
        </div>
      `).join('')}
      <button class="text-btn" onclick="window.__nav('officer')">← Back to Admin</button>
    `;
    document.getElementById('content').innerHTML = html;
  },

  approveGrade(studentId) {
    Storage.updateMember(studentId, { gradeConvRequested: false });
    UI.toast('Grade conversion approved.', 'success');
    this.renderGradeRequests();
  },
  rejectGrade(studentId) {
    Storage.updateMember(studentId, { gradeConvRequested: false });
    UI.toast('Grade conversion rejected.', 'info');
    this.renderGradeRequests();
  },

  // ---- Delete Event ----
  deleteEvent(id) {
    if (confirm('Delete this event?')) {
      Storage.deleteEvent(id);
      UI.toast('Event deleted.', 'info');
      window.__nav('events');
    }
  },

  // ---- View Member ----
  viewMember(studentId) {
    const data = Storage.getAppData();
    const member = data.members.find(m => m.studentId === studentId);
    if (!member) return UI.toast('Member not found.', 'error');
    UI.modal(`
      <h3>Member Profile</h3>
      <p><strong>Name:</strong> ${sanitizeHTML(member.name)}</p>
      <p><strong>ID:</strong> ${member.studentId}</p>
      <p><strong>Course:</strong> ${sanitizeHTML(member.course)}</p>
      <p><strong>EXP:</strong> ${member.exp}</p>
      <p><strong>Badges:</strong> ${member.badges.length}</p>
      <p><strong>Attendance:</strong> ${member.attendance?.length || 0} events</p>
      <button class="text-btn" data-close-modal>Close</button>
    `);
  }
};

// Bind global functions used in inline onclick
window.__showAnnouncementForm = () => Officer.showAnnouncementForm();
window.__createEvent = () => Officer.createEvent();
window.__awardBadge = () => Officer.showAwardBadge();
window.__viewGrievances = () => Officer.renderGrievances();
window.__viewGradeRequests = () => Officer.renderGradeRequests();
window.__approveGrade = (id) => Officer.approveGrade(id);
window.__rejectGrade = (id) => Officer.rejectGrade(id);
window.__deleteEvent = (id) => Officer.deleteEvent(id);
window.__viewMember = (id) => Officer.viewMember(id);