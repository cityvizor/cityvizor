<template>
	<div id="why-page">
		<section class="why__section container" aria-labelledby="page--heading">
			<div class="highlights__part">
				<div id="highlights__data-source" class="highlights__image"></div>
				<div class="highlights__text">
					<h2 class="highlights__heading why__heading">Jsme tansparentní zdroj dat</h2>
					<div class="why__description">Mějte přehled o hospodaření obce a o rozpočtu a jeho průběžném plnění na jednom místě.</div>
				</div>
			</div>
			
			<div class="highlights__part">
				<div id="highlights__details" class="highlights__image"></div>
				<div class="highlights__text">
					<h2 class="highlights__heading why__heading">Zobrazujeme detailně všechny výdaje</h2>
					<div class="why__description">Kategorizace výdajů podle projektů nebo zobrazovaní výdaju až na detail každé faktury vám pomůže zorientovat se.</div>
				</div>
			</div>
			
			<div class="highlights__part">
				<div id="highlights__visualisation" class="highlights__image"></div>
				<div class="highlights__text">
					<h2 class="highlights__heading why__heading">Pracujte s daty efektivně</h2>
					<div class="why__description">Vizualizace dat poskytne srozumitelný, grafický přehled o rozpočtu vaší obce.</div>
				</div>
			</div>
			
			<div class="highlights__part">
				<div id="highlights__trust" class="highlights__image"></div>
				<div class="highlights__text">
					<h2 class="highlights__heading why__heading">Mužete nám věřit</h2>
					<div class="why__description">Infrastruktura a kontinuální rozvoj aplikace je zaštiťován a podporován neziskovými organizacemi.</div>
				</div>
			</div>
		</section>

		<section id="why__annotation" aria-labelledby="annotation__heading">
			<div id="annotation__container" class="container">
				<h1 class="why__heading">Co všechno zde najdete?</h1>
				<div id="annotation__description" class="why__description">
					<div>
						<span class="underline annotation--underline">Dodavatelé</span>, kterým organizace vyplácí veřejné prostředky a za co je vyplácí.
					</div>
					<div>
						<span class="underline annotation--underline">Projektové či investiční akce</span> (opravy, stavby, pořízení SW…) které probíhají, jaké jsou na ně alokovány prostředky a kolik již bylo vyplaceno.
					</div>
					<div>
						<span class="underline annotation--underline">Plán výdajů</span> (rozpočet), plnění těchto plánů v daném roce a vazby jednotlivých faktur a investic na rozpočet.
					</div>
					<div>
						Informace o <span class="underline annotation--underline">nejnovějších</span> veřejných úředních <span class="underline annotation--underline">dokumentech</span>.
					</div>
					<div>
						<span class="underline annotation--underline">Odkazy na konkrétní smlouvy</span>, které daná organizace uveřejnila v registru smluv.
					</div>
					<div id="join-button__container">
						<a href="mailto:cityvizor@otevrenamesta.cz
							?subject=Žádost o bližší informace
							&body=Prosím,%0D%0Apošlete nám své jméno a kontaktní údaje (telefon, e-mail).%0D%0AObratem se Vám ozveme,%0D%0ADěkujeme.">
							<button class="btn">Zapojit moji obec</button>
						</a>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<style lang="scss">
@import '../../assets/styles/common/_breakpoints.scss';
@import '../../assets/styles/common/_variables.scss';

#why-page {
	margin-bottom: -60px;
}

.why__section {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.highlights__part {
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding-bottom: 120px;

	@include media-breakpoint-down(md) {
		flex-direction: column;

		&::last-of-type {
			padding-bottom: 60px;
		}
	}
}

.highlights__image {
	width: 246px;
	max-width: 100%;
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center center;
}


#highlights__data-source {
	background-image: url(../../assets/images/pages/why/data_source.png);
	height: 145px;

	@include media-retina-display() {
		background-image: url(../../assets/images/pages/why/data_source@2x.png);
	}
}

#highlights__details {
	background-image: url(../../assets/images/pages/why/details.png);
	height: 221px;

	@include media-retina-display() {
		background-image: url(../../assets/images/pages/why/details@2x.png);
	}
}

#highlights__visualisation {
	background-image: url(../../assets/images/pages/why/visualisation.png);
	height: 221px;

	@include media-retina-display() {
		background-image: url(../../assets/images/pages/why/visualisation@2x.png);
	}
}

#highlights__trust {
	background-image: url(../../assets/images/pages/why/trust.png);
	height: 186px;

	@include media-retina-display() {
		background-image: url(../../assets/images/pages/why/trust@2x.png);
	}
}

.highlights__text {
	width: 400px;
	max-width: 100%;

	@include media-breakpoint-down(md) {
		padding-top: 40px;
	}
	
	@include media-breakpoint-up(md) {
		padding-left: 87px;
	}
}

.why__heading {
	font-size: 1.5rem;
}

.highlights__heading {
	padding-bottom: 20px;
}

.why__description {
	font-size: 1.2rem;
	line-height: 1.5rem;
}

#why__annotation {
	background-color: #fafafa;
	padding-top: 100px;
	padding-bottom: 100px;
	
	@include media-breakpoint-down(md) {
		padding-top: 60px;
		padding-bottom: 60px;
	}
}

#annotation__container {
	width: 770px;
	max-width: 100%;
}

#annotation__description {
	padding-top: 60px;
	
	& > * {
		padding-bottom: 20px;
	}
}

.annotation--underline {
	padding-bottom: 5px;
	background-size: auto 6px;
}

#join-button__container {
	padding-top: 115px;
	display: flex;
	justify-content: center;
	align-items: center;
	
	@include media-breakpoint-down(md) {
		padding-top: 60px;
	}
}

#join-button {
	padding-top: 8px;
	text-decoration: none;
}
</style>
