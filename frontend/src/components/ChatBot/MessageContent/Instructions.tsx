import React from 'react';

interface InstructionsProps {
  title: string;
  steps: string[];
}

export const Instructions: React.FC<InstructionsProps> = ({ title, steps }) => {
  return (
    <div className="mt-2 bg-gray-50 rounded-lg p-3">
      <h4 className="font-medium text-sm mb-2">{title}</h4>
      <ul className="space-y-1">
        {steps.map((step, index) => (
          <li key={index} className="text-sm text-gray-700">{step}</li>
        ))}
      </ul>
    </div>
  );
};