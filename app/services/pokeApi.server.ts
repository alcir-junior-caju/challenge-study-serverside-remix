type GetAllPokemonsResponse = {
	name: string;
	url: string;
};

type GetPokemonType = {
	type: {
		name: string;
	};
};

type GetPokemonAbility = {
	is_hidden: boolean;
	ability: {
		name: string;
	};
};

type GetPokemonStat = {
	base_stat: number;
	stat: {
		name: string;
	};
};

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PokeApi {
	static async getAllPokemons() {
		const response = await fetch(
			"https://pokeapi.co/api/v2/pokemon?limit=1302",
		);
		const data = await response.json();
		const names = data?.results?.map(
			(pokemon: GetAllPokemonsResponse) => pokemon.name,
		);
		return names;
	}

	static async getPokemon(pokemonName: string) {
		const response = await fetch(
			`https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
		);
		const data = await response.json();
		const dataTransformed = {
			isDefault: data?.is_default || false,
			baseExperience: data?.base_experience || 0,
			image:
				(data?.sprites?.other?.dream_world?.front_default ||
					data?.sprites.front_default) ??
				"",
			name: data?.name || "",
			types: data?.types?.map((item: GetPokemonType) => item.type.name) || [],
			abilities:
				data?.abilities
					?.sort((a: GetPokemonAbility, b: GetPokemonAbility) =>
						a.ability.name.localeCompare(b.ability.name),
					)
					.map((item: GetPokemonAbility) => {
						return {
							isHidden: item.is_hidden,
							name: item.ability.name,
						};
					}) || [],
			stats:
				data?.stats
					?.sort((a: GetPokemonStat, b: GetPokemonStat) =>
						a.stat.name.localeCompare(b.stat.name),
					)
					.map((item: GetPokemonStat) => {
						return {
							baseStat: item.base_stat,
							name: item.stat.name,
						};
					}) || [],
		};
		return dataTransformed;
	}
}
