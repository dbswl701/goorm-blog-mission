import { PostInterface } from '@type/post';
import MDEditor from '@uiw/react-md-editor';
import remarkBreaks from 'remark-breaks';
import styled from 'styled-components';
import { formatDate } from 'utils/formatDate';

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
const Post = ({ title, contents, author, createdAt }: PostInterface) => (
	<section className="p-4">
		<div className="d-flex w-100 align-items-baseline gap-2 flex-column">
			<h2 className="mb-1">{title}</h2>
			<div className="d-flex gap-2">
				<small className="fw-bold">{author}</small>
				{'·'}
				<small>{formatDate(createdAt)}</small>
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

export default Post;
