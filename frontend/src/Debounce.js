import _ from 'lodash';

const Debounce = (timeout = 1000) => {
  let action_ = null;
  const debounce = _.debounce(() => {
    action_?.();
  }, timeout);
  return Object.freeze({
    exec: (action) => {
      action_ = action;
      return debounce();
    },
    cancel: debounce.cancel,
  });
};

export default Debounce;
