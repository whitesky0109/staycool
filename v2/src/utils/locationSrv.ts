class LocationSrv {
  constructor() { }

  public search(name: string) {
    window.location.href = `/profile?userName=${name}`;
  }

  public moveHome() {
    window.location.href = '/';
  }

  public getRequest() {
    if (window.location.search.length > 1) {
      const get: any = {};
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

const locationSrv = new LocationSrv();

export default locationSrv;
