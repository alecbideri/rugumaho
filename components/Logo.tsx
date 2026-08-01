"use client";

import React from "react";

interface LogoProps {
  className?: string;
  animate?: boolean;
}

export default function Logo({ className = "h-10 w-auto", animate = false }: LogoProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 540 100" 
      className={`${className} text-slate-900 dark:text-white`}
    >
      <defs>
        {/* Import Google Serif Font inside SVG defs */}
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
            .brand-title-svg {
              font-family: 'Playfair Display', 'Times New Roman', Georgia, serif;
              font-size: 42px;
              font-weight: 750;
              fill: currentColor;
              letter-spacing: 6px;
            }
            .svg-nib {
              transform-origin: 42px 54px;
            }
            .animate-nib-writing {
              animation: nib-write 2.5s ease-in-out infinite alternate;
            }
            @keyframes nib-write {
              0% {
                transform: rotate(0deg) translate(0, 0);
              }
              50% {
                transform: rotate(-4deg) translate(-2px, 1px);
              }
              100% {
                transform: rotate(4deg) translate(2px, -1px);
              }
            }
          `}
        </style>
      </defs>

      <g transform="translate(10, 0)">
        {/* Minimalist Fountain Pen Nib Icon with optional writing animation */}
        <g transform="translate(15, 8)" className={`svg-nib ${animate ? "animate-nib-writing" : ""}`}>
          {/* Nib Body */}
          <path d="M 25 74 C 25 58 38 46 42 22 C 46 46 59 58 59 74 L 59 86 L 25 86 Z" fill="currentColor" />
          {/* White details mapping to background cutout */}
          <circle cx="42" cy="62" r="3.5" fill="#f6f8f8" className="dark:fill-slate-900" />
          <line x1="42" y1="22" x2="42" y2="58.5" stroke="#f6f8f8" strokeWidth="1.8" className="dark:stroke-slate-900" />
          <path d="M 32 86 L 32 72 C 32 67 35 63 40 63" stroke="#f6f8f8" strokeWidth="1.2" fill="none" className="dark:stroke-slate-900" />
          <path d="M 52 86 L 52 72 C 52 67 49 63 44 63" stroke="#f6f8f8" strokeWidth="1.2" fill="none" className="dark:stroke-slate-900" />
          {/* Base Ring */}
          <rect x="22" y="86" width="40" height="4" rx="2" fill="currentColor" />
        </g>

        {/* Wordmark text 'RUGUMAHO' */}
        <text x="105" y="76" className="brand-title-svg">RUGUMAHO</text>
      </g>
    </svg>
  );
}
