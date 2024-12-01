<script lang="ts">
	let { data } = $props();

	console.log(data);

	const uppercased = (params: string) => {
		return params.charAt(0).toUpperCase() + params.slice(1);
	};
</script>

{#await data.profile}
	<h1 class="text-xl">Display your Spotify profile data</h1>

	<br />

	<section id="profile">
		<h2 class="text-lg">You are not logged in yet, please log in.</h2>
	</section>
{:then profile}
	<section>
		<h2 class="text-lg">Logged in as: <span class="font-bold">{profile?.display_name}</span></h2>
		<!-- <span></span>
		<ul>
			<li>User ID: <span>{profile?.id}</span></li>
			<li>Email: <span>{profile?.email}</span></li>
			<li>Link: <a target="_blank" href={profile?.external_urls.spotify}>{profile?.uri}</a></li>
			<li>Profile Image: <span>{profile?.images[0].url}</span></li>
		</ul> -->
	</section>
{/await}

{#await data.topItems}
	<span>Loading...</span>
{:then topItems}
	<br />

	<h1 class="text-xl">Your Jam (short_term):</h1>

	<br />

	<div class="grid max-w-[864px] grid-cols-3">
		{#each topItems as item}
			<section
				class="relative isolate flex max-h-72 min-h-72 min-w-72 max-w-72 flex-col justify-end overflow-hidden px-4 pb-6 pt-36"
			>
				<!-- <span class="underline hover:text-indigo-300">
					<a target="_blank" href={item?.external_urls['spotify']}>{item?.name} </a>
				</span>
				<span>Album: {item?.album.name}</span>
				<span>Album Type: {item?.album.album_type}</span> -->
				<img
					class="absolute inset-0 h-full w-full object-cover"
					alt="Album cover"
					src={item?.album.images[0].url}
				/>

				<div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
				<h3 class="z-10 text-2xl font-bold text-white">{item?.name}</h3>
				<div class="z-10 gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
					{uppercased(item?.album.album_type)}: {item?.album.name}
				</div>
				<div class="z-10 gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
					Aritst: {item?.artists[0].name}
				</div>
			</section>
		{/each}
	</div>
{/await}
