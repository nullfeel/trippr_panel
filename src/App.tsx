import React, { useState, useEffect } from 'react';
import { Landmark, LogIn, Plus, Search } from 'lucide-react';
import { Place, User } from './types';
import PlaceList from './components/PlaceList';
import PlaceForm from './components/PlaceForm';
import AdminLogin from './components/AdminLogin';
import { getPlaces, addPlace, updatePlace, deletePlace, loginAdmin, searchPlaces, getUsers, addUser, updateUser, deleteUser } from './services/firestore';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import { Users } from 'lucide-react';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const [adminData, setAdminData] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'places' | 'users'>('places');
  const [users, setUsers] = useState<User[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  // Check for stored admin data on mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminData');
    if (storedAdmin) {
      setAdminData(JSON.parse(storedAdmin));
      setIsAuthenticated(true);
      fetchPlaces();
      fetchUsers();
    } else {
      setLoading(false); // If no stored admin, we're ready to show login
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    }
  };

  // Add user handlers
  const handleAddUser = async (user: Omit<User, 'id' | 'createdAt'>, password?:string) => {
      try {
          if(!password) throw new Error("Password is required");
          const newUser = await addUser(user, password);
          setUsers([...users, newUser]);
          setShowUserForm(false);
      } catch (err: any) {
          setError(err.message || 'Failed to add user');
          console.error(err);
      }
  };


  const handleUpdateUser = async (updatedUser: User) => {
    try {
      // Ensure we only send updateable fields
      const cleanUser = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        npm: updatedUser.npm,
        favorites: updatedUser.favorites
      };

      await updateUser(cleanUser);
      setUsers(users.map(user =>
        user.id === cleanUser.id ? { ...user, ...cleanUser } : user
      ));
      setShowUserForm(false);
    } catch (err) {
      setError('Failed to update user');
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  const fetchPlaces = async () => {
    try {
      const fetchedPlaces = await getPlaces();
      setPlaces(fetchedPlaces);
    } catch (err) {
      setError('Failed to fetch places');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const admin = await loginAdmin(email, password);

      // Store admin data first
      localStorage.setItem('adminData', JSON.stringify(admin));

      // Then update state
      setAdminData(admin);
      setIsAuthenticated(true);

      // Finally fetch places
      await fetchPlaces();
    } catch (err) {
      setError('Invalid credentials');
      console.error(err);
      setLoading(false); // Make sure to stop loading on error
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminData');
    setIsAuthenticated(false);
    setAdminData(null);
    setPlaces([]);
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length > 0) {
      const searchResults = await searchPlaces(term);
      setPlaces(searchResults);
    } else {
      fetchPlaces();
    }
  };

  const handleAddPlace = async (place: Omit<Place, 'id'>) => {
    try {
      const newPlace = await addPlace(place);
      setPlaces([...places, newPlace]);
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add place');
      console.error(err);
    }
  };

  const handleUpdatePlace = async (updatedPlace: Place) => {
    try {
      await updatePlace(updatedPlace);
      setPlaces(places.map(place =>
        place.id === updatedPlace.id ? updatedPlace : place
      ));
    } catch (err) {
      setError('Failed to update place');
      console.error(err);
    }
  };

  const handleDeletePlace = async (id: string) => {
    try {
      await deletePlace(id);
      setPlaces(places.filter(place => place.id !== id));
    } catch (err) {
      setError('Failed to delete place');
      console.error(err);
    }
  };

  // Show loading spinner while checking authentication
  if (loading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} error={error} />;
  }

  // Show main panel if authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Landmark className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Trippr Panel</span>
            </div>
            <div className="flex items-center">
             <button
                onClick={() => setCurrentView('places')}
                className={`px-3 py-2 rounded-md ${currentView === 'places' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Places
              </button>
              <button
                onClick={() => setCurrentView('users')}
                className={`ml-2 px-3 py-2 rounded-md ${currentView === 'users' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Users
              </button>
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          {/* ... existing search and add button ... */}
          <button
            onClick={() => {
              if (currentView === 'places') setShowAddForm(true);
              if (currentView === 'users') {
                setSelectedUser(undefined);
                setShowUserForm(true);
              }
            }}
            className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add {currentView === 'places' ? 'Place' : 'User'}
          </button>
        </div>

        {currentView === 'places' ? (
          <PlaceList
            places={places}
            onUpdate={handleUpdatePlace}
            onDelete={handleDeletePlace}
          />
        ) : (
          <UserList
            users={users}
            onEdit={(user) => {
              setSelectedUser(user);
              setShowUserForm(true);
            }}
            onDelete={handleDeleteUser}
          />
        )}

        {/* Add UserForm modal */}
        {showUserForm && (
          <UserForm
            user={selectedUser}
            onSubmit={selectedUser ? handleUpdateUser : handleAddUser}
            onCancel={() => {
              setShowUserForm(false);
              setSelectedUser(undefined);
            }}
          />
        )}

        {/* Keep existing PlaceForm */}
        {showAddForm && (
          <PlaceForm
            onSubmit={handleAddPlace}
            onCancel={() => setShowAddForm(false)}
          />
        )}
      </main>
    </div>
  );
}

export default App;