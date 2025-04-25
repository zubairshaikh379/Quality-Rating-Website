'use client';

import React, { useRef } from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function ContactPage() {
  const containerRef = useRef(null);
  const router = useRouter(); // Initialize the router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formData = {
      name: (e.target as any).name.value,
      email: (e.target as any).email.value,
      message: (e.target as any).message.value,
    };
  
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const result = await res.json();
  
      if (res.ok) {
        alert('✅ Message sent successfully!');
      } else {
        alert('❌ Failed to send message: ' + result.message);
      }
    } catch (err) {
      alert('❌ An error occurred while sending the message.');
      console.error(err);
    }
  };

  // Function to navigate to the Home page
  const navigateHome = () => {
    router.push('/'); // This will take the user to the Home page
  };

  return (
    <main className="min-h-screen bg-[#fdf6f0] dark:bg-zinc-900 text-black dark:text-white px-4 py-10 flex items-center justify-center">
      <div
        ref={containerRef}
        className="max-w-2xl w-full bg-white dark:bg-black p-8 rounded-2xl shadow-2xl transition duration-500 hover:shadow-green-500/20"
      >
        <h1 className="text-3xl font-bold text-center mb-6">📬 Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Reach Out</h2>

            <div className="flex items-center gap-3 hover:text-blue-600 transition">
              <Mail className="w-5 h-5" />
              <a
                href="mailto:qualpredcomp37@gmail.com"
                className="underline"
              >
                qualpredcomp37@gmail.com
              </a>
            </div>

            <div className="flex items-center gap-3 hover:text-green-600 transition">
              <MessageCircle className="w-5 h-5" />
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="flex items-center gap-3 hover:text-emerald-600 transition">
              <Phone className="w-5 h-5" />
              <a href="tel:+919999999999" className="underline">
                +91 99999 99999
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="name" type="text" placeholder="Your Name" required />
            <Input name="email" type="email" placeholder="Your Email" required />
            <Textarea name="message" placeholder="Your Message" rows={5} required />
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </div>

        {/* Home Button */}
        <div className="mt-6 text-center">
          <Button onClick={navigateHome} className="w-full">
            Go to Home
          </Button>
        </div>
      </div>
    </main>
  );
}
