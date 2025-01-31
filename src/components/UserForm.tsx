import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { X } from 'lucide-react';

interface UserFormProps {
    user?: User;
    onSubmit: (user: User | Omit<User, 'id' | 'createdAt'>, password?:string ) => void;
    onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        npm: '',
    });
    const [password, setPassword] = useState('');
    const [isNewUser, setIsNewUser] = useState(!user);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                npm: user.npm,
            });
            setIsNewUser(false)
        } else {
            setIsNewUser(true)
        }
    }, [user]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
       
        const userToSubmit = user
            ? { id: user.id, ...formData }
            : formData;

        onSubmit(userToSubmit, password);
        setPassword('');
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {user ? 'Edit User' : 'Create User'}
                    </h2>
                    <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">NPM</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={formData.npm}
                            onChange={(e) => setFormData({ ...formData, npm: e.target.value })}
                        />
                    </div>
                    {isNewUser && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                               type="password"
                               required
                               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={password}
                               onChange={(e) => setPassword(e.target.value)}
                           />
                        </div>
                    )}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                        >
                            {user ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;