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

const PostItem = ({
	id,
	title,
	createdAt,
	summary,
	author,
	likeCount,
	commentCount,
}: PostListItemProps) => (
	<Link
		to={`/posts/${id}`}
		className="list-group-item list-group-item-action"
		aria-current="true"
	>
		<div className="d-flex w-100 justify-content-between">
			<h5 className="mb-1">{title}</h5>
			<small>{new Date(createdAt).toLocaleDateString()}</small>
		</div>
		<p className="mb-1">{summary}</p>
		<div className="d-flex justify-content-between align-items-center">
			<small>by {author}</small>
			<div>
				<small>{likeCount} Likes</small>
				<small>{commentCount} Comments</small>
			</div>
		</div>
	</Link>
);

export default PostItem;
