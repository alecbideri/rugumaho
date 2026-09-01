"use client";

import Link from "next/link";
import { ShieldCheck, Lightbulb, Users } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ImageWithPlaceholder from "../../components/ImageWithPlaceholder";

export default function AboutPage() {
  return (
    <div className="dot-grid min-h-screen bg-[#f6f8f8] font-display text-slate-900 transition-colors duration-200 flex flex-col">
      <title>About Rugumaho</title>
      <meta name="description" content="Read the story behind Rugumaho—curated reflections on slow living, travel, motherhood, and intentional practices." />
      <meta property="og:title" content="About Rugumaho" />
      <meta property="og:description" content="Read the story behind Rugumaho—curated reflections on slow living, travel, motherhood, and intentional practices." />
      <link rel="canonical" href="https://rugumaho.com/about" />
      
      {/* JSON-LD Person Schema for Creator Profile Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Ariane Rugumaho",
            "url": "https://rugumaho.com/about",
            "image": "https://rugumaho.com/profile.png",
            "sameAs": [
              "https://instagram.com/rugumaho"
            ],
            "jobTitle": "Author & Creator",
            "worksFor": {
              "@type": "Organization",
              "name": "Rugumaho"
            }
          })
        }}
      />
      
      <Navbar />

      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 flex-grow space-y-24">

        {/* Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Portrait image */}
          <div className="relative aspect-square max-w-md mx-auto w-full overflow-hidden rounded-xl shadow-2xl border border-slate-100 bg-white">
            <ImageWithPlaceholder
              src="/profile.png"
              alt="Ariane Rugumaho portrait"
              containerClassName="w-full h-full"
              className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-102"
            />
          </div>

          {/* Right Column: Biography content */}
          <div className="flex flex-col justify-center">
            <div className="w-12 h-1 bg-primary mb-4"></div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary mb-6">Meet the Founder</span>
            <div className="text-slate-600 leading-relaxed text-base space-y-6 font-light">
              <p>
                Ikaze! I’m Rugumaho. My name means &ldquo;it remains present.&rdquo; In Rwandan culture, a name reflects who we are. Mine is a daily reminder to move through life with intention and stay rooted in the present.
              </p>
              <p>
                I am guided by Ubuntu, an African concept that means &ldquo;I am because you are.&rdquo; It reminds me that we are deeply connected and that each of us is shaped by the wider community around us.
              </p>
              
              <div className="pt-2">
                <h3 className="font-serif font-bold text-lg text-slate-800 mb-3">What Inspires Me</h3>
                <ul className="space-y-2.5 list-none pl-0">
                  <li className="flex items-start gap-2 text-slate-600">
                    <span className="text-primary font-bold text-base">&bull;</span>
                    <span><strong>People:</strong> the relationships and communities that shape who we are.</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <span className="text-primary font-bold text-base">&bull;</span>
                    <span><strong>Places:</strong> the journeys and experiences that broaden our perspective.</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <span className="text-primary font-bold text-base">&bull;</span>
                    <span><strong>Playlists:</strong> the sounds that hold memories, meaning, and emotion.</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <span className="text-primary font-bold text-base">&bull;</span>
                    <span><strong>Plates:</strong> the foods and flavours that bring people together.</span>
                  </li>
                </ul>
              </div>

              <p className="pt-2">
                I hope the stories you find here resonate with you, offer moments of reflection, and add meaningful value to your life.
              </p>

              <span className="font-serif italic text-lg text-slate-850 mt-4 block">
                With love,<br/>
                Rugumaho
              </span>
            </div>
          </div>
        </section>

        {/* Mission Quote Card */}
        <section className="max-w-3xl mx-auto w-full px-2">
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-8 md:p-12 text-center relative shadow-sm">
            <blockquote className="font-serif text-2xl sm:text-3xl italic text-slate-800 leading-relaxed max-w-2xl mx-auto">
              &ldquo;I aim to encourage purposeful living through authentic storytelling and community-rooted inspiration.&rdquo;
            </blockquote>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h3 className="font-serif text-3xl font-bold text-slate-900">My Core Values</h3>
            <p className="text-slate-500 font-light mt-2">The principles that guide our stories and daily choices.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1: Authenticity */}
            <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-350">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl font-bold text-slate-900 mb-3">Authenticity</h4>
              <p className="text-slate-500 font-light text-sm leading-relaxed">
                sharing honest stories and reflections rooted in lived experience.
              </p>
            </div>

            {/* Value 2: Inspiration */}
            <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-350">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-6">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl font-bold text-slate-900 mb-3">Inspiration</h4>
              <p className="text-slate-500 font-light text-sm leading-relaxed">
                encouraging purposeful, heart-led living through meaningful ideas and moments.
              </p>
            </div>

            {/* Value 3: Community */}
            <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-350">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl font-bold text-slate-900 mb-3">Community</h4>
              <p className="text-slate-500 font-light text-sm leading-relaxed">
                creating spaces for connection, learning, and shared growth.
              </p>
            </div>
          </div>
        </section>

        {/* Connection block */}
        <section className="text-center space-y-6 pt-12 border-t border-slate-100">
          <h3 className="font-serif text-3xl font-bold text-slate-900">Want to connect?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="bg-primary text-white dark:text-slate-955 px-8 py-3.5 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
            >
              Get in Touch
            </Link>
            <Link
              href="/category/all"
              className="border border-slate-200 hover:border-primary hover:text-primary px-8 py-3.5 rounded-lg text-sm font-bold transition-all bg-white"
            >
              Read the Journal
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
