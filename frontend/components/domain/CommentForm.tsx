"use client";

import { useState } from "react";
import { createComment } from "@/lib/api";
import type { CommentInfo } from "@/types/application";

interface CommentFormProps {
  applicationId: string;
  onCommentAdded: (comment: CommentInfo) => void;
}

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000001";
const MAX_LENGTH = 250;

export function CommentForm({ applicationId, onCommentAdded }: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || comment.length > MAX_LENGTH) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const newComment = await createComment(applicationId, DEFAULT_USER_ID, comment.trim());
      if (newComment) {
        setComment("");
        setSuccess(true);
        onCommentAdded(newComment);
        // Reset success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Failed to post comment. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mb-8 rounded-lg border-2 border-primary/10 bg-white p-5 shadow-sm">
      <h2 className="font-heading text-base font-semibold text-primary mb-4">
        Add Officer Comment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="comment" className="sr-only">
            Comment
          </label>
          <textarea
            id="comment"
            rows={3}
            className={`w-full rounded-md border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 ${
              error ? "border-red-500" : "border-border"
            }`}
            placeholder="Write your feedback here..."
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (error) setError(null);
            }}
            disabled={isSubmitting}
            maxLength={MAX_LENGTH}
            required
          />
          <div className="mt-1 flex justify-between items-center">
            <p className={`text-xs ${comment.length > MAX_LENGTH ? "text-red-500" : "text-secondary"}`}>
              {comment.length} / {MAX_LENGTH} characters
            </p>
            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
            {success && <p className="text-xs text-green-600 font-medium">Comment posted successfully!</p>}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim() || comment.length > MAX_LENGTH}
            className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
