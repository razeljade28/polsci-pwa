import { Storage } from '../storage.js';
import { Auth } from '../auth.js';
import { Gamification } from '../gamification.js';
import { UI, sanitizeHTML } from '../utils.js';

export const Learning = {
  currentCategory: 'all',
  currentTopic: 'constitution',
  searchTerm: '',
  topics: [
    { id: 'constitution', title: '1987 Present Constitution', category: 'constitutions', icon: 'gavel' },
    { id: 'constitution1899', title: '1899 Malolos Constitution', category: 'constitutions', icon: 'history' },
    { id: 'constitution1935', title: '1935 Commonwealth', category: 'constitutions', icon: 'history' },
    { id: 'constitution1943', title: '1943 Occupation', category: 'constitutions', icon: 'history' },
    { id: 'constitution1973', title: '1973 Constitution', category: 'constitutions', icon: 'history' },
    { id: 'constitution1986', title: '1986 Freedom Constitution', category: 'constitutions', icon: 'history' },
    { id: 'government', title: 'Government at a Glance', category: 'government', icon: 'account_balance' },
    { id: 'news', title: 'Current Affairs', category: 'current', icon: 'newspaper' },
    { id: 'bylaws', title: 'SEPOLSCIS By-Laws', category: 'organization', icon: 'groups' },
    { id: 'reviewer', title: 'Exam Reviewer', category: 'review', icon: 'school' }
  ],
  quizzes: {
    constitution: { question: 'Where does sovereignty reside under Article II, Section 1 of the 1987 Philippine Constitution?', options: ['In Congress', 'In the people', 'In the President', 'In the Supreme Court'], answer: 1, explanation: 'Article II states that sovereignty resides in the people.' }
  },

  getProgress() {
    const data = Storage.getAppData();
    const userId = Auth.currentUser?.studentId;
    if (!userId) return { viewed: [], saved: [], quizPassed: [] };
    data.learningProgress ||= {};
    if (!data.learningProgress[userId]) {
      data.learningProgress[userId] = { viewed: [], saved: [], quizPassed: [] };
      Storage.saveAppData(data);
    }
    return data.learningProgress[userId];
  },
  saveProgress(progress) {
    const data = Storage.getAppData();
    data.learningProgress[Auth.currentUser.studentId] = progress;
    Storage.saveAppData(data);
  },
  markViewed(id) {
    const progress = this.getProgress();
    if (!progress.viewed.includes(id)) {
      progress.viewed.push(id);
      this.saveProgress(progress);
      Storage.updateQuestProgress('read');
    }
  },

  render() {
    const progress = this.getProgress();
    const filtered = this.topics.filter(t => 
      (this.currentCategory === 'all' || t.category === this.currentCategory) &&
      t.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    const active = this.topics.find(t => t.id === this.currentTopic) || filtered[0] || this.topics[0];

    let html = `
      <section class="learning-header">
        <p class="eyebrow">POLSCI STUDY SPACE</p>
        <h2>Academic Learning Center</h2>
        <p>Explore Philippine constitutions, test your knowledge, and ask the AI Constitutional Advisor for support.</p>
      </section>

      <div class="learning-tabs">
        ${['all','constitutions','government','current','organization','reviewer'].map(cat => `
          <button class="tab-btn ${this.currentCategory === cat ? 'active' : ''}" data-category="${cat}">
            ${cat === 'all' ? 'All Topics' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        `).join('')}
      </div>

      <label class="search-box">
        <span class="material-symbols-rounded">search</span>
        <input id="learning-search" placeholder="Search study topic..." value="${sanitizeHTML(this.searchTerm)}">
      </label>

      <div class="learning-layout">
        <div class="topic-sidebar">
          ${filtered.map(t => `
            <button class="topic-item ${active.id === t.id ? 'selected' : ''}" data-topic="${t.id}">
              <span class="material-symbols-rounded">${t.icon}</span>
              <span>
                <strong>${sanitizeHTML(t.title)}</strong>
                <small>${t.category.toUpperCase()}</small>
              </span>
              ${progress.quizPassed.includes(t.id) ? '<span class="badge-complete">PASSED</span>' : ''}
            </button>
          `).join('')}
        </div>

        <div class="topic-content">
          ${this.renderTopic(active, progress)}
        </div>
      </div>
    `;

    document.getElementById('content').innerHTML = html;

    document.querySelectorAll('[data-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentCategory = btn.dataset.category;
        this.render();
      });
    });
    document.querySelectorAll('[data-topic]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentTopic = btn.dataset.topic;
        this.markViewed(this.currentTopic);
        this.render();
      });
    });
    document.getElementById('learning-search')?.addEventListener('input', e => {
      this.searchTerm = e.target.value;
      this.render();
    });
  },

  renderTopic(topic, progress) {
    const resources = Storage.getAppData().learningResources || {};
    const content = resources[topic.id] || 'Content not available.';
    const quiz = this.quizzes[topic.id];
    const statePolicies = 'The State shall promote a just and dynamic social order that will ensure the prosperity and independence of the nation...';

    return `
      <div class="topic-heading">
        <h3>${sanitizeHTML(topic.title)}</h3>
        <span class="topic-category">${topic.category}</span>
      </div>
      <div class="principles">
        <h4>PRINCIPLES</h4>
        <div>${sanitizeHTML(content).replace(/\n/g, '<br>')}</div>
      </div>
      <div class="constitutional-advisor">
        <div class="advisor-header">
          <span class="material-symbols-rounded">smart_toy</span>
          <div>
            <strong>CONSTITUTIONAL ADVISOR</strong>
            <small>GEMINI 2.5 · Philippine Law & History Tutor</small>
          </div>
        </div>
        <div class="advisor-state-policies">
          <h5>STATE POLICIES</h5>
          <p>${sanitizeHTML(statePolicies)}</p>
        </div>
        ${quiz ? `
          <div class="advisor-quiz">
            <p><strong>${sanitizeHTML(quiz.question)}</strong></p>
            <div class="quiz-options">
              ${quiz.options.map((opt, idx) => `
                <button onclick="window.__answerLearningQuiz('${topic.id}', ${idx})">${sanitizeHTML(opt)}</button>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  answerQuiz(topicId, answer) {
    const quiz = this.quizzes[topicId];
    if (!quiz) return;
    if (answer !== quiz.answer) return UI.toast({ message: 'Not quite—try again.', type: 'warning' });
    const progress = this.getProgress();
    if (!progress.quizPassed.includes(topicId)) {
      progress.quizPassed.push(topicId);
      this.saveProgress(progress);
      Gamification.addExp(Auth.currentUser.studentId, 20, `Completed ${this.topics.find(t => t.id === topicId)?.title} quiz`);
      UI.confetti({ count: 25 });
    }
    UI.toast({ message: `Correct! ${quiz.explanation} +20 EXP`, type: 'success' });
    this.render();
  }
};