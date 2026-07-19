import React, { useState } from "react";
import { Member, LearningProgress } from "../types";
import { learningResources } from "../data/learningContent";
import { ConstitutionalAdvisor } from "./ConstitutionalAdvisor";
import { BookOpen, Search, Bookmark, BookmarkCheck, ArrowRight, BookMarked, HelpCircle, Award, Sparkles, Compass } from "lucide-react";

interface LearningProps {
  member: Member;
  learningProgress: LearningProgress;
  onToggleBookmark: (topicId: string) => void;
  onPassQuiz: (topicId: string) => void;
  onDownloadReviewer: () => void;
}

export const Learning: React.FC<LearningProps> = ({
  member,
  learningProgress,
  onToggleBookmark,
  onPassQuiz,
  onDownloadReviewer
}) => {
  const [currentCategory, setCurrentCategory] = useState<string>("all");
  const [currentTopic, setCurrentTopic] = useState<string>("constitution");
  const [searchTerm, setSearchTerm] = useState("");
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const categories = [
    { id: "all", label: "All Topics" },
    { id: "constitutions", label: "Constitutions" },
    { id: "government", label: "Government" },
    { id: "current", label: "Current Affairs" },
    { id: "organization", label: "SEPOLSCIS" },
    { id: "review", label: "Reviewer" }
  ];

  const topics = [
    { id: "constitution", title: "1987 Present Constitution", category: "constitutions", icon: "📜", takeaway: "The Constitution is the supreme law of the Republic of the Philippines. It guarantees fundamental rights, establishes limits on government power, and protects human dignity." },
    { id: "constitution1899", title: "1899 Malolos Constitution", category: "constitutions", icon: "📜", takeaway: "The Malolos Constitution was Asia's first republican constitution. It established the First Philippine Republic, placing sovereignty completely in the Filipino people." },
    { id: "constitution1935", title: "1935 Commonwealth", category: "constitutions", icon: "📜", takeaway: "It was created under US supervision to prepare the country for full self-governance, establishing a 10-year Commonwealth transition model." },
    { id: "constitution1943", title: "1943 Occupation", category: "constitutions", icon: "📜", takeaway: "Adopted during the Japanese occupation, it established the puppet Second Republic under President Jose P. Laurel, but was never legally recognized by the Commonwealth government." },
    { id: "constitution1973", title: "1973 Constitution", category: "constitutions", icon: "📜", takeaway: "Drafted during Martial Law, it shifted the government structure into a parliamentary system, concentrating extreme power in President Ferdinand Marcos." },
    { id: "constitution1986", title: "1986 Freedom Constitution", category: "constitutions", icon: "📜", takeaway: "Proclaimed by President Corazon C. Aquino as a provisional charter following the EDSA People Power Revolution, it authorized the drafting of the 1987 Constitution." },
    { id: "government", title: "Government at a Glance", category: "government", icon: "🏛️", takeaway: "The Philippine state operates a presidential system with three separate, co-equal branches: Executive (enforcing), Legislative (lawmaking), and Judicial (interpreting) with checks and balances." },
    { id: "news", title: "Current Affairs Bulletin", category: "current", icon: "📰", takeaway: "Political science theories are validated by assessing modern news reports against primary government sources and constitution clauses." },
    { id: "bylaws", title: "SEPOLSCIS By-Laws", category: "organization", icon: "📋", takeaway: "Defines the organization's name, membership criteria, general assemblies, and elections timelines for all students." },
    { id: "sepolscisConstitution", title: "SEPOLSCIS Constitution", category: "organization", icon: "🖋️", takeaway: "A binding document detailing Southern Mindanao Colleges’ student officers’ roles, board directors’ voting limits, and financial auditing guidelines." },
    { id: "reviewer", title: "Midterm Exam Reviewer", category: "review", icon: "📖", takeaway: "Synthesizes major components of POLSCI 101, including definitions of Separation of Powers, public trust, and Constitutional commissions." }
  ];

  const quizzes: { [topicId: string]: { question: string; options: string[]; answer: number; explanation: string } } = {
    constitution: {
      question: "Where does sovereignty reside under Article II, Section 1 of the 1987 Philippine Constitution?",
      options: [
        "In the Armed Forces",
        "In the Congress and Senate",
        "In the sovereign Filipino people",
        "In the Supreme Court Justices"
      ],
      answer: 2,
      explanation: "Article II declares: 'Sovereignty resides in the people and all government authority emanates from them.'"
    },
    constitution1899: {
      question: "Which of the following established the First Philippine Republic under President Emilio Aguinaldo?",
      options: [
        "1935 Commonwealth Constitution",
        "1899 Malolos Constitution",
        "1943 Japanese Occupation Constitution",
        "1986 Freedom Constitution"
      ],
      answer: 1,
      explanation: "The Malolos Constitution, promulgated in 1899, served as the primary charter of Asia's first republican government."
    },
    government: {
      question: "Which of the following branches has the primary mandate of interpreting laws and resolving judicial cases?",
      options: [
        "The Legislative Branch",
        "The Executive Branch",
        "The Judicial Branch",
        "The Constitutional Commission"
      ],
      answer: 2,
      explanation: "Under checks and balances, the Judicial branch interprets law, while Legislative writes law, and Executive enforces it."
    },
    news: {
      question: "What is the recommended method for checking the validity of a public policy news claim?",
      options: [
        "Rely on screenshots in social media chatrooms",
        "Cross-reference the report with official government Gazettes or the primary Constitution",
        "Accept claims matching your personal political opinions",
        "Share the claim immediately with peers to test reactions"
      ],
      answer: 1,
      explanation: "Comparing secondary news articles with primary legal frameworks or official Gazettes yields reliable, accurate political evidence."
    }
  };

  const filteredTopics = topics.filter(t => {
    const matchesCategory = currentCategory === "all" || t.category === currentCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeTopic = topics.find(t => t.id === currentTopic) || filteredTopics[0] || topics[0];

  const handleQuizAnswer = (optionIdx: number) => {
    setQuizSelectedOption(optionIdx);
    const quizObj = quizzes[activeTopic.id];
    if (!quizObj) return;

    if (optionIdx === quizObj.answer) {
      setQuizFeedback({
        isCorrect: true,
        text: `Correct! ${quizObj.explanation}`
      });
      onPassQuiz(activeTopic.id);
    } else {
      setQuizFeedback({
        isCorrect: false,
        text: "Incorrect. Reread the key takeaway or lesson and try again!"
      });
    }
  };

  const handleTopicSelect = (topicId: string) => {
    setCurrentTopic(topicId);
    setQuizSelectedOption(null);
    setQuizFeedback(null);
  };

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-widest block">POLSCI STUDY SPACE</span>
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">Academic Learning Center</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
              Explore Philippine constitutions, test your knowledge, and ask the AI Constitutional Advisor for support.
            </p>
          </div>
          <BookOpen className="w-10 h-10 text-blue-600 flex-shrink-0 opacity-80" />
        </div>
      </section>

      {/* Category Horizontal Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-zinc-200 dark:border-zinc-800">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCurrentCategory(c.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              currentCategory === c.id
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-blue-600"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Main Study Layout: Two-Column Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Topic list & AI Side Tab */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search bar */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 flex items-center gap-2.5 shadow-sm">
            <Search className="w-4 h-4 text-blue-600" />
            <input
              type="text"
              placeholder="Search study topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none border-none bg-transparent text-sm text-zinc-900 dark:text-zinc-100 font-semibold"
            />
          </div>

          {/* Topic Cards Container */}
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {filteredTopics.map((topic) => {
              const isSelected = activeTopic.id === topic.id;
              const isPassed = learningProgress.quizPassed.includes(topic.id);
              return (
                <button
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic.id)}
                  className={`w-full p-3.5 border rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-600 dark:border-blue-500 shadow-sm"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-blue-600"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl flex-shrink-0">{topic.icon}</span>
                    <div className="min-w-0">
                      <strong className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100 block truncate leading-tight font-display">
                        {topic.title}
                      </strong>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider block mt-0.5">
                        {topic.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isPassed && (
                      <span className="text-[10px] font-black text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/20 px-1.5 py-0.5 rounded uppercase">
                        Passed
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-zinc-400" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* AI Advisor Integrated Chat Card */}
          <div className="hidden lg:block">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3 px-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-yellow-500" /> Need Instant Help?
            </h4>
            <ConstitutionalAdvisor member={member} />
          </div>
        </div>

        {/* Right Side: Active Lesson Detail Viewer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
            {/* Lesson Title & Bookmark option */}
            <div className="flex items-start justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-widest block">
                  {activeTopic.category} Module
                </span>
                <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100 mt-1 flex items-center gap-2 font-display">
                  <span>{activeTopic.icon}</span> {activeTopic.title}
                </h3>
              </div>
              <button
                onClick={() => onToggleBookmark(activeTopic.id)}
                className={`flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  learningProgress.saved.includes(activeTopic.id)
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                    : "bg-white dark:bg-zinc-950 text-zinc-500 hover:border-blue-600"
                }`}
              >
                {learningProgress.saved.includes(activeTopic.id) ? (
                  <>
                    <BookmarkCheck className="w-4 h-4" /> Saved to Bookmarks
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" /> Save Lesson
                  </>
                )}
              </button>
            </div>

            {/* Key Takeaway box */}
            <div className="bg-blue-50/40 dark:bg-blue-950/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 flex gap-3">
              <span className="text-xl">💡</span>
              <div className="space-y-1">
                <strong className="text-xs font-black uppercase text-blue-800 dark:text-blue-300 tracking-wider">Key Takeaway</strong>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
                  {activeTopic.takeaway}
                </p>
              </div>
            </div>

            {/* Expander Accordion for Lesson Texts */}
            <details className="group border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden bg-zinc-50 dark:bg-zinc-950" open>
              <summary className="flex justify-between items-center p-4 cursor-pointer focus:outline-none select-none font-bold text-sm text-zinc-900 dark:text-zinc-100">
                <span className="flex items-center gap-2">
                  <BookMarked className="w-4.5 h-4.5 text-blue-600" />
                  Read Full Core Framework
                </span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium space-y-4 max-h-[350px] overflow-y-auto whitespace-pre-wrap bg-white dark:bg-zinc-900">
                {learningResources[activeTopic.id] || "Lesson text details are currently being prepared by the department."}
              </div>
            </details>

            {/* Multi-choice Practice Quiz Block */}
            {quizzes[activeTopic.id] ? (
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-zinc-50 dark:bg-zinc-950 space-y-4">
                <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <HelpCircle className="w-4.5 h-4.5 text-blue-600" />
                  <span className="text-[10px] text-blue-600 dark:text-blue-300 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                    POLSCI 101 Practice Quiz · <Award className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" /> +20 EXP
                  </span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100 leading-relaxed font-display">
                    {quizzes[activeTopic.id].question}
                  </h4>

                  <div className="grid gap-2">
                    {quizzes[activeTopic.id].options.map((option, idx) => {
                      const isOptionSelected = quizSelectedOption === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleQuizAnswer(idx)}
                          className={`w-full p-3.5 rounded-lg text-xs font-bold text-left border transition-all cursor-pointer ${
                            isOptionSelected
                              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-blue-600"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {quizFeedback && (
                    <div className={`p-3.5 rounded-lg text-xs border ${
                      quizFeedback.isCorrect
                        ? "bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 border-blue-200/50"
                        : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200/50"
                    }`}>
                      <p className="font-semibold">{quizFeedback.text}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl text-center text-xs text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-950">
                ⭐ Practice quiz currently being drafted. Reading key takeaway satisfies daily quest metrics!
              </div>
            )}

            {/* Special Exporter for the Exam Reviewer */}
            {activeTopic.id === "reviewer" && (
              <button
                onClick={onDownloadReviewer}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 duration-200"
              >
                <HelpCircle className="w-4.5 h-4.5" /> Download Midterm Reviewer (POLSCI-101.txt)
              </button>
            )}
          </div>
        </div>

        {/* Mobile Advisor Panel (visible only on small screens) */}
        <div className="lg:hidden col-span-1">
          <ConstitutionalAdvisor member={member} />
        </div>
      </div>
    </div>
  );
};
