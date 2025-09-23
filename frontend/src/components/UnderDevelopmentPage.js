import React, { useState } from 'react';
import { ArrowLeft, Rocket, Mail, CheckCircle, Code, Zap, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UnderDevelopmentPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header avec branding ÉMÉRÉS */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white rounded-full p-3 mr-4">
              <Rocket className="h-8 w-8 text-teal-600" />
            </div>
            <h1 className="text-3xl font-bold text-white">ÉMÉRÉS</h1>
          </div>
          <p className="text-teal-100 text-center text-lg">
            Plateforme d'accompagnement professionnel
          </p>
        </div>

        {/* Contenu principal */}
        <div className="px-8 py-12 text-center">
          <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-200">
            <Rocket className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Module en développement
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Cette fonctionnalité est actuellement en cours de développement par notre équipe.
            </p>
            
            {/* Fonctionnalités à venir */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 bg-white rounded-xl p-4">
                <Code className="h-6 w-6 text-teal-600 flex-shrink-0" />
                <span className="text-left text-gray-700">Interface utilisateur avancée</span>
              </div>
              <div className="flex items-center space-x-3 bg-white rounded-xl p-4">
                <Zap className="h-6 w-6 text-teal-600 flex-shrink-0" />
                <span className="text-left text-gray-700">Fonctionnalités intelligentes</span>
              </div>
              <div className="flex items-center space-x-3 bg-white rounded-xl p-4">
                <Calendar className="h-6 w-6 text-teal-600 flex-shrink-0" />
                <span className="text-left text-gray-700">Intégrations complètes</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-500 mb-2">Disponibilité prévue :</p>
              <p className="text-xl font-semibold text-teal-600">
                Bientôt disponible !
              </p>
            </div>
          </div>

          {/* Newsletter signup */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <Mail className="h-12 w-12 text-teal-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Être notifié du lancement
            </h3>
            <p className="text-gray-600 mb-4">
              Inscrivez-vous pour être parmi les premiers à découvrir ce nouveau module !
            </p>
            {!subscribed ? (
              <form onSubmit={handleNewsletterSignup} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 transform hover:scale-105"
                >
                  M'avertir du lancement
                </button>
              </form>
            ) : (
              <div className="text-green-600 flex items-center justify-center space-x-2">
                <CheckCircle className="h-6 w-6" />
                <span className="font-semibold">Inscription réussie ! Vous serez notifié.</span>
              </div>
            )}
          </div>

          {/* Contact et support */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-800">
              Questions sur ce module ?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:dev@emeres.fr"
                className="inline-flex items-center justify-center space-x-2 bg-white border-2 border-teal-600 text-teal-600 font-semibold py-2 px-4 rounded-xl hover:bg-teal-50 transition-colors duration-200"
              >
                <Mail className="h-5 w-5" />
                <span>dev@emeres.fr</span>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center space-x-2 bg-white border-2 border-teal-600 text-teal-600 font-semibold py-2 px-4 rounded-xl hover:bg-teal-50 transition-colors duration-200"
              >
                <Rocket className="h-5 w-5" />
                <span>Nous contacter</span>
              </a>
            </div>
          </div>

          {/* Bouton retour */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors duration-200 font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour à l'accueil</span>
          </button>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center border-t">
          <p className="text-sm text-gray-500">
            Innovation en cours • ÉMÉRÉS © 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnderDevelopmentPage;