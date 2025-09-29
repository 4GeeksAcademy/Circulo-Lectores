import { useContext, useState } from 'react';
import { NavLink } from 'react-router';
import { UserContext } from '../context/UserContext';
import { routesConfig } from '../services/routing/routes';
import { searchUsers, followUser, unfollowUser } from '../services/api/follows';

export const NavBar = () => {
  const { user, logout } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setSearching(true);
    try {
      const results = await searchUsers(query);
      setSearchResults(results);
      setShowDropdown(results.length > 0);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleFollow = async (userId, index) => {
    try {
      await followUser(userId);
      const newResults = [...searchResults];
      newResults[index].is_following = true;
      newResults[index].followers_count += 1;
      setSearchResults(newResults);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (userId, index) => {
    try {
      await unfollowUser(userId);
      const newResults = [...searchResults];
      newResults[index].is_following = false;
      newResults[index].followers_count -= 1;
      setSearchResults(newResults);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const getProfileAvatar = (userName) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=7c3aed&color=fff&size=40&bold=true&rounded=true`;
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  return (
    <nav className="navbar bg-primary">
      <div className="container-fluid">
        <div className="d-flex align-items-center gap-3 flex-grow-1">
          {routesConfig
            .filter((route) => route.showInNavbar)
            .map((route) => (
              <NavLink key={route.name} to={route.path}>
                <button type="button" className="btn btn-primary navbar-brand">
                  {route.name}
                </button>
              </NavLink>
            ))}
        </div>

        <div className="position-relative" style={{ width: '300px' }}>
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-dark border-secondary">
              <i className="fa-solid fa-search text-white"></i>
            </span>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Buscar usuarios..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
              onBlur={handleBlur}
              style={{
                borderLeft: 'none',
              }}
            />
            {searching && (
              <span className="input-group-text bg-dark border-secondary">
                <span className="spinner-border spinner-border-sm text-white"></span>
              </span>
            )}
          </div>

          {showDropdown && (
            <div
              className="position-absolute w-100 mt-1 bg-dark border border-secondary rounded shadow-lg"
              style={{
                maxHeight: '400px',
                overflowY: 'auto',
                zIndex: 1050,
              }}
            >
              {searchResults.map((user, index) => (
                <div
                  key={user.id}
                  className="d-flex align-items-center p-2 border-bottom border-secondary"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'rgba(124, 58, 237, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <img
                    src={getProfileAvatar(user.name)}
                    alt={user.name}
                    className="rounded-circle me-2"
                    width="40"
                    height="40"
                  />
                  <div className="flex-grow-1">
                    <div
                      className="text-white fw-bold"
                      style={{ fontSize: '0.9rem' }}
                    >
                      {user.name}
                    </div>
                    <small
                      className="text-muted"
                      style={{ fontSize: '0.75rem' }}
                    >
                      {user.followers_count} seguidores
                    </small>
                  </div>
                  {user.is_following ? (
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleUnfollow(user.id, index)}
                      style={{ fontSize: '0.75rem' }}
                    >
                      Siguiendo
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleFollow(user.id, index)}
                      style={{ fontSize: '0.75rem' }}
                    >
                      Seguir
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-primary navbar-brand"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
