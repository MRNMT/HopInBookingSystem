import React, { useState } from 'react';
import { FaShare, FaFacebook, FaTwitter, FaWhatsapp, FaEnvelope, FaLink, FaCheck } from 'react-icons/fa';
import { Button } from './Button';

interface ShareButtonProps {
  accommodation: {
    name: string;
    address: string;
    city: string;
    country: string;
    id: string;
  };
}

export const ShareButton: React.FC<ShareButtonProps> = ({ accommodation }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/booking?accommodation=${accommodation.id}`;
  const shareText = `Check out ${accommodation.name} in ${accommodation.city}, ${accommodation.country} on HopIn!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowShareMenu(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowShareMenu(false);
      }, 2000);
    }
  };

  const handleNativeShare = async () => {
    if ('share' in navigator && navigator.share) {
      try {
        await navigator.share({
          title: accommodation.name,
          text: shareText,
          url: shareUrl,
        });
        setShowShareMenu(false);
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed');
      }
    }
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(url, '_blank');
    setShowShareMenu(false);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out ${accommodation.name}`);
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowShareMenu(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="flex items-center gap-2"
      >
        <FaShare className="text-sm" />
        Share
      </Button>

      {showShareMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowShareMenu(false)}
          />

          {/* Share Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
            <div className="p-2">
              {/* Native Share (if available) */}
              {'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                >
                  <FaShare className="text-blue-600" />
                  <span className="font-medium">Share via...</span>
                </button>
              )}

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
              >
                {copied ? (
                  <>
                    <FaCheck className="text-green-600" />
                    <span className="font-medium text-green-600">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <FaLink className="text-blue-600" />
                    <span className="font-medium">Copy Link</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="border-t border-gray-100 my-1" />

              {/* Social Media Options */}
              <button
                onClick={shareToFacebook}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 rounded-lg transition-colors text-gray-700"
              >
                <FaFacebook className="text-blue-600" />
                <span className="font-medium">Facebook</span>
              </button>

              <button
                onClick={shareToTwitter}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 rounded-lg transition-colors text-gray-700"
              >
                <FaTwitter className="text-blue-400" />
                <span className="font-medium">Twitter</span>
              </button>

              <button
                onClick={shareToWhatsApp}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-green-50 rounded-lg transition-colors text-gray-700"
              >
                <FaWhatsapp className="text-green-600" />
                <span className="font-medium">WhatsApp</span>
              </button>

              <button
                onClick={shareViaEmail}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
              >
                <FaEnvelope className="text-gray-600" />
                <span className="font-medium">Email</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

