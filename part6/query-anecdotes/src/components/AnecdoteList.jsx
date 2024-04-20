import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAlertDispatch } from '../NotificationContext';
import anecdoteServices from '../services/anecdotes';


const AnecdoteList = ({ anecdotes }) => {

    const queryClient = useQueryClient();
    const dispatch = useAlertDispatch();

    const newAnecdoteMutation = useMutation({
    mutationFn: anecdoteServices.addVote,
    onSuccess: (anecdote) => {
      const anecdotes = queryClient.getQueryData({ queryKey: ['anecdotes'] });
      queryClient.setQueryData({ queryKey: ['anecdotes'] }, anecdotes.map(a =>
        a.id === anecdote.id
          ? anecdote
          : a
      ));
      dispatch({
        type: 'ALERT',
        payload: { content: `anecdote '${anecdote.content}' voted` }
      });
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000);
    },
    onError: (error) => {
      dispatch({
        type: 'ALERT',
        payload: { content: error.response.data.error }
      });
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000);
    }
  });

  const handleVote = (anecdote) => {
    newAnecdoteMutation.mutate(anecdote);
  };


    return (
        <div>
        {anecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
            <div key={anecdote.id}>
              <div>
                {anecdote.content}
              </div>
              <div>
                has {anecdote.votes}
                <button onClick={() => handleVote(anecdote)}>vote</button>
              </div>
            </div>
          )}
          </div>
    )
}

export default AnecdoteList