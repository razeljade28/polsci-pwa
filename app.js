// app.js - PWA App logic
// --------------------------------
// Mock Data Initialization
const defaultEvents = [
  { id: 1, title: 'General Assembly', date: '2026-07-20', type: 'assembly', exp: 50 },
  { id: 2, title: 'Debate Competition', date: '2026-07-25', type: 'competition', exp: 100 },
  { id: 3, title: 'Basketball Intrams', date: '2026-08-01', type: 'sports', exp: 75 },
];
const defaultBadges = [
  { id: 'b1', name: 'Best Debater', icon: '🎤', unlocked: false },
  { id: 'b2', name: 'MVP', icon: '🏀', unlocked: false },
  { id: 'b3', name: 'Perfect Attendance', icon: '✅', unlocked: false },
  { id: 'b4', name: 'Quiz Bee Champ', icon: '🏆', unlocked: false },
  { id: 'b5', name: 'Org President', icon: '👑', unlocked: false },
];
const defaultMembers = [
  { studentId: '2024-0001', name: 'Juan dela Cruz', year: '2', position: '', membership: 'Active', exp: 320, attendance: [], badges: [], achievements: ['Debate Winner Q1'], gradeConvRequested: false },
  { studentId: 'officer1', name: 'Maria Santos', year: '3', position: 'President', membership: 'Active', exp: 560, attendance: [], badges: ['b5'], achievements: [], gradeConvRequested: false },
  // more sample members
];

// Load from localStorage or initialize
if (!localStorage.getItem('appData')) {
  const data = { events: defaultEvents, members: defaultMembers, grievances: [], announcements: ['Welcome to PolSci Org! Please complete your profile.'] };
  localStorage.setItem('appData', JSON.stringify(data));
}

// Current user
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const mainScreen = document.getElementById('main-screen');
const content = document.getElementById('content');
const screenTitle = document.getElementById('screen-title');
const navButtons = document.querySelectorAll('.bottom-nav button');

// Login
document.getElementById('login-btn').addEventListener('click', () => {
  const role = document.getElementById('role-select').value;
  const studentId = document.getElementById('student-id').value.trim();
  if (!studentId) return alert('Enter Student ID');
  // Find or create member
  let appData = JSON.parse(localStorage.getItem('appData'));
  let member = appData.members.find(m => m.studentId === studentId);
  if (!member) {
    member = { studentId, name: studentId, year: '1', position: '', membership: 'Active', exp: 0, attendance: [], badges: [], achievements: [], gradeConvRequested: false };
    appData.members.push(member);
    localStorage.setItem('appData', JSON.stringify(appData));
  }
  // Set role (for demo we treat role as selected; real app would authenticate)
  currentUser = { ...member, role };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  showMain();
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  currentUser = null;
  loginScreen.classList.add('active');
  mainScreen.classList.remove('active');
});

function showMain() {
  loginScreen.classList.remove('active');
  mainScreen.classList.add('active');
  navigateTo('home');
}

// Navigation
navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const screen = btn.dataset.screen;
    navigateTo(screen);
  });
});

function navigateTo(screen) {
  switch(screen) {
    case 'home': renderHome(); break;
    case 'events': renderEvents(); break;
    case 'learning': renderLearning(); break;
    case 'profile': renderProfile(); break;
  }
}

// Render Functions
function renderHome() {
  screenTitle.textContent = 'Home';
  let appData = JSON.parse(localStorage.getItem('appData'));
  let member = appData.members.find(m => m.studentId === currentUser.studentId);
  // EXP bar
  let expHTML = `<div class="card"><h3>Hello, ${member.name}</h3>
    <p>EXP: ${member.exp} / 1000</p>
    <div class="exp-bar"><div class="exp-fill" style="width:${Math.min((member.exp/1000)*100,100)}%"></div></div>
    ${currentUser.role === 'officer' || currentUser.role === 'adviser' ? renderOfficerDashboard(appData) : ''}
    </div>`;
  // Announcements
  expHTML += `<div class="card"><h4>📢 Announcements</h4>`;
  appData.announcements.forEach(a => expHTML += `<p>• ${a}</p>`);
  expHTML += `</div>`;
  // Upcoming events
  expHTML += `<div class="card"><h4>📅 Upcoming Events</h4>`;
  appData.events.slice(0,3).forEach(e => expHTML += `<p>${e.title} - ${e.date} (${e.exp} EXP)</p>`);
  expHTML += `</div>`;
  content.innerHTML = expHTML;
}

function renderOfficerDashboard(appData) {
  let pendingGrievance = appData.grievances.filter(g => g.status === 'submitted').length;
  let pendingGradeConv = appData.members.filter(m => m.gradeConvRequested).length;
  return `
    <div class="officer-widget">
      <div class="widget" onclick="showLeaderboard()"><span class="number">${appData.members.length}</span><br>Members</div>
      <div class="widget" onclick="viewGrievances()"><span class="number">${pendingGrievance}</span><br>Grievances</div>
      <div class="widget"><span class="number">${pendingGradeConv}</span><br>Grade Req</div>
    </div>
    <button onclick="showAwardBadgeForm()">Award Badge</button>
    <button onclick="showGradeRequests()" class="secondary">Review Grade Conversions</button>
  `;
}
// ... other functions: renderEvents, renderLearning, renderProfile, checkIn, submitGrievance, etc.
// I'll include all in final code but keep this response manageable.