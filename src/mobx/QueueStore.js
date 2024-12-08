import { task } from 'mobx-task';
import { action, observable } from 'mobx';
import fetch from 'axios/FetchMaster';
import DialogNotification from 'components/shared-components/DialogNotification';
import { AutoSave } from './AutoSave';
import _ from 'lodash';
import UserStore from './UserStore';

const QueueStore = observable({
  channelList: [],
  channelServiceList: [],
  activeChannel: '1',
  remaining: 0,
  currentQueue: {},
  getRemaining: task(async () => {
    try {
      const resp = await fetch.queue({
        method: 'get',
        url: '/queue/get_current_queue',
        params: { channel: QueueStore.activeChannel },
      });

      const { data = {}, status = 400 } = resp;

      if (_.get(data, 'statusCode', 200) === 401) {
        UserStore.RefreshQueueToken();
      }

      if (status !== 200) {
        return Promise.reject(status);
      }

      const isQueueNormal = !(data?.ret < 0);
      if (!isQueueNormal) {
        return Promise.reject(data);
      }

      QueueStore.setRemaining(data.remaining);
      return Promise.resolve(resp);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setRemaining: action((remaining) => (QueueStore.remaining = remaining)),
  getCurrentQueue: task(async () => {
    try {
      const resp = await fetch.queue({
        method: 'get',
        url: '/queue/get_current_queue',
        params: { channel: QueueStore.activeChannel },
      });

      const { data = {}, status = 400 } = resp;

      if (_.get(data, 'statusCode', 200) === 401) {
        UserStore.RefreshQueueToken();
      }

      if (status !== 200) {
        return Promise.reject(status);
      }

      const isQueueNormal = !(data?.ret < 0);
      if (!isQueueNormal) {
        QueueStore.setCurrentQueue(data.data);
        QueueStore.setRemaining(data.remaining);
        return Promise.reject(data);
      }

      QueueStore.setCurrentQueue(data.data);
      QueueStore.setRemaining(data.remaining);
      return Promise.resolve(resp);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setCurrentQueue: action((_store) => (QueueStore.currentQueue = _store)),
  getChannelList: task(async () => {
    try {
      const _resp = await fetch.queue({
        method: 'get',
        url: '/admin/channel',
      });

      const { data = {}, status = 400 } = _resp;

      if (status !== 200) {
        return Promise.reject(status);
      }

      QueueStore.setChannelList(_.get(data, 'data', []));
      return Promise.resolve(_resp);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setChannelList: action((_store) => (QueueStore.channelList = _store)),
  getChannelServiceList: task(async (channel = '1') => {
    try {
      const _resp = await fetch.queue({
        method: 'get',
        url: '/admin/channel',
        params: {
          channel,
        },
      });

      const { data = {}, status = 400 } = _resp;

      if (status !== 200) {
        return Promise.reject(status);
      }

      QueueStore.setChannelServiceList(_.get(data, 'data.service_type.queue_type', []));
      QueueStore.setActiveChannel(channel);
      return Promise.resolve(_resp);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setChannelServiceList: action((_store) => (QueueStore.channelServiceList = _store)),
  setActiveChannel: action((_store) => (QueueStore.activeChannel = _store)),
  updateChannelInfo: task(async (payload = [], channel = '1') => {
    try {
      const _resp = await fetch.queue({
        method: 'put',
        url: '/admin/channel',
        data: { service_type: payload },
        params: { channel },
      });

      QueueStore.setActiveChannel(channel);
      QueueStore.getCurrentQueue();
      DialogNotification('success', 'แก้ไขช่องบริการสำเร็จ');
      return Promise.resolve(_resp);
    } catch (error) {
      DialogNotification('error', 'แก้ไขช่องบริการไม่สำเร็จ');
      return Promise.reject(error);
    }
  }),
  createRepeatQueue: task(async () => {
    try {
      const _resp = await fetch.queue({
        method: 'get',
        url: '/queue/requeue',
        params: { channel: _.get(QueueStore, 'activeChannel') },
      });

      DialogNotification('success', 'เรียกคิวซ้ำสำเร็จ');
      return Promise.resolve(_resp);
    } catch (error) {
      DialogNotification('error', 'เรียกคิวซ้ำไม่สำเร็จ');
      return Promise.reject(error);
    }
  }),
  createNextQueue: task(async () => {
    try {
      const resp = await fetch.queue({
        method: 'put',
        url: '/queue/next_queue',
        params: { channel: _.get(QueueStore, 'activeChannel') },
      });

      const { data: respData } = resp.data;

      if (respData.ret === -1) {
        throw new Error('ไม่สามารถเรียกคิวถัดไปได้');
      }

      QueueStore.setCurrentQueue(respData.next_queue);
      await QueueStore.getRemaining();

      DialogNotification('success', 'เรียกคิวถัดไปสำเร็จ');
      return Promise.resolve(resp);
    } catch (error) {
      DialogNotification('error', 'เรียกคิวถัดไปไม่สำเร็จ');
      return Promise.reject(error);
    }
  }),
});

AutoSave(QueueStore, 'queue-store');

export default QueueStore;
