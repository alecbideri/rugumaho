"use client";

import { useState } from "react";
import { ChevronDown, Send } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { sendContactFormEmail } from "../../lib/sanityActions";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    {...props} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    {...props} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await sendContactFormEmail({ name, email, subject, message });
      if (res.success) {
        setSubmitted(true);
        setName("");
        setEmail("");
        setMessage("");
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert("Failed to send message: " + (res.error || "Unknown error"));
      }
    } catch (err: any) {
      console.error(err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dot-grid min-h-screen bg-[#f6f8f8] font-display text-slate-900 transition-colors duration-200 flex flex-col">
      <Navbar />

      <main className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-16 flex-grow flex items-center justify-center">
        <div className="bg-white rounded-xl border border-slate-100 p-8 sm:p-12 shadow-sm w-full max-w-2xl relative">
          
          <div className="text-center mb-10">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
              Let&apos;s Connect
            </h2>
            <p className="text-slate-500 font-light mt-2 text-sm">
              For collaborations, inquiries, or just to say hello.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl text-center font-medium space-y-2">
              <h3 className="text-lg font-bold font-serif">Message Sent Successfully!</h3>
              <p className="text-sm font-light text-slate-500">
                Thank you for reaching out, Ariane Rugumaho will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name & Email inputs grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name-input" className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 block">
                    Full Name
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm px-4 py-3 text-slate-900 focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-slate-300"
                  />
                </div>
                <div>
                  <label htmlFor="email-input" className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 block">
                    Email Address
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm px-4 py-3 text-slate-900 focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-slate-300"
                  />
                </div>
              </div>

              {/* Subject dropdown */}
              <div>
                <label htmlFor="subject-select" className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 block">
                  Subject
                </label>
                <div className="relative">
                  <select
                    id="subject-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm px-4 py-3 text-slate-900 focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer appearance-none"
                  >
                    <option>General Inquiry</option>
                    <option>Collaboration</option>
                    <option>Advertising / Sponsorship</option>
                    <option>Saying Hello</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Message text area */}
              <div>
                <label htmlFor="message-input" className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 block">
                  Message
                </label>
                <textarea
                  id="message-input"
                  required
                  placeholder="Tell us how we can help..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm px-4 py-3 text-slate-900 focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-slate-300 resize-none h-32"
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white dark:text-slate-900 disabled:opacity-50 text-sm font-extrabold py-4 rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/15 cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

            </form>
          )}

          {/* Social footnotes separator */}
          <div className="relative my-10 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative bg-white px-4 text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
              Or reach out via
            </span>
          </div>

          {/* Contact footnotes direct email and socials */}
          <div className="text-center space-y-6">
            <div className="space-y-1">
              <p className="text-xs text-slate-500 font-light">Prefer email?</p>
              <a 
                href="mailto:hello@rugumaho.com" 
                className="text-primary hover:text-primary/70 inline-block text-lg font-bold transition-all hover:scale-[1.02] active:scale-98 underline decoration-dotted decoration-primary/30 hover:decoration-solid"
              >
                hello@rugumaho.com
              </a>
            </div>

            {/* Flat Outlined Social Row */}
            <div className="flex gap-4 justify-center items-center pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="size-11 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 hover:text-white dark:hover:text-slate-900 hover:bg-slate-900 dark:hover:bg-white hover:border-slate-900 dark:hover:border-white transition-all cursor-pointer hover:scale-110 active:scale-95" 
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="size-11 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 hover:text-white dark:hover:text-slate-900 hover:bg-slate-900 dark:hover:bg-white hover:border-slate-900 dark:hover:border-white transition-all cursor-pointer hover:scale-110 active:scale-95" 
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
