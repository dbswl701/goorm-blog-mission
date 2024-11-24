import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUserCircle } from 'react-icons/fa';
import { useGetComments } from '@hooks/useGetComments';
import { usePostComment } from '@hooks/usePostComment';

interface CommentSectionProps {
	postId: string;
}

const Container = styled.div`
	margin-top: 2rem;
`;

const CommentHeader = styled.h4`
	margin-bottom: 1rem;
	font-weight: bold;
`;

const CommentInput = styled.textarea`
	width: 100%;
	height: 4rem;
	padding: 0.5rem;
	margin-bottom: 1rem;
	border: 1px solid #dee2e6;
	border-radius: 4px;
	resize: none;
	font-size: 1rem;
	outline: none;
`;

const CommentButton = styled.button`
	background-color: var(--color-primary);
	color: white;
	padding: 0.5rem 1rem;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	margin-bottom: 1.5rem;

	&:hover {
		background-color: var(--color-primary-hover);
	}

	&:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}
`;

const CommentList = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
`;

const CommentItem = styled.li`
	display: flex;
	align-items: flex-start;
	gap: 1rem;
	padding: 0.5rem 0;
	border-bottom: 1px solid #f1f3f5;

	.comment-author {
		font-weight: bold;
	}

	.comment-content {
		white-space: pre-wrap;
		word-wrap: break-word;
	}
`;

const CommentInputWrapper = styled.form`
	display: flex;
	flex-direction: column;
`;

const CommentButtonWrapper = styled.div`
	display: flex;
	justify-content: flex-end;
`;

const Comment: React.FC<CommentSectionProps> = ({ postId }) => {
	const [newComment, setNewComment] = useState('');

	const { data: comments, isLoading, error } = useGetComments(postId);
	const { mutate, isPending: isSubmitting } = usePostComment();

	const handleCommentSubmit = async () => {
		if (!newComment.trim()) return;
		setNewComment('');
		mutate({ postId, content: newComment });
	};

	return (
		<Container>
			<CommentHeader>{comments?.length}개의 댓글</CommentHeader>

			{/* 댓글 입력 폼 */}
			<CommentInputWrapper onSubmit={handleCommentSubmit}>
				<CommentInput
					placeholder="댓글을 작성하세요"
					value={newComment}
					onChange={(e) => setNewComment(e.target.value)}
				/>
				<CommentButtonWrapper>
					<CommentButton
						type="submit"
						disabled={!newComment.trim() || isSubmitting}
						// disabled={!newComment.trim()}
					>
						{isSubmitting ? '작성 중...' : '댓글 작성'}
					</CommentButton>
				</CommentButtonWrapper>
			</CommentInputWrapper>

			{/* 댓글 리스트 */}
			<CommentList>
				{comments?.map((comment) => (
					<CommentItem key={comment.id}>
						<FaUserCircle size={32} />
						<div>
							<div className="comment-author">
								{comment.author}
							</div>
							<div className="comment-content">
								{comment.content}
							</div>
							<small>
								{new Date(comment.createdAt).toLocaleString()}
							</small>
						</div>
					</CommentItem>
				))}
			</CommentList>
		</Container>
	);
};

export default Comment;
