import React, { useEffect, useState } from 'react';
import styles from './Write.module.scss';
import MDEditor from '@uiw/react-md-editor';
import { GrPrevious } from 'react-icons/gr';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetPost } from '@hooks/useGetPost';
import { usePostCreatePost } from '@hooks/usePostCreatePost';
import { usePutPost } from '@hooks/usePutPost';
import remarkBreaks from 'remark-breaks';
import styled from 'styled-components';

const MAX_TITLE_LENGTH = 50;
const MAX_CONTENT_LENGTH = 5000;

const StyledEditor = styled(MDEditor)`
	margin-top: 16px;
	background-color: #ffffff !important; /* 흰색 배경 */
	color: var(--color-fg-default); /* 텍스트 색상 */
	flex: 1;

	.w-md-editor-toolbar {
		background-color: #ffffff !important; /* 툴바 배경 */
		color: black !important;
	}

	.w-md-editor-preview > .wmde-markdown {
		background-color: #ffffff;
		color: black;
	}
`;

const Write = ({ username }: { username: string | null }) => {
	const [title, setTitle] = useState('');
	const [contents, setContents] = useState('');
	const [isTitleOverLimit, setIsTitleOverLimit] = useState(false);
	const [isContentOverLimit, setIsContentOverLimit] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [isModify, setIsModify] = useState(false);
	const id = searchParams.get('id') as string;

	const { data } = useGetPost(id as string);

	useEffect(() => {
		if (data) {
			setTitle(data.title);
			setContents(data.contents);
			setIsModify(true);
		}
	}, [data]);

	// const username = useAuth();
	if (username === '') {
		location.href = '/login';
		return;
	}

	const { mutate: postMutate } = usePostCreatePost();
	const { mutate: putMutate } = usePutPost();

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth <= 768);
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setTitle(value);
		setIsTitleOverLimit(value.length > MAX_TITLE_LENGTH);
	};

	const handleContentChange = (value: string | undefined) => {
		if (value !== undefined) {
			setContents(value);
			setIsContentOverLimit(value.length > MAX_CONTENT_LENGTH);
		}
	};

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!title.trim() || !contents.trim()) {
			toast.warn('제목과 내용을 모두 입력해주세요.', {
				position: 'top-right',
			});
			return;
		}
		if (isTitleOverLimit || isContentOverLimit) {
			toast.error('제목이나 내용이 너무 깁니다!', {
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
		<div className={styles.Write__editorContainer}>
			<form
				onSubmit={onSubmit}
				style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
			>
				<div className={styles.Write__header}>
					<div
						className={styles.Write__previousBtn}
						onClick={() => navigate('/')}
					>
						<GrPrevious />
					</div>
					<button
						type="submit"
						className={styles.Write__submitBtn}
						aria-label="게시글 등록하기"
					>
						등록
					</button>
				</div>
				<div>
					<textarea
						value={title}
						aria-describedby="title-warning"
						onChange={handleTitleChange}
						placeholder="제목을 입력하세요"
						className={styles.Write__title}
						maxLength={MAX_TITLE_LENGTH + 1}
						rows={2}
					/>
					{isTitleOverLimit && (
						<p
							className={styles.Write__warning}
							aria-live="polite"
							id="title-warning"
						>
							제목은 최대 {MAX_TITLE_LENGTH}자까지 입력
							가능합니다.
						</p>
					)}
				</div>
				<StyledEditor
					className={styles.Write__editor}
					aria-describedby="contents-warning"
					value={contents}
					onChange={handleContentChange}
					previewOptions={{
						remarkPlugins: [remarkBreaks],
					}}
					preview={isMobile ? 'edit' : 'live'}
				/>
				{isContentOverLimit && (
					<p
						className={styles.Write__warning}
						aria-live="polite"
						id="contents-warning"
					>
						내용은 최대 {MAX_CONTENT_LENGTH}자까지 입력 가능합니다.
					</p>
				)}
			</form>
		</div>
	);
};

export default Write;
