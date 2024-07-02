import { ErrorPage } from "@/components/error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { title } from "@/config.shared";
import { PokeApi } from "@/services/pokeApi.server";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
	isRouteErrorResponse,
	useLoaderData,
	useRouteError,
	useSearchParams,
} from "@remix-run/react";
import { Ban, BarChartBig, BarChartHorizontal, Search } from "lucide-react";
import { ChangeEvent, Children, useEffect, useState } from "react";

type PokemonAbility = {
	isHidden: boolean;
	name: string;
};

type PokemonStat = {
	baseStat: number;
	name: string;
};

export const meta: MetaFunction = () => {
	return [
		{ title: title("Buscar Pokemon") },
		{ name: "description", content: "Busque informações do seu pokemon!" },
	];
};

export async function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url);
	const query = url.searchParams;
	const pokemon = query.get("pokemon") || "";
	const pokeNames = await PokeApi.getAllPokemons();
	let pokeData: Record<string, unknown>;
	if (pokemon) {
		pokeData = await PokeApi.getPokemon(pokemon);
	}
	const response = {
		pokeNames,
		pokeData,
	};
	return new Response(JSON.stringify(response), {
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=30, s-maxage=60",
		},
	});
}

export default function Index() {
	const { pokeNames, pokeData } = useLoaderData<typeof loader>();
	const [_, setSearchParams] = useSearchParams();
	const [search, setSearch] = useState("");
	const [progress, setProgress] = useState(0);

	function handleSetSearch(event: ChangeEvent<HTMLInputElement>) {
		setTimeout(() => {
			setSearch(event.target.value);
		}, 500);
	}

	function handleSearch() {
		setSearchParams((prevParams) => {
			prevParams.set("pokemon", search);
			return prevParams;
		});
	}

	function handleSortSearch() {
		setSearchParams((prevParams) => {
			prevParams.set(
				"pokemon",
				pokeNames[Math.floor(Math.random() * pokeNames.length)],
			);
			return prevParams;
		});
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (search?.length === 0) {
			setSearchParams((prevParams) => {
				prevParams.delete("pokemon");
				return prevParams;
			});
		}
	}, [search]);

	useEffect(() => {
		if (pokeData?.baseExperience) {
			const timer = setTimeout(() => setProgress(pokeData.baseExperience), 300);
			return () => clearTimeout(timer);
		}
	}, [pokeData?.baseExperience]);

	return (
		<main className="container mx-auto py-8 flex flex-col justify-center items-center gap-4">
			<h1 className="text-6xl font-bold uppercase">PokeGoogle</h1>
			<div className="relative w-full my-6">
				<Search className="absolute left-2.5 top-2.5 h-7 w-7 text-muted-foreground" />
				<Input
					type="search"
					placeholder="Encontre seu pokemon..."
					className="w-full rounded-full bg-background h-12 pl-12 text-xl text-muted-foreground uppercase placeholder:uppercase"
					list="pokeNames"
					onChange={handleSetSearch}
				/>
			</div>
			<div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full">
				<div className={!search ? "cursor-not-allowed" : ""}>
					<Button
						onClick={handleSearch}
						variant="default"
						className="rounded-full w-full md:w-52"
						disabled={!search}
					>
						Procurar
					</Button>
				</div>
				<Button
					onClick={handleSortSearch}
					variant="secondary"
					className="rounded-full w-full md:w-52"
				>
					Estou com sorte
				</Button>
			</div>

			{pokeData && (
				<Card className="w-full p-4 mt-12 bg-secondary shadow-xl relative">
					{pokeData.isDefault && (
						<Badge className="bg-red-500 absolute">Padrão</Badge>
					)}
					<div className="grid md:grid-cols-3 gap-12">
						<div className="flex flex-col justify-center items-center">
							{pokeData.image ? (
								<img
									src={pokeData.image}
									alt={pokeData.name}
									className="w-40 h-40"
								/>
							) : (
								<Ban className="w-32 h-32 text-muted-foreground" />
							)}
							<h2 className="text-xl text-muted-foreground uppercase">
								{pokeData.name}
							</h2>
							<div className="flex justify-start items-center gap-2">
								{Children.toArray(
									pokeData?.types?.map((typeName: string) => (
										<Badge variant="default" className="my-2">
											{typeName}
										</Badge>
									)),
								)}
							</div>
							<Progress
								value={progress}
								className="w-[100%] bg-muted-foreground"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<div className="flex gap-2">
								<BarChartHorizontal className="w-6 h-6 text-muted-foreground" />
								<h3 className="text-lg font-medium text-foreground">
									Habilidades
								</h3>
							</div>
							<div className="flex justify-start items-center gap-2">
								{Children.toArray(
									pokeData?.abilities?.map((ability: PokemonAbility) => (
										<Badge
											variant={ability.isHidden ? "destructive" : "default"}
											className="my-2 text-xs"
										>
											{ability.name}
										</Badge>
									)),
								)}
							</div>
						</div>
						<div>
							<div className="flex gap-2">
								<BarChartBig className="w-6 h-6 text-muted-foreground" />
								<h3 className="text-lg font-medium text-foreground">
									Estatísticas
								</h3>
							</div>
							<div className="flex flex-col justify-start items-start gap-2">
								{Children.toArray(
									pokeData?.stats?.map((stat: PokemonStat) => (
										<>
											<span className="text-xs font-light text-foreground mt-0.5">
												{stat.name}
											</span>
											<Progress
												value={stat.baseStat}
												className="w-[100%] bg-muted-foreground"
											/>
										</>
									)),
								)}
							</div>
						</div>
					</div>
				</Card>
			)}

			<datalist id="pokeNames">
				{Children.toArray(
					pokeNames.map((name: string) => <option value={name} />),
				)}
			</datalist>
		</main>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();
	if (isRouteErrorResponse(error)) {
		error.status = 404;
		error.data = "Oh no! Something went wrong!";
	}

	return <ErrorPage />;
}
