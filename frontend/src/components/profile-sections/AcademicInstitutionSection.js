import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { GraduationCap, Building, Search, Plus, Save, RefreshCw, MapPin } from 'lucide-react';
import UniversalFileUpload from '../shared/UniversalFileUpload';

const AcademicInstitutionSection = ({ profileForm, setProfileForm, errors = {}, onSave, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateInstitution, setShowCreateInstitution] = useState(false);
  const [searchFilter, setSearchFilter] = useState('all'); // all, name, city, region, department, postal

  const handleInputChange = (field, value) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Base de données complète d'établissements français avec informations géographiques
  const institutionDatabase = [
    // Universités - Île-de-France (75, 91, 92, 93, 94, 95, 77, 78)
    { name: 'Université Paris-Saclay', city: 'Saclay', region: 'Île-de-France', department: '91', postal_code: '91190', type: 'Université' },
    { name: 'Sorbonne Université', city: 'Paris', region: 'Île-de-France', department: '75', postal_code: '75005', type: 'Université' },
    { name: 'Université PSL', city: 'Paris', region: 'Île-de-France', department: '75', postal_code: '75230', type: 'Université' },
    
    // Universités - Auvergne-Rhône-Alpes (01, 03, 07, 15, 26, 38, 42, 43, 63, 69, 73, 74)
    { name: 'Université de Lyon', city: 'Lyon', region: 'Auvergne-Rhône-Alpes', department: '69', postal_code: '69007', type: 'Université' },
    { name: 'Université de Grenoble', city: 'Grenoble', region: 'Auvergne-Rhône-Alpes', department: '38', postal_code: '38000', type: 'Université' },
    { name: 'Université de Saint-Étienne', city: 'Saint-Étienne', region: 'Auvergne-Rhône-Alpes', department: '42', postal_code: '42000', type: 'Université' },
    { name: 'Université de Clermont-Ferrand', city: 'Clermont-Ferrand', region: 'Auvergne-Rhône-Alpes', department: '63', postal_code: '63000', type: 'Université' },
    
    // Universités - Nouvelle-Aquitaine (16, 17, 19, 23, 24, 33, 40, 47, 64, 79, 86, 87)
    { name: 'Université de Bordeaux', city: 'Bordeaux', region: 'Nouvelle-Aquitaine', department: '33', postal_code: '33000', type: 'Université' },
    { name: 'Université de Poitiers', city: 'Poitiers', region: 'Nouvelle-Aquitaine', department: '86', postal_code: '86000', type: 'Université' },
    { name: 'Université de La Rochelle', city: 'La Rochelle', region: 'Nouvelle-Aquitaine', department: '17', postal_code: '17000', type: 'Université' },
    
    // Universités - Occitanie (09, 11, 12, 30, 31, 32, 34, 46, 48, 65, 66, 81, 82)
    { name: 'Université de Toulouse', city: 'Toulouse', region: 'Occitanie', department: '31', postal_code: '31000', type: 'Université' },
    { name: 'Université de Montpellier', city: 'Montpellier', region: 'Occitanie', department: '34', postal_code: '34000', type: 'Université' },
    
    // Universités - Hauts-de-France (02, 59, 60, 62, 80)
    { name: 'Université de Lille', city: 'Lille', region: 'Hauts-de-France', department: '59', postal_code: '59000', type: 'Université' },
    { name: 'Université d\'Amiens', city: 'Amiens', region: 'Hauts-de-France', department: '80', postal_code: '80000', type: 'Université' },
    
    // Universités - Pays de la Loire (44, 49, 53, 72, 85)
    { name: 'Université de Nantes', city: 'Nantes', region: 'Pays de la Loire', department: '44', postal_code: '44000', type: 'Université' },
    { name: 'Université d\'Angers', city: 'Angers', region: 'Pays de la Loire', department: '49', postal_code: '49000', type: 'Université' },
    { name: 'Université du Mans', city: 'Le Mans', region: 'Pays de la Loire', department: '72', postal_code: '72000', type: 'Université' },
    
    // Universités - Grand Est (08, 10, 51, 52, 54, 55, 57, 67, 68, 88)
    { name: 'Université de Strasbourg', city: 'Strasbourg', region: 'Grand Est', department: '67', postal_code: '67000', type: 'Université' },
    { name: 'Université de Nancy', city: 'Nancy', region: 'Grand Est', department: '54', postal_code: '54000', type: 'Université' },
    { name: 'Université de Metz', city: 'Metz', region: 'Grand Est', department: '57', postal_code: '57000', type: 'Université' },
    { name: 'Université de Reims', city: 'Reims', region: 'Grand Est', department: '51', postal_code: '51000', type: 'Université' },
    
    // Universités - Bretagne (22, 29, 35, 56)
    { name: 'Université de Rennes', city: 'Rennes', region: 'Bretagne', department: '35', postal_code: '35000', type: 'Université' },
    { name: 'Université de Brest', city: 'Brest', region: 'Bretagne', department: '29', postal_code: '29200', type: 'Université' },
    
    // Universités - Provence-Alpes-Côte d'Azur (04, 05, 06, 13, 83, 84)
    { name: 'Université de Marseille', city: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur', department: '13', postal_code: '13000', type: 'Université' },
    { name: 'Université de Nice', city: 'Nice', region: 'Provence-Alpes-Côte d\'Azur', department: '06', postal_code: '06000', type: 'Université' },
    
    // Universités - Normandie (14, 27, 50, 61, 76)
    { name: 'Université de Caen', city: 'Caen', region: 'Normandie', department: '14', postal_code: '14000', type: 'Université' },
    { name: 'Université de Rouen', city: 'Rouen', region: 'Normandie', department: '76', postal_code: '76000', type: 'Université' },
    
    // Écoles d'ingénieur - Île-de-France
    { name: 'École Polytechnique', city: 'Palaiseau', region: 'Île-de-France', department: '91', postal_code: '91128', type: 'École d\'ingénieur' },
    { name: 'École Centrale Paris', city: 'Châtenay-Malabry', region: 'Île-de-France', department: '92', postal_code: '92295', type: 'École d\'ingénieur' },
    { name: 'ISEP', city: 'Paris', region: 'Île-de-France', department: '75', postal_code: '75006', type: 'École d\'ingénieur' },
    { name: 'Supélec', city: 'Gif-sur-Yvette', region: 'Île-de-France', department: '91', postal_code: '91192', type: 'École d\'ingénieur' },
    { name: 'Télécom Paris', city: 'Palaiseau', region: 'Île-de-France', department: '91', postal_code: '91120', type: 'École d\'ingénieur' },
    { name: 'Mines ParisTech', city: 'Paris', region: 'Île-de-France', department: '75', postal_code: '75006', type: 'École d\'ingénieur' },
    { name: 'ENSAM', city: 'Paris', region: 'Île-de-France', department: '75', postal_code: '75013', type: 'École d\'ingénieur' },
    
    // Écoles d'ingénieur - Auvergne-Rhône-Alpes
    { name: 'École Centrale Lyon', city: 'Lyon', region: 'Auvergne-Rhône-Alpes', department: '69', postal_code: '69130', type: 'École d\'ingénieur' },
    { name: 'INSA Lyon', city: 'Lyon', region: 'Auvergne-Rhône-Alpes', department: '69', postal_code: '69621', type: 'École d\'ingénieur' },
    { name: 'Mines Saint-Étienne', city: 'Saint-Étienne', region: 'Auvergne-Rhône-Alpes', department: '42', postal_code: '42023', type: 'École d\'ingénieur' },
    
    // Écoles d'ingénieur - Autres régions
    { name: 'École Centrale Marseille', city: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur', department: '13', postal_code: '13451', type: 'École d\'ingénieur' },
    { name: 'École Centrale Nantes', city: 'Nantes', region: 'Pays de la Loire', department: '44', postal_code: '44321', type: 'École d\'ingénieur' },
    { name: 'École Centrale Lille', city: 'Lille', region: 'Hauts-de-France', department: '59', postal_code: '59651', type: 'École d\'ingénieur' },
    { name: 'INSA Rennes', city: 'Rennes', region: 'Bretagne', department: '35', postal_code: '35708', type: 'École d\'ingénieur' },
    { name: 'INSA Toulouse', city: 'Toulouse', region: 'Occitanie', department: '31', postal_code: '31077', type: 'École d\'ingénieur' },
    { name: 'INSA Strasbourg', city: 'Strasbourg', region: 'Grand Est', department: '67', postal_code: '67084', type: 'École d\'ingénieur' },
    { name: 'INSA Rouen', city: 'Rouen', region: 'Normandie', department: '76', postal_code: '76801', type: 'École d\'ingénieur' },
    { name: 'UTC Compiègne', city: 'Compiègne', region: 'Hauts-de-France', department: '60', postal_code: '60200', type: 'École d\'ingénieur' },
    { name: 'UTT Troyes', city: 'Troyes', region: 'Grand Est', department: '10', postal_code: '10004', type: 'École d\'ingénieur' },
    { name: 'UTBM Belfort', city: 'Belfort', region: 'Bourgogne-Franche-Comté', department: '90', postal_code: '90010', type: 'École d\'ingénieur' },
    { name: 'Mines Nancy', city: 'Nancy', region: 'Grand Est', department: '54', postal_code: '54042', type: 'École d\'ingénieur' },
    
    // Écoles de commerce
    { name: 'HEC Paris', city: 'Jouy-en-Josas', region: 'Île-de-France', department: '78', postal_code: '78351', type: 'École de commerce' },
    { name: 'ESSEC Business School', city: 'Cergy-Pontoise', region: 'Île-de-France', department: '95', postal_code: '95021', type: 'École de commerce' },
    { name: 'ESCP Business School', city: 'Paris', region: 'Île-de-France', department: '75', postal_code: '75011', type: 'École de commerce' },
    { name: 'EM Lyon', city: 'Lyon', region: 'Auvergne-Rhône-Alpes', department: '69', postal_code: '69134', type: 'École de commerce' },
    { name: 'EDHEC', city: 'Lille', region: 'Hauts-de-France', department: '59', postal_code: '59046', type: 'École de commerce' },
    { name: 'Audencia', city: 'Nantes', region: 'Pays de la Loire', department: '44', postal_code: '44312', type: 'École de commerce' },
    { name: 'Neoma Business School', city: 'Reims', region: 'Grand Est', department: '51', postal_code: '51687', type: 'École de commerce' },
    { name: 'Skema Business School', city: 'Lille', region: 'Hauts-de-France', department: '59', postal_code: '59800', type: 'École de commerce' },
    { name: 'Kedge Business School', city: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur', department: '13', postal_code: '13009', type: 'École de commerce' },
    { name: 'Grenoble École de Management', city: 'Grenoble', region: 'Auvergne-Rhône-Alpes', department: '38', postal_code: '38003', type: 'École de commerce' },
    { name: 'Toulouse Business School', city: 'Toulouse', region: 'Occitanie', department: '31', postal_code: '31068', type: 'École de commerce' },
    { name: 'Rennes School of Business', city: 'Rennes', region: 'Bretagne', department: '35', postal_code: '35065', type: 'École de commerce' },
    { name: 'Montpellier Business School', city: 'Montpellier', region: 'Occitanie', department: '34', postal_code: '34185', type: 'École de commerce' },
    
    // Écoles spécialisées informatique - EPITECH
    { name: 'EPITECH Paris', city: 'Paris', region: 'Île-de-France', department: '75', postal_code: '75011', type: 'École spécialisée' },
    { name: 'EPITECH Lyon', city: 'Lyon', region: 'Auvergne-Rhône-Alpes', department: '69', postal_code: '69007', type: 'École spécialisée' },
    { name: 'EPITECH Marseille', city: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur', department: '13', postal_code: '13008', type: 'École spécialisée' },
    { name: 'EPITECH Toulouse', city: 'Toulouse', region: 'Occitanie', department: '31', postal_code: '31000', type: 'École spécialisée' },
    { name: 'EPITECH Lille', city: 'Lille', region: 'Hauts-de-France', department: '59', postal_code: '59000', type: 'École spécialisée' },
    { name: 'EPITECH Nantes', city: 'Nantes', region: 'Pays de la Loire', department: '44', postal_code: '44000', type: 'École spécialisée' },
    { name: 'EPITECH Bordeaux', city: 'Bordeaux', region: 'Nouvelle-Aquitaine', department: '33', postal_code: '33000', type: 'École spécialisée' },
    { name: 'EPITECH Rennes', city: 'Rennes', region: 'Bretagne', department: '35', postal_code: '35000', type: 'École spécialisée' },
    { name: 'EPITECH Strasbourg', city: 'Strasbourg', region: 'Grand Est', department: '67', postal_code: '67000', type: 'École spécialisée' },
    { name: 'EPITECH Montpellier', city: 'Montpellier', region: 'Occitanie', department: '34', postal_code: '34000', type: 'École spécialisée' },
    { name: 'EPITECH Nice', city: 'Nice', region: 'Provence-Alpes-Côte d\'Azur', department: '06', postal_code: '06000', type: 'École spécialisée' },
    { name: '42 Paris', city: 'Paris', region: 'Île-de-France', department: '75', postal_code: '75017', type: 'École spécialisée' },
    { name: '42 Lyon', city: 'Lyon', region: 'Auvergne-Rhône-Alpes', department: '69', postal_code: '69007', type: 'École spécialisée' },
    { name: 'Supinfo Paris', city: 'Paris', region: 'Île-de-France', department: '75', postal_code: '75015', type: 'École spécialisée' },
    { name: 'EPSI Paris', city: 'Paris', region: 'Île-de-France', department: '75', postal_code: '75010', type: 'École spécialisée' },
    { name: 'YNOV Campus Lyon', city: 'Lyon', region: 'Auvergne-Rhône-Alpes', department: '69', postal_code: '69007', type: 'École spécialisée' },
    
    // Établissements dans le Pas-de-Calais (62) - Région mentionnée par l'utilisateur
    { name: 'Université du Littoral Côte d\'Opale', city: 'Boulogne-sur-Mer', region: 'Hauts-de-France', department: '62', postal_code: '62200', type: 'Université' },
    { name: 'École Supérieure du Professorat Boulogne', city: 'Boulogne-sur-Mer', region: 'Hauts-de-France', department: '62', postal_code: '62200', type: 'École spécialisée' },
    { name: 'IUT Calais Boulogne', city: 'Calais', region: 'Hauts-de-France', department: '62', postal_code: '62100', type: 'IUT' },
    { name: 'Lycée Mariette Boulogne-sur-Mer', city: 'Boulogne-sur-Mer', region: 'Hauts-de-France', department: '62', postal_code: '62200', type: 'Lycée' },
    { name: 'CFA Boulogne-sur-Mer', city: 'Boulogne-sur-Mer', region: 'Hauts-de-France', department: '62', postal_code: '62200', type: 'CFA' },
    
    // IUT principaux
    { name: 'IUT Paris Descartes', city: 'Paris', region: 'Île-de-France', department: '75', postal_code: '75016', type: 'IUT' },
    { name: 'IUT Lyon 1', city: 'Lyon', region: 'Auvergne-Rhône-Alpes', department: '69', postal_code: '69622', type: 'IUT' },
    { name: 'IUT Bordeaux', city: 'Bordeaux', region: 'Nouvelle-Aquitaine', department: '33', postal_code: '33175', type: 'IUT' },
    { name: 'IUT Toulouse', city: 'Toulouse', region: 'Occitanie', department: '31', postal_code: '31077', type: 'IUT' },
    { name: 'IUT Lille', city: 'Lille', region: 'Hauts-de-France', department: '59', postal_code: '59653', type: 'IUT' },
    { name: 'IUT Nantes', city: 'Nantes', region: 'Pays de la Loire', department: '44', postal_code: '44470', type: 'IUT' },
    { name: 'IUT Marseille', city: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur', department: '13', postal_code: '13388', type: 'IUT' },
    { name: 'IUT Strasbourg', city: 'Strasbourg', region: 'Grand Est', department: '67', postal_code: '67411', type: 'IUT' },
    { name: 'IUT Grenoble', city: 'Grenoble', region: 'Auvergne-Rhône-Alpes', department: '38', postal_code: '38031', type: 'IUT' },
    { name: 'IUT Nice', city: 'Nice', region: 'Provence-Alpes-Côte d\'Azur', department: '06', postal_code: '06206', type: 'IUT' },
    { name: 'IUT Rennes', city: 'Rennes', region: 'Bretagne', department: '35', postal_code: '35704', type: 'IUT' },
    { name: 'IUT Montpellier', city: 'Montpellier', region: 'Occitanie', department: '34', postal_code: '34296', type: 'IUT' },
    
    // Lycées prestigieux
    { name: 'Lycée Henri IV', city: 'Paris', region: 'Île-de-France', department: '75', postal_code: '75005', type: 'Lycée' },
    { name: 'Lycée Louis-le-Grand', city: 'Paris', region: 'Île-de-France', department: '75', postal_code: '75005', type: 'Lycée' },
    { name: 'Lycée Saint-Louis', city: 'Paris', region: 'Île-de-France', department: '75', postal_code: '75006', type: 'Lycée' },
    { name: 'Lycée du Parc', city: 'Lyon', region: 'Auvergne-Rhône-Alpes', department: '69', postal_code: '69006', type: 'Lycée' },
    { name: 'Lycée Pierre de Fermat', city: 'Toulouse', region: 'Occitanie', department: '31', postal_code: '31000', type: 'Lycée' },
    { name: 'Lycée Faidherbe', city: 'Lille', region: 'Hauts-de-France', department: '59', postal_code: '59000', type: 'Lycée' },
    { name: 'Lycée Clemenceau', city: 'Nantes', region: 'Pays de la Loire', department: '44', postal_code: '44000', type: 'Lycée' },
    { name: 'Lycée Thiers', city: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur', department: '13', postal_code: '13001', type: 'Lycée' },
    { name: 'Lycée Kléber', city: 'Strasbourg', region: 'Grand Est', department: '67', postal_code: '67000', type: 'Lycée' },
    { name: 'Lycée Champollion', city: 'Grenoble', region: 'Auvergne-Rhône-Alpes', department: '38', postal_code: '38000', type: 'Lycée' },
    
    // ENS (Écoles Normales Supérieures)
    { name: 'ENS Paris', city: 'Paris', region: 'Île-de-France', department: '75', postal_code: '75005', type: 'École normale supérieure' },
    { name: 'ENS Lyon', city: 'Lyon', region: 'Auvergne-Rhône-Alpes', department: '69', postal_code: '69342', type: 'École normale supérieure' },
    { name: 'ENS Cachan', city: 'Cachan', region: 'Île-de-France', department: '94', postal_code: '94235', type: 'École normale supérieure' },
    { name: 'ENS Rennes', city: 'Rennes', region: 'Bretagne', department: '35', postal_code: '35170', type: 'École normale supérieure' }
  ];

  // Filtrage intelligent des établissements
  const filteredInstitutions = institutionDatabase.filter(institution => {
    if (!searchTerm || searchTerm.length < 2) return false;
    
    const searchLower = searchTerm.toLowerCase();
    
    switch (searchFilter) {
      case 'name':
        return institution.name.toLowerCase().includes(searchLower);
      case 'city':
        return institution.city.toLowerCase().includes(searchLower);
      case 'region':
        return institution.region.toLowerCase().includes(searchLower);
      case 'department':
        return institution.department.includes(searchTerm) || 
               institution.department === searchTerm;
      case 'postal':
        return institution.postal_code.includes(searchTerm);
      default: // 'all'
        return institution.name.toLowerCase().includes(searchLower) ||
               institution.city.toLowerCase().includes(searchLower) ||
               institution.region.toLowerCase().includes(searchLower) ||
               institution.department.includes(searchTerm) ||
               institution.postal_code.includes(searchTerm) ||
               institution.type.toLowerCase().includes(searchLower);
    }
  }).slice(0, 12); // Augmenté à 12 résultats

  // Options de filtres
  const filterOptions = [
    { value: 'all', label: 'Tous les critères', icon: '🔍' },
    { value: 'name', label: 'Nom établissement', icon: '🏫' },
    { value: 'city', label: 'Ville', icon: '🏙️' },
    { value: 'region', label: 'Région', icon: '🗺️' },
    { value: 'department', label: 'Département', icon: '📍' },
    { value: 'postal', label: 'Code postal', icon: '📮' }
  ];

  // Auto-détection du type d'établissement
  const detectInstitutionType = (institutionName) => {
    // Recherche exacte dans la base
    const found = institutionDatabase.find(inst => 
      inst.name.toLowerCase() === institutionName.toLowerCase()
    );
    if (found) return found.type;
    
    // Recherche par mots-clés
    const name = institutionName.toLowerCase();
    if (name.includes('université') || name.includes('fac')) return 'Université';
    if (name.includes('polytechnique') || name.includes('centrale') || name.includes('insa') || name.includes('isep')) return 'École d\'ingénieur';
    if (name.includes('essec') || name.includes('hec') || name.includes('escp') || name.includes('business')) return 'École de commerce';
    if (name.includes('lycée')) return 'Lycée';
    if (name.includes('cfa')) return 'CFA';
    if (name.includes('iut')) return 'IUT';
    if (name.includes('ens')) return 'École normale supérieure';
    
    return '';
  };

  const institutionTypes = [
    'Lycée',
    'Université',
    'École d\'ingénieur',
    'École de commerce',
    'École spécialisée',
    'CFA',
    'Institut universitaire de technologie (IUT)',
    'École normale supérieure',
    'Autre'
  ];

  const studyFields = [
    'Informatique & Développement',
    'Data Science & IA',
    'Marketing & Communication',
    'Commerce & Vente',
    'Finance & Comptabilité',
    'Ressources Humaines',
    'Design & Création',
    'Ingénierie & Technique',
    'Santé & Médical',
    'Éducation & Formation',
    'Juridique & Droit',
    'Logistique & Transport',
    'Agriculture & Environnement',
    'Tourisme & Hôtellerie',
    'Arts & Culture',
    'Autre'
  ];

  const degreeTypes = [
    'CAP',
    'Bac',
    'BTS',
    'BUT',
    'Licence',
    'Bachelor',
    'Master',
    'Doctorat',
    'Diplôme d\'ingénieur',
    'MBA',
    'Autre'
  ];

  const studyYears = [
    '1ère année',
    '2ème année',
    '3ème année',
    '4ème année',
    '5ème année',
    '6ème année et plus'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5" />
          <span>Établissement actuel</span>
        </CardTitle>
        <CardDescription>
          Informations sur votre établissement d'enseignement actuel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Recherche d'établissement avec filtres */}
        <div className="space-y-4">
          <Label className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span>Recherche d'établissement</span>
          </Label>
          
          {/* Filtres de recherche */}
          <div className="flex flex-wrap gap-2 mb-3">
            {filterOptions.map(option => (
              <Button
                key={option.value}
                variant={searchFilter === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchFilter(option.value)}
                className="text-xs h-8"
              >
                <span className="mr-1">{option.icon}</span>
                {option.label}
              </Button>
            ))}
          </div>
          
          <div className="relative">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={`Rechercher par ${filterOptions.find(f => f.value === searchFilter)?.label.toLowerCase() || 'tous critères'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowCreateInstitution(!showCreateInstitution)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Créer</span>
              </Button>
            </div>
            
            {/* Indication du filtre actif */}
            {searchFilter !== 'all' && (
              <div className="mt-2">
                <div className="inline-flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                  <span>{filterOptions.find(f => f.value === searchFilter)?.icon}</span>
                  <span>Recherche par {filterOptions.find(f => f.value === searchFilter)?.label.toLowerCase()}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchFilter('all')}
                    className="h-4 w-4 p-0 ml-1 text-blue-600 hover:bg-blue-100"
                  >
                    ×
                  </Button>
                </div>
              </div>
            )}
            
            {/* Résultats de recherche avec informations géographiques complètes */}
            {searchTerm && filteredInstitutions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-80 overflow-y-auto">
                {filteredInstitutions.map((institution, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex justify-between items-start"
                    onClick={() => {
                      handleInputChange('institution_name', institution.name);
                      handleInputChange('institution_city', institution.city);
                      const detectedType = institution.type;
                      if (detectedType) {
                        handleInputChange('institution_type', detectedType);
                      }
                      setSearchTerm('');
                    }}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">{institution.name}</div>
                      <div className="text-xs text-gray-600 flex items-center flex-wrap gap-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{institution.city}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>🗺️</span>
                          <span>{institution.region}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>📍</span>
                          <span>Dép. {institution.department}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>📮</span>
                          <span>{institution.postal_code}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {institution.type}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
                
                {/* Message si pas de résultats */}
                {searchTerm.length >= 2 && filteredInstitutions.length === 0 && (
                  <div className="px-4 py-6 text-sm text-gray-500 text-center">
                    <div className="mb-2">
                      Aucun établissement trouvé pour "{searchTerm}"
                      {searchFilter !== 'all' && (
                        <span className="block text-xs mt-1">
                          avec le filtre {filterOptions.find(f => f.value === searchFilter)?.label.toLowerCase()}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      {searchFilter !== 'all' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchFilter('all')}
                          className="text-xs mr-2"
                        >
                          🔍 Rechercher dans tous les critères
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCreateInstitution(true)}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Créer cet établissement
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Création d'établissement */}
          {showCreateInstitution && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <Input
                placeholder="Nom de votre établissement"
                value={profileForm.institution_name}
                onChange={(e) => handleInputChange('institution_name', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-2">
                Si votre établissement n'existe pas dans la liste, vous pouvez le créer ici
              </p>
            </div>
          )}
          
          {profileForm.institution_name && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <Building className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-blue-800 mb-2">
                    {profileForm.institution_name}
                  </div>
                  {(() => {
                    const institutionData = institutionDatabase.find(inst => 
                      inst.name === profileForm.institution_name
                    );
                    return institutionData ? (
                      <div className="space-y-2">
                        <div className="flex items-center flex-wrap gap-4 text-xs text-blue-600">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{institutionData.city}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>🗺️</span>
                            <span>{institutionData.region}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>📍</span>
                            <span>Dép. {institutionData.department}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>📮</span>
                            <span>{institutionData.postal_code}</span>
                          </div>
                        </div>
                        <div>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                            {institutionData.type}
                          </span>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Type d'établissement */}
        <div className="space-y-2">
          <Label>Type d'établissement</Label>
          <Select 
            value={profileForm.institution_type} 
            onValueChange={(value) => handleInputChange('institution_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez le type d'établissement" />
            </SelectTrigger>
            <SelectContent>
              {institutionTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Domaine d'étude */}
        <div className="space-y-2">
          <Label>Domaine d'étude</Label>
          <Select 
            value={profileForm.field_of_study} 
            onValueChange={(value) => handleInputChange('field_of_study', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez votre domaine d'étude" />
            </SelectTrigger>
            <SelectContent>
              {studyFields.map(field => (
                <SelectItem key={field} value={field}>{field}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Diplôme préparé et Année d'étude */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Diplôme préparé</Label>
            <Select 
              value={profileForm.degree_preparing} 
              onValueChange={(value) => handleInputChange('degree_preparing', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Diplôme en cours" />
              </SelectTrigger>
              <SelectContent>
                {degreeTypes.map(degree => (
                  <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Année d'étude</Label>
            <Select 
              value={profileForm.study_year} 
              onValueChange={(value) => handleInputChange('study_year', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Année actuelle" />
              </SelectTrigger>
              <SelectContent>
                {studyYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Année prévue d'obtention */}
        <div className="space-y-2">
          <Label>Année prévue d'obtention</Label>
          <Input
            type="number"
            min="2024"
            max="2030"
            value={profileForm.graduation_year}
            onChange={(e) => handleInputChange('graduation_year', e.target.value)}
            placeholder="Ex: 2025"
          />
        </div>

        {/* Relevé de notes / Justificatif étudiant */}
        <UniversalFileUpload
          label="Relevé de notes / Justificatif étudiant"
          description="Ajoutez votre relevé de notes ou un justificatif de scolarité (PDF)"
          acceptedTypes={['application/pdf']}
          maxSize={5 * 1024 * 1024} // 5MB
          value={profileForm.student_certificate}
          onChange={(file) => handleInputChange('student_certificate', file)}
          required={false}
        />

        {/* Bouton de sauvegarde de la section */}
        {onSave && (
          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={onSave}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Sauvegarde...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Sauvegarder la section</span>
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AcademicInstitutionSection;