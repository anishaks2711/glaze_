import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import donutBg from '@/assets/DonutBg.png';

interface Props {
  freelancerName: string;
  avatarUrl: string;
  reviewPrompt: string | null;
  isLoggedIn: boolean;
  canGlaze: boolean;
  onClose: () => void;
  onGlaze: () => void;
}

export function GlazeInviteModal({
  freelancerName,
  reviewPrompt,
  isLoggedIn,
  canGlaze,
  onClose,
  onGlaze,
}: Props) {
  const prompt =
    reviewPrompt ||
    `${freelancerName} wants your honest feedback! Leave a Glaze and share your experience.`;

  const buttonLabel = !isLoggedIn
    ? 'Sign in to Glaze'
    : !canGlaze
    ? 'Clients can leave Glazes'
    : 'Leave a Glaze';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
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
        <div className="absolute inset-0 bg-card" style={{ opacity: 0.55 }} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/20 hover:bg-black/30 transition-colors text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Title */}
        <div className="relative z-10 px-5 mt-14 mb-3">
          <p className="text-white font-heading font-bold text-lg leading-snug drop-shadow">
            {freelancerName} is requesting a Glaze
          </p>
        </div>

        {/* White inner box */}
        <div className="relative z-10 mx-5 rounded-xl bg-white/90 dark:bg-white/10 backdrop-blur-sm px-4 py-4 shadow">
          <p className="text-sm text-gray-900 dark:text-foreground leading-relaxed">{prompt}</p>
        </div>

        {/* Glaze button */}
        <div className="relative z-10 px-5 pt-3 pb-6">
          <Button
            onClick={onGlaze}
            className="w-full text-white"
            style={{ backgroundColor: '#DD5402' }}
            disabled={isLoggedIn && !canGlaze}
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
