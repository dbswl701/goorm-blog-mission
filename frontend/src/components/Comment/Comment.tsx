import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useGetComments } from '@hooks/useGetComments';
import { usePostComment } from '@hooks/usePostComment';
import styles from './Comment.module.scss';

interface CommentSectionProps {
	postId: string;
}

const Comment: React.FC<CommentSectionProps> = ({ postId }) => {
	const [newComment, setNewComment] = useState('');

	const { data: comments, isLoading, error } = useGetComments(postId);
	const { mutate, isPending: isSubmitting } = usePostComment();

	const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!newComment.trim()) return;
		setNewComment('');
		mutate({ postId, content: newComment });
	};

	return (
		<div className={styles.commentContainer}>
			<h4 className={styles.commentHeader}>
				{comments?.length || 0}개의 댓글
			</h4>

			{/* 댓글 입력 폼 */}
			<form
				onSubmit={handleCommentSubmit}
				className={styles.commentInputWrapper}
			>
				<textarea
					className={styles.commentInput}
					placeholder="댓글을 작성하세요"
					value={newComment}
					onChange={(e) => setNewComment(e.target.value)}
					aria-label="댓글 입력"
				/>
				<div className={styles.commentButtonWrapper}>
					<button
						type="submit"
						className={styles.commentButton}
						disabled={!newComment.trim() || isSubmitting}
					>
						{isSubmitting ? '작성 중...' : '댓글 작성'}
					</button>
				</div>
			</form>

			{/* 댓글 리스트 */}
			<ul className={styles.commentList}>
				{comments?.map((comment) => (
					<li key={comment.id} className={styles.commentItem}>
						<FaUserCircle size={32} />
						<article>
							<div className={styles.commentAuthor}>
								{comment.author}
							</div>
							<p className={styles.commentContent}>
								{comment.content}
							</p>
							<small>
								{new Date(comment.createdAt).toLocaleString()}
							</small>
						</article>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Comment;
