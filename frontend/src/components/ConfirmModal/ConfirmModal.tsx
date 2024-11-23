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
	if (!isOpen) return null;

	return (
		<div className={styles.Modal__backdrop}>
			<div className={styles.Modal__content}>
				<p>{message}</p>
				<div className={styles.Modal__actions}>
					<button
						className={styles.Modal__cancel_btn}
						onClick={onCancel}
					>
						취소
					</button>
					<button
						className={styles.Modal__confirm_btn}
						onClick={onConfirm}
					>
						확인
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmModal;
