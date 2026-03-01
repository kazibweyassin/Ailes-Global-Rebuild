"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, X, FileText, BookOpen, MessageSquare, ChevronDown, FilePlus, ListTodo, AlertCircle, FileUp, CheckCircle2, ArrowRight, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'application' | 'action' | 'error' | 'document' | 'scholarship_matches';
  data?: any;
  status?: 'sending' | 'sent' | 'error';
  matches?: any[];
};

type ScholarshipApplication = {
  id: string;
  scholarshipId: string;
  scholarshipName: string;
  status: 'draft' | 'in_progress' | 'submitted' | 'won' | 'rejected';
  progress: number;
  deadline?: string;
  documents: {
    type: 'essay' | 'recommendation' | 'transcript' | 'other';
    name: string;
    status: 'pending' | 'uploaded' | 'generated';
    content?: string;
  }[];
  formData?: Record<string, any>;
  submissionDate?: string;
};

type QuickAction = {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  type?: 'action' | 'application';
  applicationId?: string;
};

export default function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeApplication, setActiveApplication] = useState<ScholarshipApplication | null>(null);
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastRequestTimeRef = useRef<number>(0);
  const rateLimitCooldownRef = useRef<number>(0);

  // ─── Sound system ───────────────────────────────────────────────
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);
  const hasPlayedAttentionRef = useRef(false);

  const playSound = (type: 'attention' | 'open' | 'send' | 'receive') => {
    if (isMutedRef.current || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const t = ctx.currentTime;
      const tone = (freq: number, start: number, dur: number, vol: number) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.setValueAtTime(freq, start);
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(vol, start + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, start + dur);
        o.start(start); o.stop(start + dur + 0.05);
      };
      if (type === 'attention') { tone(523, t, 0.20, 0.12); tone(659, t + 0.16, 0.25, 0.09); }
      if (type === 'open')      { tone(392, t, 0.15, 0.13); tone(523, t + 0.13, 0.15, 0.11); tone(659, t + 0.26, 0.28, 0.09); }
      if (type === 'send')      { tone(700, t, 0.07, 0.08); tone(350, t + 0.05, 0.09, 0.05); }
      if (type === 'receive')   { tone(880, t, 0.15, 0.10); tone(1047, t + 0.12, 0.20, 0.08); }
      setTimeout(() => { ctx.close().catch(() => {}); }, 1500);
    } catch (_e) { /* silently ignore */ }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    isMutedRef.current = next;
    if (typeof window !== 'undefined') localStorage.setItem('ai-copilot-muted', String(next));
  };

  // Load mute preference + play attention ping once after 4 s
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Clear any stale dismissed flag so widget is always visible
    localStorage.removeItem('ai-copilot-dismissed');
    const muted = localStorage.getItem('ai-copilot-muted') === 'true';
    setIsMuted(muted);
    isMutedRef.current = muted;
    if (hasPlayedAttentionRef.current) return;
    hasPlayedAttentionRef.current = true;
    const timer = setTimeout(() => playSound('attention'), 4000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDocumentUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file.');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File is too large. Maximum size is 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const messageId = `doc-${Date.now()}`;
    const documentMessage: Message = {
      id: messageId,
      content: `Uploading ${file.name}...`,
      isUser: true,
      timestamp: new Date(),
      type: 'document',
      status: 'sending',
      data: {
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        previewUrl: '',
        downloadUrl: ''
      }
    };

    setMessages(prev => [...prev, documentMessage]);
    setIsProcessing(true);

    try {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
          
          setMessages(prev => prev.map(msg => 
            msg.id === messageId 
              ? { 
                  ...msg, 
                  data: { 
                    ...msg.data, 
                    progress,
                    content: `Uploading ${file.name}... ${progress}%`
                  },
                  content: `Uploading ${file.name}... ${progress}%`
                } 
              : msg
          ));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          const fileUrl = response.fileUrl || '';
          
          setMessages(prev => prev.map(msg => 
            msg.id === messageId 
              ? { 
                  ...msg, 
                  status: 'sent',
                  content: `Uploaded ${file.name}`,
                  data: { 
                    ...msg.data, 
                    ...response, 
                    status: 'uploaded',
                    previewUrl: fileUrl,
                    downloadUrl: fileUrl
                  }
                } 
              : msg
          ));
          toast.success('Document uploaded successfully');
        } else {
          throw new Error('Upload failed');
        }
      };

      xhr.onerror = () => {
        throw new Error('Upload failed');
      };

      xhr.open('POST', '/api/documents/upload', true);
      xhr.send(formData);
    } catch (error) {
      console.error('Error uploading document:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              status: 'error',
              content: `Failed to upload ${file.name}`,
              type: 'error',
              data: {
                ...msg.data,
                error: 'Upload failed. Please try again.'
              }
            } 
          : msg
      ));
      toast.error('Failed to upload document');
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  // ─── FAQ Template Engine (no API needed) ─────────────────────────────────
  const FAQ_TEMPLATES: { keywords: string[]; answer: string }[] = [
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'greetings', 'start'],
      answer: `👋 Hello! I'm your **Scholarship Copilot** from Ailes Global.\n\nI can help you with:\n- 🎓 Finding scholarships that match your profile\n- 📝 Understanding application requirements\n- 💰 Learning about funding amounts & deadlines\n- 🌍 Studying abroad in the USA, UK, Canada, Europe & more\n- 📄 Tips for writing winning essays\n\nWhat would you like to know? Type your question below!`
    },
    {
      keywords: ['what is ailes', 'about ailes', 'who are you', 'what do you do', 'about this platform'],
      answer: `**Ailes Global** is Africa's #1 scholarship-first study abroad platform.\n\nWe help African students — especially women — find fully-funded scholarships, match with top universities worldwide, and navigate the entire application process.\n\n🌟 **What sets us apart:**\n- Curated database of 500+ active scholarships\n- AI-powered profile matching\n- Step-by-step application guidance\n- Expert consultants available\n\nReady to start your journey? 🚀`
    },
    {
      keywords: ['fully funded', 'full scholarship', '100%', 'free scholarship', 'full funding'],
      answer: `✅ **Fully Funded Scholarships** cover everything:\n\n- ✈️ Flight tickets (in most cases)\n- 🏠 Accommodation & living allowance\n- 📚 Tuition fees (100%)\n- 🍽️ Monthly stipend\n- 📖 Books & study materials\n\n**Top fully-funded programs for Africans:**\n1. **Chevening** (UK) — up to £18,000/year\n2. **MasterCard Foundation** (various universities)\n3. **DAAD** (Germany) — full funding + stipend\n4. **Aga Khan** Foundation\n5. **OFID** Scholarship\n\nWould you like help finding ones that match your field of study?`
    },
    {
      keywords: ['gpa', 'grades', 'cgpa', 'grade requirement', 'academic requirement', 'minimum grade'],
      answer: `📊 **GPA Requirements vary by scholarship:**\n\n| Scholarship | Minimum GPA |\n|---|---|\n| Chevening (UK) | No fixed minimum |\n| Fulbright (USA) | ~3.0 / Second Class Upper |\n| DAAD (Germany) | Above average |\n| MasterCard Foundation | 3.0+ |\n| Commonwealth | Second Class Upper+ |\n\n💡 **Key tip:** A lower GPA can be offset by:\n- Strong recommendation letters\n- Leadership & community work\n- A compelling personal statement\n- Research/work experience\n\nDon't let grades stop you from applying!`
    },
    {
      keywords: ['deadline', 'when to apply', 'application deadline', 'closing date', 'last date'],
      answer: `📅 **Key Scholarship Deadlines to Know:**\n\n**January – March:** DAAD (Germany), Rhodes Scholarship\n**March – June:** Various university scholarships open\n**October – December:** Chevening, Fulbright, Commonwealth, Gates Cambridge\n\n⚠️ **Pro tip:** Most top scholarships open **12 months before** the program starts. Start preparing NOW even if the deadline is months away.\n\nVisit our [Scholarships page](/scholarships) to see live deadlines! 🗓️`
    },
    {
      keywords: ['how to apply', 'application process', 'steps to apply', 'how do i apply', 'where to start'],
      answer: `📝 **How to Apply for Scholarships — Step by Step:**\n\n**Step 1: Build your profile** (2 mins)\n→ Tell us your education level, field, and goals\n\n**Step 2: Get matched**\n→ We show you scholarships with the highest chance of success\n\n**Step 3: Prepare documents**\n- Academic transcripts\n- 2–3 letters of recommendation\n- Personal statement / essay\n- CV / Resume\n- English test results (IELTS/TOEFL if needed)\n\n**Step 4: Submit**\n→ Apply directly on the scholarship's official website\n\n**Step 5: Track & follow up**\n→ Monitor your application status\n\nWant me to help you start? Say **"find scholarships"**! 🎯`
    },
    {
      keywords: ['personal statement', 'essay', 'sop', 'statement of purpose', 'motivation letter', 'cover letter'],
      answer: `✍️ **Writing a Winning Personal Statement:**\n\n**Structure (800–1000 words):**\n1. **Hook** — Start with a powerful story or moment\n2. **Your background** — Academic journey & achievements\n3. **Why this scholarship** — Be specific, research their values\n4. **Career goals** — Where will this degree take you?\n5. **Impact** — How will you serve your community?\n\n**Golden rules:**\n- ❌ Never start with "I was born in..."\n- ✅ Show, don't tell — use real examples\n- ✅ Tailor each essay to the specific scholarship\n- ✅ Get it reviewed by someone else\n- ✅ Check grammar with Grammarly\n\n💡 Want a template? Ask me for **"personal statement template"**!`
    },
    {
      keywords: ['personal statement template', 'essay template', 'sop template'],
      answer: `📋 **Personal Statement Template:**\n\n---\n**Opening (100 words):**\n*"[Start with a story, challenge, or moment that shaped your passion for your field]"*\n\n**Academic Background (150 words):**\n*"My undergraduate studies in [field] at [university] equipped me with [skills]. I graduated with [GPA/class] and [key achievement]."*\n\n**Why This Program (150 words):**\n*"[Scholarship name] aligns perfectly with my goals because [specific reason tied to their mission]..."*\n\n**Career Goals (200 words):**\n*"Upon completing this program, I intend to [specific goals] in [home country/region]..."*\n\n**Impact & Return (150 words):**\n*"I am committed to [how you'll give back]. Africa needs [your solution] and I am positioned to..."*\n\n**Closing (100 words):**\n*"This scholarship is not just an opportunity for me — it is an investment in [broader impact]..."*\n\n---\n\nCustomize each section with YOUR story. Make it personal! ✨`
    },
    {
      keywords: ['recommendation letter', 'reference letter', 'lor', 'referee', 'recommender'],
      answer: `📨 **Letters of Recommendation — What You Need to Know:**\n\n**How many:** Usually 2–3 letters required\n\n**Who to ask:**\n- University professors (preferred)\n- Thesis/project supervisors\n- Employers or internship supervisors\n- Community leaders (for leadership scholarships)\n\n**Tips:**\n- Ask at least **2–3 months** before deadline\n- Give your referee your CV, personal statement & scholarship details\n- A specific letter beats a generic one every time\n- Follow up politely if they haven't submitted\n\n**What a great letter includes:**\n- How long they've known you\n- Specific academic/professional examples\n- Your unique strengths\n- A strong endorsement\n\nNeed a template to give your referee? Just ask! 📝`
    },
    {
      keywords: ['ielts', 'toefl', 'english test', 'language requirement', 'english proficiency', 'duolingo english'],
      answer: `🗣️ **English Language Requirements:**\n\n| Test | Common Minimum |\n|---|---|\n| IELTS Academic | 6.0 – 7.0 |\n| TOEFL iBT | 80 – 100 |\n| Duolingo English | 100 – 120 |\n| PTE Academic | 55 – 65 |\n\n**Scholarships that may waive English tests:**\n- If you studied in English medium for 4+ years\n- Some accept a letter from your university\n- MasterCard Foundation often flexible for African universities\n\n💡 **Prep tips:**\n- Practice daily reading & listening (BBC, podcasts)\n- Take mock tests on the official websites\n- Target 1 point above minimum for safety\n\nIELTS costs ~$250. TOEFL costs ~$245. Plan ahead!`
    },
    {
      keywords: ['chevening', 'uk scholarship', 'british scholarship', 'study in uk', 'united kingdom'],
      answer: `🇬🇧 **Chevening Scholarship (UK):**\n\n- **Funder:** UK Foreign, Commonwealth & Development Office\n- **Level:** Master's degree (1 year)\n- **Value:** Fully funded — tuition + living + flights + visa\n- **Deadline:** Usually **November each year**\n\n**Eligibility:**\n- Citizen of a Chevening-eligible country (most African countries ✅)\n- 2+ years work experience\n- Bachelor's degree (minimum 2:1)\n- Return to home country after\n\n**What they look for:**\n- Leadership potential\n- Networking ability\n- Ambassadorial qualities\n\n🔗 Apply at: **chevening.org**\n\nWant tips on the Chevening essay questions? Just ask!`
    },
    {
      keywords: ['fulbright', 'usa scholarship', 'american scholarship', 'study in usa', 'united states'],
      answer: `🇺🇸 **Fulbright Foreign Student Scholarship (USA):**\n\n- **Funder:** U.S. Department of State\n- **Level:** Master's or PhD\n- **Value:** Fully funded — tuition, living, health insurance, flights\n- **Deadline:** Varies by country (~October)\n\n**Eligibility:**\n- Citizen of a Fulbright-participating country ✅\n- Bachelor's degree\n- English proficiency\n- Strong academic record\n\n**Application tips:**\n- Apply through your country's Fulbright Commission\n- Essays must show US-home country cultural exchange value\n- Leadership & community involvement matter a lot\n\n🔗 Visit: **fulbright.org**\n\nAfrica has strong Fulbright acceptance rates — apply! 🎓`
    },
    {
      keywords: ['daad', 'germany scholarship', 'german scholarship', 'study in germany', 'deutschland'],
      answer: `🇩🇪 **DAAD Scholarships (Germany):**\n\n- **Funder:** German Academic Exchange Service\n- **Level:** Bachelor's, Master's, PhD, Research\n- **Value:** €850–€1,200/month + tuition + travel allowance\n- **Deadline:** Varies by program (Oct–Dec)\n\n**Why Germany?**\n- Most public universities charge **zero tuition** 🎉\n- Strong engineering, sciences, and business programs\n- High quality of life\n\n**Popular DAAD programs for Africans:**\n- Development-Related Postgraduate Courses\n- EPOS — In-Country/In-Region Programmes\n- Research Grants\n\n**Language:** Many programs taught in English.\n\n🔗 Visit: **daad.de/en**`
    },
    {
      keywords: ['mastercard', 'mastercard foundation', 'mcf', 'africa scholarship'],
      answer: `💳 **MasterCard Foundation Scholars Program:**\n\n- **Target:** Academically talented but financially disadvantaged African youth\n- **Level:** Undergraduate & Graduate\n- **Value:** Fully funded — tuition, accommodation, stipend, flights\n\n**Partner Universities include:**\n- University of Toronto (Canada)\n- Sciences Po (France)\n- University of Edinburgh (UK)\n- African Leadership University\n- And many more across Africa\n\n**What they value:**\n- Leadership & community service\n- Financial need\n- Academic excellence\n- Commitment to give back to Africa\n\n**For women:** Extra priority given to female applicants 👩‍🎓\n\n🔗 Visit: **mastercardfdn.org/scholars**`
    },
    {
      keywords: ['commonwealth', 'commonwealth scholarship', 'csc', 'study commonwealth'],
      answer: `🌍 **Commonwealth Scholarship (UK):**\n\n- **Funder:** UK Government\n- **Level:** Master's & PhD\n- **Value:** Fully funded — tuition, stipend, flights, thesis grant\n- **Deadline:** Usually **December**\n\n**Eligibility:**\n- Citizens of Commonwealth countries (most African countries ✅)\n- First class or upper second class degree\n- Cannot be currently studying/living in UK\n\n**What they look for:**\n- Academic excellence\n- Potential to contribute to development of your home country\n- Commitment to return home\n\n🔗 Apply through your country's Commonwealth nominating agency\n\nStrong focus on **development impact** — emphasize this in your essays!`
    },
    {
      keywords: ['canadian scholarship', 'study in canada', 'canada university'],
      answer: `🇨🇦 **Studying in Canada — Key Scholarships:**\n\n1. **Vanier Canada Graduate Scholarship** — PhD students, CAD $50,000/year\n2. **MasterCard Foundation at U of T** — Fully funded undergrad/grad\n3. **University merit awards** — Most Canadian universities offer international awards\n4. **IDRC Research Awards** — Development-focused research\n\n**Why Canada?**\n- Welcoming immigration policies\n- Post-graduation work permit (3 years)\n- Pathway to permanent residency\n- Diverse & multicultural 🍁\n\nAverage tuition: CAD $20,000–35,000/year (before scholarships)`
    },
    {
      keywords: ['australia', 'australian scholarship', 'study in australia', 'australia awards'],
      answer: `🇦🇺 **Australia Awards Scholarship:**\n\n- **Funder:** Australian Government\n- **Level:** Undergraduate, Master's, PhD\n- **Value:** Fully funded — tuition, living, flights, health\n- **Target:** Developing countries including many African nations\n- **Deadline:** Usually **February**\n\n**Why Australia?**\n- World-class universities (8 in global top 100)\n- Post-study work rights\n- Strong research programs\n\n🔗 Visit: **australiaawards.gov.au**`
    },
    {
      keywords: ['phd', 'doctorate', 'doctoral', 'research degree', 'phd scholarship'],
      answer: `🔬 **PhD / Doctoral Scholarships for Africans:**\n\n1. **Commonwealth PhD** (UK) — Fully funded\n2. **DAAD Research Grants** (Germany) — €1,200/month\n3. **Fulbright PhD** (USA) — Fully funded\n4. **Swedish Institute** — Full funding inc. family allowance\n5. **ETH Zurich Excellence** (Switzerland)\n6. **OWSD Fellowship** — Women in STEM PhDs\n\n**What PhD funders look for:**\n- Published research or strong research proposal\n- Relevant Master's degree\n- Supervisor confirmation\n- Strong academic references\n\n💡 **Tip:** Email professors directly before applying — a supervisor who wants you is a huge advantage!`
    },
    {
      keywords: ['women', 'female', 'girl', 'gender', 'woman scholarship'],
      answer: `👩‍🎓 **Scholarships Specifically for Women:**\n\n1. **L'Oréal-UNESCO For Women in Science** — STEM research\n2. **OWSD Fellowship** — Women in STEM PhDs from developing countries\n3. **African Women in Agricultural Research (AWARD)**\n4. **Cartier Women's Initiative** — Women entrepreneurs\n5. **MasterCard Foundation** — Prioritizes women applicants\n6. **Aga Khan Foundation** — Significant female representation\n7. **WomEng** — Women in Engineering\n\n**At Ailes Global, women get extra support because we believe educated women transform communities.** 🌍\n\nWant help finding one that fits your field?`
    },
    {
      keywords: ['stem', 'engineering', 'science', 'technology', 'mathematics', 'computer science', 'it scholarship'],
      answer: `💻 **STEM Scholarships for African Students:**\n\n1. **Google PhD Fellowship** — Computer Science\n2. **Microsoft Research PhD** — Technology fields\n3. **L'Oréal-UNESCO** — Women in Science\n4. **OWSD** — Women in STEM developing countries\n5. **DAAD Engineering** — Germany tech universities\n6. **Carnegie Mellon Africa** — ICT scholarships\n\n**Why STEM is great for scholarships:**\n- High demand = more funding available\n- Strong research grants for PhD students\n- Many companies sponsor international STEM students\n\n🎯 Your field is one of the most funded globally. Apply!`
    },
    {
      keywords: ['business', 'mba', 'management', 'finance', 'economics', 'business scholarship'],
      answer: `📈 **Business / MBA Scholarships:**\n\n1. **Chevening** (UK) — MBA & business masters\n2. **INSEAD MBA Scholarship** — Need-based & merit\n3. **HEC Paris Excellence** — Top MBA program\n4. **African Development Bank** — Economics & finance\n5. **IMF Institute Scholarship** — Macro-economics focus\n6. **WB JJ WBGSP** — Development economics\n\n**For MBA specifically:**\n- Most top MBAs require 3–5 years work experience\n- GMAT score often needed (~600+)\n- Strong professional references important\n\n💼 Average MBA ROI: 3x salary increase within 5 years!`
    },
    {
      keywords: ['medicine', 'medical', 'health', 'doctor', 'nursing', 'public health'],
      answer: `🏥 **Medical & Health Scholarships:**\n\n1. **Aga Khan University** — Medical programs in East Africa\n2. **Fogarty International** (NIH) — Global health research\n3. **Commonwealth Medical Scholarship** — Postgrad medicine\n4. **PEPFAR Scholarships** — HIV/AIDS & public health\n5. **WHO/TDR Scholarships** — Tropical disease research\n\n**Public Health is highly funded** — especially if focused on African health challenges (malaria, maternal health, etc.) 🌍\n\n**Note:** Most scholarships are for postgraduate study (MPH, MSc, PhD).`
    },
    {
      keywords: ['law', 'llm', 'legal', 'human rights', 'law scholarship'],
      answer: `⚖️ **Law & Legal Scholarships:**\n\n1. **Chevening** (UK) — LLM & legal studies\n2. **Oxford Weidenfeld & Hoffmann** — Law & related fields\n3. **Georgetown LLM Merit Awards** (USA)\n4. **Open Society Foundations** — Human rights focus\n5. **Human Rights Watch Fellowships**\n\n**High demand areas:**\n- International human rights law\n- Environmental law\n- Trade & investment law\n\n💡 **Tip:** Highlight how your legal career will serve justice in Africa — scholarship committees love this narrative! 🌍`
    },
    {
      keywords: ['interview', 'scholarship interview', 'prepare interview', 'interview tips', 'selection interview'],
      answer: `🎤 **Scholarship Interview Preparation:**\n\n**Common questions you WILL be asked:**\n1. "Tell me about yourself"\n2. "Why do you deserve this scholarship?"\n3. "What are your career goals?"\n4. "How will you use this education to help your community?"\n5. "Why this country/university?"\n6. "What's your biggest challenge and how did you overcome it?"\n\n**Tips to nail it:**\n- Research the scholarship's mission deeply\n- Prepare specific examples (use STAR method)\n- Practice out loud with a friend or mirror\n- Dress professionally even for video interviews\n- Ask thoughtful questions at the end\n\n⏱️ Most interviews are 20–30 minutes. Be concise but impactful!`
    },
    {
      keywords: ['cv', 'resume', 'curriculum vitae', 'academic cv'],
      answer: `📄 **Scholarship CV / Academic CV Tips:**\n\n**Structure:**\n1. Personal Info — Name, contacts, LinkedIn\n2. Education — Degrees, GPA, institutions\n3. Work Experience — Most recent first\n4. Research & Publications — If any\n5. Awards & Honours\n6. Leadership & Volunteering — **Very important!**\n7. Skills — Languages, tech, other\n8. References — 2–3 contacts\n\n**Rules:**\n- Max 2 pages for Master's, 3–4 for PhD\n- Use clean, professional formatting\n- Tailor it slightly for each scholarship\n- Use **action verbs**: Led, Coordinated, Developed, Managed\n\nWant a section-by-section template? Just ask! ✍️`
    },
    {
      keywords: ['cost', 'fees', 'how much', 'price', 'ailes global fee', 'service fee'],
      answer: `💰 **Ailes Global Services:**\n\n- **Browsing scholarships** — Free ✅\n- **AI scholarship matching** — Free ✅\n- **Basic guidance** — Free ✅\n\nFor premium personalized consulting (essay review, application strategy, 1-on-1 mentoring), reach out via our [Contact page](/contact).\n\n🎯 The best scholarships are **completely free to apply** to. You should never pay to apply for a legitimate scholarship. If anyone charges you to apply, it may be a scam! ⚠️`
    },
    {
      keywords: ['scam', 'fake scholarship', 'fraud', 'legitimate', 'real scholarship', 'is it real'],
      answer: `⚠️ **How to Spot Scholarship Scams:**\n\n**Red flags:**\n- ❌ You have to pay to apply or receive the award\n- ❌ You "won" without applying\n- ❌ They ask for your bank account details\n- ❌ Poor grammar on official communications\n- ❌ No verifiable official website\n- ❌ Pressure to respond immediately\n\n**Legitimate scholarships:**\n- ✅ Always free to apply\n- ✅ Have official government or institutional websites\n- ✅ Found on university websites or official portals\n\n**Safe places to find scholarships:**\n- ailesglobal.com (us! 😊)\n- scholars4dev.com\n- opportunitiesforafricans.com`
    },
    {
      keywords: ['rejection', 'rejected', 'failed', 'not selected', 'what if i fail', 'unsuccessful'],
      answer: `💪 **Got Rejected? Here's What To Do:**\n\n**First — It's normal!** Even the strongest applicants get rejected. Chevening success rate is ~3%. Keep going.\n\n**Immediate steps:**\n1. Request feedback (some scholarships provide it)\n2. Identify what was weak — essay? Interview? Grades?\n3. Work on those areas for 6 months\n\n**Reapplying:**\n- Most scholarships allow you to reapply next cycle\n- Many winners got in on their **2nd or 3rd attempt**\n- Your application will be stronger each time\n\n**Meanwhile:**\n- Apply to 5–10 scholarships simultaneously\n- Explore local funding options & university scholarships\n\n🌟 Every "no" is one step closer to your "yes"!`
    },
    {
      keywords: ['contact', 'speak to someone', 'human', 'consultant', 'advisor', 'help me'],
      answer: `📞 **Talk to an Ailes Global Advisor:**\n\nOur team of expert consultants is ready to give you personalized guidance!\n\n👉 Visit our [Contact page](/contact) to:\n- Book a free 15-minute discovery call\n- Send us a message\n- Connect on WhatsApp\n\nWe've helped students win scholarships worth **$50,000–$150,000** — your dream is achievable! 🌟`
    },
    {
      keywords: ['find scholarship', 'match scholarship', 'which scholarship', 'suggest scholarship', 'recommend scholarship', 'scholarship for me'],
      answer: `🎯 **Finding Your Best-Fit Scholarship:**\n\nTo match you with the right scholarships, I need to know:\n\n1. **What's your current education level?** (Bachelor's, Master's, PhD?)\n2. **What field do you study?** (Engineering, Business, Medicine, etc.)\n3. **Which country would you like to study in?**\n4. **What's your nationality?**\n5. **Do you have work experience?**\n\n📝 Share these details and I'll suggest the best scholarships for your profile!\n\nOr visit our [Scholarships page](/scholarships) for AI-powered matching! 🚀`
    },
    {
      keywords: ['thank', 'thanks', 'thank you', 'helpful', 'great', 'amazing', 'awesome'],
      answer: `😊 You're so welcome! That's what I'm here for.\n\nRemember — your education journey starts with a single application. **You've got this!** 💪\n\nFeel free to ask me anything else about scholarships, universities, essays, or studying abroad.\n\nGood luck — we're rooting for you at Ailes Global! 🌍✨`
    },
  ];

  const getTemplateResponse = (userInput: string): string => {
    const lower = userInput.toLowerCase().trim();
    for (const faq of FAQ_TEMPLATES) {
      if (faq.keywords.some(kw => lower.includes(kw))) {
        return faq.answer;
      }
    }
    return `🤔 Great question! Here's how I can help:\n\n- 🎓 **Find scholarships** — tell me your field & level of study\n- 📝 **Application tips** — ask about essays, CVs, interviews\n- 🌍 **Country-specific** — ask about UK, USA, Germany, Canada, etc.\n- 💡 **Eligibility** — ask about GPA, work experience, language tests\n\n**Popular questions to try:**\n- "What are fully funded scholarships?"\n- "How do I write a personal statement?"\n- "Scholarships for women in STEM"\n- "How to apply for Chevening"\n\nOr visit our [Scholarships page](/scholarships) to browse & filter live opportunities! 🚀`;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Handle empty input unless it's a command
    if ((!input.trim() && !input.startsWith('/')) || isProcessing) return;

    // Rate limiting disabled for testing
    // const now = Date.now();
    // const timeSinceLastRequest = now - lastRequestTimeRef.current;
    // const minDelay = 500; // 500ms minimum - very lenient
    // 
    // if (timeSinceLastRequest < minDelay) {
    //   // Just wait silently instead of blocking
    //   await new Promise(resolve => setTimeout(resolve, minDelay - timeSinceLastRequest));
    // }

    // Only enforce cooldown if we've actually hit a rate limit (not preemptively)
    // Removed preemptive cooldown check

    lastRequestTimeRef.current = Date.now();

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      isUser: true,
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages((prev) => [...prev, userMessage]);
    playSound('send');
    setInput("");
    setIsLoading(true);
    setIsProcessing(true);

    try {
      // Handle application-specific commands
      if (input.startsWith('/')) {
        const [command, ...args] = input.slice(1).split(' ');
        
        switch(command.toLowerCase()) {
          case 'new':
            startNewApplication({ name: args.join(' ') || 'Custom Scholarship' });
            setIsLoading(false);
            setIsProcessing(false);
            return;
            
          case 'list':
            setMessages(prev => [...prev, {
              id: `list-${Date.now()}`,
              content: "Here are your current applications:",
              isUser: false,
              timestamp: new Date(),
              type: 'action',
              data: { action: 'list_applications', applications }
            }]);
            setIsLoading(false);
            setIsProcessing(false);
            return;
            
          case 'help':
            setMessages(prev => [...prev, {
              id: `help-${Date.now()}`,
              content: `Available commands:\n\n` +
                `/new [name] - Start a new application\n` +
                `/list - Show all applications\n` +
                `/help - Show this help message\n`,
              isUser: false,
              timestamp: new Date()
            }]);
            setIsLoading(false);
            setIsProcessing(false);
            return;
        }
      }

      // Update message status to sent
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
      ));

      // Simulate brief typing delay for realism
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 700));

      const reply = getTemplateResponse(input);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: reply,
        isUser: false,
        timestamp: new Date(),
        type: 'text',
      };

      setMessages(prev => [...prev, aiMessage]);
      playSound('receive');
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      // Handle rate limit errors with shorter cooldown
      if (error?.message?.includes('rate limit') || error?.status === 429) {
        // Set shorter cooldown period (10 seconds instead of 30)
        rateLimitCooldownRef.current = Date.now() + 10000;
        
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          content: "Rate limit exceeded. The system will automatically retry. Please wait a moment and try again.",
          isUser: false,
          timestamp: new Date(),
          type: 'error',
          status: 'error'
        };
        setMessages(prev => [...prev, errorMessage]);
        toast.error('Rate limit exceeded. Please wait a moment.', {
          duration: 3000,
        });
      } else {
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          content: error?.message || "Sorry, I encountered an error processing your request. Please try again.",
          isUser: false,
          timestamp: new Date(),
          type: 'error',
          status: 'error'
        };
        setMessages(prev => [...prev, errorMessage]);
        toast.error(error?.message || 'Failed to process your request');
      }
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  // Load saved applications from localStorage
  useEffect(() => {
    const savedApps = localStorage.getItem('scholarshipApplications');
    if (savedApps) {
      setApplications(JSON.parse(savedApps));
    }
  }, []);

  // Save applications to localStorage when they change
  useEffect(() => {
    if (applications.length > 0) {
      localStorage.setItem('scholarshipApplications', JSON.stringify(applications));
    }
  }, [applications]);

  const startNewApplication = (scholarship: any) => {
    const newApp: ScholarshipApplication = {
      id: `app-${Date.now()}`,
      scholarshipId: scholarship.id || 'custom',
      scholarshipName: scholarship.name || 'Custom Scholarship',
      status: 'draft',
      progress: 0,
      deadline: scholarship.deadline,
      documents: [
        { type: 'essay', name: 'Personal Statement', status: 'pending' },
        { type: 'recommendation', name: 'Letter of Recommendation', status: 'pending' },
      ],
    };
    
    setApplications(prev => [...prev, newApp]);
    setActiveApplication(newApp);
    
    // Add a welcome message for the new application
    setMessages(prev => [...prev, {
      id: `app-${Date.now()}`,
      content: `I'll help you apply for ${newApp.scholarshipName}. Let's get started!`,
      isUser: false,
      timestamp: new Date(),
      type: 'application',
      data: newApp
    }]);
  };

  const quickActions: QuickAction[] = [
    {
      title: "Find Scholarships",
      description: "Help me find scholarships matching my profile",
      icon: <BookOpen className="h-5 w-5" />,
      onClick: () => setInput("Help me find scholarships matching my profile"),
      type: 'action'
    },
    {
      title: "Start New Application",
      description: "Begin a new scholarship application",
      icon: <FilePlus className="h-5 w-5" />,
      onClick: () => startNewApplication({}),
      type: 'action'
    },
    {
      title: "My Applications",
      description: "View and manage your applications",
      icon: <ListTodo className="h-5 w-5" />,
      onClick: () => {
        setMessages(prev => [...prev, {
          id: `app-list-${Date.now()}`,
          content: "Here are your current applications:",
          isUser: false,
          timestamp: new Date(),
          type: 'action',
          data: { action: 'list_applications', applications }
        }]);
      },
      type: 'action'
    },
    ...applications.slice(0, 3).map(app => ({
      title: `Continue: ${app.scholarshipName}`,
      description: `Progress: ${app.progress}%`,
      icon: <FileText className="h-5 w-5" />,
      onClick: () => {
        setActiveApplication(app);
        setMessages(prev => [...prev, {
          id: `resume-${app.id}`,
          content: `Let's continue working on your application for ${app.scholarshipName}`,
          isUser: false,
          timestamp: new Date(),
          type: 'application',
          data: app
        }]);
      },
      type: 'application' as const,
      applicationId: app.id
    }))
  ];

  return !isOpen ? (
    <motion.div
      className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        onClick={() => {
          playSound('open');
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className="rounded-full h-12 w-12 p-0 shadow-lg border border-gray-200"
        style={{background:'#ffffff',color:'var(--gold)'}}
      >
        <Sparkles className="h-5 w-5" />
      </Button>
    </motion.div>
  ) : (
    <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 w-[calc(100vw-2rem)] max-w-xs">
      <Card className="w-full rounded-xl shadow-xl overflow-hidden flex flex-col" style={{background:'#ffffff',border:'1px solid #e5e7eb'}}>
        <div 
          className="p-3 cursor-pointer flex justify-between items-center"
          style={{background:'#ffffff',borderBottom:'2px solid var(--gold)'}}
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" style={{color:'var(--gold)'}} />
            <span className="font-semibold text-sm" style={{color:'#111827'}}>Scholarship Copilot</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="p-1 hover:bg-gray-100 rounded"
              title={isMuted ? "Unmute sounds" : "Mute sounds"}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5 text-gray-400" /> : <Volume2 className="h-3.5 w-3.5 text-gray-500" />}
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-3 space-y-3 max-h-[45vh] overflow-y-auto" style={{color:'#111827'}}>
                {messages.length === 0 ? (
                  <div className="space-y-4">
                    <div className="text-center py-3">
                      <h3 className="font-semibold text-sm text-gray-900">How can I help you today?</h3>
                      <p className="text-xs text-gray-500 mt-0.5">AI Scholarship Assistant</p>
                    </div>
                    <div className="space-y-3">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            action.onClick();
                            const textarea = document.querySelector('textarea');
                            textarea?.focus();
                          }}
                          className="w-full text-left p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg" style={{background:'#FEF3C7',color:'var(--gold)'}}>
                              {action.icon}
                            </div>
                            <div>
                              <p className="font-medium text-xs text-gray-900">{action.title}</p>
                              <p className="text-xs text-gray-500">{action.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-2.5 text-xs ${
                            message.isUser
                              ? "text-gray-900"
                              : "text-gray-800"
                          }`}
                          style={message.isUser
                            ? {background:'var(--gold)',color:'#111827'}
                            : {background:'#f3f4f6',border:'1px solid #e5e7eb'}
                          }
                        >
                          {message.type === 'error' ? (
                            <Alert variant="destructive" className="p-2">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Error</AlertTitle>
                              <AlertDescription className="text-xs">
                                {message.content}
                              </AlertDescription>
                            </Alert>
                          ) : message.type === 'document' ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 flex-shrink-0" />
                                <span className="text-sm font-medium truncate max-w-[200px]">{message.data?.name}</span>
                                {message.status === 'sending' ? (
                                  <span className="text-xs ml-auto" style={{color:'var(--soft)'}}>
                                    {message.data?.progress}%
                                  </span>
                                ) : message.status === 'error' ? (
                                  <span className="text-xs text-destructive ml-auto">Failed</span>
                                ) : (
                                  <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                                )}
                              </div>
                              {message.status === 'sending' && (
                                <Progress value={message.data?.progress || 0} className="h-1.5" />
                              )}
                              {message.status === 'sent' && message.data?.previewUrl && (
                                <div className="mt-2 flex flex-col gap-2">
                                  <a
                                    href={message.data.previewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs hover:underline flex items-center gap-1"
                                    style={{color:'var(--gold-light)'}}
                                  >
                                    <FileText className="h-3 w-3" />
                                    <span>View Document</span>
                                  </a>
                                  <a
                                    href={message.data.downloadUrl}
                                    download={message.data.name}
                                    className="text-xs hover:underline flex items-center gap-1"
                                    style={{color:'var(--gold-light)'}}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                      <polyline points="7 10 12 15 17 10"></polyline>
                                      <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    <span>Download</span>
                                  </a>
                                </div>
                              )}
                              {message.data?.error && (
                                <p className="text-xs text-destructive mt-1">{message.data.error}</p>
                              )}
                            </div>
                          ) : message.type === 'scholarship_matches' && message.matches && message.matches.length > 0 ? (
                            <div className="space-y-3">
                              <div className="prose prose-sm max-w-none mb-3">
                                <ReactMarkdown
                                  components={{
                                    a: ({node, ...props}) => (
                                      <a 
                                        {...props} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                        style={{color:'var(--gold-light)'}}
                                      />
                                    )
                                  }}
                                >
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                              <div className="space-y-2 max-h-64 overflow-y-auto">
                                {message.matches.slice(0, 5).map((match: any, idx: number) => {
                                  const sch = match.scholarship;
                                  const daysLeft = Math.ceil((new Date(sch.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                                  return (
                                    <div key={idx} className="rounded-lg p-3 transition-shadow hover:shadow-md" style={{background:'var(--navy-light)',border:'1px solid rgba(245,237,214,.1)'}}>
                                      <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex-1">
                                          <h4 className="font-semibold text-sm mb-1" style={{color:'var(--ivory)'}}>{sch.name}</h4>
                                          <p className="text-xs" style={{color:'var(--soft)'}}>{sch.provider}</p>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-xs font-bold text-primary">{match.matchScore}%</div>
                                          <div className="text-xs" style={{color:'var(--muted)'}}>Match</div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-4 text-xs mb-2" style={{color:'var(--soft)'}}>
                                        <span>💰 {sch.currency} {sch.amount?.toLocaleString() || 'Varies'}</span>
                                        <span>📍 {sch.country}</span>
                                        <span>⏰ {daysLeft}d left</span>
                                      </div>
                                      {match.matchReasons && match.matchReasons.length > 0 && (
                                        <div className="mb-2">
                                          <p className="text-xs font-medium mb-1" style={{color:'#4ADE80'}}>Why it matches:</p>
                                          <ul className="text-xs space-y-0.5" style={{color:'var(--soft)'}}>
                                            {match.matchReasons.slice(0, 2).map((reason: string, rIdx: number) => (
                                              <li key={rIdx}>✓ {reason}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      <Link href={`/scholarships/${sch.id}`}>
                                        <Button size="sm" variant="outline" className="w-full mt-2 text-xs" style={{borderColor:'rgba(245,237,214,.25)',color:'var(--gold)',background:'transparent'}}>
                                          View Details
                                          <ArrowRight className="h-3 w-3 ml-1" />
                                        </Button>
                                      </Link>
                                    </div>
                                  );
                                })}
                              </div>
                              {message.matches.length > 5 && (
                                <p className="text-xs text-center" style={{color:'var(--muted)'}}>
                                  +{message.matches.length - 5} more matches available
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="prose prose-sm max-w-none">
                              <ReactMarkdown
                                components={{
                                  code({node, className, children, ...props}: any) {
                                    const inline = !className || !className.includes('language-');
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                      <pre className={`language-${match[1]} p-4 rounded overflow-x-auto`} style={{background:'var(--navy-light)' as string}}>
                                        <code className={className} {...props}>
                                          {children}
                                        </code>
                                      </pre>
                                    ) : (
                                      <code className={className} {...props}>
                                        {children}
                                      </code>
                                    );
                                  },
                                  a: ({node, ...props}) => (
                                    <a 
                                      {...props} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="hover:underline"
                                      style={{color:'var(--gold-light)'}}
                                    />
                                  )
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          )}
                          <p className="text-xs opacity-70 mt-1 text-right">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="rounded-lg p-2.5" style={{background:'#f3f4f6',border:'1px solid #e5e7eb'}}>
                          <div className="flex space-x-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-3" style={{borderTop:'1px solid #e5e7eb'}}>
                <div className="relative">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about scholarships..."
                    className="pr-20 resize-none placeholder:text-gray-400 text-xs"
                    style={{background:'#f9fafb',color:'#111827',borderColor:'#e5e7eb'}}
                    rows={1}
                    disabled={isProcessing}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <div className="absolute right-2 bottom-2 flex gap-1">
                    <input
                      type="file"
                      id="document-upload"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleDocumentUpload(e.target.files[0]);
                          // Reset the input to allow selecting the same file again
                          e.target.value = '';
                        }
                      }}
                      accept=".pdf,.doc,.docx,.txt"
                      disabled={isProcessing}
                    />
                    <label 
                      htmlFor="document-upload"
                      className="p-1.5 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                      style={{color:'#9ca3af'}}
                      title="Upload document"
                    >
                      <FileUp className="h-4 w-4" />
                    </label>
                    <Button
                      type="submit"
                      size="icon"
                      className="h-8 w-8"
                      disabled={!input.trim() || isProcessing}
                      onClick={(e) => {
                        if (isLoading) e.preventDefault();
                      }}
                    >
                      {isLoading ? (
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-background animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-background animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-background animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}