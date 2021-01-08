<template>
<div>
	<div v-if="this.alternativePageContent.whyHtml" v-html="this.alternativePageContent.whyHtml"></div>
	<div v-else>
		<b-container>
			<b-row>
				<b-col sm="12">
					<h1 class="underlined" style="margin-bottom: 20px">Proč Cityvizor?</h1>
				</b-col>
				<b-col xs="12" sm="6" v-for="(point, idx) in points" :key="point.title" class="list-entry">
					<b-row>
						<b-col cols="auto">
							<div class="list-number">
								<b>{{idx + 1}}</b>
							</div>
						</b-col>
						<b-col cols="8">
							<b-row>
								<h4>{{point.title}}</h4>
							</b-row>
							<b-row id="point-content">
								{{point.content}}
							</b-row>
						</b-col>
					</b-row>
				</b-col>
			</b-row>
		<ParticipateBox></ParticipateBox>
		</b-container>
	</div>
</div>
</template>

<script>
import ParticipateBox from "../partials/ParticipateBox.vue"

export default {
  name: 'WhyPage',
  components: {
	  ParticipateBox
  },
  data() {
	  return {
		points: [
			{
				title: "Skutečně transparentní zdroj dat",
				content: "Vychází z otevřených dat o hospodaření měst a obcí. Tato data umí zveřejňovat srozumitelně a v souvislostech."
			},
			{
				title: "Uživatelsky přívětivá forma",
				content: "Vše je zobrazeno přehledně a formulováno tak, aby byly informace přístupné a srozumitelné pro každého."
			},
			{
				title: "Vše na jednom místě",
				content: "Poskytuje informace o rozpočtu obce a jeho průběžném plnění, informace z úřední desky i z Registru smluv."
			},
			{
				title: "Okamžité informace",
				content: "Srozumitelná data o hospodaření obce jsou k dispozici 24 hodin denně, což může zastupitelům usnadnit rozhodování, vyhodnocování a řízení obce a kraje."
			},
			{
				title: "Spolehlivý přehled",
				content: "Rozdělení výdajů a příjmů do kategorií podle projektů a investičních akcí pomáhá rychlejší orientaci. Navíc můžete sledovat i průběžné plnění a financování těchto akcí."
			},
			{
				title: "Do detailu každé faktury",
				content: "Cityvizor zobrazuje příjmy a výdaje do detailu každé faktury a věrně tak odráží skutečnost."
			},
			{
				title: "Kompletní informace ke každé položce",
				content: "Ještě podrobnější informace získáte díky možnosti náhledu na detail investiční akce, kde najdete vše o jejím financování včetně seznamu dodavatelů a faktur, které jim byly proplaceny. Zároveň zde najdete financování dané akce v minulých letech."
			},
			{
				title: "Náhled přímo na faktury za daný měsíc",
				content: "Aplikace umožňuje náhled na faktury, které byly obcím proplaceny v konkrétním měsíci vybraného roku. Můžete tak jednoduše zjistit, komu tento rok vaše obec vyplatila kolik peněz, aniž byste museli hádat, o jaký druh výdaje se jedná"
			},
			{
				title: "Historická data",
				content: "Cityvizor zobrazuje také vývoj rozpočtů v minulosti. Můžete se tak podívat, jak vaše obec hospodařila v předchozích letech."
			},
			{
				title: "Efektivní práce s daty díky vizualizaci",
				content: "Jednoduché tabulky a grafy poskytují srozumitelný přehled o rozpočtu vaší obce. Všechny vizualizace dat můžete využívat pro prezentaci činnosti obce a jejího hospodaření."
			},
			{
				title: "Aplikace je neustále zdokonalována",
				content: "Původně byla vyvinuta pracovníky Ministerstva financí ČR a její infrastrukturu a rozvoj zaštiťují neziskové organizace. Jejich tým průběžně zpracovává zpětnou vazbu a vyvíjí nové funkce tak, aby vám aplikace přinesla ještě více užitku."
			},
			{
				title: "Na míru vašim potřebám",
				content: "Aplikace Cityvizor je upravitelná přesně podle potřeb vaší obce, aby se vám s ní pracovalo co nejlépe."
			},
			{
				title: "Ušetříte za licence",
				content: "Obec může ušetřit za licence pro přístup do informačního systému. Zaměstnancům obce bude většinou jako jediný nástroj stačit Cityvizor."
			},
			{
				title: "Začít můžete hned",
				content: "Není třeba projít složitým školením. Aplikaci můžete začít používat hned po importu dat vaší obce. Pokud vám však zaškolení dá větší jistotu, rádi vám poskytneme veškerou podporu."
			}
		]
	  }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/common/_variables.scss';

#point-content {
	margin-left: 0.5em;
}


.list-entry {
	margin-bottom: 20px;
}
.list-number {
	border-radius: 50%;
	border: 2px solid $black;
	justify-content: center;
	align-items: center;
	display: flex;
	width: 60px;
  	height: 60px;
	margin-right: 10px;
}

</style>
