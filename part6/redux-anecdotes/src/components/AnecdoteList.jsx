import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { voteAnecdote, initializeAnecdotes } from "../reducers/anecdoteReducer";
import { createNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const filter = useSelector((state) => state.filter);
  const anecdotes = useSelector((state) =>
    filter
      ? state.anecdotes.filter((anecdote) =>
          anecdote.content.toLowerCase().includes(filter.toLowerCase())
        )
      : state.anecdotes
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAnecdotes());
  }, [dispatch, anecdotes]);

  const handleVote = (anecdote) => {
    dispatch(voteAnecdote(anecdote));
    dispatch(createNotification(`You voted '${anecdote.content}'`, 5));
  };

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes).filter((anecdote) => filter ? anecdote.content.toLowerCase().includes(filter.toLowerCase()) : true)

  return sortedAnecdotes.map((anecdote) => (
    anecdote && (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => handleVote(anecdote)}>vote</button>
      </div>
    </div> )
  )
);
};

export default AnecdoteList;