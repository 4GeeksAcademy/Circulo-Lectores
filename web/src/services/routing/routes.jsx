import { Home } from '../../pages/Home';
import { Login } from '../../pages/Login';
import { Book } from '../../pages/Book';
import { Feed } from '../../pages/Feed';
import { Profile } from '../../pages/Profile';
import { Register } from '../../pages/Register';
import { ReviewForm } from '../../pages/ReviewForm';
import { Footer } from '../../components/Footer';
import { ReviewCard } from '../../components/ReviewCard';
import { UserCard } from '../../components/UserCard';
import { MyLibrary } from '../../pages/MyLibrary';
import { MyQuotes } from '../../pages/MyQuotes';
import { MyReviews } from '../../pages/MyReviews';
import { MyRecommendations } from '../../pages/MyRecommendations';
import { UserSearch } from '../../components/UserSearch';
import { MyFollowers } from '../../components/MyFollowers';
import { MyFollowings } from '../../components/MyFollowings';

export const routesConfig = [
  {
    name: 'Home',
    path: '/',
    component: <Home />,
    showInNavbar: true,
  },
  {
    name: 'Login',
    path: '/login',
    component: <Login />,
    showInNavbar: false,
  },
  {
    name: 'Book Detail',
    path: '/book',
    component: <Book />,
    showInNavbar: true,
  },
  {
    name: 'Profile',
    path: '/profile',
    component: <Profile />,
    showInNavbar: true,
  },
  {
    name: 'Feed',
    path: '/feed',
    component: <Feed />,
    showInNavbar: true,
  },
  {
    name: 'Register',
    path: '/register',
    component: <Register />,
    showInNavbar: false,
  },
  {
    name: 'Review Form',
    path: '/review_form',
    component: <ReviewForm />,
    showInNavbar: true,
  },
  {
    name: 'Mi Biblioteca',
    path: '/my_library',
    component: <MyLibrary />,
    showInNavbar: false,
  },
  {
    name: 'Mis Citas',
    path: '/my_quotes',
    component: <MyQuotes />,
    showInNavbar: false,
  },
  {
    name: 'Mis Reseñas',
    path: '/my_reviews',
    component: <MyReviews />,
    showInNavbar: false,
  },
  {
    name: 'Mis Recomendaciones',
    path: '/my_recommendations',
    component: <MyRecommendations />,
    showInNavbar: false,
  },
  {
    name: 'Footer',
    path: '/footer',
    component: <Footer />,
    showInNavbar: false,
  },
  {
    name: 'ReviewCard',
    path: '/review_card',
    component: <ReviewCard />,
    showInNavbar: true,
  },
  {
    name: 'User Card',
    path: '/user_card',
    component: <UserCard />,
    showInNavbar: true,
  },
  {
    name: 'Buscar Usuarios',
    path: '/seacrh_users',
    component: <UserSearch />,
    showInNavbar: false,
  },
  {
    name: 'Mis Seguidores',
    path: '/my_followers',
    component: <MyFollowers />,
    showInNavbar: false,
  },
  {
    name: 'Siguiendo',
    path: '/my_followings',
    component: <MyFollowings />,
    showInNavbar: false,
  },
];
