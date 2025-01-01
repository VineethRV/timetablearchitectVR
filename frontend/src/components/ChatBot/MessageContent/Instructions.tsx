import React from "react";
import { FileDownloadMessage, LinkButtonMessage, TextMessage } from "../types";
import { LinkButton } from "./LinkButton";
import { FileDownload } from "./FileDownload";

interface InstructionsProps {
  title: string;
  steps: (TextMessage | LinkButtonMessage | FileDownloadMessage)[];
}

export const Instructions: React.FC<InstructionsProps> = ({ title, steps }) => {
  console.log(steps);
  return (
    <div>
      <h4 className="font-medium text-base mb-2 text-center capitalize">{title}</h4>
    <div className="mt-2 bg-gray-50 rounded-lg p-3">
      <ol className="space-y-4 list-decimal list-inside">
        {steps.map((step) => {
          switch (step.type) {
        case "text":
          return (
            <div key={step.id}>
          <li className="text-sm text-gray-700">
            {step.text}
          </li>
            </div>
          );
        case "link":
          return (
            <div key={step.id}>
          <li className="text-sm font-medium text-gray-700">
            {step.text}
          </li>
          <LinkButton url={step.url} buttonText={step.text} />
            </div>
          );
        case "file":
          return (
            <div key={step.id}>
          <li className="text-sm text-gray-700">
            {step.text}
          </li>
          <FileDownload
            fileName={step.fileName}
            fileUrl={step.fileUrl}
          />
            </div>
          );
        default:
          return null;
          }
        })}
      </ol>
    </div>
    </div>
  );
};
