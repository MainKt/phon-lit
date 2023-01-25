<script>
	import { page } from '$app/stores';
</script>

<header style:padding="0" class="container-fluid">
	<nav>
		<ul>
			<li>
				<a href="/" class="contrast">
					<strong>PhonLit 🔥</strong>
				</a>
			</li>
		</ul>

		<ul>
			<li aria-current={$page.url.pathname === '/transliterator' ? 'page' : undefined}>
				<a href="/transliterator" class="contrast">Transliterator</a>
			</li>
			<!-- <span>|</span> -->
			<li aria-current={$page.url.pathname.startsWith('/custom-script') ? 'page' : undefined}>
				<!-- <a href="/custom-script" class="contrast">Add custom script</a> -->
			</li>
		</ul>		
		
	</nav>
	<hr>

</header>