import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmeresButton from './ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from './ui/EmeresCard';
import EmeresInput from './ui/EmeresInput';
import EmeresBadge from './ui/EmeresBadge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  MessageSquare,
  Building,
  GraduationCap,
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
  Heart,
  Sparkles,
  Target,
  AlertCircle
} from 'lucide-react';

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          organization: formData.organization,
          message: formData.message
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Contact message sent successfully:', result);
        setSuccess(true);
        
        // Reset form after success
        setTimeout(() => {
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            organization: '',
            message: ''
          });
          setSuccess(false);
        }, 3000);
      } else {
        throw new Error('Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      console.error('Error sending contact message:', error);
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const contactReasons = [
    {
      icon: GraduationCap,
      title: "Étudiants",
      description: "Besoin d'aide pour vos candidatures ou onboarding",
      gradient: "from-teal-500 to-teal-600",
      bgGradient: "from-teal-50 to-cyan-50"
    },
    {
      icon: Building,
      title: "Entreprises", 
      description: "Informations sur nos offres et abonnements",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-indigo-50"
    },
    {
      icon: Users,
      title: "Écoles",
      description: "Intégration et suivi pédagogique",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      icon: UserCheck,
      title: "Mentors",
      description: "Rejoindre notre réseau et accompagner des talents",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-teal-50"
    }
  ];

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/company/emeres-officiel",
      color: "from-blue-600 to-blue-700",
      description: "ÉMÉRÉS Officiel"
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://facebook.com/emeres.officiel",
      color: "from-blue-500 to-blue-600",
      description: "Communauté étudiante"
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://twitter.com/emeres_fr",
      color: "from-sky-400 to-sky-600",
      description: "Actualités & conseils"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 relative overflow-hidden">
      {/* Background Image globale avec contraste optimal */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 via-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <img 
                  src="/emeres-logo.png" 
                  alt="ÉMÉRÉS" 
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain drop-shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div 
                  className="h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg hidden"
                >
                  <span className="text-2xl sm:text-3xl font-bold text-white">É</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-600 mb-6 leading-tight">
              Contactez-nous
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Vous souhaitez en savoir plus sur ÉMÉRÉS, poser une question ou proposer une collaboration ?
              <br />
              <span className="text-blue-600 font-semibold">Notre équipe est à votre écoute.</span>
            </p>
            
            <div className="flex items-center justify-center gap-3">
              <EmeresBadge variant="primary" size="lg">
                <Clock className="h-4 w-4 mr-2" />
                Réponse sous 48h
              </EmeresBadge>
              <EmeresBadge variant="secondary" size="lg">
                <Heart className="h-4 w-4 mr-2" />
                Support dédié
              </EmeresBadge>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Contact Form - Takes 2 columns */}
          <div className="lg:col-span-2">
            <EmeresCard variant="elevated" className="bg-white/95 backdrop-blur-sm border-0 shadow-emeres-xl">
              <EmeresCardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-emeres-primary rounded-xl">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <EmeresCardTitle className="text-2xl lg:text-3xl">
                      Envoyez-nous un message
                    </EmeresCardTitle>
                    <EmeresCardDescription className="text-lg">
                      Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
                    </EmeresCardDescription>
                  </div>
                </div>
              </EmeresCardHeader>

              <EmeresCardContent>
                {success ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Message envoyé avec succès !
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
                    </p>
                    <EmeresBadge variant="primary" size="lg">
                      <Clock className="h-4 w-4 mr-2" />
                      Réponse attendue sous 48h
                    </EmeresBadge>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2 block">
                          Prénom *
                        </Label>
                        <EmeresInput
                          id="firstName"
                          placeholder="Votre prénom"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                          className="h-12"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-2 block">
                          Nom *
                        </Label>
                        <EmeresInput
                          id="lastName"
                          placeholder="Votre nom"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                        Adresse email *
                      </Label>
                      <EmeresInput
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        leftIcon={<Mail className="h-4 w-4 text-gray-400" />}
                        required
                        className="h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="organization" className="text-sm font-medium text-gray-700 mb-2 block">
                        Organisation (facultatif)
                      </Label>
                      <EmeresInput
                        id="organization"
                        placeholder="Votre entreprise, école ou organisation"
                        value={formData.organization}
                        onChange={(e) => handleInputChange('organization', e.target.value)}
                        leftIcon={<Building className="h-4 w-4 text-gray-400" />}
                        className="h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2 block">
                        Votre message *
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Décrivez votre demande, votre projet ou vos questions..."
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        required
                        rows={6}
                        className="resize-none"
                      />
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">
                          Protection des données
                        </h4>
                        <p className="text-sm text-blue-800">
                          Vos données sont traitées conformément au RGPD. Elles ne seront utilisées que pour répondre à votre demande.
                        </p>
                      </div>
                    </div>

                    <EmeresButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={loading}
                      loadingtext="Envoi en cours..."
                      fullWidth
                      className="h-14 text-lg font-semibold"
                      icon={<Send />}
                    >
                      Envoyer le message
                    </EmeresButton>
                  </form>
                )}
              </EmeresCardContent>
            </EmeresCard>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Direct Contact */}
            <EmeresCard variant="default" className="bg-gradient-to-br from-white to-gray-50">
              <EmeresCardHeader>
                <EmeresCardTitle className="text-xl flex items-center gap-2">
                  <Target className="h-5 w-5 text-teal-600" />
                  Contact direct
                </EmeresCardTitle>
              </EmeresCardHeader>
              <EmeresCardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <a 
                      href="mailto:contact@emeres.fr"
                      className="text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      contact@emeres.fr
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Siège social</div>
                    <div className="text-gray-600 text-sm">
                      Adresse à définir
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Téléphone</div>
                    <div className="text-gray-600 text-sm">
                      Sur demande par email
                    </div>
                  </div>
                </div>
              </EmeresCardContent>
            </EmeresCard>

            {/* Social Media */}
            <EmeresCard variant="default" className="bg-gradient-to-br from-white to-gray-50">
              <EmeresCardHeader>
                <EmeresCardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Réseaux sociaux
                </EmeresCardTitle>
              </EmeresCardHeader>
              <EmeresCardContent className="space-y-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className={`w-10 h-10 bg-gradient-to-r ${social.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{social.name}</div>
                        <div className="text-sm text-gray-600">{social.description}</div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    </a>
                  );
                })}
              </EmeresCardContent>
            </EmeresCard>

            {/* Response Time */}
            <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl p-6 text-white text-center">
              <Clock className="h-8 w-8 mx-auto mb-3 opacity-90" />
              <h3 className="font-semibold text-lg mb-2">Délai de réponse</h3>
              <p className="text-white/90 text-sm">
                Nous répondons généralement sous 48h.
                N'hésitez pas, votre projet mérite notre attention.
              </p>
            </div>
          </div>
        </div>

        {/* Why Contact Us Section */}
        <section className="mt-16 lg:mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi nous contacter ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quel que soit votre profil, nous avons une solution adaptée à vos besoins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactReasons.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <EmeresCard 
                  key={index}
                  variant="default"
                  interactive={true}
                  className={`group hover-lift bg-gradient-to-br ${reason.bgGradient} border-0 cursor-pointer overflow-hidden relative`}
                >
                  {/* Image de fond spécifique par type de contact */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 group-hover:opacity-15 transition-opacity duration-300"
                    style={{
                      backgroundImage: reason.title === 'Étudiants' ? `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')` :
                                     reason.title === 'Entreprises' ? `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')` :
                                     reason.title === 'Écoles' ? `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')` :
                                     `url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`
                    }}
                  />
                  
                  <EmeresCardContent className="p-6 text-center relative z-10">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${reason.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {reason.title}
                    </h3>
                    
                    <p className="text-gray-700 leading-relaxed">
                      {reason.description}
                    </p>
                  </EmeresCardContent>
                </EmeresCard>
              );
            })}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-16 lg:mt-24">
          <EmeresCard variant="elevated" className="bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 border-0 shadow-emeres-xl text-white">
            <EmeresCardContent className="p-8 lg:p-12 text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Prêt à rejoindre l'aventure ÉMÉRÉS ?
                </h2>
                
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Nous répondons généralement sous 48h. N'hésitez pas, votre projet ou votre question mérite notre attention.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <EmeresButton
                    variant="secondary"
                    size="lg"
                    icon={<ArrowRight />}
                    onClick={() => document.getElementById('firstName').focus()}
                    className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-8 py-4 font-semibold"
                  >
                    Nous contacter
                  </EmeresButton>
                  
                  <EmeresButton
                    variant="outline"
                    size="lg"
                    icon={<GraduationCap />}
                    onClick={() => navigate('/about')}
                    className="border-white text-white hover:bg-white hover:text-teal-600 text-lg px-8 py-4 font-semibold"
                  >
                    En savoir plus
                  </EmeresButton>
                </div>
                
                <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/80 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Support personnalisé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Réponse garantie sous 48h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Équipe dédiée</span>
                  </div>
                </div>
              </div>
            </EmeresCardContent>
          </EmeresCard>
        </section>
      </div>

      {/* Footer Note */}
      <div className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 ÉMÉRÉS. Tous droits réservés. Une plateforme conçue avec ❤️ pour connecter les talents.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;