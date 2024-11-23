import { PostInterface } from '@type/post';
import MDEditor from '@uiw/react-md-editor';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import remarkBreaks from 'remark-breaks';
import styled from 'styled-components';
import { formatDate } from 'utils/formatDate';
import styles from './Post.module.scss';
import { useState } from 'react';
import { useLikePost } from '@hooks/usePostLike';

const StyledEditor = styled(MDEditor)`
	margin-top: 16px;
	background-color: #ffffff !important; /* 흰색 배경 */
	color: var(--color-fg-default); /* 텍스트 색상 */
	.w-md-editor-toolbar {
		display: none;
	}
	.w-md-editor-preview > .wmde-markdown {
		background-color: #ffffff !important; /* 미리보기 배경 */
		color: black !important; /* 텍스트 색상 */
	}
	flex: 1; /* 남은 공간을 모두 차지 */
`;

const ActionButton = styled.button`
	border: none;
	background-color: transparent;
	color: #868e96;
	&: hover {
		color: #212529;
	}
`;

interface IProps extends PostInterface {
	handleDeleteClick: () => void;
	likeCount: number;
	isLikedByUser: boolean;
}

const Post = ({
	id,
	title,
	contents,
	author,
	createdAt,
	likeCount,
	isLikedByUser,
	handleDeleteClick,
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
		<section className="p-4">
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
					<div className="d-flex gap-2">
						<ActionButton
							onClick={() => navigate(`/write?id=${id}`)}
						>
							수정
						</ActionButton>
						<ActionButton onClick={handleDeleteClick}>
							삭제
						</ActionButton>
					</div>
				</div>
			</div>

			<StyledEditor
				value={contents}
				previewOptions={{
					remarkPlugins: [remarkBreaks],
				}}
				height={'67vh'}
				preview={'preview'}
			/>
		</section>
	);
};

export default Post;
