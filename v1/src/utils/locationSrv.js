class LocationSrv {
  constructor() {
    this.search = (name) => {
      window.location.href = `/profile?userName=${name}`;
    };
    this.moveHome = () => {
      window.location.href = '/';
    };

    this.getRequest = () => {
      if (window.location.search.length > 1) {
        const get = {};
        const ret = window.location.search.substr(1).split('&');
        for (let i = 0; i < ret.length; i += 1) {
          const r = ret[i].split('=');
          get[r[0]] = decodeURIComponent(r[1]);
        }
        return get;
      }

      return false;
    };
  }
}

const locationSrv = new LocationSrv();

export default locationSrv;
