"use client";

import React, { useState } from 'react';
import { Camera, Plus, X } from 'lucide-react';

export default function AdditionalPetInfo() {
  const [about, setAbout] = useState('');
  const [interests, setInterests] = useState(['Beach', 'Parks', 'Toys', 'Naps']);
  const [personality, setPersonality] = useState(['Friendly', 'Energetic', 'Loving']);
  const [customInterest, setCustomInterest] = useState('');
  const [customPersonality, setCustomPersonality] = useState('');
  const [photos, setPhotos] = useState([]);

  const addInterest = () => {
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setInterests([...interests, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const removeInterest = (interest) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const addPersonality = () => {
    if (customPersonality.trim() && !personality.includes(customPersonality.trim())) {
      setPersonality([...personality, customPersonality.trim()]);
      setCustomPersonality('');
    }
  };

  const removePersonality = (trait) => {
    setPersonality(personality.filter(p => p !== trait));
  };

  const handlePhotoUpload = () => {
    // Simulate photo upload
    const newPhoto = `Photo ${photos.length + 1}`;
    setPhotos([...photos, newPhoto]);
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-6 text-center border-b border-gray-100">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mr-2">
            <span className="text-white font-bold text-sm">🐾</span>
          </div>
          <h1 className="text-xl font-bold text-pink-500">Petfectly</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-md mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tell us more!</h2>
            <p className="text-gray-600">Help others get to know your furry friend better</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2">
              1
            </div>
            <div className="w-16 h-1 bg-pink-500 mx-1"></div>
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2">
              2
            </div>
            <div className="w-16 h-1 bg-pink-500 mx-1"></div>
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              3
            </div>
          </div>

          {/* About Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">About</h3>
            </div>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell us about your pet's personality, favorite activities, and what makes them special..."
              className="w-full h-24 px-4 py-3 bg-gray-100 border-0 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700"
              maxLength={200}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {about.length}/200
            </div>
          </div>

          {/* Additional Photos */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">More Photos</h3>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <Camera className="w-6 h-6 text-gray-400" />
                  </div>
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              {photos.length < 6 && (
                <button
                  onClick={handlePhotoUpload}
                  className="aspect-square border-2 border-dashed border-pink-300 rounded-lg flex flex-col items-center justify-center text-pink-500 hover:border-pink-400 hover:bg-pink-50 transition-colors"
                >
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-xs">Add Photo</span>
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Add up to 6 photos to showcase your pet</p>
          </div>

          {/* Interests */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {interests.map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {interest}
                  <button
                    onClick={() => removeInterest(interest)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                placeholder="Add interest"
                className="flex-1 px-3 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && addInterest()}
              />
              <button
                onClick={addInterest}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
              >
                Add
              </button>
            </div>
          </div>

          {/* Personality */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Personality</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {personality.map((trait, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {trait}
                  <button
                    onClick={() => removePersonality(trait)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customPersonality}
                onChange={(e) => setCustomPersonality(e.target.value)}
                placeholder="Add personality trait"
                className="flex-1 px-3 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && addPersonality()}
              />
              <button
                onClick={addPersonality}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
              >
                Add
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            
            <div className="flex gap-3">
              <button className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium">
                Skip
              </button>
              <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:from-pink-600 hover:to-red-600 transition-all duration-200 font-medium flex items-center">
                Finish
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-100 py-4 text-center text-gray-500 text-sm">
        <p>© 2025 Petfectly. All rights reserved.</p>
        <p className="mt-1">Find the perfect playdate for your furry friend.</p>
      </div>
    </div>
  );
}