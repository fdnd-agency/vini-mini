<script>
	import { Documentation, Nav } from '@fdnd/components';

	const data = {
		Categories: {
			//GET: '/docs/categorie#get',
			GET: '/docs/categories'
		},
		Personen: {
			GET: '/docs/personen'
		},
		Producten: {
			//GET: '/docs/producten#get'
			GET: '/docs/producten'
		},
		Product: {
			GET: '/docs/product#get',
			// '[slug]': '/docs/method#slug'
			// POST: '/docs/method#post',
			// PUT: '/docs/method#put',
			// PATCH: '/docs/method#patch',
			// DELETE: '/docs/method#delete',
		},
		Notities: {
			GET: '/docs/notities#get',
			// '[slug]': '/docs/method#slug'
			POST: '/docs/notities#post',
			// PUT: '/docs/method#put',
			// PATCH: '/docs/method#patch',
			// DELETE: '/docs/method#delete',
		},
	};
</script>

<Documentation {data}>
	<slot />
</Documentation>
