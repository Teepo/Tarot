<template>
	<v-container fill-height class="align-center justify-center">

		<v-row class="justify-center mt-16 mb-16">
			<v-img src="./../assets/logo.svg" max-width="300"></v-img>
		</v-row>

		<RouterLink to="/oneplayer">
			<v-btn color="primary" class="mt-2" type="submit" block>One Player</v-btn>
		</RouterLink>

		<RouterLink to="/multiplayer">
			<v-btn color="primary" class="mt-2" type="submit" block>Multiplayer</v-btn>
		</RouterLink>
	</v-container>
</template>

<style lang="scss" scoped>
.v-container {
	height: 100vh;
}
</style>