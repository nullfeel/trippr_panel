import React, { useState } from 'react';
import { Place } from '../types';
import PlaceForm from './PlaceForm';
import { Edit, Trash2, Star } from 'lucide-react';

interface PlaceListProps {
  places: Place[];
  onUpdate: (place: Place) => void;
  onDelete: (id: string) => void;
}

export default function PlaceList({ places, onUpdate, onDelete }: PlaceListProps) {
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {places.map((place) => (
        <div
          key={place.id}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="relative h-48">
            <img
              src={place.image}
              alt={place.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{place.rating}</span>
            </div>
          </div>
          <div className="px-4 py-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{place.title}</h3>
                <p className="text-sm text-gray-500">{place.location}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {place.type}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600 line-clamp-3">
              {place.description}
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setEditingPlace(place)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => onDelete(place.id)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {editingPlace && (
        <PlaceForm
          place={editingPlace}
          onSubmit={(updatedPlace) => {
            onUpdate({ ...updatedPlace, id: editingPlace.id });
            setEditingPlace(null);
          }}
          onCancel={() => setEditingPlace(null)}
        />
      )}
    </div>
  );
}