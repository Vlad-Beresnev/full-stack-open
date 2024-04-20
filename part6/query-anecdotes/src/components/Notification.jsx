import { useAlertContext } from '../NotificationContext';

const Notification = () => {

const { content, status } = useAlertContext();

  
const style = {
  color: status === 'error' ? 'red': 'green',
  background: 'lightblue',
  fontSize: '20px',
  borderSize: '5px',
  borderStyle: 'solid',
  borderRadius: '5px',
  padding: '10px',
  marginBottom: '10px'
}


  if (!content) return null;

  return (
    <div style={style}>
      {content}
    </div>
  );
};

export default Notification;
