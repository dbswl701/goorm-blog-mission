import { useEffect, useState } from 'react';
import styles from './ScrollToTopButton.module.scss';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
	const [isVisible, setIsVisible] = useState(false);

	// 스크롤 이벤트 핸들러
	const toggleVisibility = () => {
		if (window.pageYOffset > 300) {
			// 스크롤 위치가 300px 이상일 때 버튼 표시
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	};

	// 스크롤 시 toggleVisibility 함수 호출
	useEffect(() => {
		window.addEventListener('scroll', toggleVisibility);
		return () => {
			window.removeEventListener('scroll', toggleVisibility);
		};
	}, []);

	// 버튼 클릭 시 최상단으로 스크롤
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};
	return (
		<>
			{isVisible && (
				<button
					onClick={scrollToTop}
					className={styles['scroll-to-top']}
					aria-label="맨 위로 이동"
				>
					<FaArrowUp />
				</button>
			)}
		</>
	);
};

export default ScrollToTopButton;
