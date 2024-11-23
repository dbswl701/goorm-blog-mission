import { useEffect, useRef, useState } from 'react';
import styles from './Write.module.scss';
import MDEditor, { MDEditorProps } from '@uiw/react-md-editor';
import styled from 'styled-components';
import { usePostCreatePost } from '@hooks/usePostCreatePost';
import remarkBreaks from 'remark-breaks';
import { GrPrevious } from 'react-icons/gr';

const EditorContainer = styled.div`
	width: 100vw;
	height: 90vh;
	padding: 1rem;
	box-sizing: border-box;
	// background-color: #f8f9fa; /* 원하는 배경색으로 변경 가능 */

	@media (max-width: 768px) {
		padding: 0.5rem;
	}
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
`;

const Write = () => {
	const [title, setTitle] = useState('');
	const [value, setValue] = useState('**Hello world!!!**');
	const [isMobile, setIsMobile] = useState(false);

	const { mutate, isLoading } = usePostCreatePost();
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
		if (!title.trim() || !value?.trim()) {
			console.log('제목과 내용을 모두 입력해주세요.');
			// toast
			return;
		}

		mutate({ title: title.trim(), contents: value.trim() });
	};

	return (
		<EditorContainer>
			<div className="d-flex justify-content-between mt-2">
				<div className={styles.Write__previousBtn}>
					<GrPrevious />
				</div>

				<button className={styles.Write__submitBtn}>등록</button>
			</div>
			<form onSubmit={onSubmit}>
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
					value={value}
					onChange={setValue as MDEditorProps['onChange']}
					previewOptions={{
						remarkPlugins: [remarkBreaks],
					}}
					height={'67vh'}
					preview={isMobile ? 'edit' : 'live'}
				/>
			</form>
		</EditorContainer>
	);
};
export default Write;
