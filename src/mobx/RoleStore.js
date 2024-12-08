import _ from 'lodash';
import { makeAutoObservable, runInAction } from 'mobx';
import RoleService from 'services/RoleService';
import { AutoSave } from './AutoSave';

class MainStore {
  content_loading = false;
  actionLoading = false;
  roles = [];
  role = {};

  constructor() {
    makeAutoObservable(this);

    AutoSave(this, 'role-store');
  }

  async CreateRole(data) {
    runInAction(() => {
      this.actionLoading = true;
    });
    try {
      const resp = await RoleService.create(data);
      return Promise.resolve(resp);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.actionLoading = false;
      });
    }
  }

  async UpdateRole(id, data) {
    runInAction(() => {
      this.actionLoading = true;
    });
    try {
      const resp = await RoleService.update(id, data);
      return Promise.resolve(resp);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.actionLoading = false;
      });
    }
  }

  async GetRoles() {
    runInAction(() => {
      this.content_loading = true;
    });
    try {
      const resp = await RoleService.get({
        params: {
          is_deleted: false,
          is_hidden: false,
          limit: 5000,
        },
      });
      runInAction(() => {
        this.roles = resp.data;
      });
      return Promise.resolve(this.roles);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.content_loading = false;
      });
    }
  }

  async GetRoleById(_id) {
    runInAction(() => {
      this.content_loading = true;
    });
    try {
      const resp = await RoleService.get({
        params: { _id },
      });
      runInAction(() => {
        this.role = {
          ...resp.data,
          abilities: _.mapValues(_.groupBy(resp.data.abilities, '_id'), (v) => true),
        };
      });
      return Promise.resolve(this.role);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.content_loading = false;
      });
    }
  }

  async DeleteRole(id) {
    runInAction(() => {
      this.actionLoading = true;
    });
    try {
      const resp = await RoleService.delete(id);
      return Promise.resolve(resp);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.actionLoading = false;
      });
    }
  }
}

const RoleStore = new MainStore();
export default RoleStore;
