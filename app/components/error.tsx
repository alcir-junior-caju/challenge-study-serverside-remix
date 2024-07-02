import { Link } from "@remix-run/react";

export function ErrorPage() {
	return (
		<section className="bg-background">
			<div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
				<div className="mx-auto max-w-screen-sm text-center">
					<h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-foreground">
						404
					</h1>
					<p className="mb-4 text-3xl tracking-tight font-bold text-foreground md:text-4xl">
						Algo está faltando.
					</p>
					<p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
						Desculpe, não conseguimos encontrar essa página. Você encontrará
						muito para explorar na página inicial.
					</p>
					<Link
						to="/"
						className="inline-flex text-foreground bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
					>
						Back to Homepage
					</Link>
				</div>
			</div>
		</section>
	);
}
