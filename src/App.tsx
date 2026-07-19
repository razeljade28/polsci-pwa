import React, { useState, useEffect } from "react";
import { Member, Event, Quest, Announcement, Opportunity, Grievance, Feedback } from "./types";
import { Dashboard } from "./components/Dashboard";
import { Events } from "./components/Events";
import { Learning } from "./components/Learning";
import { Portfolio } from "./components/Portfolio";
import { Opportunities } from "./components/Opportunities";
import { Grievance as GrievanceView } from "./components/Grievance";
import { OfficerPanel } from "./components/OfficerPanel";
import { DigitalID } from "./components/DigitalID";
import { Shield, Calendar, BookOpen, Award, Users, LogOut, Moon, Sun, LayoutDashboard, Gavel, Sparkles, Download, ShieldCheck, Compass, Info } from "lucide-react";

// Preloaded Static Assets / Default Database
const DEFAULT_MEMBERS: Member[] = [
  {
    studentId: "2024-0001",
    name: "Juan Dela Cruz",
    year: "2",
    course: "B.A. Political Science",
    position: "",
    role: "member",
    membership: "Active",
    exp: 320,
    attendance: ["2026-07-01"],
    badges: ["b1"],
    achievements: ["Debate Runner-Up 2025"],
    gradeConvRequested: false,
    email: "juan@smc.edu",
    passwordHash: "student"
  },
  {
    studentId: "officer1",
    name: "Maria Santos",
    year: "3",
    course: "B.A. Political Science",
    position: "President",
    role: "officer",
    membership: "Active",
    exp: 560,
    attendance: ["2026-07-01", "2026-07-08"],
    badges: ["b5", "b3"],
    achievements: ["Best Leader 2025"],
    gradeConvRequested: false,
    email: "maria@smc.edu",
    passwordHash: "officer"
  },
  {
    studentId: "2024-0002",
    name: "Carlos Mendoza",
    year: "1",
    course: "B.A. Political Science",
    position: "",
    role: "member",
    membership: "Active",
    exp: 180,
    attendance: ["2026-07-15"],
    badges: ["b1"],
    achievements: [],
    gradeConvRequested: false,
    email: "carlos@smc.edu",
    passwordHash: "student"
  }
];

const DEFAULT_EVENTS: Event[] = [
  {
    id: 1,
    title: "General Assembly & Seminar",
    date: "2026-07-20",
    type: "assembly",
    exp: 50,
    location: "SMC Room 101, Main Campus",
    description: "Our monthly general assembly covering constitutional policies and introducing student leaders.",
    capacity: 60,
    rsvps: {}
  },
  {
    id: 2,
    title: "Inter-School Debate Championship",
    date: "2026-07-25",
    type: "competition",
    exp: 100,
    location: "SMC Auditorium Hall",
    description: "Political Science debate invitees showcase debate and adjudication competencies.",
    capacity: 100,
    rsvps: {}
  },
  {
    id: 3,
    title: "Community Outreach & Voter Drive",
    date: "2026-08-01",
    type: "volunteer",
    exp: 120,
    location: "Barangay Main Learning Center",
    description: "SMC youth lead non-partisan voter education campaigns. Yields 4 service hours.",
    capacity: 40,
    rsvps: {}
  }
];

const DEFAULT_OPPORTUNITIES: Opportunity[] = [
  {
    id: "o1",
    type: "Scholarship",
    title: "Future Public Leaders Fellowship",
    organization: "Civic Futures Foundation",
    deadline: "2026-08-10",
    location: "Online Portal / SMC Admin",
    description: "Fully-funded fellowship for political science majors with proven leadership track records.",
    savedBy: []
  },
  {
    id: "o2",
    type: "Internship",
    title: "Local Legislative Office Placement",
    organization: "City Government Affairs Dept",
    deadline: "2026-08-15",
    location: "City Legislative Secretariat",
    description: "Four-week internship shadowing legal consultations and policy drafting boards.",
    savedBy: []
  },
  {
    id: "o3",
    type: "Debate",
    title: "Philippine National Debate Invitational",
    organization: "Philippine Debate Union",
    deadline: "2026-08-20",
    location: "SMC Main Stage Auditorium",
    description: "Open call for university debate teams. Prizes awarded for top speakers.",
    savedBy: []
  }
];

const DEFAULT_QUESTS: Quest[] = [
  { id: "q1", title: "RSVP to an upcoming event", requirement: "checkin", progress: 0, target: 1, expReward: 20, completed: false, date: new Date().toDateString() },
  { id: "q2", title: "Study a core constitution framework", requirement: "read", progress: 0, target: 1, expReward: 15, completed: false, date: new Date().toDateString() },
  { id: "q3", title: "Submit an advisory grievance entry", requirement: "grievance", progress: 0, target: 1, expReward: 25, completed: false, date: new Date().toDateString() }
];

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  { id: "a1", text: "Welcome to the all-new SEPOLSCIS Portal! Configure your student details in Profile.", createdAt: new Date().toISOString() },
  { id: "a2", text: "Midterm Reviewer is now unlocked and available in the Learning Center reviewer tab.", createdAt: new Date().toISOString() }
];

const DEFAULT_GRIEVANCES: Grievance[] = [
  {
    id: "g1",
    memberId: "2024-0001",
    title: "Outreach Travel Conflict",
    description: "The volunteer outreach drive overlaps with our major midterm exam schedule.",
    anonymous: false,
    status: "submitted",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export default function App() {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState<string>("home");

  // Authentication State
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Sign Up Form States
  const [signUpId, setSignUpId] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpYear, setSignUpYear] = useState("1");
  const [signUpCourse, setSignUpCourse] = useState("B.A. Political Science");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirm, setSignUpConfirm] = useState("");

  // App Database State
  const [members, setMembers] = useState<Member[]>(DEFAULT_MEMBERS);
  const [events, setEvents] = useState<Event[]>(DEFAULT_EVENTS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(DEFAULT_OPPORTUNITIES);
  const [quests, setQuests] = useState<Quest[]>(DEFAULT_QUESTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(DEFAULT_ANNOUNCEMENTS);
  const [grievances, setGrievances] = useState<Grievance[]>(DEFAULT_GRIEVANCES);
  const [attendanceRecords, setAttendanceRecords] = useState<{ eventId: number; memberId: string; date: string; exp: number }[]>([]);
  const [learningProgress, setLearningProgress] = useState<{ [studentId: string]: { viewed: string[]; saved: string[]; quizPassed: string[] } }>({});

  const [darkMode, setDarkMode] = useState(false);

  // Initialize and load databases from LocalStorage
  useEffect(() => {
    try {
      const storedMembers = localStorage.getItem("sepolscis_members");
      const storedEvents = localStorage.getItem("sepolscis_events");
      const storedOpps = localStorage.getItem("sepolscis_opportunities");
      const storedQuests = localStorage.getItem("sepolscis_quests");
      const storedAnnouncements = localStorage.getItem("sepolscis_announcements");
      const storedGrievances = localStorage.getItem("sepolscis_grievances");
      const storedAttendance = localStorage.getItem("sepolscis_attendance");
      const storedLearning = localStorage.getItem("sepolscis_learning");
      const storedUser = localStorage.getItem("sepolscis_current_user");
      const storedDarkMode = localStorage.getItem("sepolscis_dark_mode");

      if (storedMembers) setMembers(JSON.parse(storedMembers));
      if (storedEvents) setEvents(JSON.parse(storedEvents));
      if (storedOpps) setOpportunities(JSON.parse(storedOpps));
      if (storedQuests) setQuests(JSON.parse(storedQuests));
      if (storedAnnouncements) setAnnouncements(JSON.parse(storedAnnouncements));
      if (storedGrievances) setGrievances(JSON.parse(storedGrievances));
      if (storedAttendance) setAttendanceRecords(JSON.parse(storedAttendance));
      if (storedLearning) setLearningProgress(JSON.parse(storedLearning));
      if (storedUser) setCurrentUser(JSON.parse(storedUser));
      if (storedDarkMode) {
        const isDark = JSON.parse(storedDarkMode);
        setDarkMode(isDark);
        document.body.classList.toggle("dark", isDark);
      }
    } catch (e) {
      console.error("Failed to load local DB state:", e);
    }
  }, []);

  // Save changes to localStorage helper
  const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim() || !loginPassword.trim()) {
      alert("Please enter both Student ID and password.");
      return;
    }

    const matched = members.find(
      m => m.studentId.toLowerCase() === loginId.toLowerCase().trim() && m.passwordHash === loginPassword.trim()
    );

    if (matched) {
      setCurrentUser(matched);
      saveToLocalStorage("sepolscis_current_user", matched);
      setLoginId("");
      setLoginPassword("");
    } else {
      alert("Invalid Student ID or password.");
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpId.trim() || !signUpName.trim() || !signUpCourse.trim() || !signUpPassword.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    if (signUpPassword !== signUpConfirm) {
      alert("Passwords do not match.");
      return;
    }

    const exists = members.some(m => m.studentId.toLowerCase() === signUpId.toLowerCase().trim());
    if (exists) {
      alert("Student ID already registered. Please login.");
      return;
    }

    const newMember: Member = {
      studentId: signUpId.trim(),
      name: signUpName.trim(),
      year: signUpYear,
      course: signUpCourse.trim(),
      position: "",
      role: "member",
      membership: "Active",
      exp: 0,
      attendance: [],
      badges: ["b1"], // automatic new member badge
      achievements: [],
      gradeConvRequested: false,
      email: `${signUpId.trim()}@smc.edu`,
      passwordHash: signUpPassword
    };

    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    saveToLocalStorage("sepolscis_members", updatedMembers);

    alert("Sign up successful! Please log in.");
    setIsSigningUp(false);
    setSignUpId("");
    setSignUpName("");
    setSignUpPassword("");
    setSignUpConfirm("");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("sepolscis_current_user");
    setCurrentScreen("home");
  };

  // Gamification: Add EXP Helper
  const awardExp = (studentId: string, amount: number) => {
    const updatedMembers = members.map(m => {
      if (m.studentId === studentId) {
        const newExp = m.exp + amount;
        let badges = [...m.badges];

        // Automatic badge awards checks
        if (newExp >= 100 && !badges.includes("b2")) {
          badges.push("b2"); // active member
          alert(`🏅 Honors Badge Unlocked: Active Member (+100 EXP achieved!)`);
        }
        if (newExp >= 300 && !badges.includes("b10")) {
          badges.push("b10"); // senior counselor
          alert(`🏅 Honors Badge Unlocked: Senior Counselor (+300 EXP achieved!)`);
        }
        if (newExp >= 500 && !badges.includes("b9")) {
          badges.push("b9"); // Dean's award
          alert(`🏅 Honors Badge Unlocked: Dean's Award (+500 EXP achieved!)`);
        }

        const updated = { ...m, exp: newExp, badges };
        if (currentUser && currentUser.studentId === studentId) {
          setCurrentUser(updated);
          saveToLocalStorage("sepolscis_current_user", updated);
        }
        return updated;
      }
      return m;
    });

    setMembers(updatedMembers);
    saveToLocalStorage("sepolscis_members", updatedMembers);
  };

  // Progression updates
  const progressQuest = (reqType: Quest["requirement"]) => {
    const updatedQuests = quests.map(q => {
      if (q.requirement === reqType && !q.completed) {
        const nextProgress = q.progress + 1;
        if (nextProgress >= q.target) {
          if (currentUser) {
            awardExp(currentUser.studentId, q.expReward);
          }
          return { ...q, progress: q.target, completed: true };
        }
        return { ...q, progress: nextProgress };
      }
      return q;
    });
    setQuests(updatedQuests);
    saveToLocalStorage("sepolscis_quests", updatedQuests);
  };

  // Event RSVP
  const handleRsvp = (eventId: number, status: "going" | "maybe" | "no") => {
    if (!currentUser) return;

    const updatedEvents = events.map(e => {
      if (e.id === eventId) {
        const rsvps = { ...e.rsvps, [currentUser.studentId]: status };
        return { ...e, rsvps };
      }
      return e;
    });

    setEvents(updatedEvents);
    saveToLocalStorage("sepolscis_events", updatedEvents);

    if (status === "going") {
      progressQuest("checkin");
    }
  };

  // Event check-in simulator
  const handleCheckInEvent = (eventId: number) => {
    if (!currentUser) return;

    const alreadyCheckedIn = attendanceRecords.some(
      r => r.eventId === eventId && r.memberId === currentUser.studentId
    );

    if (alreadyCheckedIn) {
      alert("You have already checked-in to this event!");
      return;
    }

    const eventObj = events.find(e => e.id === eventId);
    if (!eventObj) return;

    const record = {
      eventId,
      memberId: currentUser.studentId,
      date: new Date().toISOString().split("T")[0],
      exp: eventObj.exp
    };

    const updatedRecords = [...attendanceRecords, record];
    setAttendanceRecords(updatedRecords);
    saveToLocalStorage("sepolscis_attendance", updatedRecords);

    // Add event attendance timestamp to member
    const updatedMembers = members.map(m => {
      if (m.studentId === currentUser.studentId) {
        const attendance = [...(m.attendance || []), record.date];
        let badges = [...m.badges];

        // Attendance Badge Checks
        if (attendance.length >= 5 && !badges.includes("b3")) {
          badges.push("b3"); // Perfect Attendance
          alert("🏅 Honors Badge Unlocked: Perfect Attendance (+5 verified check-ins!)");
        }

        const updated = { ...m, attendance, badges };
        setCurrentUser(updated);
        saveToLocalStorage("sepolscis_current_user", updated);
        return updated;
      }
      return m;
    });

    setMembers(updatedMembers);
    saveToLocalStorage("sepolscis_members", updatedMembers);

    awardExp(currentUser.studentId, eventObj.exp);
    alert(`✓ Success! Checked-in to "${eventObj.title}". Bestowed +${eventObj.exp} EXP!`);
  };

  // ICS calendar Exporter helper
  const handleDownloadCalendar = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const dateFormatted = event.date.replace(/-/g, "");
    const escapeText = (str: string) => str.replace(/[\\,;]/g, "\\$&").replace(/\n/g, "\\n");

    const icsText = 
      "BEGIN:VCALENDAR\r\n" +
      "VERSION:2.0\r\n" +
      "BEGIN:VEVENT\r\n" +
      `UID:sepolscis-${event.id}@smc.edu\r\n` +
      `DTSTART:${dateFormatted}T090000\r\n` +
      `DTEND:${dateFormatted}T110000\r\n` +
      `SUMMARY:${escapeText(event.title)}\r\n` +
      `LOCATION:${escapeText(event.location)}\r\n` +
      `DESCRIPTION:${escapeText(event.description)}\r\n` +
      "END:VEVENT\r\n" +
      "END:VCALENDAR";

    const blob = new Blob([icsText], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, "_")}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Submit Feedback
  const handleSubmitFeedback = (eventId: number, rating: number, comment: string) => {
    alert("Thank you for your valuable feedback! This helps us improve SMC academic programs.");
  };

  // Bookmark / saved Toggle
  const handleToggleBookmark = (topicId: string) => {
    if (!currentUser) return;

    const progress = learningProgress[currentUser.studentId] || { viewed: [], saved: [], quizPassed: [] };
    const isSaved = progress.saved.includes(topicId);

    const updatedSaved = isSaved
      ? progress.saved.filter(id => id !== topicId)
      : [...progress.saved, topicId];

    const updatedProgress = {
      ...learningProgress,
      [currentUser.studentId]: {
        ...progress,
        saved: updatedSaved
      }
    };

    setLearningProgress(updatedProgress);
    saveToLocalStorage("sepolscis_learning", updatedProgress);

    if (!isSaved) {
      progressQuest("read");
    }
  };

  // Pass practice multiple choice quizzes
  const handlePassQuiz = (topicId: string) => {
    if (!currentUser) return;

    const progress = learningProgress[currentUser.studentId] || { viewed: [], saved: [], quizPassed: [] };
    if (progress.quizPassed.includes(topicId)) return;

    const updatedProgress = {
      ...learningProgress,
      [currentUser.studentId]: {
        ...progress,
        quizPassed: [...progress.quizPassed, topicId]
      }
    };

    setLearningProgress(updatedProgress);
    saveToLocalStorage("sepolscis_learning", updatedProgress);

    awardExp(currentUser.studentId, 20); // Practice quiz award
  };

  // TXT Exporter for reviewer
  const handleDownloadReviewer = () => {
    alert("Reviewer download started.");
    const content = "SMC POLSCI 101 Midterm Study Reviewer:\n\n Separation of Powers establishes distinct Executive, Legislative, and Judicial duties. Read Article II, Section 1 of the 1987 Constitution for primary sovereignty clauses.";
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "POLSCI_Midterm_Reviewer.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Save Bookmarked Opportunity
  const handleToggleSaveOpportunity = (id: string) => {
    if (!currentUser) return;

    const updatedOpps = opportunities.map(o => {
      if (o.id === id) {
        const savedBy = o.savedBy || [];
        const isSaved = savedBy.includes(currentUser.studentId);
        return {
          ...o,
          savedBy: isSaved
            ? savedBy.filter(studentId => studentId !== currentUser.studentId)
            : [...savedBy, currentUser.studentId]
        };
      }
      return o;
    });

    setOpportunities(updatedOpps);
    saveToLocalStorage("sepolscis_opportunities", updatedOpps);
  };

  // Submitting advisory report
  const handleSubmitGrievance = (title: string, description: string, anonymous: boolean) => {
    if (!currentUser) return;

    const newG: Grievance = {
      id: `g-${Date.now()}`,
      memberId: currentUser.studentId,
      title,
      description,
      anonymous,
      status: "submitted",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedGrievances = [newG, ...grievances];
    setGrievances(updatedGrievances);
    saveToLocalStorage("sepolscis_grievances", updatedGrievances);

    progressQuest("grievance");
  };

  // Certified printing helper
  const handleDownloadCertificate = () => {
    if (!currentUser) return;
    const count = attendanceRecords.filter(r => r.memberId === currentUser.studentId).length;
    const win = window.open("", "_blank");
    if (!win) {
      alert("Please allow pop-ups to generate your printable certificate.");
      return;
    }
    win.document.write(`
      <html>
        <head>
          <title>SMC Participation Certificate - ${currentUser.name}</title>
          <style>
            body { font-family: 'Georgia', serif; text-align: center; padding: 50px; background-color: #fcfdfa; color: #1C2A18; }
            .border-frame { border: 10px double #4A7C59; padding: 40px; max-width: 700px; margin: auto; background-color: white; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
            h1 { font-size: 38px; font-weight: normal; margin-bottom: 5px; color: #355E42; }
            .subtitle { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #7A8A72; margin-bottom: 40px; }
            .certify { font-style: italic; font-size: 16px; margin-bottom: 20px; }
            .name { font-size: 28px; font-weight: bold; border-bottom: 2px solid #DFE8D8; display: inline-block; padding-bottom: 5px; margin-bottom: 25px; color: #1C2A18; }
            .count { font-weight: bold; color: #4A7C59; }
            .footer-text { margin-top: 40px; font-size: 11px; color: #7A8A72; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="border-frame">
            <h1>Certificate of Participation</h1>
            <div class="subtitle">Society of Empowered Political Science Students</div>
            <p class="certify">This is officially certified and bestowed upon</p>
            <div class="name">${currentUser.name}</div>
            <p>for outstanding and active participation in SEPOLSCIS student forums and academic initiatives, with a registered verified total of <span class="count">${count}</span> checked-in organizational event attendance record(s).</p>
            <p class="footer-text">Southern Mindanao Colleges · Pagadian City, Philippines<br>Issued on ${new Date().toLocaleDateString()}</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  // OFFICER BACKEND ACTIONS

  const handlePostAnnouncement = (text: string) => {
    const newA: Announcement = {
      id: `a-${Date.now()}`,
      text,
      createdAt: new Date().toISOString()
    };
    const updated = [newA, ...announcements];
    setAnnouncements(updated);
    saveToLocalStorage("sepolscis_announcements", updated);
  };

  const handleCreateEvent = (eventData: Omit<Event, "id" | "rsvps">) => {
    const newE: Event = {
      ...eventData,
      id: Date.now(),
      rsvps: {}
    };
    const updated = [...events, newE];
    setEvents(updated);
    saveToLocalStorage("sepolscis_events", updated);
  };

  const handleAwardBadge = (studentId: string, badgeId: string) => {
    const updatedMembers = members.map(m => {
      if (m.studentId === studentId) {
        if (m.badges.includes(badgeId)) return m;
        const badges = [...m.badges, badgeId];
        // grants 25 exp
        const updated = { ...m, badges, exp: m.exp + 25 };
        if (currentUser && currentUser.studentId === studentId) {
          setCurrentUser(updated);
          saveToLocalStorage("sepolscis_current_user", updated);
        }
        return updated;
      }
      return m;
    });

    setMembers(updatedMembers);
    saveToLocalStorage("sepolscis_members", updatedMembers);
  };

  const handleApproveGradeRequest = (studentId: string) => {
    const updated = members.map(m => {
      if (m.studentId === studentId) {
        return { ...m, gradeConvRequested: false, exp: m.exp + 50 }; // awards 50 exp upon approval
      }
      return m;
    });
    setMembers(updated);
    saveToLocalStorage("sepolscis_members", updated);
  };

  const handleRejectGradeRequest = (studentId: string) => {
    const updated = members.map(m => {
      if (m.studentId === studentId) {
        return { ...m, gradeConvRequested: false };
      }
      return m;
    });
    setMembers(updated);
    saveToLocalStorage("sepolscis_members", updated);
  };

  const handleUpdateGrievanceStatus = (
    id: string,
    status: "in-progress" | "resolved" | "rejected",
    resolutionNotes?: string
  ) => {
    const updated = grievances.map(g => {
      if (g.id === id) {
        return {
          ...g,
          status,
          resolution: resolutionNotes,
          notes: status === "in-progress" ? "Officer is currently researching solutions." : undefined,
          updatedAt: new Date().toISOString()
        };
      }
      return g;
    });
    setGrievances(updated);
    saveToLocalStorage("sepolscis_grievances", updated);
  };

  // Dark Mode toggling
  const handleToggleDarkMode = () => {
    const nextVal = !darkMode;
    setDarkMode(nextVal);
    saveToLocalStorage("sepolscis_dark_mode", nextVal);
    document.body.classList.toggle("dark", nextVal);
  };

  // Database Export / Reset helper
  const handleExportData = () => {
    const data = {
      members,
      events,
      opportunities,
      quests,
      announcements,
      grievances,
      attendanceRecords,
      learningProgress
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SMC_PolSci_Database.json`;
    link.click();
    URL.revokeObjectURL(url);
    alert("Database exported successfully!");
  };

  const handleResetData = () => {
    if (window.confirm("Warning: This resets all custom check-ins, EXP levels, and custom reports back to standard enrollment settings. Proceed?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center items-center px-4 py-12 transition-colors">
        {/* Dynamic decorative colors */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="w-full max-w-md space-y-6 relative z-10">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-4xl shadow-xl border border-blue-500/30 mx-auto transform transition-transform hover:scale-105 duration-300">
              🏛️
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-display">
                SEPOLSCIS
              </h1>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-extrabold uppercase tracking-widest mt-1">
                Student Excellence in Political Science
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-md space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h2 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                {isSigningUp ? "Create Study Account" : "Sign In Portal"}
              </h2>
              <button
                onClick={() => setIsSigningUp(!isSigningUp)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {isSigningUp ? "Have account? Sign In" : "Sign Up"}
              </button>
            </div>

            {/* Login View */}
            {!isSigningUp ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Student ID Number</label>
                  <input
                    required
                    type="text"
                    placeholder="officer1 (or 2024-0001)"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full text-sm p-3.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-blue-600 text-zinc-900 dark:text-zinc-100 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Password</label>
                  <input
                    required
                    type="password"
                    placeholder="officer (or student)"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full text-sm p-3.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-blue-600 text-zinc-900 dark:text-zinc-100 font-semibold"
                  />
                </div>

                {/* Preload info box */}
                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 rounded-xl flex gap-2 text-[10px] text-blue-800 dark:text-blue-300 font-semibold leading-relaxed">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <span className="font-extrabold block text-blue-950 dark:text-blue-200">Standard Study Accounts:</span>
                    • President/Admin Role: <strong className="font-extrabold">officer1</strong> / password: <strong className="font-extrabold">officer</strong><br />
                    • Regular Member Role: <strong className="font-extrabold">2024-0001</strong> / password: <strong className="font-extrabold">student</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold tracking-wide uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 duration-200"
                >
                  Enter Portal Room
                </button>
              </form>
            ) : (
              /* Sign Up view */
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Student ID Number</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g., 2026-00005"
                    value={signUpId}
                    onChange={(e) => setSignUpId(e.target.value)}
                    className="w-full text-sm p-3.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-blue-600 text-zinc-900 dark:text-zinc-100 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g., Juan Dela Cruz"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="w-full text-sm p-3.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-blue-600 text-zinc-900 dark:text-zinc-100 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Year Level</label>
                    <select
                      value={signUpYear}
                      onChange={(e) => setSignUpYear(e.target.value)}
                      className="w-full text-sm p-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-blue-600 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">SMC Course Major</label>
                    <input
                      required
                      type="text"
                      placeholder="B.A. Political Science"
                      value={signUpCourse}
                      onChange={(e) => setSignUpCourse(e.target.value)}
                      className="w-full text-sm p-3.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-blue-600 text-zinc-900 dark:text-zinc-100 font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Create Password</label>
                  <input
                    required
                    type="password"
                    placeholder="At least 6 characters"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="w-full text-sm p-3.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-blue-600 text-zinc-900 dark:text-zinc-100 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Confirm Password</label>
                  <input
                    required
                    type="password"
                    placeholder="Verify password"
                    value={signUpConfirm}
                    onChange={(e) => setSignUpConfirm(e.target.value)}
                    className="w-full text-sm p-3.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-blue-600 text-zinc-900 dark:text-zinc-100 font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold tracking-wide uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 duration-200"
                >
                  Create SMC Account
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active Member Database Progress info
  const myProgress = learningProgress[currentUser.studentId] || { viewed: [], saved: [], quizPassed: [] };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors flex flex-col pb-24 md:pb-28">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex justify-between items-center max-w-7xl mx-auto w-full transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black shadow-sm">
            🏛️
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-tight leading-none text-zinc-900 dark:text-zinc-100 font-display">
              SEPOLSCIS
            </h2>
            <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mt-1 block">Southern Mindanao</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Dark Mode Trigger */}
          <button
            onClick={handleToggleDarkMode}
            className="w-10 h-10 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-center hover:border-blue-600 bg-white dark:bg-zinc-900 cursor-pointer text-zinc-500 transition-all"
          >
            {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-10 h-10 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-center hover:border-red-600 bg-white dark:bg-zinc-900 cursor-pointer text-red-600 transition-all"
            title="Log Out of SMC Session"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {/* Routed views */}
        {currentScreen === "home" && (
          <Dashboard
            member={currentUser}
            events={events}
            quests={quests}
            announcements={announcements}
            members={members}
            onNavigate={(s) => setCurrentScreen(s)}
            onCheckIn={() => setCurrentScreen("events")}
            onShowGrievance={() => setCurrentScreen("grievance")}
          />
        )}

        {currentScreen === "events" && (
          <Events
            member={currentUser}
            events={events}
            onRsvp={handleRsvp}
            onCheckInEvent={handleCheckInEvent}
            onDownloadCalendar={handleDownloadCalendar}
            onSubmitFeedback={handleSubmitFeedback}
            attendanceRecords={attendanceRecords}
          />
        )}

        {currentScreen === "learning" && (
          <Learning
            member={currentUser}
            learningProgress={myProgress}
            onToggleBookmark={handleToggleBookmark}
            onPassQuiz={handlePassQuiz}
            onDownloadReviewer={handleDownloadReviewer}
          />
        )}

        {currentScreen === "portfolio" && (
          <Portfolio
            member={currentUser}
            events={events}
            opportunities={opportunities}
            attendanceRecords={attendanceRecords.filter(r => r.memberId === currentUser.studentId)}
            onDownloadCertificate={handleDownloadCertificate}
          />
        )}

        {currentScreen === "opportunities" && (
          <Opportunities
            member={currentUser}
            opportunities={opportunities}
            onToggleSaveOpportunity={handleToggleSaveOpportunity}
          />
        )}

        {currentScreen === "grievance" && (
          <GrievanceView
            member={currentUser}
            grievances={grievances}
            onSubmitGrievance={handleSubmitGrievance}
          />
        )}

        {currentScreen === "officer" && currentUser.role === "officer" && (
          <OfficerPanel
            member={currentUser}
            members={members}
            events={events}
            grievances={grievances}
            onPostAnnouncement={handlePostAnnouncement}
            onCreateEvent={handleCreateEvent}
            onAwardBadge={handleAwardBadge}
            onApproveGradeRequest={handleApproveGradeRequest}
            onRejectGradeRequest={handleRejectGradeRequest}
            onUpdateGrievanceStatus={handleUpdateGrievanceStatus}
          />
        )}

        {currentScreen === "profile" && (
          <div className="space-y-6">
            {/* ID Component */}
            <section className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 px-1">
                SMC Digital Identity
              </h3>
              <DigitalID member={currentUser} />
            </section>

            {/* Profile specifications card */}
            <div className="bg-white dark:bg-[#1E2A1A] border border-[#DFE8D8] dark:border-[#2F3D29] rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-[#1C2A18] dark:text-[#F0F5ED]">
                Profile Configurations
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="space-y-1">
                  <span className="text-gray-400">Student ID</span>
                  <p className="p-3 bg-emerald-50/20 border border-[#DFE8D8] dark:border-[#2F3D29] rounded-xl text-[#1C2A18] dark:text-[#F0F5ED] font-mono">
                    {currentUser.studentId}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-gray-400">Registered Email Address</span>
                  <p className="p-3 bg-emerald-50/20 border border-[#DFE8D8] dark:border-[#2F3D29] rounded-xl text-[#1C2A18] dark:text-[#F0F5ED]">
                    {currentUser.email}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-gray-400">Major Department</span>
                  <p className="p-3 bg-emerald-50/20 border border-[#DFE8D8] dark:border-[#2F3D29] rounded-xl text-[#1C2A18] dark:text-[#F0F5ED]">
                    {currentUser.course}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-gray-400">Enrollment Year Level</span>
                  <p className="p-3 bg-emerald-50/20 border border-[#DFE8D8] dark:border-[#2F3D29] rounded-xl text-[#1C2A18] dark:text-[#F0F5ED]">
                    {currentUser.year} Year
                  </p>
                </div>
              </div>

              {/* Grade Conversion Request Option */}
              <div className="pt-4 border-t border-[#DFE8D8] dark:border-[#2F3D29] space-y-3">
                <strong className="text-xs font-extrabold text-[#1C2A18] dark:text-[#F0F5ED] block">Grade Credit Verification Request</strong>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  You can request to convert your checked-in activity points and volunteer service hours into direct college grade credits. Subject to Dean of Students approval.
                </p>
                {currentUser.gradeConvRequested ? (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100/50 flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5" /> Grade Conversion request pending on Officer roster.
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      const updated = members.map(m => {
                        if (m.studentId === currentUser.studentId) {
                          return { ...m, gradeConvRequested: true };
                        }
                        return m;
                      });
                      setMembers(updated);
                      saveToLocalStorage("sepolscis_members", updated);

                      const userUpdated = { ...currentUser, gradeConvRequested: true };
                      setCurrentUser(userUpdated);
                      saveToLocalStorage("sepolscis_current_user", userUpdated);

                      alert("Grade credit verification request submitted!");
                    }}
                    className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow cursor-pointer"
                  >
                    Request Grade Conversion Approval
                  </button>
                )}
              </div>
            </div>

            {/* Database backups & resets */}
            <div className="bg-white dark:bg-[#1E2A1A] border border-[#DFE8D8] dark:border-[#2F3D29] rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                Database Actions & Export
              </h3>

              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={handleExportData}
                  className="px-4 py-2.5 border border-[#DFE8D8] rounded-xl text-xs font-bold text-gray-500 hover:border-emerald-800 hover:text-emerald-850 cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Export Database (JSON)
                </button>
                <button
                  onClick={handleResetData}
                  className="px-4 py-2.5 border border-red-100 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  Reset All App Data
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Sticky Tab Navigation */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-lg bg-white/85 dark:bg-zinc-900/85 backdrop-blur-lg border border-zinc-200 dark:border-zinc-800 rounded-3xl p-2 flex justify-around items-center shadow-lg z-50">
        {[
          { id: "home", icon: Shield, label: "Home" },
          { id: "learning", icon: BookOpen, label: "Lessons" },
          { id: "events", icon: Calendar, label: "Events" },
          { id: "opportunities", icon: Compass, label: "Opps" },
          { id: "portfolio", icon: Award, label: "Rewards" },
          { id: "profile", icon: Users, label: "ID & Profile" }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentScreen(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-2xl transition-all cursor-pointer ${
              currentScreen === item.id
                ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-extrabold scale-105"
                : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-[9px] font-bold tracking-wide">{item.label}</span>
          </button>
        ))}

        {/* Exclusive Officer Panel Button */}
        {currentUser.role === "officer" && (
          <button
            onClick={() => setCurrentScreen("officer")}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-2xl transition-all cursor-pointer ${
              currentScreen === "officer"
                ? "bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 font-extrabold scale-105"
                : "text-yellow-600/50 hover:text-yellow-600"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            <span className="text-[9px] font-bold tracking-wide">Admin</span>
          </button>
        )}
      </nav>
    </div>
  );
}
