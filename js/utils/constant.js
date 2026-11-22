(function () {
  window.SodamConstants = Object.freeze({
    storagePrefix: 'sodam:',
    events: Object.freeze({ dataChanged: 'sodam:data-changed' }),
    keys: Object.freeze({
      creations: 'sodam:creations', reservations: 'sodam:reservations',
      messages: 'sodam:messages', reservationDraft: 'sodam:reservation-draft',
      adminSession: 'sodam:admin-session', lastReservation: 'sodam:last-reservation', config: 'sodam:config'
    }),
    categories: Object.freeze({
      pavlova: 'Pavlova', 'dome-cakes': 'Dome cakes', 'custom-cakes': 'Custom cakes',
      'fruit-cakes': 'Fruit cakes', seasonal: 'Seasonal'
    }),
    reservationStatuses: Object.freeze(['new', 'confirmed', 'completed', 'cancelled'])
  });
})();
