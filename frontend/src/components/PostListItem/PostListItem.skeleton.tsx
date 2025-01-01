const SkeletonItem = () => (
	<div
		className="list-group-item list-group-item-action placeholder-glow"
		aria-hidden="true"
	>
		<span className="placeholder bg-secondary col-3"></span>

		<p className="mb-2">
			<span className="placeholder bg-secondary col-7 d-block mb-2"></span>
			<span className="placeholder bg-secondary col-5 d-block"></span>
		</p>
		<small>
			<span className="placeholder bg-secondary col-2"></span>
		</small>
	</div>
);

const PostListSkeleton = () => {
	return (
		<ul className="list-group list-group-flush py-4">
			<SkeletonItem />
			<SkeletonItem />
			<SkeletonItem />
		</ul>
	);
};

export default PostListSkeleton;
