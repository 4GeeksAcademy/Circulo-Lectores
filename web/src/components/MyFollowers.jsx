import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../context/UserContext';
import { followUser, unfollowUser } from '../services/api/follows';

export const MyFollowers = () => {
  const { profile } = useContext(UserContext);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowers = async () => {
      if (profile?.id) {
        try {
          setLoading(true);
          const response = await fetch(`/api/follows/${profile.id}/followers`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': sessionStorage.getItem('csrf_access_token'),
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log('Followers data:', data);

          // Añadir info de si los seguimos
          const followersWithStatus = await Promise.all(
            data.map(async (follower) => {
              try {
                const searchResponse = await fetch(
                  `/api/profiles/search?q=${follower.name}`,
                  {
                    credentials: 'include',
                    headers: {
                      'Content-Type': 'application/json',
                      'X-CSRF-TOKEN':
                        sessionStorage.getItem('csrf_access_token'),
                    },
                  }
                );
                const searchData = await searchResponse.json();
                const followerData = searchData.find(
                  (u) => u.id === follower.id
                );
                return {
                  ...follower,
                  is_following: followerData?.is_following || false,
                };
              } catch {
                return { ...follower, is_following: false };
              }
            })
          );

          setFollowers(followersWithStatus);
        } catch (error) {
          console.error('Error fetching followers:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchFollowers();
  }, [profile?.id]);

  const handleFollow = async (userId, index) => {
    try {
      await followUser(userId);
      const newFollowers = [...followers];
      newFollowers[index].is_following = true;
      setFollowers(newFollowers);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (userId, index) => {
    try {
      await unfollowUser(userId);
      const newFollowers = [...followers];
      newFollowers[index].is_following = false;
      setFollowers(newFollowers);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const getProfileAvatar = (userName) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=7c3aed&color=fff&size=60&bold=true&rounded=true`;
  };

  if (loading) {
    return (
      <div className="container-fluid bg-dark min-vh-100 py-4">
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="text-white">Cargando seguidores...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-dark min-vh-100 py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="d-flex align-items-center mb-4">
              <button
                className="btn btn-link text-white p-0 me-3"
                onClick={() => navigate(-1)}
              >
                <i className="fa-solid fa-arrow-left fa-lg"></i>
              </button>
              <h1 className="text-white mb-0">Mis Seguidores</h1>
            </div>

            {followers.length === 0 ? (
              <div className="text-center">
                <div className="card bg-dark border border-secondary">
                  <div className="card-body py-5">
                    <i className="fa-solid fa-users fa-3x text-muted mb-3"></i>
                    <h5 className="text-white">No tienes seguidores aún</h5>
                    <p className="text-muted">
                      Cuando otros usuarios te sigan, aparecerán aquí
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row g-3">
                {followers.map((follower, index) => (
                  <div key={follower.id} className="col-12">
                    <div className="card bg-dark border border-secondary">
                      <div className="card-body d-flex align-items-center">
                        <img
                          src={getProfileAvatar(follower.name)}
                          alt={follower.name}
                          className="rounded-circle me-3"
                          width="60"
                          height="60"
                        />
                        <div className="flex-grow-1">
                          <h6 className="text-white mb-0">{follower.name}</h6>
                        </div>
                        {follower.is_following ? (
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleUnfollow(follower.id, index)}
                          >
                            Siguiendo
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleFollow(follower.id, index)}
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
      </div>
    </div>
  );
};
