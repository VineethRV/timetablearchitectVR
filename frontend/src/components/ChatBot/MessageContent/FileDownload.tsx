import React from 'react';
import { FileDown } from 'lucide-react';

interface FileDownloadProps {
  fileName: string;
  fileUrl: string;
}

export const FileDownload: React.FC<FileDownloadProps> = ({ fileName, fileUrl }) => {
  return (
    <a
      href={fileUrl}
      download={fileName}
      className="inline-flex items-center gap-2 px-4 py-2 mt-2 text-sm bg-white border border-green-200 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
    >
      <FileDown size={16} />
      <span>Download {fileName}</span>
    </a>
  );
};