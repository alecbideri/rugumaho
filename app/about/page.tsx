"use client";

import Link from "next/link";
import { ShieldCheck, Lightbulb, Users } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AboutPage() {
  return (
    <div className="dot-grid min-h-screen bg-[#f6f8f8] font-display text-slate-900 transition-colors duration-200 flex flex-col">
      <Navbar />

      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 flex-grow space-y-24">

        {/* Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Portrait image */}
          <div className="relative aspect-[3/4] max-w-md mx-auto w-full overflow-hidden rounded-xl shadow-2xl border border-slate-100 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/profile.jpg"
              alt="Ariane Rugumaho portrait"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
            />
          </div>

          {/* Right Column: Biography content */}
          <div className="flex flex-col justify-center">
            <div className="w-12 h-1 bg-primary mb-4"></div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary mb-2">Meet the Founder</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              The Story Behind Rugumaho
            </h2>
            <div className="text-slate-600 leading-relaxed text-base space-y-6 font-light">
              <p>
                My journey began with a simple idea: to celebrate authentic human connection in a world that often feels disconnected. &ldquo;Rugumaho&rdquo; means to endure and remain present, but for me, it represents the intentionality behind every shared story and handcrafted detail.
              </p>
              <p>
                What started as a personal journal has blossomed into a collective dedicated to mindful living. I believe that the objects I surround myself with and the stories I tell shape the essence of my daily life.
              </p>
              <p>
                Through this space, I invite you to explore the beauty of the slow and the meaningful. Every piece of content, every curated item, is a reflection of my passion for purpose-driven, heart-led living.
              </p>

              <span className="font-serif italic text-lg text-slate-800 mt-6 block">
                &mdash; Ariane Rugumaho
              </span>
            </div>
          </div>
        </section>

        {/* Mission Quote Card */}
        <section className="max-w-3xl mx-auto w-full px-2">
          <div className="bg-[#F0FBFF]/70 backdrop-blur-md border border-primary/20 rounded-xl p-8 md:p-12 text-center relative shadow-sm shadow-primary/5">
            <span className="text-primary text-6xl font-serif leading-none mb-4 block select-none">&ldquo;</span>
            <blockquote className="font-serif text-2xl sm:text-3xl italic text-slate-800 leading-relaxed max-w-2xl mx-auto">
              To inspire meaningful lives through the power of authentic storytelling and community-driven inspiration, fostering a global culture of intentionality.
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
                I believe in being true to ourselves and our community, honoring real stories over fleeting trends.
              </p>
            </div>

            {/* Value 2: Inspiration */}
            <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-350">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-6">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl font-bold text-slate-900 mb-3">Inspiration</h4>
              <p className="text-slate-500 font-light text-sm leading-relaxed">
                Sparking curiosity and encouraging a more intentional, thoughtful approach to daily life and personal creativity.
              </p>
            </div>

            {/* Value 3: Community */}
            <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-350">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl font-bold text-slate-900 mb-3">Community</h4>
              <p className="text-slate-500 font-light text-sm leading-relaxed">
                Fostering warm spaces where individuals can connect, share meaningful conversations, and grow together.
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
              className="bg-primary text-slate-950 px-8 py-3.5 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-95 transition-all"
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
