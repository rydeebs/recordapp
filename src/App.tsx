import { GoalProvider } from './context/GoalContext';
import SomeComponent from './components/SomeComponent';

function App() {
  return (
    <GoalProvider>
      <SomeComponent />
    </GoalProvider>
  );
}

export default App; 