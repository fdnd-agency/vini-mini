<script>
	import { Documentation, Nav } from '@fdnd/components';

	const data = {
		Product: {
			// GET: '/docs/products#get',
			// '[slug]': '/docs/method#slug'
			// POST: '/docs/method#post',
			// PUT: '/docs/method#put',
			// PATCH: '/docs/method#patch',
			// DELETE: '/docs/method#delete',
		},
		Producten: {
			GET: '/docs/producten#get'
		},
		
	};
</script>

<Documentation {data}>
	<slot />
</Documentation>
