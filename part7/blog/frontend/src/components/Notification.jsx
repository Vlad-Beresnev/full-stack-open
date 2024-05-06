import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (notification === null) return null;

  return <p severity={notification.type}>{notification.message}</p>;
};

export default Notification;