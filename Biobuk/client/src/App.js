import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BiobukProvider } from './context/BiobukContext';
import { BiobukBrowser } from './routes/BiobukBrowser';

function App() {
  return (
    <div className="App">
      <BiobukProvider>
        <BiobukBrowser />
      </BiobukProvider>
    </div>
  );
}

export default App;
