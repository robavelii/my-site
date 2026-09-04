import React from 'react';
import { Award } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Badge } from '../ui/Badge';

interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  link?: string;
}

const CERTIFICATIONS: Certification[] = [
  {
    name: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    date: '2024',
    credentialId: 'XXXXX-XXXXX',
  },
  {
    name: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'Cloud Native Computing Foundation',
    date: '2023',
    credentialId: 'XXXXX-XXXXX',
  },
  // Add more certifications as needed
];

export const Certifications: React.FC = () => {
  return (
    <section id="certifications">
      <SectionHeader title="Certifications & Credentials" icon={Award} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CERTIFICATIONS.map((cert, idx) => (
          <div
            key={idx}
            className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 p-6 shadow-sm dark:shadow-none hover:shadow-md dark:hover:border-zinc-700 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                <Award className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{cert.name}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{cert.issuer}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 text-xs">
                    {cert.date}
                  </Badge>
                  {cert.credentialId && (
                    <span className="text-xs font-mono text-zinc-500">ID: {cert.credentialId}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
