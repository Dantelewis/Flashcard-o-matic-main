import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteDeck, listDecks } from '../utils/api/index.js';

// Component for Home screen
function Home() {
  const mountedRef = useRef(false);
  const [decks, setDecks] = useState([]);
  const navigate = useNavigate();

  // Effects
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    async function loadDecks() {
      try {
        const decks = await listDecks();
        if (mountedRef.current) {
          setDecks((_) => [...decks]);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          throw error;
        }
      }
    }
    loadDecks();

    return () => abortController.abort();
  }, []);

  // Handlers
  const deleteHandler = async (deckId) => {
    const confirmation = window.confirm(
      'Delete this deck? You will not be able to recover it.'
    );
    if (confirmation) {
      await deleteDeck(deckId);
      history.go(0);
    }
  };

  // map out JSX for to display all decks retreived as stylized cards
  const styledDecks = decks.map((deck) => (
    <div
      key={deck.id}
      className='card'
      style={{ width: '100%', marginTop: '1em' }}
    >
      <div className='card-body'>
        <div className='d-flex justify-content-between'>
          <h4 className='card-title'>{deck.name}</h4>
          <p>{deck.cards.length} cards</p>
        </div>
        <p className='card-text text-secondary'>{deck.description}</p>
        <div className='d-flex justify-content-between mt-4'>
          <Link to={`/decks/${deck.id}`} className='card-link'>
            <button
              className='btn btn-secondary'
              onClick={() => navigate(`/decks/${deck.id}`)}
            >
              <i className='fas fa-binoculars'></i> View
            </button>
          </Link>
          <Link to={`/decks/${deck.id}/study`} className='card-link'>
            <button
              className='btn btn-primary'
              onClick={() => navigate(`/decks/${deck.id}/study`)}
            >
              <i className='fas fa-book'></i> Study
            </button>
          </Link>
          <Link to='#' className='card-link'>
            <button
              className='btn btn-danger'
              onClick={() => deleteHandler(deck.id)}
            >
              <i className='fas fa-trash'></i> Delete
            </button>
          </Link>
        </div>
      </div>
    </div>
  ));

  // return decks
  return decks ? (
    <>{styledDecks}</>
  ) : (
    <p>Loading...</p>
  );
}

export default Home;