'use client'

import { useState, FormEvent } from 'react'
import { Star } from 'lucide-react'
import { useUser } from '@/context/UserContext'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'

interface WriteReviewProps {
  productId: string
  productName: string
}

export function WriteReview({ productId, productName }: WriteReviewProps) {
  const { user } = useUser()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [hasImage, setHasImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!user) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (isSubmitting || submitted) return
    if (rating === 0) {
      toast('Please select a star rating.', 'error')
      return
    }
    setIsSubmitting(true)
    try {
      await fetch('/api/gameball/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user!.playerId,
          events: {
            write_review: {
              has_image: hasImage ? 'true' : 'false',
              product_id: productId,
              rating: String(rating),
            },
          },
        }),
      })
      setSubmitted(true)
      toast('Thanks for your review! Points may be awarded.')
    } catch {
      toast('Could not submit review. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-navy-800 border border-green-700 rounded-xl p-6 text-center">
        <p className="text-green-400 font-semibold text-lg">✓ Review submitted!</p>
        <p className="text-navy-500 text-sm mt-1">
          Thank you for reviewing {productName}. Loyalty points may be awarded to your account.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-6">
      <h3 className="font-display text-xl text-white mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-colors"
              >
                <Star
                  size={28}
                  className={
                    star <= (hoveredRating || rating)
                      ? 'text-gold-500 fill-gold-500'
                      : 'text-navy-600'
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* Review text */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1.5">
            Your Review
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            placeholder="Share your thoughts on this product..."
            className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white placeholder-navy-500 focus:outline-none focus:border-gold-500 transition-colors resize-none"
          />
        </div>

        {/* Has Image checkbox */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={hasImage}
              onChange={(e) => setHasImage(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${
                hasImage
                  ? 'bg-gold-500 border-gold-500'
                  : 'bg-navy-900 border-navy-600 group-hover:border-gold-500'
              }`}
            >
              {hasImage && (
                <svg className="w-3 h-3 text-navy-900" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-white/80">
            I&apos;m attaching an image with my review
          </span>
          <span className="text-xs text-gold-500 font-medium ml-auto">+Extra Points</span>
        </label>

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </div>
  )
}
