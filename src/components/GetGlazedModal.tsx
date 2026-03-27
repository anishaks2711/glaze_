import { useState } from 'react';
import { X, Pencil, Check, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import donutBg from '@/assets/DonutBg.png';
import { supabase } from '@/lib/supabase';

interface Props {
  freelancerId: string;
  freelancerName: string;
  avatarUrl: string;
  reviewPrompt: string | null;
  onClose: () => void;
}

const DEFAULT_PROMPT =
  "I'd love to hear about your experience working with me! Leave a Glaze and let others know what it was like.";

export function GetGlazedModal({ freelancerId, reviewPrompt, onClose }: Props) {
  const [promptText, setPromptText] = useState(reviewPrompt || DEFAULT_PROMPT);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const savePrompt = async (text: string) => {
    setSaving(true);
    await supabase.from('profiles').update({ review_prompt: text }).eq('id', freelancerId);
    setSaving(false);
  };

  const profileUrl = `${window.location.origin}/profile/${freelancerId}?glaze=1`;

  const handleShare = async () => {
    const shareText = `${promptText}\n\n${profileUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, url: profileUrl });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      {/* Card with DonutBg1 as background */}
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Background image */}
        <img
          src={donutBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0.35 }}
        />
        {/* Background colour fill so card isn't transparent */}
        <div className="absolute inset-0 bg-card" style={{ opacity: 0.55 }} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/20 hover:bg-black/30 transition-colors text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {/* White inner box */}
        <div className="relative z-10 m-5 mt-14 rounded-xl bg-white/90 dark:bg-white/10 backdrop-blur-sm px-4 py-4 space-y-4 shadow">
          {/* Editable prompt */}
          <div>
            <div className="flex items-start gap-2">
              {isEditing ? (
                <textarea
                  autoFocus
                  value={promptText}
                  onChange={e => setPromptText(e.target.value)}
                  maxLength={500}
                  rows={4}
                  className="flex-1 text-sm text-gray-900 dark:text-foreground bg-white/80 rounded-lg px-3 py-2 outline-none resize-none border border-primary"
                />
              ) : (
                <p className="flex-1 text-sm text-gray-900 dark:text-foreground leading-relaxed">{promptText}</p>
              )}
              <button
                onClick={() => {
                  if (isEditing) savePrompt(promptText);
                  setIsEditing(v => !v);
                }}
                disabled={saving}
                className="mt-0.5 p-1.5 rounded-full hover:bg-black/10 transition-colors text-gray-500 hover:text-primary shrink-0"
                aria-label={isEditing ? 'Done editing' : 'Edit message'}
              >
                {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </button>
            </div>
            {isEditing && (
              <p className="text-xs text-gray-400 mt-1 text-right">{promptText.length}/500</p>
            )}
          </div>
        </div>

        {/* Share button outside the white box, inside the card */}
        <div className="relative z-10 px-5 pb-5">
          <Button
            onClick={handleShare}
            className="w-full text-white gap-2"
            style={{ backgroundColor: '#DD5402' }}
          >
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {copied ? 'Copied to clipboard!' : 'Share Glaze Link'}
          </Button>
        </div>
      </div>
    </div>
  );
}
