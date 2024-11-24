import styled from 'styled-components';
import styles from './PostSkeleton.module.scss';
import MDEditor from '@uiw/react-md-editor';

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
const PostSkeleton = () => (
	<section className={`${styles.skeleton} py-4`}>
		{/* 제목 */}
		<div className="placeholder-glow mt-2 mb-4">
			<span className="placeholder bg-secondary col-6 d-block placeholder-lg"></span>
		</div>

		{/* 작성자 및 날짜 */}
		<div className="d-flex gap-2 align-items-center placeholder-glow mb-4">
			<span className="placeholder bg-secondary col-2"></span>
			<span className="placeholder bg-secondary col-1"></span>
		</div>

		{/* 좋아요 및 댓글 */}
		{/* <div className="placeholder-glow mb-4">
			<div
				className={`${styles.likePlaceholder} placeholder bg-secondary`}
			></div>
		</div> */}

		{/* 콘텐츠 영역 */}
		<StyledEditor
			className={styles.Post__editor}
			preview={'preview'}
			height="66vh"
		/>
	</section>
);

export default PostSkeleton;
