"use client";

interface PreviewProps {
  model?: string;
}

const Preview = ({ model = "" }: PreviewProps) => {
  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: model }}
    />
  );
};

export default Preview;
