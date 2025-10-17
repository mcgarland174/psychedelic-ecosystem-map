'use client';

interface AirtableEmbedProps {
  baseId: string;
  viewId?: string;
}

export default function AirtableEmbed({ baseId, viewId }: AirtableEmbedProps) {
  const embedUrl = viewId
    ? `https://airtable.com/embed/${baseId}/${viewId}`
    : `https://airtable.com/embed/${baseId}`;

  return (
    <div className="w-full h-full">
      <iframe
        className="airtable-embed w-full h-full"
        src={embedUrl}
        frameBorder="0"
        width="100%"
        height="100%"
        style={{ background: 'transparent', border: '1px solid #ccc' }}
      />
    </div>
  );
}
