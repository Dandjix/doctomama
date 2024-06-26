// src/i18n.js
import { createI18n } from 'vue-i18n';

const messages = {
  fr: {
    $vuetify: {
      dataTable: {
        itemsPerPageText: 'Éléments par page:',
        ariaLabel: {
          sortDescending: 'Tri décroissant.',
          sortAscending: 'Tri croissant.',
          sortNone: 'Non trié.',
          activateNone: 'Activer pour supprimer le tri.',
          activateDescending: 'Activer pour trier par ordre décroissant.',
          activateAscending: 'Activer pour trier par ordre croissant.',
        },
        sortBy: 'Trier par',
      },
      datePicker: {
        itemsSelected: '{0} sélectionnés',
        nextMonthAriaLabel: 'Mois prochain',
        nextYearAriaLabel: 'L’année prochaine',
        prevMonthAriaLabel: 'Mois précédent',
        prevYearAriaLabel: 'L’année dernière',
      },
    },
  },
};

const i18n = createI18n({
  locale: 'fr', // set locale to French
  messages,
});

export default i18n;
