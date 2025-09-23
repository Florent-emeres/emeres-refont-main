import React, { useState } from 'react';
import { ArrowLeft, Clock, AlertTriangle, Mail, CheckCircle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MaintenancePage = () => {
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
              <AlertTriangle className="h-8 w-8 text-teal-600" />
            </div>
            <h1 className="text-3xl font-bold text-white">ÉMÉRÉS</h1>
          </div>
          <p className="text-teal-100 text-center text-lg">
            Plateforme d'accompagnement professionnel
          </p>
        </div>

        {/* Contenu principal */}
        <div className="px-8 py-12 text-center">
          <div className="bg-orange-50 rounded-2xl p-6 mb-8 border border-orange-200">
            <Clock className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Maintenance en cours
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Nous effectuons actuellement une maintenance programmée pour améliorer votre expérience.
            </p>
            <div className="bg-white rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-500 mb-2">Durée estimée :</p>
              <p className="text-xl font-semibold text-teal-600">
                Retour prévu dans 2 heures
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Dernière mise à jour : {new Date().toLocaleString('fr-FR')}
            </p>
          </div>

          {/* Newsletter signup */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <Mail className="h-12 w-12 text-teal-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Être notifié du retour en ligne
            </h3>
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
                  M'avertir par email
                </button>
              </form>
            ) : (
              <div className="text-green-600 flex items-center justify-center space-x-2">
                <CheckCircle className="h-6 w-6" />
                <span className="font-semibold">Email enregistré avec succès !</span>
              </div>
            )}
          </div>

          {/* Contact et support */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-800">
              Besoin d'aide ?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@emeres.fr"
                className="inline-flex items-center justify-center space-x-2 bg-white border-2 border-teal-600 text-teal-600 font-semibold py-2 px-4 rounded-xl hover:bg-teal-50 transition-colors duration-200"
              >
                <Mail className="h-5 w-5" />
                <span>support@emeres.fr</span>
              </a>
              <a
                href="tel:+33123456789"
                className="inline-flex items-center justify-center space-x-2 bg-white border-2 border-teal-600 text-teal-600 font-semibold py-2 px-4 rounded-xl hover:bg-teal-50 transition-colors duration-200"
              >
                <AlertTriangle className="h-5 w-5" />
                <span>Support urgent</span>
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
            Merci de votre patience • ÉMÉRÉS © 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;