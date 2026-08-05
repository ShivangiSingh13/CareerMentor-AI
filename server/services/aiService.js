/**
 * aiService.js
 * -----------------------------------------------------------------------
 * Single reusable AI integration layer for the whole app.
 * Supports: gemini | openai | groq | huggingface | mock
 *
 * Set AI_PROVIDER in .env to pick the primary provider.
 * If that provider fails (quota, network, bad key), the service
 * automatically tries the next one in FALLBACK_ORDER, and finally
 * falls back to the built-in mock so the app never fully breaks.
 * -----------------------------------------------------------------------
 */

const PRIMARY_PROVIDER = (process.env.AI_PROVIDER || "mock").toLowerCase();

const GEMINI_KEY = process.env.GEMINI_API_KEY || "";
const OPENAI_KEY = process.env.OPENAI_API_KEY || "";
const GROQ_KEY = process.env.GROQ_API_KEY || "";
const HF_KEY = process.env.HUGGINGFACE_API_KEY || "";

// Order to try if the primary provider fails. Mock is always the final safety net.
const FALLBACK_ORDER = ["groq", "huggingface", "gemini", "openai", "mock"];

const hasKey = (provider) => {
  if (provider === "gemini") return !!GEMINI_KEY;
  if (provider === "openai") return !!OPENAI_KEY;
  if (provider === "groq") return !!GROQ_KEY;
  if (provider === "huggingface") return !!HF_KEY;
  return provider === "mock";
};

/** Strips ```json fences and stray text so we can safely JSON.parse a model reply */
const cleanJSON = (text) => {
  if (!text) return "";
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
};

// ---------------------------------------------------------------------
// Low-level provider callers
// ---------------------------------------------------------------------

const callGemini = async (prompt) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Gemini API error");
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

/** Shared caller for any OpenAI-compatible endpoint: OpenAI, Groq, Hugging Face router */
const callOpenAICompatible = async ({ baseUrl, apiKey, model, prompt }) => {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `${baseUrl} API error`);
  return data?.choices?.[0]?.message?.content || "";
};

const callOpenAI = (prompt) =>
  callOpenAICompatible({
    baseUrl: "https://api.openai.com/v1/chat/completions",
    apiKey: OPENAI_KEY,
    model: "gpt-4o-mini",
    prompt,
  });

const callGroq = (prompt) =>
  callOpenAICompatible({
    baseUrl: "https://api.groq.com/openai/v1/chat/completions",
    apiKey: GROQ_KEY,
    model: "llama-3.3-70b-versatile", // fast + free-tier friendly
    prompt,
  });

const callHuggingFace = (prompt) =>
  callOpenAICompatible({
    baseUrl: "https://router.huggingface.co/v1/chat/completions",
    apiKey: HF_KEY,
    model: "meta-llama/Llama-3.1-8B-Instruct:fastest",
    prompt,
  });

/** Tries the primary provider, then walks the fallback chain until one works */
const callAI = async (prompt) => {
  const order = [PRIMARY_PROVIDER, ...FALLBACK_ORDER.filter((p) => p !== PRIMARY_PROVIDER)];

  for (const provider of order) {
    if (provider === "mock") break; // mock is handled by each feature's own mock function
    if (!hasKey(provider)) continue;

    try {
      if (provider === "gemini") return await callGemini(prompt);
      if (provider === "openai") return await callOpenAI(prompt);
      if (provider === "groq") return await callGroq(prompt);
      if (provider === "huggingface") return await callHuggingFace(prompt);
    } catch (error) {
      console.warn(`⚠️ ${provider} failed, trying next provider:`, error.message);
      continue;
    }
  }

  return null; // every provider failed or none configured — caller falls back to mock
};

// ---------------------------------------------------------------------
// 1. RESUME ANALYSIS
// ---------------------------------------------------------------------
export const analyzeResume = async (resumeText) => {
  const prompt = `
You are an expert technical resume reviewer and ATS (Applicant Tracking System) simulator.
Analyze the following resume text and respond with ONLY valid JSON (no markdown, no commentary) in this exact shape:

{
  "atsScore": <number 0-100>,
  "missingSkills": [<string>, ...],
  "suggestions": [<string>, ...],
  "recommendedProjects": [<string>, ...],
  "verdict": "<one sentence overall verdict>"
}

Resume text:
"""
${resumeText.slice(0, 6000)}
"""
`;

  try {
    const raw = await callAI(prompt);
    if (!raw) return mockAnalyzeResume(resumeText);
    const parsed = JSON.parse(cleanJSON(raw));
    return normalizeResumeAnalysis(parsed);
  } catch (error) {
    console.error("AI resume analysis failed, falling back to mock:", error.message);
    return mockAnalyzeResume(resumeText);
  }
};

const normalizeResumeAnalysis = (parsed) => ({
  atsScore: Math.max(0, Math.min(100, Number(parsed.atsScore) || 0)),
  missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills.slice(0, 10) : [],
  suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 10) : [],
  recommendedProjects: Array.isArray(parsed.recommendedProjects)
    ? parsed.recommendedProjects.slice(0, 5)
    : [],
  verdict: typeof parsed.verdict === "string" ? parsed.verdict : "",
});

const mockAnalyzeResume = (resumeText) => {
  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  const hasNumbers = /\d/.test(resumeText);
  const score = Math.min(95, 45 + Math.min(30, Math.floor(wordCount / 20)) + (hasNumbers ? 10 : 0));

  return {
    atsScore: score,
    missingSkills: ["System Design", "Docker", "Unit Testing", "CI/CD"],
    suggestions: [
      "Add measurable outcomes to your bullet points (e.g. 'reduced load time by 30%').",
      "Use stronger action verbs like 'built', 'optimized', or 'led' instead of 'worked on'.",
      "Group your skills section by category (languages, frameworks, tools).",
      "Keep bullet points to 1-2 lines for better ATS parsing.",
    ],
    recommendedProjects: [
      "Build a full-stack app with authentication and a REST API",
      "Contribute to an open-source repository and link it on your resume",
      "Create a small CLI tool or automation script showcasing problem solving",
    ],
    verdict: "Solid foundation — needs more quantified impact and a couple of standout projects.",
  };
};

// ---------------------------------------------------------------------
// 2. CAREER MENTOR CHAT
// ---------------------------------------------------------------------
export const getChatReply = async (history, newMessage) => {
  const historyText = history
    .map((m) => `${m.role === "user" ? "Student" : "Mentor"}: ${m.content}`)
    .join("\n");

  const prompt = `
You are an encouraging, practical AI career mentor for a student preparing for tech placements.
Keep replies concise (3-6 sentences), specific, and actionable.

Conversation so far:
${historyText}

Student: ${newMessage}
Mentor:
`;

  try {
    const raw = await callAI(prompt);
    return raw?.trim() || mockChatReply(newMessage);
  } catch (error) {
    console.error("AI chat reply failed, falling back to mock:", error.message);
    return mockChatReply(newMessage);
  }
};

const mockChatReply = (message) => {
  const lower = message.toLowerCase();
  if (lower.includes("resume")) {
    return "A strong resume highlights measurable impact. Try uploading it in the Resume Analyzer tab — I'll break down your ATS score and exactly what to improve.";
  }
  if (lower.includes("interview")) {
    return "For interviews, structure your answers with the STAR method (Situation, Task, Action, Result). Practice explaining 2-3 of your best projects out loud until it feels natural.";
  }
  if (lower.includes("skill") || lower.includes("learn")) {
    return "Focus on depth over breadth — pick one backend and one frontend technology, build two solid projects with them, and you'll have more to talk about in interviews than a long list of frameworks.";
  }
  return "That's a great question. Could you tell me a bit more about your target role or current skill level so I can give you more specific guidance?";
};

/** Generates a short session title from the first user message */
export const generateSessionTitle = async (firstMessage) => {
  const prompt = `Summarize this student message into a 3-5 word chat title, no punctuation, no quotes:\n"${firstMessage}"`;
  try {
    const raw = await callAI(prompt);
    const title = raw?.trim().replace(/["'.]/g, "");
    return title || (firstMessage.length > 40 ? `${firstMessage.slice(0, 40)}...` : firstMessage);
  } catch {
    return firstMessage.length > 40 ? `${firstMessage.slice(0, 40)}...` : firstMessage;
  }
};

// ---------------------------------------------------------------------
// 3. ROADMAP GENERATION
// ---------------------------------------------------------------------
export const generateRoadmap = async ({ currentSkills, targetRole, timeframeWeeks }) => {
  const prompt = `
You are a career roadmap planner. Create a ${timeframeWeeks}-week personalized learning roadmap
for a student targeting the role "${targetRole}" who currently has these skills: ${currentSkills.join(", ") || "none listed"}.

Respond with ONLY valid JSON (no markdown) in this exact shape:
{
  "weeks": [
    {
      "title": "<short week title>",
      "topics": ["<topic 1>", "<topic 2>", "<topic 3>"],
      "projectIdea": "<one small project idea for the week>",
      "resources": ["<resource name or URL>", "<resource name or URL>"]
    }
  ]
}
Return exactly ${timeframeWeeks} week objects.
`;

  try {
    const raw = await callAI(prompt);
    if (!raw) return mockRoadmap({ currentSkills, targetRole, timeframeWeeks });
    const parsed = JSON.parse(cleanJSON(raw));
    return normalizeRoadmap(parsed, timeframeWeeks);
  } catch (error) {
    console.error("AI roadmap generation failed, falling back to mock:", error.message);
    return mockRoadmap({ currentSkills, targetRole, timeframeWeeks });
  }
};

const normalizeRoadmap = (parsed, timeframeWeeks) => {
  const weeks = Array.isArray(parsed.weeks) ? parsed.weeks : [];
  return {
    weeks: weeks.slice(0, timeframeWeeks).map((w, i) => ({
      title: w.title || `Week ${i + 1}`,
      topics: Array.isArray(w.topics) ? w.topics.map((t) => ({ text: t, completed: false })) : [],
      projectIdea: w.projectIdea || "",
      resources: Array.isArray(w.resources) ? w.resources : [],
    })),
  };
};

const mockRoadmap = ({ currentSkills, targetRole, timeframeWeeks }) => {
  const themes = [
    "Fundamentals refresh",
    "Core skill building",
    "Hands-on project work",
    "Advanced concepts",
    "System design basics",
    "Mock interviews & DSA",
    "Portfolio polish",
    "Applications & networking",
  ];

  const weeks = Array.from({ length: timeframeWeeks }, (_, i) => ({
    title: `Week ${i + 1}: ${themes[i % themes.length]} for ${targetRole}`,
    topics: [
      { text: `Study core concepts relevant to ${targetRole}`, completed: false },
      { text: `Practice 5-10 problems related to ${themes[i % themes.length].toLowerCase()}`, completed: false },
      { text: currentSkills[i % (currentSkills.length || 1)]
          ? `Deepen your ${currentSkills[i % currentSkills.length]} skills`
          : "Explore a new relevant tool or framework", completed: false },
    ],
    projectIdea: `Build a small project applying week ${i + 1}'s concepts for a ${targetRole} portfolio.`,
    resources: ["freeCodeCamp", "Official documentation", "YouTube crash course"],
  }));

  return { weeks };
};
