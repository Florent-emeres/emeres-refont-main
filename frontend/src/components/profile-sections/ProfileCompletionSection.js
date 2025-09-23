import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { CheckCircle, AlertCircle, Target } from 'lucide-react';

const ProfileCompletionSection = ({ profileForm }) => {
  // Définition des champs obligatoires avec leurs sections
  const getRequiredFields = () => {
    const baseRequiredFields = {
      'Informations personnelles': [
        { field: 'last_name', label: 'Nom' },
        { field: 'first_name', label: 'Prénom' },
        { field: 'birth_date', label: 'Date de naissance' },
        { field: 'phone', label: 'Téléphone' },
        { field: 'email', label: 'Email' }
      ],
      'Établissement': [
        { field: 'institution_name', label: 'Nom de l\'établissement' },
        { field: 'field_of_study', label: 'Domaine d\'étude' }
      ]
    };

    // Ajouter les consentements UNIQUEMENT pour les comptes créés par établissement
    // Les inscriptions directes ont déjà validé leurs consentements lors de l'inscription
    if (profileForm.created_by_institution) {
      baseRequiredFields['Consentements'] = [
        { field: 'gdpr_consent', label: 'Consentement RGPD' },
        { field: 'terms_accepted', label: 'Conditions générales' },
        { field: 'profile_sharing_consent', label: 'Partage profil' }
      ];
    }

    return baseRequiredFields;
  };

  const requiredFields = getRequiredFields();

  // Champs recommandés pour un profil complet
  const recommendedFields = {
    'Profil enrichi': [
      { field: 'profile_photo', label: 'Photo de profil' },
      { field: 'nationality', label: 'Nationalité' },
      { field: 'address_street', label: 'Adresse' }
    ],
    'Formation': [
      { field: 'institution_type', label: 'Type d\'établissement' },
      { field: 'degree_preparing', label: 'Diplôme préparé' },
      { field: 'study_year', label: 'Année d\'étude' },
      { field: 'graduation_year', label: 'Année d\'obtention' }
    ],
    'Compétences': [
      { field: 'main_skills', label: 'Compétences principales', isArray: true },
      { field: 'languages', label: 'Langues', isArray: true }
    ],
    'Recherche': [
      { field: 'search_objective', label: 'Objectif professionnel' },
      { field: 'search_domain', label: 'Domaine recherché' },
      { field: 'uploaded_cv', label: 'CV' }
    ]
  };

  // Calcul du taux de complétion
  const calculateCompletion = () => {
    const currentRequiredFields = getRequiredFields();
    const allFields = Object.values({ ...currentRequiredFields, ...recommendedFields }).flat();
    let completedFields = 0;
    
    allFields.forEach(({ field, isArray }) => {
      const value = profileForm[field];
      if (isArray) {
        if (Array.isArray(value) && value.length > 0) completedFields++;
      } else if (typeof value === 'boolean') {
        if (value === true) completedFields++;
      } else if (typeof value === 'object' && value !== null) {
        if (value.uploaded || value.name) completedFields++;
      } else {
        if (value && value.toString().trim() !== '') completedFields++;
      }
    });
    
    return Math.round((completedFields / allFields.length) * 100);
  };

  // Validation des champs obligatoires
  const validateRequiredFields = () => {
    const missingFields = [];
    const currentRequiredFields = getRequiredFields();
    
    Object.entries(currentRequiredFields).forEach(([section, fields]) => {
      fields.forEach(({ field, label }) => {
        const value = profileForm[field];
        if (typeof value === 'boolean') {
          if (!value) missingFields.push({ section, field, label });
        } else {
          if (!value || value.toString().trim() === '') {
            missingFields.push({ section, field, label });
          }
        }
      });
    });
    
    return missingFields;
  };

  // Suggestions d'amélioration
  const getSuggestions = () => {
    const suggestions = [];
    
    // Vérifier les champs recommandés manquants
    Object.entries(recommendedFields).forEach(([section, fields]) => {
      fields.forEach(({ field, label, isArray }) => {
        const value = profileForm[field];
        let isEmpty = false;
        
        if (isArray) {
          isEmpty = !Array.isArray(value) || value.length === 0;
        } else if (typeof value === 'object' && value !== null) {
          isEmpty = !value.uploaded && !value.name;
        } else {
          isEmpty = !value || value.toString().trim() === '';
        }
        
        if (isEmpty) {
          suggestions.push({ section, field, label });
        }
      });
    });
    
    return suggestions.slice(0, 5); // Limiter à 5 suggestions
  };

  const completionPercentage = calculateCompletion();
  const missingRequired = validateRequiredFields();
  const suggestions = getSuggestions();

  // Déterminer la couleur de la barre de progression
  const getProgressColor = () => {
    if (missingRequired.length > 0) return 'bg-red-500';
    if (completionPercentage < 50) return 'bg-orange-500';
    if (completionPercentage < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Complétion du profil</span>
          <Badge variant={missingRequired.length > 0 ? 'destructive' : 'default'}>
            {completionPercentage}%
          </Badge>
        </CardTitle>
        <CardDescription>
          Suivez votre progression et améliorez votre visibilité
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Barre de progression */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progression globale</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-3">
            <div 
              className={`h-full rounded-full transition-all ${getProgressColor()}`}
              style={{ width: `${completionPercentage}%` }}
            />
          </Progress>
        </div>

        {/* Alertes pour champs obligatoires manquants */}
        {missingRequired.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h4 className="font-medium text-red-800">Champs obligatoires manquants</h4>
            </div>
            <div className="space-y-2">
              {Object.entries(
                missingRequired.reduce((acc, item) => {
                  if (!acc[item.section]) acc[item.section] = [];
                  acc[item.section].push(item);
                  return acc;
                }, {})
              ).map(([section, fields]) => (
                <div key={section}>
                  <p className="text-sm font-medium text-red-700">{section} :</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {fields.map(({ label }, index) => (
                      <Badge key={index} variant="outline" className="text-red-600 border-red-300">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions d'amélioration */}
        {missingRequired.length === 0 && suggestions.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium text-blue-800">Suggestions pour améliorer votre profil</h4>
            </div>
            <div className="space-y-2">
              {Object.entries(
                suggestions.reduce((acc, item) => {
                  if (!acc[item.section]) acc[item.section] = [];
                  acc[item.section].push(item);
                  return acc;
                }, {})
              ).map(([section, fields]) => (
                <div key={section}>
                  <p className="text-sm font-medium text-blue-700">{section} :</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {fields.map(({ label }, index) => (
                      <Badge key={index} variant="outline" className="text-blue-600 border-blue-300">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message de félicitations */}
        {completionPercentage >= 90 && missingRequired.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-800">Excellent travail ! 🎉</h4>
                <p className="text-sm text-green-700">
                  Votre profil est presque complet. Vous maximisez vos chances d'être remarqué par les recruteurs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Note explicative pour les inscriptions directes */}
        {!profileForm.created_by_institution && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-800">Consentements RGPD validés ✅</h4>
                <p className="text-sm text-blue-700">
                  Vos consentements RGPD ont été validés lors de votre inscription et ne sont pas comptabilisés 
                  dans la progression du profil.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Note explicative pour les comptes créés par établissement */}
        {profileForm.created_by_institution && missingRequired.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-800">Consentements RGPD validés ✅</h4>
                <p className="text-sm text-blue-700">
                  Vos consentements RGPD ont été validés lors de l'activation de votre compte créé par votre établissement.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Conseils */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">💡 Conseils pour optimiser votre profil</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Un profil complet à 80%+ attire 3x plus l'attention des recruteurs</li>
            <li>• Ajoutez une photo professionnelle pour humaniser votre profil</li>
            <li>• Détaillez vos compétences selon votre domaine d'études</li>
            <li>• Incluez vos expériences même courtes (stages, projets, bénévolat)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionSection;