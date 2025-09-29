import { useState } from 'react';
import { searchUsers, followUser, unfollowUser } from '../services/api/follows';

export const UserSearch = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await searchUsers(query);
      setUsers(results);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId, index) => {
    try {
      await followUser(userId);
      // Actualizar el estado local
      const newUsers = [...users];
      newUsers[index].is_following = true;
      newUsers[index].followers_count += 1;
      setUsers(newUsers);
    } catch (error) {
      console.error('Error following user:', error);
      alert('Error al seguir usuario');
    }
  };

  const handleUnfollow = async (userId, index) => {
    try {
      await unfollowUser(userId);
      // Actualizar el estado local
      const newUsers = [...users];
      newUsers[index].is_following = false;
      newUsers[index].followers_count -= 1;
      setUsers(newUsers);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      alert('Error al dejar de seguir');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getProfileAvatar = (userName) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=7c3aed&color=fff&size=80&bold=true&rounded=true`;
  };

  return (
    <div className="container-fluid bg-dark min-vh-100 py-4">
      <div className="container">
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card bg-dark border border-secondary">
              <div className="card-body">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar usuarios..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={loading}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      <i className="fa-solid fa-search"></i>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {users.length > 0 && (
          <div className="row g-3">
            {users.map((user, index) => (
              <div key={user.id} className="col-12 col-md-6 col-lg-4">
                <div className="card bg-dark border border-secondary h-100">
                  <div className="card-body d-flex align-items-center">
                    <img
                      src={getProfileAvatar(user.name)}
                      alt={user.name}
                      className="rounded-circle me-3"
                      width="60"
                      height="60"
                    />
                    <div className="flex-grow-1">
                      <h6 className="text-white mb-1">{user.name}</h6>
                      <small className="text-muted">
                        {user.followers_count} seguidores ·{' '}
                        {user.followings_count} siguiendo
                      </small>
                    </div>
                    {user.is_following ? (
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleUnfollow(user.id, index)}
                      >
                        Siguiendo
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleFollow(user.id, index)}
                      >
                        Seguir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
