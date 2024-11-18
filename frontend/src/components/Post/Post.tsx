import { PostInterface } from '@type/post';

const Post = ({ title, contents, author, createdAt }: PostInterface) => (
	<section className="p-4">
		<div className="d-flex w-100 align-items-baseline gap-2">
			<h2 className="mb-1">{title}</h2>

			<small>by {author}</small>
			<small>{createdAt}</small>
		</div>
		<p className="mt-4">{contents}</p>
	</section>
);

export default Post;
