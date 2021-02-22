<template>
  <b-container>
    <b-row>
      <b-col sm="7">
      <div v-if="this.alternativePageContent.homeHtml" v-html="this.alternativePageContent.homeHtml"></div>
      <div v-else>
        <h1>Transparentní hospodaření obcí do detailu každé faktury</h1>
        <p>
          Cityvizor je aplikace pro všechny, které zajímá hospodaření obcí v ČR – pro občany, zastupitele, pracovníky obce i novináře.
          <br>
          <br>
          Přináší přehlednou vizualizaci rozpočtu obce s detailními daty, která jsou získávána přímo z účetních systémů obcí a následně zobrazována přehledně, srozumitelně a v souvislostech.
        </p>
        </div>
      </b-col>
      <b-col sm="5" md="4" offset-sm="1">
        <img src="@/assets/images/pages/home/vesnice.png"/>
      </b-col>
    </b-row>

    <ActiveCities></ActiveCities>
    <ParticipateBox class="participate-box-padding"></ParticipateBox>

    <b-row>
    <h2 class="benefits-header-margins">
      Díky Cityvizoru se snadno a rychle dozvíte
    </h2>
    </b-row>

    <b-row style="justify-content: space-between;">
      <b-col v-for="benefit in benefits" sm="12" md="3" class="description-box description-bottom-margin">
        <b-card class="description-image-margin text-center" :img-src="benefit.image" img-top img-height="200" img-width="200">
          <b-card-body>
            <b-card-text class="description-text">{{ benefit.description }}</b-card-text>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <p><router-link to="/proc-cityvizor" class="why-link-margins">Proč Cityvizor?</router-link></p>
    </b-row>

  </b-container>
</template>

<script>
import ParticipateBox from "../partials/ParticipateBox.vue"
import ActiveCities from "../partials/ActiveCities.vue"

export default {
  name: 'ComponentsPagesHome',
  components: {
    ParticipateBox,
    ActiveCities
  },
  data() {
    return {
      benefits: [
        {
          description:
              'Jak vypadá plán výdajů a příjmů i ' +
              'jeho plnění, které faktury a investice ' +
              'se k němu vážou a kdo jsou ' +
              'dodavatelé.',
          image: require('@/assets/images/pages/home/data_source.svg')
        },
        {
          description:
              'Které projektové a investiční akce právě probíhají, ' +
              'jaké prostředky jsou na ně vyhrazeny a kolik už bylo vyplaceno.',
          image: require('@/assets/images/pages/home/visualization.svg')
        },
        {
          description:
              'Nejnovější informace z úředních desek a odkazy na konkrétní ' +
              'dokumenty uveřejněné v Registru smluv.',
          image: require('@/assets/images/pages/home/details.svg')
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="scss">
@import '../../assets/styles/common/_variables.scss';

$margin: 24px;
$extra-large-margin: 64px;

.description-bottom-margin {
  margin-bottom: 10px;
}

.bottom-margin-participating-cities {
  margin-bottom: 40px;
}

.participating-header-margins {
  margin-top: 88px;
  margin-bottom: 8px;
}

.benefits-header-margins {
  margin-bottom: $margin;
  margin-top: $extra-large-margin;
}

.description-box {
  background: $white;
  border: 1px solid #CACACA;
  box-sizing: border-box;
  border-radius: 8px;
}

.description-text {
  font-size: $font-size-md;
  margin: 0px $margin $margin $margin;
}

.description-image-margin {
  margin: $margin 0px;
}

.participate-box-padding {
  padding: 32px;
}

.why-link-margins {
  margin-bottom: $extra-large-margin;
}

</style>
