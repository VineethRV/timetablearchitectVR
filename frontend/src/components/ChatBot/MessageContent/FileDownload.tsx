import React from "react";
import { FileDown } from "lucide-react";
import { WEBSITE_URL } from "../../../../config";

interface FileDownloadProps {
  fileName: string; // Name of the file to be displayed
  fileUrl: string;  // URL to navigate or download from
}

export const FileDownload: React.FC<FileDownloadProps> = ({
  fileName,
  fileUrl,
}) => {
  const file_url = `${WEBSITE_URL}/templates/${fileName}`
  console.log(fileUrl)
  return (
    <a
      href={file_url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 mt-2 text-sm bg-white border border-blue-200 rounded-lg hover:bg-blue-50 text-green-600 transition-colors"
    >
      <FileDown size={16} />
      <span>Download {fileName}</span>
    </a>
  );
};
