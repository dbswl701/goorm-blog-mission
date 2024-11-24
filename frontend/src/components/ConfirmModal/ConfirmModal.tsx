import { useEffect } from 'react';
import styles from './ConfirmModal.module.scss';

interface ConfirmModalProps {
	isOpen: boolean;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}

const ConfirmModal = ({
	isOpen,
	message,
	onConfirm,
	onCancel,
}: ConfirmModalProps) => {
	// ESC 키로 모달 닫기
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onCancel();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown);
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, onCancel]);

	// 모달 닫기 핸들러 (외부 클릭)
	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onCancel();
		}
	};

	if (!isOpen) return null;

	return (
		<div
			className={styles.Modal__backdrop}
			role="dialog"
			aria-modal="true"
			aria-labelledby="confirm-modal-title"
			aria-describedby="confirm-modal-description"
			onClick={handleBackdropClick}
		>
			<div className={styles.Modal__content}>
				<h2 id="confirm-modal-title">삭제</h2>
				<p id="confirm-modal-description">{message}</p>
				<div className={styles.Modal__actions}>
					<button
						className={styles.Modal__cancel_btn}
						onClick={onCancel}
						aria-label="취소"
					>
						취소
					</button>
					<button
						className={styles.Modal__confirm_btn}
						onClick={onConfirm}
						aria-label="확인"
					>
						확인
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmModal;
