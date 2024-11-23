import { useEffect, useState } from 'react';
import styles from './Write.module.scss';
import MDEditor, { MDEditorProps } from '@uiw/react-md-editor';
import styled from 'styled-components';
import { usePostCreatePost } from '@hooks/usePostCreatePost';
import remarkBreaks from 'remark-breaks';
import { GrPrevious } from 'react-icons/gr';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import { toast } from 'react-toastify';
import { useGetPost } from '@hooks/useGetPost';
import { usePutPost } from '@hooks/usePutPost';

const EditorContainer = styled.div`
	width: 100vw;
	height: calc(100vh - 56px);
	display: flex;
	flex-direction: column;
	padding: 1rem;
	// background-color: #f8f9fa; /* 원하는 배경색으로 변경 가능 */

	@media (max-width: 768px) {
		padding: 0.5rem;
	}
`;
const Header = styled.div`
	display: flex;
	justify-content: space-between;
	// padding: 1rem;
	box-sizing: border-box;
`;
const StyledEditor = styled(MDEditor)`
	background-color: #ffffff !important; /* 흰색 배경 */
	color: var(--color-fg-default); /* 텍스트 색상 */

	.w-md-editor-toolbar {
		background-color: #ffffff !important; /* 툴바 배경 */
		color: black !important;
	}
	.w-md-editor-preview > .wmde-markdown {
		background-color: #ffffff !important; /* 미리보기 배경 */
		color: black !important; /* 텍스트 색상 */
	}
	flex: 1; /* 남은 공간을 모두 차지 */
`;

const Write = () => {
	const [title, setTitle] = useState('');
	const [contents, setContents] = useState('');
	const [isMobile, setIsMobile] = useState(false);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [isModify, setIsModify] = useState(false);
	const id = searchParams.get('id') as string;
	console.log('id: ', id);

	const { data, isLoading, error } = useGetPost(id as string);

	useEffect(() => {
		if (data) {
			console.log('data: ', data);
			setTitle(data.title);
			setContents(data.contents);
			setIsModify(true);
		}
	}, []);

	const username = useAuth();
	if (username === '') {
		location.href = '/login';
		return;
	}

	const { mutate: postMutate } = usePostCreatePost();
	const { mutate: putMutate } = usePutPost();
	// 모바일 여부 감지
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!title.trim() || !contents?.trim()) {
			toast.warn('제목과 내용을 모두 입력해주세요.', {
				position: 'top-right',
			});
			return;
		}

		if (isModify) {
			putMutate({ id, title: title.trim(), contents: contents.trim() });
		} else {
			postMutate({ title: title.trim(), contents: contents.trim() });
		}
	};

	return (
		<EditorContainer>
			<form
				onSubmit={onSubmit}
				style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
			>
				<Header>
					<div
						className={styles.Write__previousBtn}
						onClick={() => navigate('/')}
					>
						<GrPrevious />
					</div>

					<button type="submit" className={styles.Write__submitBtn}>
						등록
					</button>
				</Header>
				<div className={styles.Write__header}>
					<textarea
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="제목을 입력하세요"
						className={styles.Write__title}
						maxLength={50}
						rows={2}
					/>
				</div>
				<StyledEditor
					value={contents}
					onChange={setContents as MDEditorProps['onChange']}
					previewOptions={{
						remarkPlugins: [remarkBreaks],
					}}
					// height={'67vh'}
					preview={isMobile ? 'edit' : 'live'}
				/>
			</form>
		</EditorContainer>
	);
};
export default Write;
