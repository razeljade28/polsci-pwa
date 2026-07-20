import { Storage } from './storage.js';
import { hashPassword, UI } from './utils.js';

export const Auth = {
  currentUser: null,

  init() {
    this.currentUser = Storage.getCurrentUser();
    if (this.currentUser) {
      const member = Storage.getMember(this.currentUser.studentId);
      if (member) {
        this.currentUser = { ...member, role: member.role || 'member' };
        Storage.setCurrentUser(this.currentUser);
        return true;
      } else {
        Storage.removeCurrentUser();
        this.currentUser = null;
        return false;
      }
    }
    return false;
  },

  async login(studentId, password) {
    if (!studentId || !password) return { success: false, message: 'All fields required.' };
    const data = Storage.getAppData();
    const member = data.members.find(m => m.studentId === studentId);
    if (!member) return { success: false, message: 'Account not found.' };

    // migrate old password
    if (member.password && !member.passwordHash) {
      member.passwordHash = await hashPassword(member.password);
      delete member.password;
      Storage.saveAppData(data);
    }
    const hashedInput = await hashPassword(password);
    if (member.passwordHash !== hashedInput) {
      return { success: false, message: 'Invalid password.' };
    }

    this.currentUser = { ...member, role: member.role || 'member' };
    Storage.setCurrentUser(this.currentUser);
    Storage.addNotification({
      type: 'info',
      title: 'Welcome back!',
      message: `You logged in as ${member.name}`,
      icon: 'login'
    });
    return { success: true, user: this.currentUser };
  },

  async signup(studentId, password, name, year, course) {
    const data = Storage.getAppData();
    if (data.members.find(m => m.studentId === studentId)) {
      return { success: false, message: 'Student ID already registered.' };
    }
    const hashed = await hashPassword(password);
    const newMember = {
      studentId,
      name: name || studentId,
      year: year || '1',
      course: course || 'B.A. Political Science',
      position: '',
      role: 'member',
      membership: 'Active',
      exp: 0,
      attendance: [],
      badges: [],
      achievements: [],
      gradeConvRequested: false,
      email: '',
      passwordHash: hashed,
    };
    data.members.push(newMember);
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
    return this.currentUser?.role === 'adviser';
  },
  isGrievance() {
    return this.currentUser?.role === 'grievance';
  },
  getRole() {
    return this.currentUser?.role || 'member';
  }
};