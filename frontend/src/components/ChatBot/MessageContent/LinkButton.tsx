import React from 'react';
import { ExternalLink } from 'lucide-react';

interface LinkButtonProps {
  url: string;
  buttonText: string;
}

export const LinkButton: React.FC<LinkButtonProps> = ({ url, buttonText }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 mt-2 text-sm bg-white border border-blue-200 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
    >
      <span>{buttonText}</span>
      <ExternalLink size={16} />
    </a>
  );
};