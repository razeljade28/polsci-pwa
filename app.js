// ================================================================
// SEPOLSCIS - Complete Application Logic
// All features: Streak, Quests, Quizzes, Resources, Charts, etc.
// ================================================================

// ================================================================
// MODULE: Storage
// ================================================================
const Storage = {
    get(key) {
        try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
    },
    set(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    },
    remove(key) {
        localStorage.removeItem(key);
    },
    getAppData() {
        let data = this.get('appData');
        if (!data) {
            data = this.getDefaultData();
            this.set('appData', data);
        }
        // Ensure new fields exist for future features
        if (!data.auditLog) data.auditLog = [];
        if (!data.quests) data.quests = this.getDefaultQuests();
        if (!data.quizzes) data.quizzes = this.getDefaultQuizzes();
        if (!data.resources) data.resources = this.getDefaultResources();
        if (!data.streaks) data.streaks = {};
        if (!data.readResources) data.readResources = [];
        if (!data.quizAttempts) data.quizAttempts = [];
        if (!data.settings) data.settings = { multiplier: 1 };
        if (!data.onboardingCompleted) data.onboardingCompleted = false;
        this.saveAppData(data);
        return data;
    },
    saveAppData(data) {
        this.set('appData', data);
    },
    getDefaultData() {
        return {
            events: [
                { id: 1, title: 'General Assembly', date: '2026-07-20', type: 'assembly', exp: 50, location: 'Room 101',
                    description: 'Monthly general assembly for all members.' },
                { id: 2, title: 'Debate Competition', date: '2026-07-25', type: 'competition', exp: 100,
                    location: 'Auditorium', description: 'Inter-school debate competition.' },
                { id: 3, title: 'Basketball Intrams', date: '2026-08-01', type: 'sports', exp: 75,
                    location: 'Gymnasium', description: 'Intramural basketball tournament.' },
                { id: 4, title: 'Quiz Bee', date: '2026-08-10', type: 'competition', exp: 80, location: 'Room 203',
                    description: 'Political Science quiz bee.' },
                { id: 5, title: 'Volunteer Drive', date: '2026-08-15', type: 'volunteer', exp: 50,
                    location: 'Community Center', description: 'Community outreach program.' },
            ],
            members: [{
                studentId: '2024-0001',
                name: 'Juan dela Cruz',
                year: '2',
                course: 'B.A. Political Science',
                position: '',
                membership: 'Active',
                exp: 320,
                attendance: ['2026-07-01', '2026-07-08', '2026-07-15'],
                badges: ['b1'],
                achievements: ['Debate Winner Q1'],
                gradeConvRequested: false,
                email: 'juan@example.com',
                password: 'demo123',
                avatar: null,
                streak: 0,
                lastLogin: null,
                questProgress: {}
            }, {
                studentId: 'officer1',
                name: 'Maria Santos',
                year: '3',
                course: 'B.A. Political Science',
                position: 'President',
                membership: 'Active',
                exp: 560,
                attendance: ['2026-07-01', '2026-07-08', '2026-07-15', '2026-07-22'],
                badges: ['b5', 'b3'],
                achievements: ['Best Leader 2025'],
                gradeConvRequested: false,
                email: 'maria@example.com',
                password: 'demo123',
                avatar: null,
                streak: 0,
                lastLogin: null,
                questProgress: {}
            }, {
                studentId: '2024-0002',
                name: 'Pedro Reyes',
                year: '1',
                course: 'B.A. Political Science',
                position: '',
                membership: 'Active',
                exp: 180,
                attendance: ['2026-07-01', '2026-07-15'],
                badges: [],
                achievements: [],
                gradeConvRequested: false,
                email: 'pedro@example.com',
                password: 'demo123',
                avatar: null,
                streak: 0,
                lastLogin: null,
                questProgress: {}
            }, {
                studentId: '2024-0003',
                name: 'Ana Flores',
                year: '2',
                course: 'B.A. Political Science',
                position: 'Secretary',
                membership: 'Active',
                exp: 420,
                attendance: ['2026-07-01', '2026-07-08', '2026-07-15', '2026-07-22'],
                badges: ['b2'],
                achievements: ['Top Performer Q2'],
                gradeConvRequested: false,
                email: 'ana@example.com',
                password: 'demo123',
                avatar: null,
                streak: 0,
                lastLogin: null,
                questProgress: {}
            }, {
                studentId: '2024-0004',
                name: 'Carlos Mendoza',
                year: '3',
                course: 'B.A. Political Science',
                position: '',
                membership: 'Active',
                exp: 720,
                attendance: ['2026-07-01', '2026-07-08', '2026-07-15', '2026-07-22', '2026-07-29'],
                badges: ['b1', 'b4'],
                achievements: ['Quiz Bee Champion 2025', 'Debate Finalist'],
                gradeConvRequested: true,
                email: 'carlos@example.com',
                password: 'demo123',
                avatar: null,
                streak: 0,
                lastLogin: null,
                questProgress: {}
            }],
            grievances: [{
                id: 'g1',
                memberId: '2024-0001',
                title: 'Schedule Conflict',
                description: 'The general assembly conflicts with my class schedule.',
                anonymous: false,
                status: 'submitted',
                createdAt: '2026-07-10T10:00:00',
                updatedAt: '2026-07-10T10:00:00',
                notes: '',
                resolution: ''
            }, {
                id: 'g2',
                memberId: 'officer1',
                title: 'Event Venue Issue',
                description: 'The debate venue is too small for the expected participants.',
                anonymous: true,
                status: 'in-progress',
                createdAt: '2026-07-12T14:30:00',
                updatedAt: '2026-07-14T09:00:00',
                notes: 'Looking for alternative venue.',
                resolution: ''
            }],
            announcements: [
                'Welcome to SEPOLSCIS! Please complete your profile.',
                'General Assembly on July 20 at Room 101. See you there!',
                'Debate Competition registration is now open until July 22.'
            ],
            notifications: [],
            checkIns: [],
            learningResources: {
                constitution: 'The Political Science Student Organization Constitution...',
                bylaws: 'Article I: Name and Purpose...',
                news: 'Latest updates from the department...',
                government: 'Recent government policies and updates...',
                reviewer: 'Midterm reviewer for POLSCI 101...'
            },
            auditLog: [],
            quests: [],
            quizzes: [],
            resources: [],
            streaks: {},
            readResources: [],
            quizAttempts: [],
            settings: { multiplier: 1 },
            onboardingCompleted: false
        };
    },
    getDefaultQuests() {
        return [
            { id: 'q1', title: 'First Check-In', desc: 'Attend your first event', icon: '✅', goal: 1, progress: 0, reward: 25, type: 'checkin' },
            { id: 'q2', title: 'Active Week', desc: 'Attend 3 events in a week', icon: '📅', goal: 3, progress: 0, reward: 75, type: 'checkin_weekly' },
            { id: 'q3', title: 'Streak Starter', desc: 'Maintain a 3-day streak', icon: '🔥', goal: 3, progress: 0, reward: 50, type: 'streak' },
            { id: 'q4', title: 'Debate Star', desc: 'Win a debate competition', icon: '🎤', goal: 1, progress: 0, reward: 100, type: 'win_debate' },
            { id: 'q5', title: 'Volunteer Hero', desc: 'Volunteer at 2 events', icon: '🤝', goal: 2, progress: 0, reward: 80, type: 'volunteer' },
            { id: 'q6', title: 'Quiz Master', desc: 'Score 80%+ on a quiz', icon: '🏆', goal: 1, progress: 0, reward: 50, type: 'quiz_high_score' },
            { id: 'q7', title: 'Badge Collector', desc: 'Earn 3 badges', icon: '🏅', goal: 3, progress: 0, reward: 100, type: 'badges' },
            { id: 'q8', title: 'Perfect Month', desc: 'Attend 10 events in a month', icon: '📆', goal: 10, progress: 0, reward: 150, type: 'attendance_monthly' },
            { id: 'q9', title: 'Resource Reader', desc: 'Read 5 resources', icon: '📖', goal: 5, progress: 0, reward: 60, type: 'read_resources' },
            { id: 'q10', title: 'Community Leader', desc: 'Check-in 5 times', icon: '👥', goal: 5, progress: 0, reward: 40, type: 'checkins_total' },
            { id: 'q11', title: 'Social Butterfly', desc: 'Comment on 3 announcements', icon: '💬', goal: 3, progress: 0, reward: 45, type: 'comments' },
            { id: 'q12', title: 'Event Host', desc: 'Create an event (officers)', icon: '🎉', goal: 1, progress: 0, reward: 60, type: 'create_event' },
        ];
    },
    getDefaultQuizzes() {
        return [{
            id: 'qz1',
            title: 'Political Science Basics',
            description: 'Test your knowledge of political science fundamentals.',
            questions: [
                { q: 'What is the study of politics and power?', options: ['Sociology', 'Political Science', 'Economics', 'History'], answer: 1 },
                { q: 'Which philosopher wrote "The Republic"?', options: ['Aristotle', 'Plato', 'Socrates', 'Machiavelli'], answer: 1 },
                { q: 'What is the social contract theory?', options: ['Agreement between people and government', 'Economic theory', 'Religious doctrine', 'Military strategy'], answer: 0 },
                { q: 'Which branch of government interprets laws?', options: ['Executive', 'Legislative', 'Judicial', 'Administrative'], answer: 2 },
                { q: 'What is democracy?', options: ['Rule by one', 'Rule by the people', 'Rule by the few', 'Rule by the military'], answer: 1 },
            ],
            expReward: 50
        }, {
            id: 'qz2',
            title: 'Philippine Government',
            description: 'Test your knowledge of the Philippine political system.',
            questions: [
                { q: 'What is the current constitution of the Philippines?', options: ['1987 Constitution', '1973 Constitution', '1935 Constitution', '1899 Constitution'], answer: 0 },
                { q: 'How many branches does the Philippine government have?', options: ['2', '3', '4', '5'], answer: 1 },
                { q: 'Who is the head of the executive branch?', options: ['President', 'Vice President', 'Senate President', 'Chief Justice'], answer: 0 },
                { q: 'What is the legislative branch called?', options: ['Congress', 'Parliament', 'Assembly', 'Council'], answer: 0 },
                { q: 'Which house of Congress has 24 members?', options: ['House of Representatives', 'Senate', 'Supreme Court', 'Cabinet'], answer: 1 },
            ],
            expReward: 75
        }, {
            id: 'qz3',
            title: 'International Relations',
            description: 'Test your understanding of global politics.',
            questions: [
                { q: 'What is the UN?', options: ['United Nations', 'Universal Network', 'Union of Nations', 'United Negotiations'], answer: 0 },
                { q: 'Which country has the most veto power in the UN Security Council?', options: ['USA', 'Russia', 'China', 'All five permanent members'], answer: 3 },
                { q: 'What is NATO?', options: ['North Atlantic Treaty Organization', 'National Association of Trade Organizations', 'North American Trade Alliance', 'None'], answer: 0 },
                { q: 'What is the European Union?', options: ['Economic and political union', 'Military alliance', 'Cultural organization', 'Trade bloc only'], answer: 0 },
                { q: 'Which is not a permanent member of the UN Security Council?', options: ['USA', 'Russia', 'China', 'Germany'], answer: 3 },
            ],
            expReward: 100
        }];
    },
    getDefaultResources() {
        return [
            { id: 'r1', title: 'Introduction to Political Science', type: 'pdf', url: '#', thumbnail: '📄', description: 'A comprehensive overview of political science.' },
            { id: 'r2', title: 'Philippine Constitution (1987)', type: 'pdf', url: '#', thumbnail: '📄', description: 'Full text of the 1987 Philippine Constitution.' },
            { id: 'r3', title: 'Comparative Politics Lecture', type: 'video', url: '#', thumbnail: '🎬', description: 'Video lecture on comparative political systems.' },
            { id: 'r4', title: 'Political Theory Reading List', type: 'link', url: '#', thumbnail: '🔗', description: 'Curated list of essential political theory readings.' },
            { id: 'r5', title: 'Current Events in Government', type: 'link', url: '#', thumbnail: '📰', description: 'Stay updated with the latest government news.' },
        ];
    }
};

// ================================================================
// MODULE: Auth
// ================================================================
const Auth = {
    currentUser: null,

    init() {
        this.currentUser = Storage.getCurrentUser();
        if (this.currentUser) {
            const member = Storage.getMember(this.currentUser.studentId);
            if (member) {
                this.currentUser = { ...member, role: this.currentUser.role || 'member' };
                Storage.setCurrentUser(this.currentUser);
                // Check streak on login
                this.updateStreak(member.studentId);
                return true;
            } else {
                Storage.removeCurrentUser();
                this.currentUser = null;
                return false;
            }
        }
        return false;
    },

    login(studentId, password, role) {
        if (!studentId) return { success: false, message: 'Student ID is required.' };
        if (!password) return { success: false, message: 'Password is required.' };

        let data = Storage.getAppData();
        let member = data.members.find(m => m.studentId === studentId);

        if (member) {
            if (member.password && member.password !== password) {
                return { success: false, message: 'Invalid password.' };
            }
        } else {
            member = {
                studentId,
                name: studentId,
                year: '1',
                course: 'B.A. Political Science',
                position: '',
                membership: 'Active',
                exp: 0,
                attendance: [],
                badges: [],
                achievements: [],
                gradeConvRequested: false,
                email: '',
                password: password,
                avatar: null,
                streak: 0,
                lastLogin: null,
                questProgress: {}
            };
            data.members.push(member);
            Storage.saveAppData(data);
        }

        this.currentUser = { ...member, role };
        Storage.setCurrentUser(this.currentUser);

        // Update streak
        this.updateStreak(studentId);

        Storage.addNotification({
            type: 'info',
            title: 'Welcome back!',
            message: `You logged in as ${member.name}`,
            icon: 'login'
        });

        // Check if onboarding completed
        if (!data.onboardingCompleted) {
            // Show onboarding
            setTimeout(() => {
                Onboarding.start();
            }, 500);
        }

        return { success: true, user: this.currentUser };
    },

    signup(studentId, password, name, year, course) {
        const data = Storage.getAppData();
        const existing = data.members.find(m => m.studentId === studentId);
        if (existing) {
            return { success: false, message: 'Student ID already registered.' };
        }

        const newMember = {
            studentId,
            name: name || studentId,
            year: year || '1',
            course: course || 'B.A. Political Science',
            position: '',
            membership: 'Active',
            exp: 0,
            attendance: [],
            badges: [],
            achievements: [],
            gradeConvRequested: false,
            email: '',
            password: password,
            avatar: null,
            streak: 0,
            lastLogin: null,
            questProgress: {}
        };

        data.members.push(newMember);
        data.onboardingCompleted = false; // New user needs onboarding
        Storage.saveAppData(data);

        return { success: true, user: newMember };
    },

    logout() {
        Storage.removeCurrentUser();
        this.currentUser = null;
    },

    isOfficer() {
        return this.currentUser && ['officer', 'adviser', 'grievance'].includes(this.currentUser.role);
    },

    isAdviser() {
        return this.currentUser && this.currentUser.role === 'adviser';
    },

    isGrievance() {
        return this.currentUser && this.currentUser.role === 'grievance';
    },

    getRole() {
        return this.currentUser ? this.currentUser.role : 'member';
    },

    // ========== STREAK SYSTEM ==========
    updateStreak(studentId) {
        const data = Storage.getAppData();
        const member = data.members.find(m => m.studentId === studentId);
        if (!member) return;

        const today = new Date().toISOString().split('T')[0];
        const lastLogin = member.lastLogin || '';

        if (lastLogin === today) return; // already logged in today

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yestStr = yesterday.toISOString().split('T')[0];

        if (lastLogin === yestStr) {
            member.streak = (member.streak || 0) + 1;
        } else {
            member.streak = 1; // reset streak
        }

        member.lastLogin = today;
        Storage.saveAppData(data);

        // Check for streak quest progress
        Quests.updateProgress(studentId, 'streak', member.streak);

        // If streak milestone, give bonus EXP
        if (member.streak % 7 === 0 && member.streak > 0) {
            Gamification.addExp(studentId, 20, '7-day streak bonus!');
            NotifCenter.add('Streak Milestone!', `🔥 ${member.streak}-day streak! +20 EXP bonus!`, 'success', 'local_fire_department');
        }

        // Update current user
        if (this.currentUser && this.currentUser.studentId === studentId) {
            this.currentUser.streak = member.streak;
            Storage.setCurrentUser(this.currentUser);
        }
    },

    // ========== FORGOT PASSWORD ==========
    requestPasswordReset(studentId) {
        const data = Storage.getAppData();
        const member = data.members.find(m => m.studentId === studentId);
        if (!member) {
            return { success: false, message: 'Student ID not found.' };
        }
        // In production: send email with reset link
        // For demo: generate a temporary password
        const tempPassword = Math.random().toString(36).slice(-8);
        member.password = tempPassword;
        Storage.saveAppData(data);
        // Simulate email
        console.log(`Password reset for ${member.name}: new password is ${tempPassword}`);
        NotifCenter.add('Password Reset', `A temporary password has been sent to ${member.email || 'your email'}.`, 'info', 'lock_open');
        return { success: true, message: `Temporary password sent. Check your email (or console).` };
    }
};

// ================================================================
// MODULE: UI Helpers
// ================================================================
const UI = {
    toast(opt) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const el = document.createElement('div');
        const msg = typeof opt === 'string' ? opt : opt.message;
        const type = typeof opt === 'string' ? 'info' : opt.type || 'info';
        el.className = `toast ${type}`;
        el.textContent = msg;
        container.appendChild(el);
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => el.remove(), 300);
        }, 3000);
    },

    modal(html, opts = {}) {
        const container = document.getElementById('modal-container');
        if (!container) return;
        const overlay = document.getElementById('overlay');
        const div = document.createElement('div');
        div.className = 'modal show';
        div.innerHTML = html;
        container.innerHTML = '';
        container.appendChild(div);
        overlay.classList.add('show');

        const close = () => {
            div.classList.remove('show');
            overlay.classList.remove('show');
            setTimeout(() => { container.innerHTML = ''; }, 300);
        };

        overlay.onclick = close;

        div.querySelectorAll('[data-close-modal]').forEach(el => {
            el.addEventListener('click', close);
        });

        return { close, element: div };
    },

    closeModal() {
        const container = document.getElementById('modal-container');
        const overlay = document.getElementById('overlay');
        if (container) container.innerHTML = '';
        if (overlay) overlay.classList.remove('show');
    },

    showLoading(show = true) {
        const screen = document.getElementById('loading-screen');
        if (screen) {
            screen.style.display = show ? 'flex' : 'none';
        }
    },

    hideLoading() {
        const screen = document.getElementById('loading-screen');
        if (screen) {
            screen.style.display = 'none';
        }
    },

    confetti(options = {}) {
        const count = options.count || 80;
        const colors = ['#759954', '#A9C88B', '#FFD54F', '#FF6B6B', '#4ECDC4', '#45B7D1'];
        const container = document.createElement('div');
        container.style.cssText =
            'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
        document.body.appendChild(container);

        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            const size = 6 + Math.random() * 8;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const delay = Math.random() * 0.5;
            const duration = 1.5 + Math.random() * 2;
            const rotation = Math.random() * 720;

            el.style.cssText = `
                position:absolute;
                top:-10px;
                left:${left}%;
                width:${size}px;
                height:${size * (0.5 + Math.random() * 0.5)}px;
                background:${color};
                border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
                animation: confettiFall ${duration}s ease-in ${delay}s forwards;
                transform: rotate(${rotation}deg);
                opacity:1;
            `;
            container.appendChild(el);
        }

        if (!document.getElementById('confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes confettiFall {
                    0% { transform: translateY(0) rotate(0deg) scale(1); opacity:1; }
                    100% { transform: translateY(100vh) rotate(720deg) scale(0.3); opacity:0; }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => container.remove(), 3000);
    },

    floatExp(amount, x, y) {
        const el = document.createElement('div');
        el.textContent = `+${amount} EXP`;
        el.style.cssText = `
            position:fixed;
            left:${x}px;
            top:${y}px;
            font-weight:800;
            font-size:28px;
            color:#759954;
            pointer-events:none;
            z-index:9999;
            animation: floatExpUp 1.2s ease-out forwards;
            text-shadow:0 2px 10px rgba(117,153,84,0.3);
        `;
        document.body.appendChild(el);

        if (!document.getElementById('float-exp-style')) {
            const style = document.createElement('style');
            style.id = 'float-exp-style';
            style.textContent = `
                @keyframes floatExpUp {
                    0% { opacity:1; transform: translateY(0) scale(1); }
                    100% { opacity:0; transform: translateY(-80px) scale(1.4); }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => el.remove(), 1300);
    },

    skeleton(count = 3, type = 'card') {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `
                <div class="card skeleton" style="padding:20px;animation:shimmer 1.5s infinite;">
                    <div style="height:20px;width:70%;background:#e8ece4;border-radius:8px;margin-bottom:12px;"></div>
                    <div style="height:14px;width:90%;background:#e8ece4;border-radius:6px;margin-bottom:8px;"></div>
                    <div style="height:14px;width:60%;background:#e8ece4;border-radius:6px;"></div>
                </div>
            `;
        }
        return html;
    },

    emptyState(message, icon = 'inbox', action = null) {
        let html = `
            <div class="card text-center" style="padding:40px 20px;">
                <span class="material-symbols-rounded" style="font-size:64px;color:#c5d0b8;display:block;margin-bottom:16px;">${icon}</span>
                <p style="color:var(--text-light);font-size:1rem;">${message}</p>
        `;
        if (action) {
            html += `<button class="btn-primary" style="margin-top:16px;width:auto;padding:12px 28px;display:inline-flex;" onclick="${action}">Take Action</button>`;
        }
        html += `</div>`;
        return html;
    },

    // Profile picture upload (base64)
    uploadAvatar(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Create a canvas to crop to square
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const size = Math.min(img.width, img.height);
                canvas.width = 200;
                canvas.height = 200;
                const ctx = canvas.getContext('2d');
                const sx = (img.width - size) / 2;
                const sy = (img.height - size) / 2;
                ctx.drawImage(img, sx, sy, size, size, 0, 0, 200, 200);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                callback(dataUrl);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

// ================================================================
// MODULE: Notifications
// ================================================================
const NotifCenter = {
    render() {
        const data = Storage.getAppData();
        const notifs = data.notifications || [];

        if (notifs.length === 0) {
            UI.modal(`
                <div style="text-align:center;padding:20px 0;">
                    <span class="material-symbols-rounded" style="font-size:64px;color:#c5d0b8;">notifications_off</span>
                    <h3 style="margin-top:12px;">No Notifications</h3>
                    <p style="color:var(--text-light);">You're all caught up!</p>
                    <button class="btn-primary" style="margin-top:16px;width:auto;padding:12px 28px;display:inline-flex;" data-close-modal>Close</button>
                </div>
            `);
            return;
        }

        let html = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <h3>Notifications</h3>
                <button class="text-btn" id="mark-all-read" style="font-weight:600;color:var(--primary);">Mark all read</button>
            </div>
            <div style="max-height:400px;overflow-y:auto;">
        `;

        notifs.forEach(n => {
            const icon = n.icon || 'notifications';
            html += `
                <div style="display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--border);${n.read ? 'opacity:0.6;' : ''}">
                    <span class="material-symbols-rounded" style="color:var(--primary);font-size:28px;">${icon}</span>
                    <div style="flex:1;">
                        <strong>${n.title || 'Update'}</strong>
                        <p style="color:var(--text-light);font-size:0.9rem;margin-top:2px;">${n.message || ''}</p>
                        <small style="color:#b0b8a8;font-size:0.75rem;">${n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}</small>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        html +=
            `<button class="btn-primary" style="margin-top:16px;width:auto;padding:12px 28px;display:inline-flex;" data-close-modal>Close</button>`;

        UI.modal(html);

        document.getElementById('mark-all-read')?.addEventListener('click', () => {
            Storage.markAllRead();
            UI.toast('All notifications marked as read.');
            NotifCenter.updateBadge();
            UI.closeModal();
            NotifCenter.render();
        });
    },

    updateBadge() {
        const count = Storage.getUnreadCount();
        const dot = document.getElementById('notif-dot');
        if (dot) {
            dot.style.display = count > 0 ? 'block' : 'none';
        }
    },

    add(title, message, type = 'info', icon = 'notifications') {
        Storage.addNotification({ title, message, type, icon });
        this.updateBadge();
        UI.toast({ message: title, type: type });
        // Push notification if supported
        this.sendPush(title, message);
    },

    // ========== PUSH NOTIFICATIONS ==========
    sendPush(title, body) {
        if ('Notification' in window && Notification.permission === 'granted') {
            navigator.serviceWorker.ready.then(reg => {
                reg.showNotification(title, {
                    body: body,
                    icon: '/icons/icon-192.png',
                    badge: '/icons/icon-192.png',
                    vibrate: [200, 100, 200]
                });
            });
        }
    },

    async requestPushPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                // Subscribe to push (requires VAPID keys)
                try {
                    const reg = await navigator.serviceWorker.ready;
                    const sub = await reg.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: this.urlBase64ToUint8Array(
                            'YOUR_VAPID_PUBLIC_KEY' // Replace with your VAPID public key
                        )
                    });
                    console.log('Push subscription:', sub);
                    // Send sub to backend
                    UI.toast({ message: 'Push notifications enabled!', type: 'success' });
                } catch (err) {
                    console.error('Push subscription failed:', err);
                }
            }
        }
    },

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
};

// ================================================================
// MODULE: EXP & Gamification (with multipliers)
// ================================================================
const Gamification = {
    LEVELS: [
        { level: 1, exp: 0, title: 'New Member' },
        { level: 2, exp: 100, title: 'Active Member' },
        { level: 3, exp: 300, title: 'Dedicated Member' },
        { level: 4, exp: 600, title: 'Senior Member' },
        { level: 5, exp: 1000, title: 'Elite Member' },
        { level: 6, exp: 1500, title: 'Master Member' },
        { level: 7, exp: 2100, title: 'Legend' },
    ],

    getLevel(exp) {
        let result = this.LEVELS[0];
        for (const lv of this.LEVELS) {
            if (exp >= lv.exp) result = lv;
        }
        return result;
    },

    getNextLevel(exp) {
        for (const lv of this.LEVELS) {
            if (exp < lv.exp) return lv;
        }
        return null;
    },

    getProgress(exp) {
        const current = this.getLevel(exp);
        const next = this.getNextLevel(exp);
        if (!next) return 100;
        const range = next.exp - current.exp;
        const progress = ((exp - current.exp) / range) * 100;
        return Math.min(Math.max(progress, 0), 100);
    },

    // ========== EXP MULTIPLIERS ==========
    getMultiplier() {
        const data = Storage.getAppData();
        const settings = data.settings || { multiplier: 1 };
        let mult = settings.multiplier || 1;

        // Weekend bonus (Saturday/Sunday)
        const day = new Date().getDay();
        if (day === 0 || day === 6) mult *= 1.5;

        // Check if any event today gives bonus
        const today = new Date().toISOString().split('T')[0];
        const events = data.events || [];
        const todayEvents = events.filter(e => e.date === today);
        if (todayEvents.some(e => e.type === 'competition')) mult *= 1.2;

        return Math.round(mult * 10) / 10;
    },

    addExp(studentId, amount, reason) {
        const data = Storage.getAppData();
        const member = data.members.find(m => m.studentId === studentId);
        if (!member) return null;

        const mult = this.getMultiplier();
        const finalAmount = Math.round(amount * mult);

        const oldExp = member.exp;
        const oldLevel = this.getLevel(oldExp);
        member.exp += finalAmount;
        const newLevel = this.getLevel(member.exp);

        Storage.saveAppData(data);

        if (newLevel.level > oldLevel.level) {
            NotifCenter.add(
                `Level Up! ${newLevel.title}`,
                `You reached Level ${newLevel.level} with ${member.exp} EXP!`,
                'success',
                'rocket_launch'
            );
            UI.confetti({ count: 100 });
            this.checkBadges(studentId);
        }

        if (Auth.currentUser && Auth.currentUser.studentId === studentId) {
            Auth.currentUser.exp = member.exp;
            Storage.setCurrentUser(Auth.currentUser);
        }

        // Check quests
        Quests.updateProgress(studentId, 'exp_gained', finalAmount);

        return { oldExp, newExp: member.exp, gained: finalAmount, level: newLevel, multiplier: mult };
    },

    getBadgeDefinitions() {
        return [
            { id: 'b1', name: 'New Member', icon: '🌟', condition: 'exp >= 0', desc: 'Joined the organization' },
            { id: 'b2', name: 'Active Member', icon: '🔥', condition: 'exp >= 100', desc: 'Reached 100 EXP' },
            { id: 'b3', name: 'Perfect Attendance', icon: '✅', condition: 'attendance >= 5',
            desc: '5 events attended' },
            { id: 'b4', name: 'Best Debater', icon: '🎤', condition: 'achievements.includes("Debate Winner")',
                desc: 'Won a debate competition' },
            { id: 'b5', name: 'MVP', icon: '🏀', condition: 'achievements.includes("Sports MVP")',
                desc: 'MVP in sports' },
            { id: 'b6', name: 'Quiz Bee Champ', icon: '🏆', condition: 'achievements.includes("Quiz Bee Champion")',
                desc: 'Won the Quiz Bee' },
            { id: 'b7', name: 'Volunteer', icon: '🤝', condition: 'exp >= 200', desc: 'Reached 200 EXP' },
            { id: 'b8', name: 'President', icon: '👑', condition: 'position === "President"',
            desc: 'Served as President' },
            { id: 'b9', name: 'Dean\'s Award', icon: '🎓', condition: 'exp >= 500', desc: 'Reached 500 EXP' },
            { id: 'b10', name: 'Senior Member', icon: '⭐', condition: 'exp >= 300', desc: 'Reached 300 EXP' },
        ];
    },

    checkBadges(studentId) {
        const data = Storage.getAppData();
        const member = data.members.find(m => m.studentId === studentId);
        if (!member) return;

        const definitions = this.getBadgeDefinitions();
        let unlocked = 0;

        definitions.forEach(def => {
            if (member.badges.includes(def.id)) return;
            let conditionMet = false;
            try {
                const exp = member.exp;
                const attendance = member.attendance ? member.attendance.length : 0;
                const achievements = member.achievements || [];
                const position = member.position || '';
                conditionMet = new Function('exp', 'attendance', 'achievements', 'position',
                    `return ${def.condition};`)(exp, attendance, achievements, position);
            } catch {
                conditionMet = false;
            }

            if (conditionMet) {
                member.badges.push(def.id);
                unlocked++;
                NotifCenter.add(
                    `Badge Unlocked: ${def.name}`,
                    `You earned the "${def.name}" badge! ${def.desc}`,
                    'success',
                    'workspace_premium'
                );
                UI.confetti({ count: 60 });
                // Update quest progress
                Quests.updateProgress(studentId, 'badge_earned', 1);
            }
        });

        if (unlocked > 0) {
            Storage.saveAppData(data);
            if (Auth.currentUser && Auth.currentUser.studentId === studentId) {
                Auth.currentUser.badges = member.badges;
                Storage.setCurrentUser(Auth.currentUser);
            }
        }
    },

    getMemberBadges(studentId) {
        const data = Storage.getAppData();
        const member = data.members.find(m => m.studentId === studentId);
        if (!member) return [];
        const definitions = this.getBadgeDefinitions();
        return definitions.map(def => ({
            ...def,
            unlocked: member.badges.includes(def.id)
        }));
    }
};

// ================================================================
// MODULE: Quests
// ================================================================
const Quests = {
    getQuests() {
        const data = Storage.getAppData();
        return data.quests || Storage.getDefaultQuests();
    },

    updateProgress(studentId, type, amount) {
        const data = Storage.getAppData();
        const member = data.members.find(m => m.studentId === studentId);
        if (!member) return;

        let quests = data.quests || Storage.getDefaultQuests();
        let updated = false;

        // Initialize quest progress if needed
        if (!member.questProgress) member.questProgress = {};

        quests.forEach(q => {
            if (q.type !== type) return;
            // Check if already completed
            if (member.questProgress[q.id] && member.questProgress[q.id].completed) return;

            const current = member.questProgress[q.id] || { progress: 0, completed: false };
            // If the quest goal is a specific event type (e.g., "win_debate"), check achievements
            if (type === 'win_debate' && !member.achievements.includes('Debate Winner')) return;
            if (type === 'volunteer') {
                // Count volunteer attendances
                const volunteerCount = data.events.filter(e => e.type === 'volunteer' && member.attendance.includes(e.date))
                    .length;
                if (volunteerCount >= q.goal) {
                    current.progress = q.goal;
                } else {
                    return; // don't update if not enough
                }
            } else if (type === 'attendance_monthly') {
                const now = new Date();
                const month = now.getMonth();
                const year = now.getFullYear();
                const monthlyAttendances = member.attendance.filter(d => {
                    const dt = new Date(d);
                    return dt.getMonth() === month && dt.getFullYear() === year;
                });
                current.progress = Math.min(monthlyAttendances.length, q.goal);
            } else if (type === 'checkins_total') {
                current.progress = Math.min(member.attendance.length, q.goal);
            } else if (type === 'comments') {
                // Not implemented, but we can track via a new field
                current.progress = Math.min((member.commentCount || 0), q.goal);
            } else if (type === 'create_event') {
                // Officers only
                if (Auth.isOfficer()) {
                    const createdEvents = data.events.filter(e => e.createdBy === studentId).length;
                    current.progress = Math.min(createdEvents, q.goal);
                }
            } else if (type === 'badge_earned') {
                current.progress = Math.min(member.badges.length, q.goal);
            } else if (type === 'streak') {
                current.progress = Math.min(member.streak || 0, q.goal);
            } else if (type === 'read_resources') {
                const readCount = data.readResources.filter(r => r.memberId === studentId).length;
                current.progress = Math.min(readCount, q.goal);
            } else if (type === 'quiz_high_score') {
                // Check if any quiz attempt has score >= 80%
                const attempts = data.quizAttempts.filter(a => a.memberId === studentId && a.score >= 80);
                current.progress = Math.min(attempts.length, q.goal);
            } else if (type === 'checkin') {
                // Count total check-ins
                current.progress = Math.min(member.attendance.length, q.goal);
            } else if (type === 'checkin_weekly') {
                // Count check-ins in the last 7 days
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                const recent = member.attendance.filter(d => new Date(d) >= weekAgo);
                current.progress = Math.min(recent.length, q.goal);
            } else if (type === 'exp_gained') {
                // For exp-based quests, we need to track cumulative
                const totalExp = member.exp;
                current.progress = Math.min(totalExp, q.goal);
            } else {
                // For numeric progress
                current.progress = Math.min((current.progress || 0) + amount, q.goal);
            }

            if (current.progress >= q.goal && !current.completed) {
                current.completed = true;
                // Reward EXP
                Gamification.addExp(studentId, q.reward, `Quest completed: ${q.title}`);
                NotifCenter.add('Quest Completed!', `🎉 ${q.title} - +${q.reward} EXP`, 'success', 'check_circle');
                UI.confetti({ count: 50 });
                updated = true;
            }

            member.questProgress[q.id] = current;
        });

        if (updated) {
            Storage.saveAppData(data);
            if (Auth.currentUser && Auth.currentUser.studentId === studentId) {
                Auth.currentUser.questProgress = member.questProgress;
                Storage.setCurrentUser(Auth.currentUser);
            }
        }
    },

    render() {
        const data = Storage.getAppData();
        const member = data.members.find(m => m.studentId === Auth.currentUser.studentId);
        if (!member) return;

        const quests = data.quests || Storage.getDefaultQuests();
        const progress = member.questProgress || {};

        let html = `
            <h3 style="margin-bottom:16px;">🎯 Quests</h3>
            <p style="color:var(--text-light);margin-bottom:16px;">Complete quests to earn bonus EXP!</p>
        `;

        quests.forEach(q => {
            const p = progress[q.id] || { progress: 0, completed: false };
            const percentage = Math.min((p.progress / q.goal) * 100, 100);
            const status = p.completed ? '✅ Completed' : `${p.progress}/${q.goal}`;
            html += `
                <div class="quest-card ${p.completed ? 'completed' : ''}">
                    <div style="flex:1;">
                        <div style="display:flex;align-items:center;gap:10px;">
                            <span style="font-size:28px;">${q.icon}</span>
                            <div>
                                <strong>${q.title}</strong>
                                <p style="font-size:0.85rem;color:var(--text-light);margin:0;">${q.desc}</p>
                            </div>
                        </div>
                        <div class="quest-progress">
                            <span style="width:${percentage}%;"></span>
                        </div>
                        <div style="display:flex;justify-content:space-between;margin-top:4px;">
                            <span style="font-size:0.8rem;color:var(--text-light);">${status}</span>
                            <span style="font-size:0.8rem;font-weight:700;color:var(--primary);">+${q.reward} EXP</span>
                        </div>
                    </div>
                </div>
            `;
        });

        document.getElementById('content').innerHTML = html;
    }
};

// ================================================================
// MODULE: Quizzes
// ================================================================
const Quizzes = {
    render() {
        const data = Storage.getAppData();
        const quizzes = data.quizzes || Storage.getDefaultQuizzes();

        let html = `
            <h3 style="margin-bottom:16px;">📝 Quizzes</h3>
            <p style="color:var(--text-light);margin-bottom:16px;">Test your knowledge and earn EXP!</p>
        `;

        quizzes.forEach(q => {
            // Check if already attempted
            const attempts = data.quizAttempts.filter(a => a.quizId === q.id && a.memberId === Auth.currentUser.studentId);
            const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : 0;
            const attempted = attempts.length > 0;

            html += `
                <div class="card" style="cursor:pointer;" onclick="window.__startQuiz('${q.id}')">
                    <h4>${q.title}</h4>
                    <p style="color:var(--text-light);font-size:0.9rem;">${q.description}</p>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
                        <span style="font-weight:600;color:var(--primary);">+${q.expReward} EXP</span>
                        ${attempted ? `<span style="color:var(--success);">Best Score: ${bestScore}%</span>` : ''}
                        <button class="btn-primary" style="padding:6px 16px;width:auto;font-size:0.8rem;">${attempted ? 'Retry' : 'Start'}</button>
                    </div>
                </div>
            `;
        });

        document.getElementById('content').innerHTML = html;
    },

    startQuiz(quizId) {
        const data = Storage.getAppData();
        const quiz = data.quizzes.find(q => q.id === quizId);
        if (!quiz) return;

        let currentQuestion = 0;
        let score = 0;
        let answers = [];

        const renderQuestion = () => {
            const q = quiz.questions[currentQuestion];
            let optionsHtml = q.options.map((opt, idx) => `
                <button class="quiz-option" data-idx="${idx}">${opt}</button>
            `).join('');

            UI.modal(`
                <div style="max-height:80vh;overflow-y:auto;">
                    <h3>${quiz.title}</h3>
                    <p style="color:var(--text-light);">Question ${currentQuestion+1} of ${quiz.questions.length}</p>
                    <p style="font-weight:600;font-size:1.1rem;margin:12px 0;">${q.q}</p>
                    <div id="quiz-options">
                        ${optionsHtml}
                    </div>
                    <div style="margin-top:16px;display:flex;justify-content:space-between;">
                        <span>Score: ${score}/${currentQuestion}</span>
                        ${currentQuestion > 0 ? `<button class="text-btn" id="quiz-prev">Previous</button>` : ''}
                        <button class="btn-primary" id="quiz-next" style="display:none;">Next</button>
                    </div>
                </div>
            `);

            document.querySelectorAll('.quiz-option').forEach(btn => {
                btn.addEventListener('click', function() {
                    const idx = parseInt(this.dataset.idx);
                    const isCorrect = idx === q.answer;
                    if (isCorrect) score++;
                    answers.push(idx);
                    // Disable all options
                    document.querySelectorAll('.quiz-option').forEach(b => b.style.pointerEvents = 'none');
                    // Highlight correct/wrong
                    document.querySelectorAll('.quiz-option').forEach((b, i) => {
                        if (i === q.answer) b.classList.add('correct');
                        else if (i === idx && !isCorrect) b.classList.add('wrong');
                        if (i === idx) b.classList.add('selected');
                    });
                    document.getElementById('quiz-next').style.display = 'block';
                });
            });

            document.getElementById('quiz-next')?.addEventListener('click', () => {
                if (currentQuestion < quiz.questions.length - 1) {
                    currentQuestion++;
                    UI.closeModal();
                    renderQuestion();
                } else {
                    // Quiz complete
                    const percentage = Math.round((score / quiz.questions.length) * 100);
                    // Save attempt
                    const attempt = {
                        quizId: quiz.id,
                        memberId: Auth.currentUser.studentId,
                        score: percentage,
                        answers: answers,
                        date: new Date().toISOString()
                    };
                    data.quizAttempts.push(attempt);
                    Storage.saveAppData(data);

                    UI.closeModal();
                    // Reward EXP based on score
                    if (percentage >= 80) {
                        const expEarned = quiz.expReward;
                        Gamification.addExp(Auth.currentUser.studentId, expEarned, `Quiz: ${quiz.title} (${percentage}%)`);
                        NotifCenter.add('Quiz Master!', `You scored ${percentage}% on ${quiz.title}! +${expEarned} EXP`, 'success', 'school');
                        UI.confetti({ count: 60 });
                        // Update quest progress
                        Quests.updateProgress(Auth.currentUser.studentId, 'quiz_high_score', 1);
                    } else {
                        UI.toast({ message: `You scored ${percentage}%. Keep learning!`, type: 'info' });
                    }
                    // Refresh quiz list
                    this.render();
                }
            });

            document.getElementById('quiz-prev')?.addEventListener('click', () => {
                if (currentQuestion > 0) {
                    currentQuestion--;
                    // Remove last answer
                    answers.pop();
                    UI.closeModal();
                    renderQuestion();
                }
            });
        };

        renderQuestion();
    }
};

// ================================================================
// MODULE: Resources
// ================================================================
const Resources = {
    render() {
        const data = Storage.getAppData();
        const resources = data.resources || Storage.getDefaultResources();
        const readResources = data.readResources || [];

        let html = `
            <h3 style="margin-bottom:16px;">📚 Resources</h3>
            <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;">
                <button class="btn-primary" style="padding:8px 16px;width:auto;font-size:0.85rem;" onclick="window.__uploadResource()">+ Upload Resource</button>
            </div>
        `;

        if (resources.length === 0) {
            html += UI.emptyState('No resources available.', 'menu_book', '__uploadResource()');
        } else {
            resources.forEach(r => {
                const isRead = readResources.some(rr => rr.resourceId === r.id && rr.memberId === Auth.currentUser.studentId);
                html += `
                    <div class="resource-item ${isRead ? 'read' : ''}" onclick="window.__openResource('${r.id}')">
                        <span class="icon">${r.thumbnail}</span>
                        <div style="flex:1;">
                            <strong>${r.title}</strong>
                            <p style="font-size:0.8rem;color:var(--text-light);margin:0;">${r.description || ''}</p>
                            <small style="color:var(--text-light);">${r.type.toUpperCase()}</small>
                        </div>
                        ${isRead ? '<span style="color:var(--success);">✅ Read</span>' : ''}
                    </div>
                `;
            });
        }

        document.getElementById('content').innerHTML = html;
    },

    openResource(resourceId) {
        const data = Storage.getAppData();
        const resource = data.resources.find(r => r.id === resourceId);
        if (!resource) return;

        // Mark as read if not already
        const readResources = data.readResources || [];
        const alreadyRead = readResources.some(r => r.resourceId === resourceId && r.memberId === Auth.currentUser.studentId);
        if (!alreadyRead) {
            readResources.push({
                resourceId: resourceId,
                memberId: Auth.currentUser.studentId,
                readAt: new Date().toISOString()
            });
            data.readResources = readResources;
            Storage.saveAppData(data);
            // Reward EXP for reading
            Gamification.addExp(Auth.currentUser.studentId, 10, `Read resource: ${resource.title}`);
            // Update quest progress
            Quests.updateProgress(Auth.currentUser.studentId, 'read_resources', 1);
            UI.toast({ message: `📖 +10 EXP for reading "${resource.title}"`, type: 'success' });
            // Refresh view
            this.render();
        }

        // Open the resource (if URL)
        if (resource.url && resource.url !== '#') {
            window.open(resource.url, '_blank');
        } else {
            UI.toast({ message: `Resource "${resource.title}" - content not available online.`, type: 'info' });
        }
    },

    uploadResource() {
        UI.modal(`
            <h3>📤 Upload Resource</h3>
            <form id="upload-resource-form">
                <div class="form-group">
                    <label>Title</label>
                    <div class="input-box">
                        <span class="material-symbols-rounded">title</span>
                        <input type="text" id="resource-title" placeholder="Resource title" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Type</label>
                    <div class="input-box">
                        <span class="material-symbols-rounded">category</span>
                        <select id="resource-type">
                            <option value="pdf">PDF</option>
                            <option value="video">Video</option>
                            <option value="link">Link</option>
                            <option value="document">Document</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>URL / File</label>
                    <div class="input-box">
                        <span class="material-symbols-rounded">link</span>
                        <input type="text" id="resource-url" placeholder="https://..." required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Description (optional)</label>
                    <div class="input-box" style="align-items:flex-start;">
                        <span class="material-symbols-rounded" style="margin-top:12px;">description</span>
                        <textarea id="resource-desc" style="flex:1;border:none;outline:none;background:transparent;resize:vertical;min-height:60px;font-family:inherit;font-size:14px;color:var(--text);" placeholder="Short description..."></textarea>
                    </div>
                </div>
                <button type="submit" class="btn-primary">Upload</button>
                <button type="button" class="text-btn" data-close-modal>Cancel</button>
            </form>
        `);

        document.getElementById('upload-resource-form')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('resource-title').value.trim();
            const type = document.getElementById('resource-type').value;
            const url = document.getElementById('resource-url').value.trim();
            const description = document.getElementById('resource-desc').value.trim();

            if (!title || !url) return UI.toast({ message: 'Title and URL are required.', type: 'error' });

            const data = Storage.getAppData();
            const newResource = {
                id: 'r' + Date.now(),
                title,
                type,
                url,
                description: description || '',
                thumbnail: type === 'pdf' ? '📄' : type === 'video' ? '🎬' : '🔗',
                uploadedBy: Auth.currentUser.studentId,
                uploadedAt: new Date().toISOString()
            };
            data.resources.push(newResource);
            Storage.saveAppData(data);
            UI.closeModal();
            UI.toast({ message: 'Resource uploaded successfully!', type: 'success' });
            NotifCenter.add('New Resource', `${title} has been uploaded.`, 'info', 'upload');
            Resources.render();
        });
    }
};

// ================================================================
// MODULE: Audit Log
// ================================================================
const Audit = {
    log(action, details) {
        const data = Storage.getAppData();
        data.auditLog.push({
            action,
            details,
            officerId: Auth.currentUser?.studentId || 'system',
            timestamp: new Date().toISOString()
        });
        Storage.saveAppData(data);
    },

    render() {
        const data = Storage.getAppData();
        const logs = data.auditLog || [];

        let html = `
            <h3 style="margin-bottom:16px;">📋 Audit Log</h3>
            <p style="color:var(--text-light);margin-bottom:12px;">All officer actions are recorded here.</p>
        `;

        if (logs.length === 0) {
            html += UI.emptyState('No audit logs yet.', 'history');
        } else {
            logs.slice().reverse().forEach(log => {
                html += `
                    <div class="card" style="padding:12px 16px;margin-bottom:8px;">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                            <div>
                                <strong>${log.action}</strong>
                                <p style="font-size:0.85rem;color:var(--text-light);margin:2px 0;">${log.details}</p>
                                <small style="color:var(--text-light);">By: ${log.officerId}</small>
                            </div>
                            <small style="color:var(--text-light);">${new Date(log.timestamp).toLocaleString()}</small>
                        </div>
                    </div>
                `;
            });
        }

        document.getElementById('content').innerHTML = html;
    }
};

// ================================================================
// MODULE: Bulk Actions
// ================================================================
const BulkActions = {
    render() {
        const data = Storage.getAppData();
        const members = data.members;

        let html = `
            <h3 style="margin-bottom:16px;">👥 Bulk Actions</h3>
            <p style="color:var(--text-light);margin-bottom:16px;">Select multiple members and perform actions.</p>
            <div id="bulk-member-list">
        `;

        members.forEach(m => {
            html += `
                <div class="card" style="display:flex;align-items:center;gap:12px;padding:12px 16px;">
                    <input type="checkbox" class="bulk-select" data-id="${m.studentId}">
                    <span><strong>${m.name}</strong> (${m.studentId})</span>
                    <span style="margin-left:auto;color:var(--text-light);font-size:0.8rem;">${m.exp} EXP</span>
                </div>
            `;
        });

        html += `
            </div>
            <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap;">
                <button class="btn-primary" id="bulk-award-badge" style="flex:1;">🏅 Award Badge</button>
                <button class="btn-primary" id="bulk-add-exp" style="flex:1;background:var(--primary-dark);">⭐ Add EXP</button>
                <button class="btn-primary" id="bulk-send-notif" style="flex:1;background:var(--text-light);">📢 Send Notification</button>
            </div>
        `;

        document.getElementById('content').innerHTML = html;

        // Award badge
        document.getElementById('bulk-award-badge')?.addEventListener('click', () => {
            const selected = document.querySelectorAll('.bulk-select:checked');
            if (selected.length === 0) return UI.toast({ message: 'Select at least one member.', type: 'warning' });

            // Show badge selection
            const definitions = Gamification.getBadgeDefinitions();
            let options = definitions.map(b => `<option value="${b.id}">${b.icon} ${b.name}</option>`).join('');
            UI.modal(`
                <h3>🏅 Award Badge to ${selected.length} members</h3>
                <div class="form-group">
                    <label>Select Badge</label>
                    <div class="input-box">
                        <span class="material-symbols-rounded">workspace_premium</span>
                        <select id="bulk-badge-select">${options}</select>
                    </div>
                </div>
                <button class="btn-primary" id="bulk-badge-confirm">Award</button>
                <button class="text-btn" data-close-modal>Cancel</button>
            `);

            document.getElementById('bulk-badge-confirm')?.addEventListener('click', () => {
                const badgeId = document.getElementById('bulk-badge-select').value;
                selected.forEach(cb => {
                    const memberId = cb.dataset.id;
                    const member = data.members.find(m => m.studentId === memberId);
                    if (member && !member.badges.includes(badgeId)) {
                        member.badges.push(badgeId);
                        Gamification.addExp(memberId, 25, 'Bulk badge award');
                        Audit.log('Bulk Badge Award', `Awarded ${badgeId} to ${member.name}`);
                    }
                });
                Storage.saveAppData(data);
                UI.closeModal();
                UI.toast({ message: `Badge awarded to ${selected.length} members.`, type: 'success' });
                this.render();
            });
        });

        // Add EXP
        document.getElementById('bulk-add-exp')?.addEventListener('click', () => {
            const selected = document.querySelectorAll('.bulk-select:checked');
            if (selected.length === 0) return UI.toast({ message: 'Select at least one member.', type: 'warning' });

            UI.modal(`
                <h3>⭐ Add EXP to ${selected.length} members</h3>
                <div class="form-group">
                    <label>Amount</label>
                    <div class="input-box">
                        <span class="material-symbols-rounded">stars</span>
                        <input type="number" id="bulk-exp-amount" value="50" min="10" max="500">
                    </div>
                </div>
                <button class="btn-primary" id="bulk-exp-confirm">Add EXP</button>
                <button class="text-btn" data-close-modal>Cancel</button>
            `);

            document.getElementById('bulk-exp-confirm')?.addEventListener('click', () => {
                const amount = parseInt(document.getElementById('bulk-exp-amount').value) || 50;
                selected.forEach(cb => {
                    const memberId = cb.dataset.id;
                    Gamification.addExp(memberId, amount, 'Bulk EXP award');
                    Audit.log('Bulk EXP Award', `Added ${amount} EXP to ${memberId}`);
                });
                UI.closeModal();
                UI.toast({ message: `Added ${amount} EXP to ${selected.length} members.`, type: 'success' });
                this.render();
            });
        });

        // Send notification
        document.getElementById('bulk-send-notif')?.addEventListener('click', () => {
            const selected = document.querySelectorAll('.bulk-select:checked');
            if (selected.length === 0) return UI.toast({ message: 'Select at least one member.', type: 'warning' });

            UI.modal(`
                <h3>📢 Send Notification to ${selected.length} members</h3>
                <div class="form-group">
                    <label>Title</label>
                    <div class="input-box">
                        <span class="material-symbols-rounded">title</span>
                        <input type="text" id="bulk-notif-title" placeholder="Notification title">
                    </div>
                </div>
                <div class="form-group">
                    <label>Message</label>
                    <div class="input-box" style="align-items:flex-start;">
                        <span class="material-symbols-rounded" style="margin-top:12px;">message</span>
                        <textarea id="bulk-notif-msg" style="flex:1;border:none;outline:none;background:transparent;resize:vertical;min-height:60px;font-family:inherit;font-size:14px;color:var(--text);" placeholder="Your message..."></textarea>
                    </div>
                </div>
                <button class="btn-primary" id="bulk-notif-confirm">Send</button>
                <button class="text-btn" data-close-modal>Cancel</button>
            `);

            document.getElementById('bulk-notif-confirm')?.addEventListener('click', () => {
                const title = document.getElementById('bulk-notif-title').value.trim() || 'Announcement';
                const msg = document.getElementById('bulk-notif-msg').value.trim() || 'You have a new notification.';
                selected.forEach(cb => {
                    const memberId = cb.dataset.id;
                    // Send notification to each member
                    const notif = {
                        title: title,
                        message: msg,
                        type: 'info',
                        icon: 'campaign',
                        memberId: memberId
                    };
                    Storage.addNotification(notif);
                });
                UI.closeModal();
                UI.toast({ message: `Notification sent to ${selected.length} members.`, type: 'success' });
                Audit.log('Bulk Notification', `Sent notification to ${selected.length} members`);
                this.render();
            });
        });
    }
};

// ================================================================
// MODULE: Analytics & Charts
// ================================================================
const Analytics = {
    render() {
        const data = Storage.getAppData();
        const members = data.members;

        let html = `
            <h3 style="margin-bottom:16px;">📊 Analytics</h3>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:20px;">
                <div class="card" style="text-align:center;">
                    <h2>${members.length}</h2>
                    <p>Total Members</p>
                </div>
                <div class="card" style="text-align:center;">
                    <h2>${members.reduce((sum,m) => sum + m.exp, 0)}</h2>
                    <p>Total EXP</p>
                </div>
                <div class="card" style="text-align:center;">
                    <h2>${members.filter(m => m.membership === 'Active').length}</h2>
                    <p>Active Members</p>
                </div>
                <div class="card" style="text-align:center;">
                    <h2>${data.events.length}</h2>
                    <p>Total Events</p>
                </div>
            </div>
            <div class="card">
                <h4>Member Growth</h4>
                <canvas id="member-growth-chart"></canvas>
            </div>
            <div class="card">
                <h4>EXP Distribution</h4>
                <canvas id="exp-distribution-chart"></canvas>
            </div>
            <div class="card">
                <h4>Attendance Trends</h4>
                <canvas id="attendance-trend-chart"></canvas>
            </div>
        `;

        document.getElementById('content').innerHTML = html;

        // Render charts after DOM update
        setTimeout(() => {
            this.renderMemberGrowth();
            this.renderExpDistribution();
            this.renderAttendanceTrend();
        }, 100);
    },

    renderMemberGrowth() {
        const canvas = document.getElementById('member-growth-chart');
        if (!canvas || typeof Chart === 'undefined') return;

        const data = Storage.getAppData();
        // Simulate growth over last 6 months
        const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        const counts = [2, 3, 5, 7, 10, data.members.length];

        new Chart(canvas, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Members',
                    data: counts,
                    borderColor: '#759954',
                    backgroundColor: 'rgba(117,153,84,0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    },

    renderExpDistribution() {
        const canvas = document.getElementById('exp-distribution-chart');
        if (!canvas || typeof Chart === 'undefined') return;

        const data = Storage.getAppData();
        const members = data.members;
        const ranges = ['0-100', '101-300', '301-500', '501-800', '801+'];
        const counts = ranges.map(range => {
            const [min, max] = range.split('-').map(Number);
            if (range === '801+') return members.filter(m => m.exp >= 801).length;
            return members.filter(m => m.exp >= min && m.exp <= max).length;
        });

        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: ranges,
                datasets: [{
                    label: 'Members',
                    data: counts,
                    backgroundColor: '#A9C88B',
                    borderColor: '#759954',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    },

    renderAttendanceTrend() {
        const canvas = document.getElementById('attendance-trend-chart');
        if (!canvas || typeof Chart === 'undefined') return;

        const data = Storage.getAppData();
        // Simulate attendance over last 6 months
        const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        const attendances = [3, 5, 8, 12, 15, data.checkIns?.length || 0];

        new Chart(canvas, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Check-ins',
                    data: attendances,
                    borderColor: '#E7BE45',
                    backgroundColor: 'rgba(231,190,69,0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    },

    // Personal stats for a member
    renderPersonalStats(studentId) {
        const data = Storage.getAppData();
        const member = data.members.find(m => m.studentId === studentId);
        if (!member) return;

        // Get attendance dates
        const attendance = member.attendance || [];
        const dates = attendance.slice(-10); // last 10

        let html = `
            <div class="card">
                <h4>📈 Your Progress</h4>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:12px;">
                    <div style="text-align:center;background:var(--accent);padding:12px;border-radius:16px;">
                        <div style="font-size:1.5rem;font-weight:800;color:var(--primary);">${member.exp}</div>
                        <small>EXP</small>
                    </div>
                    <div style="text-align:center;background:var(--accent);padding:12px;border-radius:16px;">
                        <div style="font-size:1.5rem;font-weight:800;color:var(--primary);">${member.streak || 0}🔥</div>
                        <small>Streak</small>
                    </div>
                    <div style="text-align:center;background:var(--accent);padding:12px;border-radius:16px;">
                        <div style="font-size:1.5rem;font-weight:800;color:var(--primary);">${attendance.length}</div>
                        <small>Check-ins</small>
                    </div>
                </div>
                <div style="margin-top:16px;">
                    <h5>Recent Activity</h5>
                    ${dates.length === 0 ? '<p style="color:var(--text-light);">No activity yet.</p>' :
                        `<ul style="list-style:none;padding:0;">
                            ${dates.map(d => `<li style="padding:4px 0;border-bottom:1px solid var(--border);">📅 ${d}</li>`).join('')}
                        </ul>`
                    }
                </div>
                <div style="margin-top:16px;">
                    <h5>Badges (${member.badges?.length || 0})</h5>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        ${(member.badges || []).map(bid => {
                            const def = Gamification.getBadgeDefinitions().find(b => b.id === bid);
                            return def ? `<span style="background:var(--accent);padding:4px 12px;border-radius:20px;font-size:0.8rem;">${def.icon} ${def.name}</span>` : '';
                        }).join('') || '<span style="color:var(--text-light);">No badges yet</span>'}
                    </div>
                </div>
            </div>
        `;

        // Append to profile page
        document.getElementById('content').innerHTML += html;
    }
};

// ================================================================
// MODULE: Onboarding
// ================================================================
const Onboarding = {
    steps: [
        { title: 'Welcome to SEPOLSCIS!', desc: 'Your all-in-one hub for the Political Science Student Organization. Let\'s get started!', icon: 'rocket_launch' },
        { title: '📊 Dashboard', desc: 'Track your EXP, level, and quick actions. Check your progress at a glance.', icon: 'dashboard' },
        { title: '📅 Events', desc: 'View upcoming events, check-in, and earn EXP. Don\'t miss out!', icon: 'event' },
        { title: '🏅 Quests & Badges', desc: 'Complete quests to earn bonus EXP and unlock badges. Show off your achievements!', icon: 'workspace_premium' },
        { title: '📚 Learning Center', desc: 'Access resources, take quizzes, and expand your knowledge. Ready to learn?', icon: 'menu_book' },
    ],
    currentStep: 0,

    start() {
        const overlay = document.getElementById('onboarding-overlay');
        if (!overlay) return;
        overlay.style.display = 'flex';
        this.currentStep = 0;
        this.showStep();
    },

    showStep() {
        const step = this.steps[this.currentStep];
        document.getElementById('onboarding-title').textContent = step.title;
        document.getElementById('onboarding-desc').textContent = step.desc;
        document.querySelector('.onboarding-card .material-symbols-rounded').textContent = step.icon;

        // Update dots
        const dotsContainer = document.getElementById('onboarding-dots');
        dotsContainer.innerHTML = this.steps.map((_, i) =>
            `<span style="width:10px;height:10px;border-radius:50%;background:${i === this.currentStep ? 'var(--primary)' : '#ddd'};display:inline-block;"></span>`
        ).join('');

        const nextBtn = document.getElementById('onboarding-next');
        if (this.currentStep === this.steps.length - 1) {
            nextBtn.textContent = 'Finish';
        } else {
            nextBtn.textContent = 'Next';
        }
    },

    next() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.showStep();
        } else {
            this.finish();
        }
    },

    finish() {
        document.getElementById('onboarding-overlay').style.display = 'none';
        const data = Storage.getAppData();
        data.onboardingCompleted = true;
        Storage.saveAppData(data);
        UI.toast({ message: '🎉 You\'re all set! Explore SEPOLSCIS.', type: 'success' });
    }
};

// ================================================================
// MODULE: Dashboard (updated with streaks, quests preview)
// ================================================================
const Dashboard = {
    render() {
        const user = Auth.currentUser;
        if (!user) return;
        const data = Storage.getAppData();
        const member = data.members.find(m => m.studentId === user.studentId);
        if (!member) return;

        // Show skeleton first
        document.getElementById('content').innerHTML = UI.skeleton(3);
        setTimeout(() => {
            this.renderContent(member, data);
        }, 300);
    },

    renderContent(member, data) {
        const level = Gamification.getLevel(member.exp);
        const progress = Gamification.getProgress(member.exp);
        const nextLevel = Gamification.getNextLevel(member.exp);
        const badges = Gamification.getMemberBadges(member.studentId);
        const unlocked = badges.filter(b => b.unlocked);
        const upcoming = data.events.filter(e => new Date(e.date) >= new Date()).slice(0, 3);
        const streak = member.streak || 0;

        // Get quest progress
        const quests = data.quests || Storage.getDefaultQuests();
        const questProgress = member.questProgress || {};
        const completedQuests = quests.filter(q => questProgress[q.id]?.completed).length;
        const totalQuests = quests.length;

        let html = `
            <!-- EXP Card with Streak -->
            <div class="card exp-card">
                <div style="position:relative;z-index:1;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <p style="opacity:0.8;">${user.role === 'officer' ? '👋 Officer' : '👋 Member'}</p>
                        ${streak > 0 ? `<span class="streak-badge">🔥 ${streak} Day Streak</span>` : ''}
                    </div>
                    <h2>Hello, ${member.name}</h2>
                    <div style="display:flex;gap:20px;margin-top:6px;flex-wrap:wrap;">
                        <span><strong>${member.exp}</strong> EXP</span>
                        <span><strong>Level ${level.level}</strong> ${level.title}</span>
                        <span><strong>${member.attendance?.length || 0}</strong> Attendances</span>
                        <span><strong>${completedQuests}/${totalQuests}</strong> Quests</span>
                    </div>
                    <div class="exp-progress" style="margin-top:12px;">
                        <span style="width:${progress}%;"></span>
                    </div>
                    ${nextLevel ? `<p style="margin-top:6px;font-size:0.8rem;opacity:0.7;">${nextLevel.exp - member.exp} EXP until ${nextLevel.title}</p>` : '<p style="margin-top:6px;font-size:0.8rem;opacity:0.7;">🏆 Max Level!</p>'}
                    ${Gamification.getMultiplier() > 1 ? `<p style="margin-top:4px;font-size:0.8rem;opacity:0.8;">⚡ ${Gamification.getMultiplier()}x EXP Multiplier active!</p>` : ''}
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="card">
                <div class="card-title">
                    <h3>Quick Actions</h3>
                </div>
                <div class="quick-grid">
                    <div class="quick-item" onclick="window.__nav('events')">
                        <span class="material-symbols-rounded">event</span>
                        <h4>Events</h4>
                        <p>View upcoming</p>
                    </div>
                    <div class="quick-item" onclick="window.__nav('profile')">
                        <span class="material-symbols-rounded">person</span>
                        <h4>Profile</h4>
                        <p>Your stats</p>
                    </div>
                    <div class="quick-item" onclick="window.__checkin()">
                        <span class="material-symbols-rounded">qr_code_scanner</span>
                        <h4>Check In</h4>
                        <p>Scan QR</p>
                    </div>
                    <div class="quick-item" onclick="window.__showGrievance()">
                        <span class="material-symbols-rounded">gavel</span>
                        <h4>Grievance</h4>
                        <p>Submit report</p>
                    </div>
                </div>
            </div>
        `;

        // Quests preview
        const activeQuests = quests.filter(q => !questProgress[q.id]?.completed).slice(0, 3);
        if (activeQuests.length > 0) {
            html += `
                <div class="card">
                    <div class="card-title">
                        <h3>🎯 Active Quests</h3>
                        <a href="#" onclick="window.__nav('quests');return false;" style="color:var(--primary);font-weight:600;font-size:0.85rem;">View all</a>
                    </div>
                    ${activeQuests.map(q => {
                        const p = questProgress[q.id] || { progress: 0 };
                        const perc = Math.min((p.progress / q.goal) * 100, 100);
                        return `
                            <div style="padding:8px 0;border-bottom:1px solid var(--border);">
                                <div style="display:flex;justify-content:space-between;align-items:center;">
                                    <span>${q.icon} ${q.title}</span>
                                    <span style="font-size:0.8rem;color:var(--text-light);">${p.progress}/${q.goal}</span>
                                </div>
                                <div class="quest-progress">
                                    <span style="width:${perc}%;"></span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }

        // Badges preview
        if (unlocked.length > 0) {
            html += `
                <div class="card">
                    <div class="card-title">
                        <h3>Your Badges</h3>
                        <span style="font-size:0.8rem;color:var(--text-light);">${unlocked.length} unlocked</span>
                    </div>
                    <div style="display:flex;gap:12px;flex-wrap:wrap;">
                        ${unlocked.slice(0,6).map(b => `
                            <div style="text-align:center;width:60px;">
                                <div style="width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#FFD54F,#FFB300);display:flex;justify-content:center;align-items:center;font-size:24px;margin:auto;box-shadow:0 4px 12px rgba(255,193,7,0.3);">${b.icon}</div>
                                <small style="font-size:0.65rem;color:var(--text-light);display:block;margin-top:4px;">${b.name}</small>
                            </div>
                        `).join('')}
                        ${unlocked.length > 6 ? `<div style="text-align:center;width:60px;display:flex;flex-direction:column;justify-content:center;align-items:center;"><span style="font-size:1.2rem;font-weight:700;color:var(--primary);">+${unlocked.length-6}</span><small style="font-size:0.65rem;color:var(--text-light);">more</small></div>` : ''}
                    </div>
                </div>
            `;
        }

        // Officer widget
        if (Auth.isOfficer()) {
            const pendingGrievance = data.grievances.filter(g => g.status === 'submitted' || g.status === 'in-progress')
                .length;
            const pendingGradeConv = data.members.filter(m => m.gradeConvRequested).length;
            const totalMembers = data.members.length;

            html += `
                <div class="card" style="background:var(--accent);">
                    <div class="card-title">
                        <h3>🛡️ Officer Dashboard</h3>
                    </div>
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
                        <div style="background:white;border-radius:16px;padding:14px;text-align:center;">
                            <div style="font-size:1.8rem;font-weight:800;color:var(--primary);">${totalMembers}</div>
                            <small style="color:var(--text-light);">Members</small>
                        </div>
                        <div style="background:white;border-radius:16px;padding:14px;text-align:center;cursor:pointer;" onclick="window.__viewGrievances()">
                            <div style="font-size:1.8rem;font-weight:800;color:var(--danger);">${pendingGrievance}</div>
                            <small style="color:var(--text-light);">Grievances</small>
                        </div>
                        <div style="background:white;border-radius:16px;padding:14px;text-align:center;cursor:pointer;" onclick="window.__viewGradeRequests()">
                            <div style="font-size:1.8rem;font-weight:800;color:var(--warning);">${pendingGradeConv}</div>
                            <small style="color:var(--text-light);">Grade Req</small>
                        </div>
                    </div>
                    <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;">
                        <button class="btn-primary" style="flex:1;padding:10px;font-size:0.85rem;" onclick="window.__awardBadge()">Award Badge</button>
                        <button class="btn-primary" style="flex:1;padding:10px;font-size:0.85rem;background:var(--primary-dark);" onclick="window.__showAnnouncementForm()">Post Announcement</button>
                    </div>
                    <div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap;">
                        <button class="btn-primary" style="flex:1;padding:10px;font-size:0.85rem;background:var(--text-light);" onclick="window.__createEvent()">+ Create Event</button>
                        <button class="btn-primary" style="flex:1;padding:10px;font-size:0.85rem;background:var(--text-light);" onclick="window.__nav('audit')">📋 Audit Log</button>
                    </div>
                </div>
            `;
        }

        // Announcements
        html += `
            <div class="card">
                <div class="card-title">
                    <h3>📢 Announcements</h3>
                </div>
                ${data.announcements.length === 0 ? '<p style="color:var(--text-light);">No announcements yet.</p>' :
                data.announcements.slice(0,3).map(a => `
                    <div style="padding:10px 0;border-bottom:1px solid var(--border);display:flex;gap:10px;align-items:flex-start;">
                        <span class="material-symbols-rounded" style="color:var(--primary);font-size:20px;">campaign</span>
                        <p style="margin:0;flex:1;">${a}</p>
                    </div>
                `).join('')}
                ${data.announcements.length > 3 ? `<p style="margin-top:8px;color:var(--text-light);font-size:0.85rem;">+${data.announcements.length-3} more</p>` : ''}
            </div>
        `;

        // Upcoming events
        html += `
            <div class="card">
                <div class="card-title">
                    <h3>📅 Upcoming Events</h3>
                    <a href="#" onclick="window.__nav('events');return false;" style="color:var(--primary);font-weight:600;font-size:0.85rem;">See all</a>
                </div>
                ${upcoming.length === 0 ? '<p style="color:var(--text-light);">No upcoming events.</p>' :
                upcoming.map(e => `
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);">
                        <div>
                            <strong>${e.title}</strong>
                            <p style="font-size:0.8rem;color:var(--text-light);margin:0;">${e.date} • ${e.type}</p>
                        </div>
                        <span style="background:#EEF6E8;padding:4px 12px;border-radius:20px;font-weight:700;font-size:0.8rem;color:var(--primary-dark);">+${e.exp} EXP</span>
                    </div>
                `).join('')}
            </div>
        `;

        // Leaderboard preview
        const sorted = [...data.members].sort((a, b) => b.exp - a.exp).slice(0, 5);
        html += `
            <div class="card">
                <div class="card-title">
                    <h3>🏆 Leaderboard</h3>
                    <a href="#" onclick="window.__showLeaderboard();return false;" style="color:var(--primary);font-weight:600;font-size:0.85rem;">View all</a>
                </div>
                ${sorted.map((m, i) => `
                    <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:${i < sorted.length-1 ? '1px solid var(--border)' : 'none'};">
                        <span style="font-weight:700;width:24px;color:${i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--text-light)'};">#${i+1}</span>
                        <span style="flex:1;font-weight:${i < 3 ? '600' : '400'};">${m.name}</span>
                        <span style="font-weight:700;color:var(--primary);">${m.exp} EXP</span>
                    </div>
                `).join('')}
            </div>
        `;

        document.getElementById('content').innerHTML = html;
    }
};

// ================================================================
// MODULE: Events (with multiplier awareness)
// ================================================================
const Events = {
    render() {
        const data = Storage.getAppData();
        const events = [...data.events].sort((a, b) => new Date(a.date) - new Date(b.date));

        let html = `
            <div style="display:flex;gap:12px;margin-bottom:18px;flex-wrap:wrap;">
                <input type="text" id="event-search" placeholder="Search events..." style="flex:1;padding:12px 18px;border:2px solid var(--border);border-radius:18px;font-size:0.9rem;outline:none;background:white;">
                <select id="event-filter" style="padding:12px 18px;border:2px solid var(--border);border-radius:18px;font-size:0.9rem;outline:none;background:white;color:var(--text);">
                    <option value="all">All Types</option>
                    <option value="assembly">Assembly</option>
                    <option value="competition">Competition</option>
                    <option value="sports">Sports</option>
                    <option value="volunteer">Volunteer</option>
                </select>
            </div>
            <div id="event-list">
        `;

        if (events.length === 0) {
            html += UI.emptyState('No events scheduled yet.', 'event', '__createEvent()');
        } else {
            events.forEach(e => {
                const isPast = new Date(e.date) < new Date();
                const expWithMult = Math.round(e.exp * Gamification.getMultiplier());
                html += `
                    <div class="event-card" data-title="${e.title.toLowerCase()}" data-type="${e.type}">
                        <div class="event-banner" style="background:${isPast ? 'var(--border)' : 'linear-gradient(135deg,var(--primary),var(--primary-light))'};">
                            <span class="material-symbols-rounded" style="font-size:60px;">${isPast ? 'event_busy' : 'event'}</span>
                        </div>
                        <div class="event-content">
                            <div class="event-title">
                                <h3>${e.title}</h3>
                                <span style="font-size:0.8rem;color:${isPast ? 'var(--text-light)' : 'var(--primary)'};font-weight:600;">${isPast ? 'Past' : 'Upcoming'}</span>
                            </div>
                            <div class="event-meta">
                                <span>📅 ${e.date}</span>
                                <span>📍 ${e.location || 'TBA'}</span>
                                <span>🏷️ ${e.type}</span>
                            </div>
                            <p style="color:var(--text-light);font-size:0.9rem;margin:8px 0;">${e.description || 'No description.'}</p>
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;flex-wrap:wrap;gap:10px;">
                                <span class="event-reward">⭐ +${expWithMult} EXP ${Gamification.getMultiplier() > 1 ? `(x${Gamification.getMultiplier()})` : ''}</span>
                                ${!isPast ? `<button class="btn-primary" style="padding:8px 20px;width:auto;font-size:0.85rem;" onclick="window.__checkinEvent(${e.id})">Check In</button>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        html += `</div>`;
        document.getElementById('content').innerHTML = html;

        document.getElementById('event-search')?.addEventListener('input', function() {
            const val = this.value.toLowerCase();
            document.querySelectorAll('.event-card').forEach(c => {
                const title = c.dataset.title || '';
                c.style.display = title.includes(val) ? '' : 'none';
            });
        });

        document.getElementById('event-filter')?.addEventListener('change', function() {
            const val = this.value;
            document.querySelectorAll('.event-card').forEach(c => {
                const type = c.dataset.type || '';
                c.style.display = val === 'all' || type === val ? '' : 'none';
            });
        });
    },

    checkin(eventId) {
        const user = Auth.currentUser;
        if (!user) return;
        const data = Storage.getAppData();
        const event = data.events.find(e => e.id === eventId);
        if (!event) return UI.toast({ message: 'Event not found.', type: 'error' });

        const member = data.members.find(m => m.studentId === user.studentId);
        if (!member) return;

        const today = new Date().toISOString().split('T')[0];
        if (member.attendance && member.attendance.includes(today)) {
            return UI.toast({ message: 'You already checked in today!', type: 'warning' });
        }

        if (!member.attendance) member.attendance = [];
        member.attendance.push(today);

        // Update streak
        Auth.updateStreak(user.studentId);

        const result = Gamification.addExp(user.studentId, event.exp, `Attended ${event.title}`);

        if (!data.checkIns) data.checkIns = [];
        data.checkIns.push({
            memberId: user.studentId,
            eventId: event.id,
            date: today,
            exp: event.exp
        });

        // Update quest progress for check-in
        Quests.updateProgress(user.studentId, 'checkin', 1);
        Quests.updateProgress(user.studentId, 'checkin_weekly', 1);
        Quests.updateProgress(user.studentId, 'checkins_total', 1);
        Quests.updateProgress(user.studentId, 'attendance_monthly', 1);
        // For volunteer quest
        if (event.type === 'volunteer') {
            Quests.updateProgress(user.studentId, 'volunteer', 1);
        }

        Storage.saveAppData(data);

        Auth.currentUser = { ...Auth.currentUser, ...member };
        Storage.setCurrentUser(Auth.currentUser);

        UI.toast({ message: `✅ Checked in to ${event.title}! +${result.gained} EXP`, type: 'success' });
        UI.confetti({ count: 40 });

        const rect = document.querySelector('.event-card')?.getBoundingClientRect();
        if (rect) {
            UI.floatExp(result.gained, rect.left + rect.width / 2, rect.top);
        }

        this.render();
        Dashboard.render();
    }
};

// ================================================================
// MODULE: Profile (with avatar upload and personal stats)
// ================================================================
const Profile = {
    render() {
        const user = Auth.currentUser;
        if (!user) return;
        const data = Storage.getAppData();
        const member = data.members.find(m => m.studentId === user.studentId);
        if (!member) return;

        const level = Gamification.getLevel(member.exp);
        const badges = Gamification.getMemberBadges(member.studentId);
        const unlocked = badges.filter(b => b.unlocked);
        const attendanceCount = member.attendance?.length || 0;
        const streak = member.streak || 0;

        let html = `
            <div class="profile-card">
                <div class="profile-pic-wrapper">
                    <img src="${member.avatar || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"%3E%3Ccircle cx="60" cy="60" r="60" fill="%23DDE8CF"/%3E%3Ctext x="60" y="75" font-size="48" text-anchor="middle" fill="%23759954"%3E👤%3C/text%3E%3C/svg%3E'}" alt="Avatar" style="width:120px;height:120px;border-radius:50%;object-fit:cover;border:4px solid var(--primary);">
                    <label class="profile-pic-upload" for="avatar-upload">
                        <span class="material-symbols-rounded" style="font-size:20px;">camera_alt</span>
                        <input type="file" id="avatar-upload" accept="image/*" style="display:none;">
                    </label>
                </div>
                <h2>${member.name}</h2>
                <p>${member.position || 'Member'} • ${member.year} Year</p>
                ${streak > 0 ? `<p style="margin-top:4px;"><span class="streak-badge">🔥 ${streak} Day Streak</span></p>` : ''}
                <div class="profile-stats">
                    <div class="profile-stat">
                        <h3>${member.exp}</h3>
                        <small>EXP</small>
                    </div>
                    <div class="profile-stat">
                        <h3>${level.level}</h3>
                        <small>Level</small>
                    </div>
                    <div class="profile-stat">
                        <h3>${attendanceCount}</h3>
                        <small>Attendance</small>
                    </div>
                </div>
            </div>

            <div class="card">
                <h4>📋 Member Details</h4>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;">
                    <div><strong>Student ID</strong><br><span style="color:var(--text-light);font-size:0.9rem;">${member.studentId}</span></div>
                    <div><strong>Course</strong><br><span style="color:var(--text-light);font-size:0.9rem;">${member.course || 'B.A. Political Science'}</span></div>
                    <div><strong>Year</strong><br><span style="color:var(--text-light);font-size:0.9rem;">${member.year}</span></div>
                    <div><strong>Membership</strong><br><span style="color:var(--text-light);font-size:0.9rem;">${member.membership}</span></div>
                    <div><strong>Position</strong><br><span style="color:var(--text-light);font-size:0.9rem;">${member.position || 'N/A'}</span></div>
                    <div><strong>Email</strong><br><span style="color:var(--text-light);font-size:0.9rem;">${member.email || 'N/A'}</span></div>
                </div>
            </div>
        `;

        // Personal stats chart (if Chart.js available)
        if (typeof Chart !== 'undefined') {
            html += `
                <div class="card">
                    <h4>📈 Your Activity</h4>
                    <canvas id="personal-stats-chart" style="height:200px;"></canvas>
                </div>
            `;
        }

        // Badges
        html += `
            <div class="card">
                <div class="card-title">
                    <h4>🏅 Badges</h4>
                    <span style="font-size:0.8rem;color:var(--text-light);">${unlocked.length}/${badges.length}</span>
                </div>
                <div class="badge-grid">
                    ${badges.map(b => `
                        <div class="badge-card ${b.unlocked ? '' : 'locked'}">
                            <div class="badge-icon" style="background:${b.unlocked ? 'linear-gradient(135deg,#FFD54F,#FFB300)' : '#e0e0e0'};">
                                ${b.icon}
                            </div>
                            <strong style="font-size:0.8rem;">${b.name}</strong>
                            <p style="font-size:0.65rem;color:var(--text-light);margin-top:4px;">${b.unlocked ? '✅ Unlocked' : '🔒 Locked'}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Achievements
        if (member.achievements && member.achievements.length > 0) {
            html += `
                <div class="card">
                    <h4>🏆 Achievements</h4>
                    <ul style="list-style:none;padding:0;margin-top:8px;">
                        ${member.achievements.map(a => `<li style="padding:6px 0;border-bottom:1px solid var(--border);display:flex;gap:10px;"><span class="material-symbols-rounded" style="color:var(--primary);font-size:20px;">emoji_events</span>${a}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Grade Conversion
        html += `
            <div class="card">
                <div class="card-title">
                    <h4>📝 Grade Conversion</h4>
                </div>
                <p style="color:var(--text-light);font-size:0.9rem;">Request to convert your organization participation into academic grade credits.</p>
                ${member.gradeConvRequested ?
                    '<p style="margin-top:10px;color:var(--success);font-weight:600;">✅ Request submitted. Awaiting approval.</p>' :
                    `<button class="btn-primary" style="margin-top:12px;width:auto;padding:10px 24px;display:inline-flex;" onclick="window.__requestGrade()">Request Grade Conversion</button>`
                }
            </div>
        `;

        // Settings
        html += `
            <div class="card">
                <div class="card-title">
                    <h4>⚙️ Settings</h4>
                </div>
                <div style="display:flex;flex-direction:column;gap:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);">
                        <span>Dark Mode</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="dark-mode-toggle" ${document.body.classList.contains('dark') ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <button class="text-btn" style="text-align:left;color:var(--danger);padding:8px 0;" onclick="window.__resetApp()">🗑️ Reset App Data</button>
                    <button class="text-btn" style="text-align:left;color:var(--primary);padding:8px 0;" onclick="window.__exportData()">📤 Export Data</button>
                </div>
            </div>
        `;

        document.getElementById('content').innerHTML = html;

        // Avatar upload
        document.getElementById('avatar-upload')?.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            UI.uploadAvatar(file, (dataUrl) => {
                member.avatar = dataUrl;
                Storage.saveAppData(data);
                Auth.currentUser.avatar = dataUrl;
                Storage.setCurrentUser(Auth.currentUser);
                UI.toast({ message: 'Avatar updated!', type: 'success' });
                Profile.render();
            });
        });

        // Personal stats chart
        if (typeof Chart !== 'undefined') {
            const canvas = document.getElementById('personal-stats-chart');
            if (canvas) {
                const attend = member.attendance || [];
                const last10 = attend.slice(-10);
                const labels = last10.map(d => new Date(d).toLocaleDateString());
                new Chart(canvas, {
                    type: 'line',
                    data: {
                        labels: labels.length ? labels : ['No data'],
                        datasets: [{
                            label: 'Check-ins',
                            data: labels.length ? labels.map(() => 1) : [0],
                            borderColor: '#759954',
                            backgroundColor: 'rgba(117,153,84,0.1)',
                            fill: true,
                            tension: 0.3
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        }
                    }
                });
            }
        }

        // Dark mode toggle
        document.getElementById('dark-mode-toggle')?.addEventListener('change', function() {
            document.body.classList.toggle('dark', this.checked);
            localStorage.setItem('darkMode', this.checked);
        });
    }
};

// ================================================================
// MODULE: Leaderboard (unchanged)
// ================================================================
const Leaderboard = {
    render() {
        const data = Storage.getAppData();
        const sorted = [...data.members].sort((a, b) => b.exp - a.exp);

        let html = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <h3>🏆 Leaderboard</h3>
                <span style="color:var(--text-light);font-size:0.9rem;">${sorted.length} members</span>
            </div>
        `;

        if (sorted.length === 0) {
            html += UI.emptyState('No members yet.', 'groups');
        } else {
            html += `<div class="leaderboard">`;
            sorted.forEach((m, i) => {
                const isCurrent = m.studentId === Auth.currentUser?.studentId;
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`;
                html += `
                    <div class="rank" style="${isCurrent ? 'border:2px solid var(--primary);' : ''}">
                        <div class="rank-number" style="background:${i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--primary)'};">${medal}</div>
                        <div class="rank-avatar">
                            <img src="${m.avatar || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 55 55"%3E%3Ccircle cx="27.5" cy="27.5" r="27.5" fill="%23DDE8CF"/%3E%3Ctext x="27.5" y="35" font-size="24" text-anchor="middle" fill="%23759954"%3E👤%3C/text%3E%3C/svg%3E'}" style="width:55px;height:55px;border-radius:50%;object-fit:cover;">
                        </div>
                        <div class="rank-info">
                            <strong>${m.name}</strong>
                            <div style="font-size:0.8rem;color:var(--text-light);">${m.position || 'Member'} • ${m.year} Year</div>
                            ${m.streak > 0 ? `<span class="streak-badge" style="font-size:0.6rem;">🔥 ${m.streak}</span>` : ''}
                        </div>
                        <div class="rank-exp">${m.exp} EXP</div>
                    </div>
                `;
            });
            html += `</div>`;
        }

        document.getElementById('content').innerHTML = html;
    }
};

// ================================================================
// MODULE: Grievance (unchanged but with audit log integration)
// ================================================================
const Grievance = {
    render() {
        const data = Storage.getAppData();
        const user = Auth.currentUser;
        const isOfficer = Auth.isOfficer();

        let grievances = data.grievances || [];

        if (!isOfficer) {
            grievances = grievances.filter(g => g.memberId === user.studentId || g.anonymous);
        }

        let html = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
                <h3>📋 Grievances</h3>
                <button class="btn-primary" style="width:auto;padding:10px 20px;display:inline-flex;gap:8px;" onclick="window.__showGrievanceForm()">
                    <span class="material-symbols-rounded" style="font-size:20px;">add</span> New
                </button>
            </div>
        `;

        if (grievances.length === 0) {
            html += UI.emptyState('No grievances found.', 'gavel', '__showGrievanceForm()');
        } else {
            grievances.forEach(g => {
                const statusMap = {
                    'submitted': { label: 'Submitted', color: 'var(--warning)' },
                    'in-progress': { label: 'In Progress', color: 'var(--primary)' },
                    'resolved': { label: 'Resolved', color: 'var(--success)' },
                    'rejected': { label: 'Rejected', color: 'var(--danger)' }
                };
                const status = statusMap[g.status] || statusMap['submitted'];
                html += `
                    <div class="card">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                            <div>
                                <h4>${g.title}</h4>
                                <p style="color:var(--text-light);font-size:0.9rem;margin-top:4px;">${g.description}</p>
                                ${g.anonymous ? '<p style="font-size:0.8rem;color:var(--text-light);">🔒 Anonymous</p>' : ''}
                            </div>
                            <span style="padding:4px 12px;border-radius:20px;font-size:0.75rem;font-weight:600;background:${status.color}20;color:${status.color};">${status.label}</span>
                        </div>
                        <div style="margin-top:10px;font-size:0.8rem;color:var(--text-light);">
                            <span>📅 ${new Date(g.createdAt).toLocaleDateString()}</span>
                            ${g.notes ? `<p style="margin-top:4px;">📝 ${g.notes}</p>` : ''}
                            ${g.resolution ? `<p style="margin-top:4px;color:var(--success);">✅ Resolution: ${g.resolution}</p>` : ''}
                        </div>
                        ${isOfficer && g.status !== 'resolved' ? `
                            <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
                                <button class="btn-primary" style="padding:6px 16px;font-size:0.8rem;width:auto;" onclick="window.__updateGrievance('${g.id}','in-progress')">In Progress</button>
                                <button class="btn-primary" style="padding:6px 16px;font-size:0.8rem;width:auto;background:var(--success);" onclick="window.__resolveGrievance('${g.id}')">Resolve</button>
                                <button class="btn-primary" style="padding:6px 16px;font-size:0.8rem;width:auto;background:var(--danger);" onclick="window.__updateGrievance('${g.id}','rejected')">Reject</button>
                            </div>
                        ` : ''}
                    </div>
                `;
            });
        }

        document.getElementById('content').innerHTML = html;
    },

    showForm() {
        UI.modal(`
            <h3>📝 Submit Grievance</h3>
            <form id="grievance-form">
                <div class="form-group">
                    <label>Title</label>
                    <div class="input-box">
                        <span class="material-symbols-rounded">title</span>
                        <input type="text" id="grievance-title" placeholder="Brief title" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <div class="input-box" style="align-items:flex-start;">
                        <span class="material-symbols-rounded" style="margin-top:12px;">description</span>
                        <textarea id="grievance-desc" style="flex:1;border:none;outline:none;background:transparent;resize:vertical;min-height:80px;font-family:inherit;font-size:14px;color:var(--text);" placeholder="Describe your grievance in detail..." required></textarea>
                    </div>
                </div>
                <div class="form-group">
                    <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
                        <input type="checkbox" id="grievance-anon"> Submit Anonymously
                    </label>
                </div>
                <button type="submit" class="btn-primary" style="margin-top:8px;">Submit Grievance</button>
                <button type="button" class="text-btn" data-close-modal style="margin-top:8px;">Cancel</button>
            </form>
        `);

        document.getElementById('grievance-form')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('grievance-title').value.trim();
            const desc = document.getElementById('grievance-desc').value.trim();
            const anon = document.getElementById('grievance-anon').checked;

            if (!title || !desc) return UI.toast({ message: 'Please fill in all fields.', type: 'error' });

            const user = Auth.currentUser;
            const grievance = {
                memberId: user.studentId,
                title,
                description: desc,
                anonymous: anon,
                status: 'submitted',
                notes: '',
                resolution: ''
            };

            Storage.addGrievance(grievance);
            UI.closeModal();
            UI.toast({ message: 'Grievance submitted successfully.', type: 'success' });
            NotifCenter.add('New Grievance Submitted', `${title} - Awaiting review.`, 'info', 'gavel');
            Audit.log('Grievance Submitted', `New grievance: ${title}`);
            Grievance.render();
        });
    },

    updateStatus(id, status) {
        const result = Storage.updateGrievance(id, { status });
        if (result) {
            UI.toast({ message: `Grievance updated to ${status}.`, type: 'success' });
            Audit.log('Grievance Updated', `Grievance ${id} status changed to ${status}`);
            Grievance.render();
        }
    },

    resolve(id) {
        UI.modal(`
            <h3>✅ Resolve Grievance</h3>
            <div class="form-group">
                <label>Resolution Notes</label>
                <div class="input-box" style="align-items:flex-start;">
                    <span class="material-symbols-rounded" style="margin-top:12px;">edit</span>
                    <textarea id="resolution-text" style="flex:1;border:none;outline:none;background:transparent;resize:vertical;min-height:80px;font-family:inherit;font-size:14px;color:var(--text);" placeholder="Describe how this grievance was resolved..."></textarea>
                </div>
            </div>
            <button class="btn-primary" id="resolve-submit">Mark as Resolved</button>
            <button class="text-btn" data-close-modal>Cancel</button>
        `);

        document.getElementById('resolve-submit')?.addEventListener('click', function() {
            const notes = document.getElementById('resolution-text').value.trim();
            const result = Storage.updateGrievance(id, { status: 'resolved', resolution: notes || 'Resolved.' });
            if (result) {
                UI.closeModal();
                UI.toast({ message: 'Grievance resolved!', type: 'success' });
                Audit.log('Grievance Resolved', `Grievance ${id} resolved.`);
                Grievance.render();
            }
        });
    }
};

// ================================================================
// MODULE: Learning (unchanged)
// ================================================================
const Learning = {
    currentTab: 'constitution',

    render() {
        const data = Storage.getAppData();
        const resources = data.learningResources || {};

        const tabs = [
            { id: 'constitution', label: 'Constitution', icon: 'gavel' },
            { id: 'bylaws', label: 'By-Laws', icon: 'menu_book' },
            { id: 'news', label: 'News', icon: 'newspaper' },
            { id: 'government', label: 'Government', icon: 'account_balance' },
            { id: 'reviewer', label: 'Reviewer', icon: 'school' },
        ];

        let html = `
            <h3 style="margin-bottom:16px;">📚 Learning Center</h3>
            <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;overflow-x:auto;padding-bottom:4px;">
                ${tabs.map(t => `
                    <button class="tab-btn ${this.currentTab === t.id ? 'active' : ''}" data-tab="${t.id}" style="padding:10px 18px;border-radius:16px;border:none;background:${this.currentTab === t.id ? 'var(--primary)' : 'white'};color:${this.currentTab === t.id ? 'white' : 'var(--text)'};font-weight:600;font-size:0.85rem;display:flex;align-items:center;gap:6px;box-shadow:${this.currentTab === t.id ? '0 8px 20px rgba(117,153,84,0.3)' : 'var(--shadow)'};transition:.3s;">
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
            });
        });
    },

    renderTab(tab, resources) {
        const content = resources[tab] || 'Content not yet available.';
        const titles = {
            constitution: '📜 Constitution',
            bylaws: '📋 By-Laws',
            news: '📰 Latest News',
            government: '🏛️ Government Updates',
            reviewer: '📖 Reviewer'
        };

        return `
            <h4>${titles[tab] || tab}</h4>
            <div style="margin-top:12px;line-height:1.8;color:var(--text-light);white-space:pre-wrap;max-height:400px;overflow-y:auto;padding-right:8px;">
                ${content}
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

// ================================================================
// MODULE: Officer (updated with audit log & bulk actions)
// ================================================================
const Officer = {
    renderDashboard() {
        const data = Storage.getAppData();
        const totalMembers = data.members.length;
        const activeMembers = data.members.filter(m => m.membership === 'Active').length;
        const totalExp = data.members.reduce((sum, m) => sum + m.exp, 0);
        const avgExp = totalMembers > 0 ? Math.round(totalExp / totalMembers) : 0;
        const totalEvents = data.events.length;
        const pendingGrievance = data.grievances.filter(g => g.status === 'submitted' || g.status === 'in-progress')
            .length;
        const totalBadges = data.members.reduce((sum, m) => sum + (m.badges?.length || 0), 0);

        let html = `
            <h3 style="margin-bottom:16px;">📊 Officer Dashboard</h3>
            <div class="analytics-grid">
                <div class="analytics-card">
                    <span class="material-symbols-rounded">groups</span>
                    <h2>${totalMembers}</h2>
                    <p>Total Members</p>
                    <small style="color:var(--text-light);">${activeMembers} active</small>
                </div>
                <div class="analytics-card">
                    <span class="material-symbols-rounded">stars</span>
                    <h2>${avgExp}</h2>
                    <p>Avg EXP</p>
                    <small style="color:var(--text-light);">${totalExp} total</small>
                </div>
                <div class="analytics-card">
                    <span class="material-symbols-rounded">event</span>
                    <h2>${totalEvents}</h2>
                    <p>Total Events</p>
                    <small style="color:var(--text-light);">${data.events.filter(e => new Date(e.date) >= new Date()).length} upcoming</small>
                </div>
                <div class="analytics-card">
                    <span class="material-symbols-rounded">gavel</span>
                    <h2>${pendingGrievance}</h2>
                    <p>Pending Grievances</p>
                    <small style="color:var(--text-light);">${data.grievances.length} total</small>
                </div>
                <div class="analytics-card">
                    <span class="material-symbols-rounded">workspace_premium</span>
                    <h2>${totalBadges}</h2>
                    <p>Badges Awarded</p>
                    <small style="color:var(--text-light);">${data.members.filter(m => m.badges?.length > 0).length} members with badges</small>
                </div>
                <div class="analytics-card">
                    <span class="material-symbols-rounded">check_circle</span>
                    <h2>${data.members.filter(m => m.gradeConvRequested).length}</h2>
                    <p>Grade Requests</p>
                    <small style="color:var(--text-light);">Pending approval</small>
                </div>
            </div>
            <div style="display:flex;gap:12px;margin-top:18px;flex-wrap:wrap;">
                <button class="btn-primary" onclick="window.__nav('events')">📅 Manage Events</button>
                <button class="btn-primary" style="background:var(--primary-dark);" onclick="window.__showAnnouncementForm()">📢 Post Announcement</button>
                <button class="btn-primary" style="background:var(--text-light);" onclick="window.__awardBadge()">🏅 Award Badge</button>
                <button class="btn-primary" style="background:var(--success);" onclick="window.__viewGradeRequests()">📝 Grade Requests</button>
                <button class="btn-primary" style="background:var(--text-light);" onclick="window.__nav('audit')">📋 Audit Log</button>
                <button class="btn-primary" style="background:var(--text-light);" onclick="window.__nav('bulk')">👥 Bulk Actions</button>
                <button class="btn-primary" style="background:var(--text-light);" onclick="window.__nav('quizzes')">📝 Quizzes</button>
                <button class="btn-primary" style="background:var(--text-light);" onclick="window.__nav('resources')">📚 Resources</button>
            </div>
        `;

        document.getElementById('content').innerHTML = html;
    },

    renderMembers() {
        const data = Storage.getAppData();
        let html = `
            <h3 style="margin-bottom:16px;">👥 Members</h3>
            <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
                <input type="text" id="member-search" placeholder="Search members..." style="flex:1;padding:12px 18px;border:2px solid var(--border);border-radius:18px;font-size:0.9rem;outline:none;background:white;">
            </div>
            <div id="member-list">
        `;

        if (data.members.length === 0) {
            html += UI.emptyState('No members registered.', 'groups');
        } else {
            const sorted = [...data.members].sort((a, b) => b.exp - a.exp);
            sorted.forEach(m => {
                html += `
                    <div class="card" data-name="${m.name.toLowerCase()}" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                        <div>
                            <div style="display:flex;align-items:center;gap:10px;">
                                <img src="${m.avatar || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Ccircle cx="20" cy="20" r="20" fill="%23DDE8CF"/%3E%3Ctext x="20" y="28" font-size="20" text-anchor="middle" fill="%23759954"%3E👤%3C/text%3E%3C/svg%3E'}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">
                                <div>
                                    <strong>${m.name}</strong>
                                    <p style="font-size:0.8rem;color:var(--text-light);margin:0;">${m.studentId} • ${m.year} Year • ${m.position || 'Member'}</p>
                                    <p style="font-size:0.8rem;color:var(--text-light);margin:0;">🏅 ${m.badges?.length || 0} badges • 📅 ${m.attendance?.length || 0} attendances • 🔥 ${m.streak || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-weight:700;color:var(--primary);">${m.exp} EXP</div>
                            <button class="btn-primary" style="padding:4px 14px;font-size:0.75rem;width:auto;margin-top:4px;" onclick="window.__viewMember('${m.studentId}')">View</button>
                        </div>
                    </div>
                `;
            });
        }

        html += `</div>`;
        document.getElementById('content').innerHTML = html;

        document.getElementById('member-search')?.addEventListener('input', function() {
            const val = this.value.toLowerCase();
            document.querySelectorAll('#member-list .card').forEach(c => {
                const name = c.dataset.name || '';
                c.style.display = name.includes(val) ? '' : 'none';
            });
        });
    },

    renderManageEvents() {
        const data = Storage.getAppData();
        let html = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
                <h3>📅 Manage Events</h3>
                <button class="btn-primary" style="width:auto;padding:10px 20px;display:inline-flex;gap:8px;" onclick="window.__createEvent()">
                    <span class="material-symbols-rounded" style="font-size:20px;">add</span> Create Event
                </button>
            </div>
        `;

        if (data.events.length === 0) {
            html += UI.emptyState('No events created yet.', 'event', '__createEvent()');
        } else {
            data.events.forEach(e => {
                html += `
                    <div class="card">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;">
                            <div>
                                <h4>${e.title}</h4>
                                <p style="font-size:0.85rem;color:var(--text-light);">📅 ${e.date} • 📍 ${e.location || 'TBA'} • 🏷️ ${e.type}</p>
                                <p style="font-size:0.85rem;color:var(--text-light);">⭐ +${e.exp} EXP</p>
                            </div>
                            <div style="display:flex;gap:8px;">
                                <button class="btn-primary" style="padding:4px 14px;font-size:0.75rem;width:auto;background:var(--danger);" onclick="window.__deleteEvent(${e.id})">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        document.getElementById('content').innerHTML = html;
    },

    renderAnnouncements() {
        const data = Storage.getAppData();
        let html = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
                <h3>📢 Announcements</h3>
                <button class="btn-primary" style="width:auto;padding:10px 20px;display:inline-flex;gap:8px;" onclick="window.__showAnnouncementForm()">
                    <span class="material-symbols-rounded" style="font-size:20px;">add</span> Post
                </button>
            </div>
        `;

        if (data.announcements.length === 0) {
            html += UI.emptyState('No announcements.', 'campaign', '__showAnnouncementForm()');
        } else {
            data.announcements.forEach((a, i) => {
                html += `
                    <div class="announcement">
                        <div class="announcement-icon">
                            <span class="material-symbols-rounded">campaign</span>
                        </div>
                        <div style="flex:1;">
                            <p>${a}</p>
                            <small style="color:var(--text-light);">Posted recently</small>
                        </div>
                    </div>
                `;
            });
        }

        document.getElementById('content').innerHTML = html;
    },

    renderBadges() {
        const data = Storage.getAppData();
        const definitions = Gamification.getBadgeDefinitions();
        const allMembers = data.members;

        let html = `
            <h3 style="margin-bottom:16px;">🏅 Badge Management</h3>
            <p style="color:var(--text-light);margin-bottom:16px;">Award badges to members for their achievements.</p>
            <button class="btn-primary" style="width:auto;padding:10px 20px;display:inline-flex;gap:8px;margin-bottom:20px;" onclick="window.__awardBadge()">
                <span class="material-symbols-rounded" style="font-size:20px;">workspace_premium</span> Award Badge
            </button>
            <div class="badge-grid">
                ${definitions.map(b => {
                    const count = allMembers.filter(m => m.badges?.includes(b.id)).length;
                    return `
                        <div class="badge-card">
                            <div class="badge-icon" style="background:linear-gradient(135deg,#FFD54F,#FFB300);">${b.icon}</div>
                            <strong>${b.name}</strong>
                            <p style="font-size:0.7rem;color:var(--text-light);">${count} members</p>
                            <p style="font-size:0.65rem;color:var(--text-light);margin-top:4px;">${b.desc}</p>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        document.getElementById('content').innerHTML = html;
    },

    renderGradeRequests() {
        const data = Storage.getAppData();
        const requests = data.members.filter(m => m.gradeConvRequested);

        let html = `
            <h3 style="margin-bottom:16px;">📝 Grade Conversion Requests</h3>
        `;

        if (requests.length === 0) {
            html += UI.emptyState('No grade conversion requests.', 'assignment');
        } else {
            requests.forEach(m => {
                html += `
                    <div class="card">
                        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                            <div>
                                <strong>${m.name}</strong>
                                <p style="font-size:0.85rem;color:var(--text-light);">${m.studentId} • ${m.year} Year</p>
                                <p style="font-size:0.85rem;color:var(--text-light);">EXP: ${m.exp} • Badges: ${m.badges?.length || 0}</p>
                            </div>
                            <div style="display:flex;gap:8px;">
                                <button class="btn-primary" style="padding:6px 16px;font-size:0.8rem;width:auto;background:var(--success);" onclick="window.__approveGrade('${m.studentId}')">Approve</button>
                                <button class="btn-primary" style="padding:6px 16px;font-size:0.8rem;width:auto;background:var(--danger);" onclick="window.__rejectGrade('${m.studentId}')">Reject</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        document.getElementById('content').innerHTML = html;
    },

    renderGrievances() {
        Grievance.render();
    },

    renderLeaderboard() {
        Leaderboard.render();
    },

    renderAnalytics() {
        Analytics.render();
    },

    renderAuditLog() {
        Audit.render();
    },

    renderBulkActions() {
        BulkActions.render();
    },

    renderQuizzes() {
        Quizzes.render();
    },

    renderResources() {
        Resources.render();
    },

    showAwardBadge() {
        const data = Storage.getAppData();
        const definitions = Gamification.getBadgeDefinitions();

        let memberOptions = data.members.map(m =>
            `<option value="${m.studentId}">${m.name} (${m.exp} EXP)</option>`
        ).join('');

        let badgeOptions = definitions.map(b =>
            `<option value="${b.id}">${b.icon} ${b.name}</option>`
        ).join('');

        UI.modal(`
            <h3>🏅 Award Badge</h3>
            <form id="award-badge-form">
                <div class="form-group">
                    <label>Member</label>
                    <div class="input-box">
                        <span class="material-symbols-rounded">person</span>
                        <select id="award-member">${memberOptions}</select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Badge</label>
                    <div class="input-box">
                        <span class="material-symbols-rounded">workspace_premium</span>
                        <select id="award-badge">${badgeOptions}</select>
                    </div>
                </div>
                <button type="submit" class="btn-primary">Award Badge</button>
                <button type="button" class="text-btn" data-close-modal>Cancel</button>
            </form>
        `);

        document.getElementById('award-badge-form')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const memberId = document.getElementById('award-member').value;
            const badgeId = document.getElementById('award-badge').value;

            const member = data.members.find(m =>