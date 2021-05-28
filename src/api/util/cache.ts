import { INovelProfile, IUserInfo, IMap } from '../../types';

class LinpxCache<T extends { id: string }> {
  store: Map<string, T> = new Map();

  get = (id: string) => {
    return this.store.get(id);
  };

  set = (id: string, data: T) => {
    return this.store.set(id, data);
  };

  getList = (idList: string[]) => {
    const result: IMap<T> = {};
    const left: string[] = [];
    idList.forEach((id) => {
      const data = this.store.get(id);
      if (data) result[id] = data;
      else left.push(id);
    });
    return {
      result,
      left: left.length ? left : null,
    };
  };

  setList = (dataList: T[]) => {
    dataList.map((data) => this.store.set(data.id, data));
  };
}

const cache: {
  user: LinpxCache<IUserInfo>;
  novelProfiles: LinpxCache<INovelProfile>;
} = {
  user: new LinpxCache(),
  novelProfiles: new LinpxCache(),
};

export default cache;
