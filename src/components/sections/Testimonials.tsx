import React from 'react';
import { Quote } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  image?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'John Doe',
    role: 'CTO',
    company: 'Tech Company',
    content:
      'Robel is an exceptional engineer who consistently delivers high-quality solutions. His expertise in distributed systems and microservices architecture has been invaluable to our team.',
  },
  {
    name: 'Jane Smith',
    role: 'Engineering Manager',
    company: 'Healthcare Startup',
    content:
      'Working with Robel was a game-changer for our project. His deep understanding of scalable systems and ability to mentor junior developers made a significant impact.',
  },
  // Add more testimonials as needed
];

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials">
      <SectionHeader title="Client Testimonials" icon={Quote} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TESTIMONIALS.map((testimonial, idx) => (
          <div
            key={idx}
            className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 p-6 shadow-sm dark:shadow-none relative"
          >
            <Quote className="absolute top-4 right-4 w-8 h-8 text-zinc-200 dark:text-zinc-800" />
            <div className="relative z-10">
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4 italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                  <span className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
