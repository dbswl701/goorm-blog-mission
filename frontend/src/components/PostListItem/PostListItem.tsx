import { formatDate } from 'utils/formatDate';
import styles from './PostListItem.module.scss';
import { AiOutlineLike } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { Link } from 'react-router-dom';

interface PostListItemProps {
	id: string;
	title: string;
	createdAt: string;
	summary: string;
	author: string;
	likeCount: number;
	commentCount: number;
}

const PostListItem = ({
	id,
	title,
	createdAt,
	summary,
	author,
	likeCount,
	commentCount,
}: PostListItemProps) => {
	return (
		<Link
			to={`/posts/${id}`}
			className="list-group-item list-group-item-action"
			aria-current="true"
		>
			<div className={styles.postHeader}>
				<h5 id={`post-title-${id}`}>{title}</h5>
				<small>{formatDate(createdAt)}</small>
			</div>
			<p id={`post-summary-${id}`} className={styles.postSummary}>
				{summary.length > 100 ? `${summary.slice(0, 100)}...` : summary}
			</p>
			<div className={styles.postAuthorAndStats}>
				<small className={styles.author}>by {author}</small>
				<div className={styles.stats}>
					<small>
						<AiOutlineLike /> {likeCount}
					</small>
					<small>
						<BiCommentDetail /> {commentCount}
					</small>
				</div>
			</div>
		</Link>
	);
};

export default PostListItem;
