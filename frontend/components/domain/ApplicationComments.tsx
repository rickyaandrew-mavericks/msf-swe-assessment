"use client";

import { useState } from "react";
import { CommentForm } from "./CommentForm";
import type { CommentInfo } from "@/types/application";

interface ApplicationCommentsProps {
  applicationId: string;
  initialComments: CommentInfo[];
}

export function ApplicationComments({ applicationId, initialComments }: ApplicationCommentsProps) {
  const [comments, setComments] = useState<CommentInfo[]>(initialComments);

  const handleCommentAdded = (newComment: CommentInfo) => {
    // Newest first
    setComments([newComment, ...comments]);
  };

  return (
    <>
      <CommentForm applicationId={applicationId} onCommentAdded={handleCommentAdded} />
      <section aria-labelledby="comments-heading" className="mb-8">
        <h2 id="comments-heading" className="sr-only">Officer Comments</h2>
        <div className="flex flex-col gap-4">
          {comments.length === 0 ? (
            <div className="mb-6 rounded-lg border border-dashed border-border bg-muted/30 px-5 py-6 text-center">
              <p className="text-sm text-secondary">
                No officer comments yet. Once reviewed, feedback will appear here.
              </p>
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="rounded-lg border-2 border-accent/20 bg-white shadow-sm overflow-hidden">
                <div className="bg-accent/5 px-4 py-2 border-b border-accent/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">{c.officer.name}</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      c.officer.role === "admin" ? "bg-purple-100 text-purple-700" :
                      c.officer.role === "officer" ? "bg-blue-100 text-blue-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {c.officer.role}
                    </span>
                  </div>
                  <time className="text-xs font-medium text-secondary">
                    {new Date(c.createdAt).toLocaleString("en-SG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <div className="px-4 py-3 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {c.comment}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
