export const formatDate = (inputDate: string): string => {
	const now = new Date();

	const sanitizedInputDate = inputDate.replace(' ', '');
	const date = new Date(sanitizedInputDate);

	const diffInMs = now.getTime() - date.getTime();
	const diffInSeconds = Math.floor(diffInMs / 1000);
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	const diffInHours = Math.floor(diffInMinutes / 60);
	const diffInDays = Math.floor(diffInHours / 24);

	// 약 X시간 전
	if (diffInHours < 23) {
		if (diffInMinutes < 60) {
			return `약 ${diffInMinutes}분 전`;
		}
		return `약 ${diffInHours}시간 전`;
	}

	// X일 전
	if (diffInDays <= 7) {
		return `${diffInDays}일 전`;
	}

	// UCT -> KST 변환
	date.setHours(date.getHours() + 18);
	console.log('날짜 출력:', date.toString());
	// YYYY년 MM월 DD일
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 0-based index
	const day = date.getDate().toString().padStart(2, '0');

	return `${year}년 ${month}월 ${day}일`;
};
