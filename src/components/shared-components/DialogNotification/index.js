import { NotificationManager } from 'react-notifications';
import moment from 'moment';

const DialogNotification = (type, title, description, duration = 3000) => {
  NotificationManager[type](description || moment().format('DD/MM/YYYY HH:mm'), title, duration);
};

export default DialogNotification;
