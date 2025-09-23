import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Mail, MapPin, Award } from 'lucide-react';
import EmeresCard from '../ui/EmeresCard';
import EmeresButton from '../ui/EmeresButton';

const EquipePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-gray-50 relative overflow-hidden">
      {/* Background décoratif */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-emerald-50/90 to-gray-50/90" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Notre Équipe
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ÉMÉRÉS est développé par une équipe passionnée de technologie et d'innovation, 
            dédiée à révolutionner la rencontre entre talents et opportunités.
          </p>
        </div>

        {/* Vision et Mission de l'équipe */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <EmeresCard className="p-8 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Notre Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              Créer des solutions technologiques innovantes qui facilitent l'insertion professionnelle 
              et démocratisent l'accès aux opportunités de carrière.
            </p>
          </EmeresCard>

          <EmeresCard className="p-8 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Nos Valeurs</h3>
            <p className="text-gray-600 leading-relaxed">
              Innovation, transparence, égalité des chances et excellence technique 
              guident chaque décision dans le développement d'ÉMÉRÉS.
            </p>
          </EmeresCard>
        </div>

        {/* Départements sans noms */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nos Départements
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <EmeresCard className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Engineering</h3>
              <p className="text-gray-600 mb-4">
                Développement des innovations technologiques et de l'architecture IA
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Python</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">React</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">IA/ML</span>
              </div>
            </EmeresCard>

            <EmeresCard className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Product & Design</h3>
              <p className="text-gray-600 mb-4">
                Conception de l'expérience utilisateur et stratégie produit
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">UX/UI</span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">Design</span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">Product</span>
              </div>
            </EmeresCard>

            <EmeresCard className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Business & Ops</h3>
              <p className="text-gray-600 mb-4">
                Développement commercial et opérations stratégiques
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">Business</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">Strategy</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">Ops</span>
              </div>
            </EmeresCard>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <EmeresCard className="p-8 bg-gradient-to-r from-blue-600 via-emerald-600 to-blue-700 text-white">
            <h2 className="text-3xl font-bold mb-4">Rejoignez l'Aventure ÉMÉRÉS</h2>
            <p className="text-xl mb-6 opacity-90">
              Nous recrutons des talents passionnés pour façonner l'avenir du recrutement
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <EmeresButton variant="secondary" size="lg">
                <Link to="/about/carrieres" className="flex items-center gap-2">
                  Voir nos Offres
                </Link>
              </EmeresButton>
              <EmeresButton variant="ghost" size="lg" className="text-white border-white hover:bg-white hover:text-blue-600">
                <Link to="/contact" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Nous Contacter
                </Link>
              </EmeresButton>
            </div>
          </EmeresCard>
        </div>
      </div>
    </div>
  );
};

export default EquipePage;