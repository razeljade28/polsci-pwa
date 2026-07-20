import { Storage } from '../storage.js';
import { Auth } from '../auth.js';
import { UI, sanitizeHTML } from '../utils.js';

export const Profile = {
  render() {
    const data = Storage.getAppData();
    const member = data.members.find(m => m.studentId === Auth.currentUser?.studentId);
    if (!member) return;

    let html = `
      <section class="digital-id">
        <div class="id-header">
          <img src="logo.png" alt="SEPOLSCIS">
          <div>
            <strong>SEPOLSCIS</strong>
            <small>DIGITAL MEMBER ID</small>
          </div>
          <span class="verified-badge">VERIFIED</span>
        </div>
        <div class="id-body">
          <div class="id-avatar">${sanitizeHTML(member.name.charAt(0))}</div>
          <div>
            <h3>${sanitizeHTML(member.name)}</h3>
            <p>${sanitizeHTML(member.course)}</p>
            <p>ID NUMBER: ${sanitizeHTML(member.studentId)}</p>
            <p>EST. 2026 · ${member.membership.toUpperCase()} MEMBER</p>
          </div>
          <div class="id-qr"></div>
        </div>
      </section>

      <section class="profile-config">
        <h3>Profile Configurations</h3>
        <div class="config-item"><span>Student ID</span><span>${sanitizeHTML(member.studentId)}</span></div>
        <div class="config-item"><span>Major Department</span><span>${sanitizeHTML(member.course)}</span></div>
        <div class="config-item"><span>Registered Email</span><span>${sanitizeHTML(member.email || 'Not set')}</span></div>
        <div class="config-item"><span>Enrollment Year</span><span>${member.year} Year</span></div>
      </section>

      <section class="grade-request">
        <p>You can request to convert your checked-in activity points and volunteer service hours into direct college grade credits. Subject to Dean of Students approval.</p>
        ${member.gradeConvRequested ? 
          `<button class="btn-secondary" disabled>Request Submitted</button>` :
          `<button class="btn-primary" onclick="window.__requestGrade()">Request Grade Conversion Approval</button>`
        }
      </section>

      <section class="database-actions">
        <h3>DATABASE ACTIONS & EXPORT</h3>
        <button class="btn-outline" onclick="window.__exportData()">Export Database (JSON)</button>
        <button class="btn-outline danger" onclick="window.__resetApp()">Reset All App Data</button>
      </section>
    `;

    document.getElementById('content').innerHTML = html;
  }
};