import { useQuery } from '@tanstack/react-query';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import anecdoteServices from './services/anecdotes';
import AnecdoteList from './components/AnecdoteList'
import { AlertContextProvider } from './NotificationContext';


const App = () => {
  

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteServices.getAnecdotes,
    refetchOnWindowFocus: false
  });

  if(result.isLoading) return <div>loading data...</div>;
  else if(result.isError)
    return <div>anecdote service not available due to problems in server</div>;

  const anecdotes = result.data;

  return (
    <AlertContextProvider>
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      <AnecdoteList anecdotes={anecdotes}/>
    </div>
    </AlertContextProvider>
  );
};

export default App;
