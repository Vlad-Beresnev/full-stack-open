import { useField } from "../hooks/index";
import { useDispatch } from "react-redux";
import { logUserIn } from "../reducers/loginReducer";

import Notification from "./Notification";

const LoginForm = () => {
  const { reset: resetUsername, ...username } = useField("text");
  const { reset: resetPassword, ...password } = useField("password");

  const dispatch = useDispatch();

  const handleLogin = (event) => {
    event.preventDefault();
    const credentials = {
      username: username.value,
      password: password.value,
    };
    dispatch(logUserIn(credentials));
    resetUsername();
    resetPassword();
  };

  return (
    <div>
      <h2 className="header-title">Blogs App</h2>
      <Notification />
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <textarea label="username" {...username} />
        </div>
        <div>
          <textarea label="password" {...password} />
        </div>
        <button variant="contained" color="primary" type="submit">
          login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;