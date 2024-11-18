interface PostListItemProps {
	id: string;
	title: string;
	createdAt: string;
	summary: string;
	author: string;
}

const PostListItem = ({
	id,
	title,
	createdAt,
	summary,
	author,
}: PostListItemProps) => (
	<a
		href={`/posts/${id}`}
		className="list-group-item list-group-item-action"
		aria-current="true"
	>
		<div className="d-flex w-100 justify-content-between">
			<h5 className="mb-1">{title}</h5>
			<small>{createdAt}</small>
		</div>
		<p className="mb-1">{summary}</p>
		<small>by {author}</small>
	</a>
);

export default PostListItem;
