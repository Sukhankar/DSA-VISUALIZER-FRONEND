import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { userActivityService } from '../../api/userActivityService';
import { Star } from 'lucide-react';

interface FavoriteButtonProps {
  algorithmSlug: string;
  initialFavorite?: boolean;
  onChange?: (isFav: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'icon';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  algorithmSlug,
  initialFavorite = false,
  onChange,
  size = 'md',
  variant = 'button',
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isFavorite, setIsFavorite] = useState<boolean>(initialFavorite);
  const [isPending, setIsPending] = useState<boolean>(false);

  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isPending) return;

    const previousState = isFavorite;
    const newState = !previousState;

    // Optimistic UI update
    setIsFavorite(newState);
    if (onChange) onChange(newState);
    setIsPending(true);

    try {
      if (newState) {
        await userActivityService.addFavorite(algorithmSlug);
      } else {
        await userActivityService.removeFavorite(algorithmSlug);
      }
    } catch (err) {
      // Revert on failure
      console.warn('Failed to update favorite status:', err);
      setIsFavorite(previousState);
      if (onChange) onChange(previousState);
    } finally {
      setIsPending(false);
    }
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        disabled={isPending}
        title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        className={`p-2 rounded-lg border transition-all cursor-pointer ${
          isFavorite
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
        } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
      >
        <Star className={`${iconSizes[size]} ${isFavorite ? 'fill-amber-400' : ''}`} />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
        isFavorite
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
      } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
    >
      <Star className={`${iconSizes[size]} ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
      <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
    </button>
  );
};
