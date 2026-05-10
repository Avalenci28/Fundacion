import React from "react";

type Props = { className?: string };

export default function SocialLinks({ className = "" }: Props) {
  const FB = process.env.NEXT_PUBLIC_SOCIAL_FB || "https://www.facebook.com/Malambosonrie";
  const IG = process.env.NEXT_PUBLIC_SOCIAL_IG || "https://www.instagram.com/malambosonrie?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a href={FB} target="_blank" rel="noopener noreferrer" aria-label="Fundación Malambo Sonríe en Facebook" className="text-gray-700 hover:text-pink-500 transition">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.09 5.66 21.22 10.44 22v-7.02H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.61.77-1.61 1.56v1.88h2.74l-.44 2.9h-2.3V22C18.34 21.22 22 17.09 22 12.07z" />
        </svg>
      </a>

      <a href={IG} target="_blank" rel="noopener noreferrer" aria-label="Fundación Malambo Sonríe en Instagram" className="text-gray-700 hover:text-pink-500 transition">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.2A4.8 4.8 0 1 0 16.8 13 4.8 4.8 0 0 0 12 8.2zm6.4-2.6a1.12 1.12 0 1 1-1.12 1.12A1.12 1.12 0 0 1 18.4 5.6zM12 10.6A1.4 1.4 0 1 1 10.6 12 1.4 1.4 0 0 1 12 10.6z" />
        </svg>
      </a>
    </div>
  );
}