import anecdoteServices from '../services/anecdotes';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAlertDispatch } from '../NotificationContext';

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const dispatch = useAlertDispatch();
  const newAnecdoteMutation = useMutation({
    mutationFn: anecdoteServices.createAnecdote,
    onSuccess: (anecdote) => {
      const anecdotes = queryClient.getQueryData({ queryKey: ['anecdotes'] });
      queryClient.setQueryData({ queryKey: ['anecdotes'] }, anecdotes.concat(anecdote));
      dispatch({
        type: 'ALERT',
        payload: { content: `new anecdote '${anecdote.content}' created` }
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

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';

    if (content.length < 5) {
      dispatch({
        type: 'ERROR',
        payload: { content: 'anecdote must be at least 5 characters long' }
      })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
    } else {
      newAnecdoteMutation.mutate({ content, votes: 0 });
    };

  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type='submit'>create</button>
      </form>
    </div>
  )
}
  
  export default AnecdoteForm
