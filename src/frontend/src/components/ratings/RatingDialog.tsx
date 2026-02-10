import { useState } from 'react';
import { useAddRating } from '../../hooks/useRatings';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: bigint;
  helperPrincipal: Principal;
  onSuccess?: () => void;
}

export default function RatingDialog({ open, onOpenChange, requestId, helperPrincipal, onSuccess }: RatingDialogProps) {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredScore, setHoveredScore] = useState(0);
  const addRatingMutation = useAddRating();

  const handleSubmit = async () => {
    try {
      await addRatingMutation.mutateAsync({
        requestId,
        helperUser: helperPrincipal,
        score: BigInt(score),
        comment,
      });
      toast.success('Rating submitted successfully!');
      onOpenChange(false);
      setScore(5);
      setComment('');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate Helper</DialogTitle>
          <DialogDescription>Share your experience with this helper</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setScore(star)}
                  onMouseEnter={() => setHoveredScore(star)}
                  onMouseLeave={() => setHoveredScore(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredScore || score)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={addRatingMutation.isPending}>
            Submit Rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
