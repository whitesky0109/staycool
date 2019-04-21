import Axios from 'axios';

class BackendSrv {
  constructor() {}

  public getChampionImg(champion: any) {
    return Axios.get(`/static/airgg/riot_api/9.2.1/data/ko_KR/champion/${champion}.json`)
  }

  public getSeasonData(season: any) {
    return Axios.get('/f/season/users/', {
      params: { season },
    });
  }

  public getVersion = () => Axios.get('/f/updatedate/');

  public getMembers = () => Axios.get('/f/members/');

  public getTeamData = (memberIDs: any) => Axios.get('/f/team/', {
    params: {
      member0: memberIDs[0],
      member1: memberIDs[1],
      member2: memberIDs[2],
      member3: memberIDs[3],
      member4: memberIDs[4],
    },
  })

  public getUserData = (userName: any) => Axios.get('/f/profile/', {
    params: {
      userName,
    },
  })

  public getSeasonUserData = (userName: any, season: any) => Axios.get('/f/profile/', {
    params: {
      userName,
      season,
    },
  })

  public getMostChampData = (season: any) => Axios.get('/f/season/pickban/', {
    params: {
      season,
    },
  })

  public getMostDuoData = (season: any) => Axios.get('/f/season/duo/', {
    params: {
      season,
    },
  })
}

const backendSrv = new BackendSrv();

export default backendSrv;
