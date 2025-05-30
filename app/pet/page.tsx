'use client';

import React, { useState } from 'react';
import {
  Dog,
  Camera,
  Plus,
  X,
  ChevronLeft,
  ArrowRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdditionalPetInfo() {
  const router = useRouter();
  const [step, setStep] = useState(2);
  const [about, setAbout] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  // Predefined lists for selection
  const interestOptions = [
    'Beach',
    'Parks',
    'Toys',
    'Naps',
    'Walks',
    'Swimming',
    'Cuddles',
    'Training',
    'Digging',
    'Snacks',
    'Chasing',
  ];

  const personalityOptions = [
    'Playful',
    'Curious',
    'Affectionate',
    'Energetic',
    'Calm',
    'Shy',
    'Independent',
    'Protective',
    'Gentle',
    'Loyal',
    'Brave',
    'Clever',
    'Sociable',
    'Observant',
    'Adventurous',
    'Stubborn',
  ];

  // Selected states
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([]);

  // Toggle handlers
  const toggleInterest = (option: string) => {
    setSelectedInterests(prev =>
      prev.includes(option) ? prev.filter(i => i !== option) : [...prev, option]
    );
  };

  const togglePersonality = (option: string) => {
    setSelectedPersonality(prev =>
      prev.includes(option) ? prev.filter(p => p !== option) : [...prev, option]
    );
  };

  const handlePhotoUpload = () => {
    const newPhoto = `Photo ${photos.length + 1}`;
    setPhotos([...photos, newPhoto]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleBack = () => router.back();
  const handleFinish = () => router.push('/');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-center bg-white border-b border-gray-100">
        <div className="flex items-center">
          <Dog className="text-pink-500" size={28} />
          <h1 className="text-2xl font-bold ml-2 bg-gradient-to-r from-pink-500 to-red-500 text-transparent bg-clip-text">
            Petfectly
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 animate-fade-in">

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-pink-500">1</div>
              <div className="w-16 h-1 bg-pink-500 mx-2" />
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-pink-500">2</div>
              <div className="w-16 h-1 bg-gray-300 mx-2" />
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-gray-300">3</div>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
            <textarea
              value={about}
              onChange={e => setAbout(e.target.value)}
              placeholder="Tell us about your pet's personality, favorite activities, and what makes them special..."
              className="w-full h-24 px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none text-gray-700"
              maxLength={200}
            />
            <div className="text-right text-xs text-gray-500 mt-1">{about.length}/200</div>
          </div>

          {/* More Photos */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">More Photos</h3>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <div className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center">
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
                  className="aspect-square border-2 border-dashed border-pink-300 rounded-xl flex flex-col items-center justify-center text-pink-500 hover:border-pink-400 hover:bg-pink-50 transition-colors"
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
            <ul className="flex flex-wrap gap-2">
              {interestOptions.map(opt => (
                <li
                  key={opt}
                  onClick={() => toggleInterest(opt)}
                  className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium border transition ${
                    selectedInterests.includes(opt)
                      ? 'bg-pink-500 text-white border-pink-500'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {opt}
                </li>
              ))}
            </ul>
          </div>

          {/* Personality */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Personality</h3>
            <ul className="flex flex-wrap gap-2">
              {personalityOptions.map(opt => (
                <li
                  key={opt}
                  onClick={() => togglePersonality(opt)}
                  className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium border transition ${
                    selectedPersonality.includes(opt)
                      ? 'bg-pink-500 text-white border-pink-500'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {opt}
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-gray-800 transition-colors font-medium">
              <ChevronLeft size={18} className="mr-1" /> Back
            </button>
            <div className="flex gap-3">
              <button onClick={() => setStep(step + 1)} className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium">
                Skip
              </button>
              <button onClick={handleFinish} className="px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl hover:from-pink-600 hover:to-red-600 transition-all duration-200 font-medium flex items-center">
                Finish
                <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 Petfectly. All rights reserved.</p>
          <p className="mt-1">Find the perfect playdate for your furry friend.</p>
        </div>
        <div className="absolute left-4 bottom-12 opacity-10">
          <div className="w-6 h-6 rounded-full bg-pink-500"></div>
          <div className="w-3 h-3 rounded-full bg-pink-500 absolute -right-1 -top-4"></div>
          <div className="w-3 h-3 rounded-full bg-pink-500 absolute right-2 -top-3"></div>
          <div className="w-3 h-3 rounded-full bg-pink-500 absolute left-2 -top-3"></div>
        </div>
        <div className="absolute right-12 bottom-8 opacity-10">
          <div className="w-6 h-6 rounded-full bg-pink-500"></div>
          <div className="w-3 h-3 rounded-full bg-pink-500 absolute -right-1 -top-4"></div>
          <div className="w-3 h-3 rounded-full bg-pink-500 absolute right-2 -top-3"></div>
          <div className="w-3 h-3 rounded-full bg-pink-500 absolute left-2 -top-3"></div>
        </div>
      </footer>
    </div>
  );
}