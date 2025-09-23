import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  School, 
  Users, 
  GraduationCap, 
  Building, 
  MapPin, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Mail,
  Phone,
  Globe
} from 'lucide-react';

const InstitutionRegistrationDemo = () => {
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  const institutions = [
    {
      id: 1,
      name: "École Supérieure de Commerce Paris",
      type: "École de Commerce",
      location: "Paris, France",
      students: 2500,
      programs: ["Master Management", "Bachelor Business", "MBA Executive"],
      partnership: "active",
      contact: {
        email: "partenariats@esc-paris.fr",
        phone: "+33 1 42 86 76 54",
        website: "www.esc-paris.fr"
      },
      stats: {
        placementRate: 95,
        internshipsThisYear: 180,
        partnersCompanies: 150
      }
    },
    {
      id: 2,
      name: "Institut National Polytechnique",
      type: "École d'Ingénieurs",
      location: "Lyon, France",
      students: 1800,
      programs: ["Ingénieur Informatique", "Ingénieur Mécanique", "Master Data Science"],
      partnership: "pending",
      contact: {
        email: "stages@inp-lyon.fr",
        phone: "+33 4 72 43 81 20",
        website: "www.inp-lyon.fr"
      },
      stats: {
        placementRate: 98,
        internshipsThisYear: 120,
        partnersCompanies: 200
      }
    },
    {
      id: 3,
      name: "Université de Technologie",
      type: "Université",
      location: "Lille, France",
      students: 3200,
      programs: ["Licence Pro", "Master Tech", "Doctorat R&D"],
      partnership: "new",
      contact: {
        email: "entreprises@ut-lille.fr",
        phone: "+33 3 20 43 45 67",
        website: "www.ut-lille.fr"
      },
      stats: {
        placementRate: 89,
        internshipsThisYear: 250,
        partnersCompanies: 80
      }
    }
  ];

  const getPartnershipBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Partenaire Actif</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-amber-800"><Clock className="h-3 w-3 mr-1" />En Négociation</Badge>;
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800"><AlertTriangle className="h-3 w-3 mr-1" />Nouveau Contact</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <img 
                src="/emeres-logo.png" 
                alt="ÉMÉRÉS" 
                className="h-16 w-16 object-contain drop-shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div 
                className="h-16 w-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg hidden"
              >
                <span className="text-2xl font-bold text-white">É</span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            ÉMÉRÉS Établissements
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez comment les établissements d'enseignement supérieur utilisent ÉMÉRÉS 
            pour optimiser le placement de leurs étudiants en stage et alternance.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-teal-600 mb-2">150+</div>
              <div className="text-sm text-gray-600">Établissements Partenaires</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">25K+</div>
              <div className="text-sm text-gray-600">Étudiants Actifs</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
              <div className="text-sm text-gray-600">Taux de Placement Moyen</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">2,5K+</div>
              <div className="text-sm text-gray-600">Entreprises Connectées</div>
            </CardContent>
          </Card>
        </div>

        {/* Institution Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {institutions.map((institution) => (
            <Card 
              key={institution.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-l-4 ${
                selectedInstitution?.id === institution.id 
                  ? 'border-l-teal-500 shadow-lg' 
                  : 'border-l-gray-200'
              }`}
              onClick={() => setSelectedInstitution(institution)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <School className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{institution.name}</CardTitle>
                      <CardDescription className="text-sm">{institution.type}</CardDescription>
                    </div>
                  </div>
                  {getPartnershipBadge(institution.partnership)}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{institution.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{institution.students} étudiants</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Programmes principaux :</h4>
                    <div className="flex flex-wrap gap-2">
                      {institution.programs.slice(0, 2).map((program) => (
                        <Badge key={program} variant="outline" className="text-xs">
                          {program}
                        </Badge>
                      ))}
                      {institution.programs.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{institution.programs.length - 2} autres
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {institution.stats.placementRate}%
                      </div>
                      <div className="text-xs text-gray-500">Placement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {institution.stats.internshipsThisYear}
                      </div>
                      <div className="text-xs text-gray-500">Stages 2024</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {institution.stats.partnersCompanies}
                      </div>
                      <div className="text-xs text-gray-500">Entreprises</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed View */}
        {selectedInstitution && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <School className="h-6 w-6 text-teal-600" />
                    {selectedInstitution.name}
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">
                    Détails du partenariat et informations de contact
                  </CardDescription>
                </div>
                {getPartnershipBadge(selectedInstitution.partnership)}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Programmes disponibles
                    </h3>
                    <div className="space-y-2">
                      {selectedInstitution.programs.map((program) => (
                        <div key={program} className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-teal-600" />
                          <span>{program}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Statistiques de placement
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedInstitution.stats.placementRate}%
                        </div>
                        <div className="text-sm text-green-700">Taux de placement</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedInstitution.stats.internshipsThisYear}
                        </div>
                        <div className="text-sm text-blue-700">Stages cette année</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Informations de contact</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <a 
                          href={`mailto:${selectedInstitution.contact.email}`}
                          className="text-teal-600 hover:text-teal-700"
                        >
                          {selectedInstitution.contact.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{selectedInstitution.contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <a 
                          href={`https://${selectedInstitution.contact.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:text-teal-700 flex items-center gap-1"
                        >
                          {selectedInstitution.contact.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-teal-900 mb-2">
                      Intégration ÉMÉRÉS
                    </h4>
                    <p className="text-sm text-teal-800 mb-3">
                      Cet établissement utilise ÉMÉRÉS pour gérer les stages et alternances 
                      de ses étudiants avec un suivi personnalisé.
                    </p>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                      Voir le portail étudiant
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-teal-500 to-blue-600 text-white">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">
              Votre établissement souhaite rejoindre ÉMÉRÉS ?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Optimisez le placement de vos étudiants et renforcez vos relations avec 
              les entreprises grâce à notre plateforme dédiée.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-teal-600 hover:bg-gray-100"
              >
                Demander une démonstration
                <Calendar className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-teal-600"
              >
                Télécharger la brochure
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2024 ÉMÉRÉS. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default InstitutionRegistrationDemo;