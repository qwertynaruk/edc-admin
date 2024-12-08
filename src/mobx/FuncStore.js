/* eslint-disable camelcase */
import { action, observable } from 'mobx';

const FuncStore = observable({
  itemSuggestion: [],
  setItemSuggestion: action((_store = []) => (FuncStore.itemSuggestion = _store.filter((e) => e))),
});
export default FuncStore;
