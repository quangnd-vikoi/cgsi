import Link from "next/link";

export default function UnauthorizedPage() {
	return (
		<div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
			<h1 className="text-2xl font-semibold">Access Denied</h1>
			<p className="text-gray-600 max-w-md">
				You do not have permission to access this page. Please contact your administrator if
				you believe this is an error.
			</p>
			<Link
				href="/"
				className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
			>
				Back to Home
			</Link>
		</div>
	);
}
