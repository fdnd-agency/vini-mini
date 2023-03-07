<script>
	import { Documentation, Nav } from '@fdnd/components';

	const data = {
		Categorie: {
			GET: '/docs/categorie#get',
		},
		Producten: {
			GET: '/docs/producten#get'
		},
		Product: {
			// GET: '/docs/products#get',
			// '[slug]': '/docs/method#slug'
			// POST: '/docs/method#post',
			// PUT: '/docs/method#put',
			// PATCH: '/docs/method#patch',
			// DELETE: '/docs/method#delete',
		},
		
	};
</script>

<Documentation {data}>
	<slot />
</Documentation>
