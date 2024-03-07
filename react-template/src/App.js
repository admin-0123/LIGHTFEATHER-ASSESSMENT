import "./App.css";
import NotificationForm from "./pages/notificationForm/NotificationForm";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import './notification.css';
import Temp from "./pages/notificationForm/Temp";



function App() {
  return (
    <div className="App">
      <NotificationForm />
      {/* <Temp/> */}
      <NotificationContainer/>
    </div>
  );
}

export default App;
