(function (global) {
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyBannerPage = {
    name: 'SnowyBannerPage',
    setup() {
      return Vue.inject('snowyPrototypeContext');
    },
    template: `
      <section>
        <snowy-banner-query-form></snowy-banner-query-form>
        <snowy-banner-data-table></snowy-banner-data-table>
      </section>`
  };
})(window);
