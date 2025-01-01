import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import remarkBreaks from 'remark-breaks';
import MDEditor from '@uiw/react-md-editor';
import { formatDate } from 'utils/formatDate';
import styles from './Post.module.scss';
import { useLikePost } from '@hooks/usePostLike';
import 'App.css';
import styled from 'styled-components';

interface IProps {
	id: string;
	title: string;
	contents: string;
	author: string;
	createdAt: string;
	likeCount: number;
	isLikedByUser: boolean;
	handleDeleteClick: () => void;
	username: string;
}

const StyledEditor = styled(MDEditor)`
	margin-top: 16px;
	background-color: #ffffff !important; /* 흰색 배경 */
	color: var(--color-fg-default); /* 텍스트 색상 */
	flex: 1;

	.w-md-editor-toolbar {
		display: none;
	}

	.w-md-editor-preview > .wmde-markdown {
		background-color: #ffffff;
		color: black;
	}
`;

const Post = ({
	id,
	title,
	contents,
	author,
	createdAt,
	likeCount,
	isLikedByUser,
	handleDeleteClick,
	username,
}: IProps) => {
	const navigate = useNavigate();
	const [isLiked, setIsLiked] = useState(isLikedByUser);
	const [localLikeCount, setLocalLikeCount] = useState(likeCount);
	const { mutate } = useLikePost();

	const handleLikeClick = () => {
		setIsLiked((prev) => !prev);
		setLocalLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

		mutate(
			{ postId: id, isLiked },
			{
				onError: () => {
					// 롤백
					setIsLiked((prev) => !prev);
					setLocalLikeCount((prev) =>
						isLiked ? prev + 1 : prev - 1
					);
				},
			}
		);
	};

	return (
		<section className="py-4">
			<div className="d-flex w-100 align-items-baseline gap-2 flex-column">
				<h2 className="mb-1">{title}</h2>
				<div className="d-flex justify-content-between w-100">
					<div className="d-flex gap-2 align-items-center">
						<small className="fw-bold">{author}</small>
						{'·'}
						<small>{formatDate(createdAt)}</small>
						<div
							className={styles.Post__like}
							onClick={handleLikeClick}
						>
							{isLiked ? (
								<FaHeart
									style={{
										color: 'red',
										width: '14px',
										height: '14px',
									}}
								/>
							) : (
								<FaRegHeart
									style={{ width: '14px', height: '14px' }}
								/>
							)}
							<small>{localLikeCount}</small>
						</div>
					</div>
					{username === author && (
						<div className="d-flex gap-2">
							<button
								onClick={() => navigate(`/write?id=${id}`)}
								className={styles.Post__actionButton}
								aria-label="게시글 수정하기"
							>
								수정
							</button>
							<button
								onClick={handleDeleteClick}
								className={styles.Post__actionButton}
								aria-label="게시글 삭제하기"
							>
								삭제
							</button>
						</div>
					)}
				</div>
			</div>

			<StyledEditor
				className={styles.Post__editor}
				value={contents}
				previewOptions={{
					remarkPlugins: [remarkBreaks],
				}}
				preview={'preview'}
				height="66vh"
			/>
		</section>
	);
};

export default Post;
