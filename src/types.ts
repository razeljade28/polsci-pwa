export interface Member {
  studentId: string;
  name: string;
  year: string; // "1" | "2" | "3" | "4"
  course: string;
  position: string; // e.g. "President", "Secretary", ""
  role: "member" | "officer" | "adviser" | "grievance";
  membership: "Active" | "Inactive";
  exp: number;
  attendance: string[]; // ISO string dates of checked in events or date strings
  badges: string[]; // badge IDs
  achievements: string[]; // list of text achievements
  gradeConvRequested: boolean;
  email: string;
  passwordHash: string;
}

export interface Event {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  type: "assembly" | "competition" | "sports" | "volunteer";
  exp: number;
  location: string;
  description: string;
  capacity?: number;
  rsvps?: { [studentId: string]: "going" | "maybe" | "no" };
  reminders?: { [studentId: string]: string }; // studentId -> "none" | "1 day" | "1 hour"
}

export interface Announcement {
  id: string;
  text: string;
  createdAt: string; // ISO string
}

export interface Grievance {
  id: string;
  memberId: string;
  title: string;
  description: string;
  anonymous: boolean;
  status: "submitted" | "in-progress" | "resolved" | "rejected";
  createdAt: string;
  updatedAt: string;
  notes?: string;
  resolution?: string;
}

export interface Quest {
  id: string;
  title: string;
  requirement: "checkin" | "read" | "grievance";
  progress: number;
  target: number;
  expReward: number;
  completed: boolean;
  date: string;
}

export interface Opportunity {
  id: string;
  type: "Scholarship" | "Internship" | "Debate" | "Volunteer";
  title: string;
  organization: string;
  deadline: string; // YYYY-MM-DD
  location: string;
  description: string;
  savedBy?: string[]; // list of studentIds
}

export interface LearningProgress {
  viewed: string[]; // list of topic IDs
  saved: string[]; // list of topic IDs
  quizPassed: string[]; // list of topic IDs
}

export interface Feedback {
  id: number;
  eventId: number;
  memberId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  createdAt: string;
}
