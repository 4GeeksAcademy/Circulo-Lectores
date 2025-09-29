import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../context/UserContext';
import {
  getBooksSearch,
  postRecommendations,
  postReadingList,
  postReview,
} from '../services/api/books';
import '../components/profile-buttons.css';
import { postQuote } from '../services/api/books';
import { updateProfile, getCurrentUser } from '../services/api/users';
import { getUserStats } from '../services/api/follows';

export const Profile = () => {
  const { logout, profile, setUser, setProfile } = useContext(UserContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [quote, setQuote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [books, setBooks] = useState([]);
  const [bookSelected, setBookSelected] = useState({});
  const [newUsername, setNewUsername] = useState('');

  const [followersCount, setFollowersCount] = useState(0);
  const [followingsCount, setFollowingsCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showReadingListModal, setShowReadingListModal] = useState(false);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      if (profile?.id) {
        try {
          setLoadingStats(true);
          const stats = await getUserStats(profile.id);
          setFollowersCount(stats.followers_count);
          setFollowingsCount(stats.followings_count);
        } catch (error) {
          console.error('Error fetching user stats:', error);
        } finally {
          setLoadingStats(false);
        }
      }
    };
    fetchStats();
  }, [profile?.id]);

  const getProfileAvatar = () => {
    const userName = profile?.name || 'Usuario';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=7c3aed&color=fff&size=100&bold=true&rounded=true`;
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Por favor ingresa un término de búsqueda');
      return;
    }
    setError('');
    try {
      const result = await getBooksSearch(query);
      setBooks(result);
    } catch (error) {
      console.error(error);
      setError('Error al buscar libros. Intenta de nuevo.');
      setBooks([]);
    }
  };

  const handleBookSelected = (book) => {
    setQuery(book.title);
    setBookSelected(book);
    setBooks([]);
  };

  const handleSaveQuote = async () => {
    try {
      const saveQuote = await postQuote(bookSelected.book_id, quote.trim());
      alert(`${saveQuote['message']}`);
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      setQuery('');
      setQuote('');
    }
  };

  const handleSaveRecommendation = async () => {
    try {
      const saveRecommendation = await postRecommendations(
        bookSelected.book_id
      );
      alert(`${saveRecommendation['message']}`);
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      setQuery('');
    }
  };

  const handleCloseModals = () => {
    setQuery('');
    setQuote('');
  };

  const handleSaveProfile = async () => {
    setError('');
    setSuccess('');
    try {
      const profile = await updateProfile(newUsername);
      setProfile(profile);
      const user = await getCurrentUser();
      setUser(user);
      setSuccess('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setError('Error al actualizar el perfil');
    } finally {
      setIsEditing(false);
      setNewUsername('');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleOptionSelect = (option) => {
    setShowAddModal(false);
    switch (option) {
      case 'reading_list':
        setShowReadingListModal(true);
        break;
      case 'recommendation':
        setShowRecommendationModal(true);
        break;
      case 'quote':
        setShowNewQuoteModal(true);
        break;
      case 'review':
        setShowReviewModal(true);
        break;
    }
  };

  const handleSaveReadingList = async () => {
    try {
      const saveReadingList = await postReadingList(bookSelected.book_id);
      alert(`${saveReadingList['message']}`);
      setShowReadingListModal(false);
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      setQuery('');
      setBooks([]);
      setBookSelected({});
    }
  };

  const handleSaveNewRecommendation = async () => {
    try {
      const saveRecommendation = await postRecommendations(
        bookSelected.book_id
      );
      alert(`${saveRecommendation['message']}`);
      setShowRecommendationModal(false);
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      setQuery('');
      setBooks([]);
      setBookSelected({});
    }
  };

  const handleSaveNewQuote = async () => {
    try {
      const saveQuote = await postQuote(bookSelected.book_id, quote.trim());
      alert(`${saveQuote['message']}`);
      setShowNewQuoteModal(false);
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      setQuery('');
      setQuote('');
      setBooks([]);
      setBookSelected({});
    }
  };

  const handleSaveReview = async () => {
    try {
      const saveReview = await postReview(
        bookSelected.book_id,
        review.trim(),
        rating
      );
      alert(`${saveReview['message']}`);
      setShowReviewModal(false);
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      setQuery('');
      setReview('');
      setRating(0);
      setBooks([]);
      setBookSelected({});
    }
  };

  const handleCloseNewModals = () => {
    setShowReadingListModal(false);
    setShowRecommendationModal(false);
    setShowNewQuoteModal(false);
    setShowReviewModal(false);
    setQuery('');
    setQuote('');
    setReview('');
    setRating(0);
    setHoverRating(0);
    setBooks([]);
    setBookSelected({});
  };

  const handleNavigateToLibrary = () => navigate('/my_library');
  const handleNavigateToReviews = () => navigate('/my_reviews');
  const handleNavigateToQuotes = () => navigate('/my_quotes');
  const handleNavigateToRecommendations = () => navigate('/my_recommendations');

  return (
    <div className="container-fluid bg-dark min-vh-100 py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="card bg-dark border border-secondary mb-4">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h2 className="mb-0">Mi Perfil</h2>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success" role="alert">
                    {success}
                  </div>
                )}

                <div className="row">
                  <div className="col-12 col-md-4 text-center mb-4 mb-md-0">
                    <div className="mb-3">
                      <img
                        src={getProfileAvatar()}
                        alt="Avatar"
                        className="rounded-circle"
                        width="100"
                        height="100"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <h5 className="text-white mb-2">
                      {profile?.name || 'Usuario'}
                    </h5>
                    <p className="text-muted small mb-3">
                      Miembro de Círculo Lectores
                    </p>

                    {!isEditing && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm w-100"
                        onClick={() => setIsEditing(true)}
                      >
                        Editar Perfil
                      </button>
                    )}
                  </div>

                  <div
                    className="col-12 col-md-8 d-flex flex-column justify-content-center align-items-center"
                    style={{ minHeight: '220px' }}
                  >
                    {isEditing ? (
                      <div className="mb-3 w-100">
                        <label htmlFor="name" className="form-label text-white">
                          Nombre
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          placeholder={profile.name}
                        />
                        <div className="d-flex gap-2 mt-3">
                          <button
                            type="button"
                            onClick={handleSaveProfile}
                            className="btn btn-success"
                          >
                            Guardar
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                              setIsEditing(false);
                              setNewUsername('');
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="profile-buttons-row"
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          marginTop: '2.5rem',
                        }}
                      >
                        <div
                          className="profile-btn-card"
                          onClick={() => navigate('/my_followers')}
                        >
                          <h3>
                            {loadingStats ? (
                              <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                              followersCount
                            )}
                          </h3>
                          <p>Seguidores</p>
                        </div>
                        <div
                          className="profile-btn-card"
                          onClick={() => navigate('/my_followings')}
                        >
                          <h3>
                            {loadingStats ? (
                              <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                              followingsCount
                            )}
                          </h3>
                          <p>Siguiendo</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-12">
                <button
                  type="button"
                  className="btn btn-primary w-100 py-3"
                  onClick={handleShowAddModal}
                >
                  <i className="fa-solid fa-plus me-2"></i>
                  Añadir
                </button>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex gap-2 flex-wrap">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#quoteModal"
                  >
                    + Cita
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#readModal"
                  >
                    + Leído
                  </button>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-12 col-md-6">
                <div className="card bg-dark border border-secondary h-100">
                  <div className="card-header bg-secondary text-white">
                    <h5 className="mb-0">
                      <i className="fa-solid fa-book-open me-2 text-success"></i>
                      Mi Biblioteca
                    </h5>
                  </div>
                  <div className="card-body text-center">
                    <p className="text-muted mb-3">Lista de lectura</p>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={handleNavigateToLibrary}
                    >
                      Ver Libros
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="card bg-dark border border-secondary h-100">
                  <div className="card-header bg-secondary text-white">
                    <h5 className="mb-0">
                      <i className="fa-solid fa-star me-2 text-info"></i>
                      Mis Reseñas
                    </h5>
                  </div>
                  <div className="card-body text-center">
                    <p className="text-muted mb-3">Libros reseñados</p>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={handleNavigateToReviews}
                    >
                      Ver Reseñas
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="card bg-dark border border-secondary h-100">
                  <div className="card-header bg-secondary text-white">
                    <h5 className="mb-0">
                      <i className="fa-solid fa-quote-left me-2 text-warning"></i>
                      Mis Citas
                    </h5>
                  </div>
                  <div className="card-body text-center">
                    <p className="text-muted mb-3">Frases favoritas</p>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={handleNavigateToQuotes}
                    >
                      Ver Citas
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="card bg-dark border border-secondary h-100">
                  <div className="card-header bg-secondary text-white">
                    <h5 className="mb-0">
                      <i className="fa-solid fa-heart me-2 text-danger"></i>
                      Recomendaciones
                    </h5>
                  </div>
                  <div className="card-body text-center">
                    <p className="text-muted mb-3">Libros recomendados</p>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={handleNavigateToRecommendations}
                    >
                      Ver Recomendaciones
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="quoteModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5"></h1>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Libro:
                  </label>
                  <div className="input-group">
                    <button
                      onClick={handleSearch}
                      type="button"
                      className="btn btn-primary btn-sm dropdown-toggle-split"
                      data-bs-toggle="dropdown"
                    >
                      Buscar
                    </button>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar libros por título, autor..."
                      id="recipient-name"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <ul className="dropdown-menu">
                      {books.map((book) => (
                        <li key={book.book_id}>
                          <button
                            type="button"
                            onClick={() => handleBookSelected(book)}
                            className="dropdown-item d-flex align-items-center"
                          >
                            <img
                              src={`https://covers.openlibrary.org/b/id/${book.cover_id}-S.jpg`}
                              alt={book.title}
                              style={{
                                width: '30px',
                                height: '45px',
                                objectFit: 'cover',
                                marginRight: '8px',
                              }}
                            />
                            <span>{book.title}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="message-text" className="col-form-label">
                    Cita:
                  </label>
                  <textarea
                    className="form-control"
                    id="message-text"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleCloseModals}
              >
                Cerrar
              </button>
              <button
                onClick={handleSaveQuote}
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="readModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5"></h1>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Libro:
                  </label>
                  <div className="input-group">
                    <button
                      onClick={handleSearch}
                      type="button"
                      className="btn btn-primary btn-sm dropdown-toggle-split"
                      data-bs-toggle="dropdown"
                    >
                      Buscar
                    </button>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar libros por título, autor..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <ul className="dropdown-menu">
                      {books.map((book) => (
                        <li key={book.book_id}>
                          <button
                            type="button"
                            onClick={() => handleBookSelected(book)}
                            className="dropdown-item d-flex align-items-center"
                          >
                            <img
                              src={`https://covers.openlibrary.org/b/id/${book.cover_id}-S.jpg`}
                              alt={book.title}
                              style={{
                                width: '30px',
                                height: '45px',
                                objectFit: 'cover',
                                marginRight: '8px',
                              }}
                            />
                            <span>{book.title}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleCloseModals}
              >
                Cerrar
              </button>
              <button
                onClick={handleSaveRecommendation}
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border border-secondary">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Añadir contenido</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseAddModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <button
                      className="btn btn-outline-secondary w-100 h-100 p-3 text-start"
                      onClick={() => handleOptionSelect('reading_list')}
                    >
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-book-open fa-2x me-3 text-success"></i>
                        <div>
                          <div className="text-white fw-bold mb-1">Lectura</div>
                          <small className="text-white">
                            Agregar libro para leer después
                          </small>
                        </div>
                      </div>
                    </button>
                  </div>
                  <div className="col-12 col-md-6">
                    <button
                      className="btn btn-outline-secondary w-100 h-100 p-3 text-start"
                      onClick={() => handleOptionSelect('recommendation')}
                    >
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-heart fa-2x me-3 text-danger"></i>
                        <div>
                          <div className="text-white fw-bold mb-1">
                            Recomendación
                          </div>
                          <small className="text-white">
                            Recomendar un libro a la comunidad
                          </small>
                        </div>
                      </div>
                    </button>
                  </div>
                  <div className="col-12 col-md-6">
                    <button
                      className="btn btn-outline-secondary w-100 h-100 p-3 text-start"
                      onClick={() => handleOptionSelect('quote')}
                    >
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-quote-left fa-2x me-3 text-warning"></i>
                        <div>
                          <div className="text-white fw-bold mb-1">Cita</div>
                          <small className="text-white">
                            Compartir una frase que te gustó
                          </small>
                        </div>
                      </div>
                    </button>
                  </div>
                  <div className="col-12 col-md-6">
                    <button
                      className="btn btn-outline-secondary w-100 h-100 p-3 text-start"
                      onClick={() => handleOptionSelect('review')}
                    >
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-star fa-2x me-3 text-info"></i>
                        <div>
                          <div className="text-white fw-bold mb-1">Reseña</div>
                          <small className="text-white">
                            Escribir tu opinión sobre un libro
                          </small>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReadingListModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content bg-dark border border-secondary">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Añadir a lista de lectura</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseNewModals}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="col-form-label text-white">Libro:</label>
                  <div className="input-group">
                    <button
                      onClick={handleSearch}
                      type="button"
                      className="btn btn-success btn-sm"
                    >
                      Buscar
                    </button>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar libros por título, autor..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  {books.length > 0 && (
                    <ul className="list-group mt-2">
                      {books.map((book) => (
                        <li
                          key={book.book_id}
                          className="list-group-item list-group-item-action d-flex"
                        >
                          <img
                            src={`https://covers.openlibrary.org/b/id/${book.cover_id}-S.jpg`}
                            className="me-3"
                            style={{
                              width: '40px',
                              height: '60px',
                              objectFit: 'cover',
                            }}
                          />
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{book.title}</h6>
                            <small className="text-muted">{book.author}</small>
                          </div>
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleBookSelected(book)}
                          >
                            Seleccionar
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseNewModals}
                >
                  Cerrar
                </button>
                <button
                  onClick={handleSaveReadingList}
                  type="button"
                  className="btn btn-success"
                  disabled={!bookSelected.book_id}
                >
                  Añadir a lista
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRecommendationModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content bg-dark border border-secondary">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Añadir recomendación</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseNewModals}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="col-form-label text-white">Libro:</label>
                  <div className="input-group">
                    <button
                      onClick={handleSearch}
                      type="button"
                      className="btn btn-danger btn-sm"
                    >
                      Buscar
                    </button>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar libros por título, autor..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  {books.length > 0 && (
                    <ul className="list-group mt-2">
                      {books.map((book) => (
                        <li
                          key={book.book_id}
                          className="list-group-item list-group-item-action d-flex"
                        >
                          <img
                            src={`https://covers.openlibrary.org/b/id/${book.cover_id}-S.jpg`}
                            className="me-3"
                            style={{
                              width: '40px',
                              height: '60px',
                              objectFit: 'cover',
                            }}
                          />
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{book.title}</h6>
                            <small className="text-muted">{book.author}</small>
                          </div>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleBookSelected(book)}
                          >
                            Seleccionar
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseNewModals}
                >
                  Cerrar
                </button>
                <button
                  onClick={handleSaveNewRecommendation}
                  type="button"
                  className="btn btn-danger"
                  disabled={!bookSelected.book_id}
                >
                  Recomendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewQuoteModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content bg-dark border border-secondary">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">Añadir cita</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseNewModals}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="col-form-label text-white">Libro:</label>
                  <div className="input-group">
                    <button
                      onClick={handleSearch}
                      type="button"
                      className="btn btn-warning btn-sm"
                    >
                      Buscar
                    </button>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar libros por título, autor..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  {books.length > 0 && (
                    <ul className="list-group mt-2">
                      {books.map((book) => (
                        <li
                          key={book.book_id}
                          className="list-group-item list-group-item-action d-flex"
                        >
                          <img
                            src={`https://covers.openlibrary.org/b/id/${book.cover_id}-S.jpg`}
                            className="me-3"
                            style={{
                              width: '40px',
                              height: '60px',
                              objectFit: 'cover',
                            }}
                          />
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{book.title}</h6>
                            <small className="text-muted">{book.author}</small>
                          </div>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleBookSelected(book)}
                          >
                            Seleccionar
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mb-3">
                  <label className="col-form-label text-white">Cita:</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Escribe la cita que te gustó..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseNewModals}
                >
                  Cerrar
                </button>
                <button
                  onClick={handleSaveNewQuote}
                  type="button"
                  className="btn btn-warning"
                  disabled={!bookSelected.book_id || !quote.trim()}
                >
                  Guardar cita
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content bg-dark border border-secondary">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title">Añadir reseña</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseNewModals}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="col-form-label text-white">Libro:</label>
                  <div className="input-group">
                    <button
                      onClick={handleSearch}
                      type="button"
                      className="btn btn-info btn-sm"
                    >
                      Buscar
                    </button>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar libros por título, autor..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  {books.length > 0 && (
                    <ul className="list-group mt-2">
                      {books.map((book) => (
                        <li
                          key={book.book_id}
                          className="list-group-item list-group-item-action d-flex"
                        >
                          <img
                            src={`https://covers.openlibrary.org/b/id/${book.cover_id}-S.jpg`}
                            className="me-3"
                            style={{
                              width: '40px',
                              height: '60px',
                              objectFit: 'cover',
                            }}
                          />
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{book.title}</h6>
                            <small className="text-muted">{book.author}</small>
                          </div>
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => handleBookSelected(book)}
                          >
                            Seleccionar
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mb-3">
                  <label className="col-form-label text-white">
                    Calificación:
                  </label>
                  <div className="d-flex align-items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`fa-solid fa-star fa-lg ${
                          star <= (hoverRating || rating)
                            ? 'text-warning'
                            : 'text-muted'
                        }`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      ></i>
                    ))}
                    <span className="text-white ms-2">
                      {rating > 0 ? `${rating}/5 estrellas` : 'Sin calificar'}
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="col-form-label text-white">Reseña:</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Escribe tu opinión sobre este libro..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseNewModals}
                >
                  Cerrar
                </button>
                <button
                  onClick={handleSaveReview}
                  type="button"
                  className="btn btn-info"
                  disabled={
                    !bookSelected.book_id || !review.trim() || rating === 0
                  }
                >
                  Guardar reseña
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
