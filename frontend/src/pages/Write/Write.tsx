import { useState } from 'react';
import styles from './Write.module.scss';
import MDEditor, { MDEditorProps } from '@uiw/react-md-editor';
import styled from 'styled-components';
import { usePostCreatePost } from '@hooks/usePostCreatePost';

const EditorContainer = styled.div`
	width: 100vw;
	height: 90vh;
	padding: 1rem;
	box-sizing: border-box;
	background-color: #f8f9fa; /* 원하는 배경색으로 변경 가능 */

	@media (max-width: 768px) {
		padding: 0.5rem;
	}
`;

const Write = () => {
	const [title, setTitle] = useState('');
	const [value, setValue] = useState('**Hello world!!!**');

	const { mutate, isLoading } = usePostCreatePost();

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
			<form onSubmit={onSubmit}>
				<div className={styles.Write__header}>
					<textarea
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="제목을 입력하세요"
						className={styles.Write__title}
					/>
					<button className={styles.Write__submitBtn}>등록</button>
				</div>
				<MDEditor
					value={value}
					onChange={setValue as MDEditorProps['onChange']}
					height="100%"
				/>
			</form>
		</EditorContainer>
	);
};
export default Write;
