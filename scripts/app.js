// app.js
import { Auth } from './auth.js';
import { UI, sanitizeHTML } from './utils.js';
import { NotifCenter } from './notifications.js';
import { Dashboard } from './views/dashboard.js';
import { Learning } from './views/learning.js';
import { Events } from './views/events.js';
import { Opportunities } from './views/opportunities.js';
import { Portfolio } from './views/portfolio.js';
import { Profile } from './views/profile.js';
import { Officer } from './views/officer.js';
import { Grievance } from './views/grievance.js';
import { Storage } from './storage.js';

export const App = {
  init() {
    UI.init();
    this.setupListeners();
    this.setupPWA();

    // Dark mode
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark');
    }

    // Show admin nav if officer
    document.getElementById('admin-nav-btn')?.classList.toggle('hidden', !Auth.isOfficer());

    // Load home
    this.navigate('home');
    NotifCenter.updateBadge();
    UI.hideLoading();
  },

  setupListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.navigate(btn.dataset.screen);
      });
    });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        Auth.logout();
        window.location.href = 'login.html';
      }
    });

    // Notifications
    document.getElementById('notif-btn')?.addEventListener('click', () => NotifCenter.render());

    // FAB QR check-in
    document.getElementById('fab-checkin')?.addEventListener('click', () => this.handleQRCheckin());

    // Install PWA
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      document.getElementById('install-banner')?.classList.remove('hidden');
      document.getElementById('install-btn')?.addEventListener('click', () => {
        if (window.deferredPrompt) {
          window.deferredPrompt.prompt();
          window.deferredPrompt.userChoice.then(() => {
            document.getElementById('install-banner').classList.add('hidden');
          });
        }
      });
    });

    window.addEventListener('appinstalled', () => {
      document.getElementById('install-banner').classList.add('hidden');
      UI.toast('🎉 App installed successfully!', 'success');
    });

    // Service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
          .catch(() => console.log('SW registration failed'));
      });
    }

    // Global shortcut functions for inline onclick
    window.__nav = (screen) => this.navigate(screen);
    window.__showGrievance = () => Grievance.showForm();
    window.__viewGrievances = () => { this.navigate('officer'); setTimeout(() => Officer.renderGrievances(), 100); };
    window.__viewGradeRequests = () => { this.navigate('officer'); setTimeout(() => Officer.renderGradeRequests(), 100); };
    window.__awardBadge = () => Officer.showAwardBadge();
    window.__showAnnouncementForm = () => Officer.showAnnouncementForm();
    window.__createEvent = () => Officer.createEvent();
    window.__saveOpportunity = (id) => Opportunities.save(id);
    window.__requestGrade = () => { /* ... unchanged */ };
    window.__resetApp = () => { /* ... */ };
    window.__exportData = () => { /* ... */ };
    window.__deleteEvent = (id) => Officer.deleteEvent(id);
    window.__viewMember = (id) => Officer.viewMember(id);
    window.__approveGrade = (id) => Officer.approveGrade(id);
    window.__rejectGrade = (id) => Officer.rejectGrade(id);
    window.__downloadReviewer = () => { /* ... */ };
    window.__answerLearningQuiz = (id, answer) => Learning.answerQuiz(id, answer);
  },

  navigate(screen) {
    const titleMap = {
      home: 'Dashboard',
      learning: 'Learning Center',
      events: 'Events',
      opportunities: 'Opportunities',
      portfolio: 'Rewards',
      profile: 'Profile',
      officer: 'Admin',
      grievance: 'Grievance'
    };
    document.getElementById('screen-title').textContent = titleMap[screen] || screen;

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(b => {
      b.classList.toggle('active', b.dataset.screen === screen);
    });

    // Render view
    switch (screen) {
      case 'home': Dashboard.render(); break;
      case 'learning': Learning.render(); break;
      case 'events': Events.render(); break;
      case 'opportunities': Opportunities.render(); break;
      case 'portfolio': Portfolio.render(); break;
      case 'profile': Profile.render(); break;
      case 'officer': Officer.renderDashboard(); break;
      case 'grievance': Grievance.render(); break;
      default: Dashboard.render();
    }

    this.updateGreeting();
  },

  updateGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Good Evening';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 17) greeting = 'Good Afternoon';
    document.getElementById('greeting').textContent = greeting;
  },

  handleQRCheckin() {
    // Lazy load QR scanner only when needed
    import('https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js').then((module) => {
      const Html5Qrcode = module.default;
      const data = Storage.getAppData();
      const upcoming = data.events.filter(e => new Date(e.date) >= new Date());
      if (upcoming.length === 0) {
        return UI.toast('No upcoming events to check in to.', 'warning');
      }

      UI.modal(`
        <h3>📷 Scan QR Code</h3>
        <div id="qr-reader" style="width:100%;max-width:400px;margin:auto;"></div>
        <button class="text-btn" data-close-modal style="margin-top:12px;">Cancel</button>
      `);

      const reader = new Html5Qrcode("qr-reader");
      reader.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          reader.stop();
          UI.closeModal();
          const eventId = parseInt(decodedText);
          const event = data.events.find(e => e.id === eventId);
          if (event) {
            Events.checkin(eventId);
          } else {
            UI.toast('Invalid event QR code.', 'error');
          }
        },
        () => {}
      );

      // Cleanup on modal close
      document.querySelector('[data-close-modal]')?.addEventListener('click', () => {
        reader.stop().catch(() => {});
      });
    }).catch(() => {
      UI.toast('QR scanner library could not be loaded.', 'error');
    });
  },

  setupPWA() {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = '#2C5E3A';
  }
};

// Entry point (called from index.html)
if (!Auth.init()) {
  window.location.href = 'login.html';
} else {
  App.init();
}