import Axios from 'axios';

class BackendSrv {
  constructor() {
    this.getChampionImg = champion => Axios.get(`/static/airgg/riot_api/9.2.1/data/ko_KR/champion/${champion}.json`);
    this.getSeasonData = season => Axios.get('/f/season/users/', {
      params: {
        season,
      },
    });
    this.getVersion = () => Axios.get('/f/updatedate/');
    this.getMembers = () => Axios.get('/f/members/');
    this.getTeamData = memberIDs => Axios.get('/f/team/', {
      params: {
        member0: memberIDs[0],
        member1: memberIDs[1],
        member2: memberIDs[2],
        member3: memberIDs[3],
        member4: memberIDs[4],
      },
    });
    this.getUserData = userName => Axios.get('/f/profile/', {
      params: {
        userName,
      },
    });
    this.getSeasonUserData = (userName, season) => Axios.get('/f/profile/', {
      params: {
        userName,
        season,
      },
    });
    this.getMostChampData = season => Axios.get('/f/season/pickban/', {
      params: {
        season,
      },
    });
    this.getMostDuoData = season => Axios.get('/f/season/duo/', {
      params: {
        season,
      },
    });
  }
}

const backendSrv = new BackendSrv();

export default backendSrv;
