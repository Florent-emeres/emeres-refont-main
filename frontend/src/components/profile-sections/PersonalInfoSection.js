import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { User, Phone, Mail, MapPin, Calendar, Edit, Check, X, Save, RefreshCw } from 'lucide-react';
import UniversalFileUpload from '../shared/UniversalFileUpload';
import EmailChangeConfirmation from '../EmailChangeConfirmation';

const PersonalInfoSection = ({ profileForm, setProfileForm, errors = {}, onSave, loading = false }) => {
  const [emailEditMode, setEmailEditMode] = useState(false);
  const [tempEmail, setTempEmail] = useState('');
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [showNationalitySuggestions, setShowNationalitySuggestions] = useState(false);
  const [phonePrefix, setPhonePrefix] = useState('+33');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [suggestedCities, setSuggestedCities] = useState([]);

  // Initialiser le téléphone existant
  React.useEffect(() => {
    if (profileForm.phone && profileForm.phone !== phonePrefix + ' ' + phoneNumber) {
      const phoneMatch = profileForm.phone.match(/^(\+\d+)\s(.+)$/);
      if (phoneMatch) {
        setPhonePrefix(phoneMatch[1]);
        setPhoneNumber(phoneMatch[2]);
      }
    }
  }, [profileForm.phone]);

  const handleInputChange = (field, value) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmailEditStart = () => {
    setTempEmail(profileForm.email);
    setEmailEditMode(true);
  };

  const handleEmailEditCancel = () => {
    setTempEmail('');
    setEmailEditMode(false);
  };

  const handleEmailEditConfirm = () => {
    if (tempEmail !== profileForm.email) {
      setShowEmailConfirmation(true);
    } else {
      setEmailEditMode(false);
    }
  };

  const handleEmailChangeConfirm = () => {
    handleInputChange('email', tempEmail);
    setEmailEditMode(false);
    setShowEmailConfirmation(false);
    setTempEmail('');
  };

  const handleEmailChangeCancel = () => {
    setShowEmailConfirmation(false);
  };

  const requiredFields = ['last_name', 'first_name', 'birth_date', 'phone', 'email'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Informations personnelles</span>
            </CardTitle>
            <CardDescription>
              Renseignez vos informations personnelles de base
            </CardDescription>
          </div>
          
          {/* Mini-aperçu photo de profil */}
          {profileForm.profile_photo && profileForm.profile_photo.uploaded && (
            <div className="flex-shrink-0">
              <img
                src={profileForm.profile_photo.url}
                alt="Photo de profil"
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nom et Prénom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="last_name">
              Nom <span className="text-red-500">*</span>
            </Label>
            <Input
              id="last_name"
              value={profileForm.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              placeholder="Votre nom de famille"
              className={errors.last_name ? 'border-red-500' : ''}
            />
            {errors.last_name && (
              <p className="text-sm text-red-500">{errors.last_name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="first_name">
              Prénom <span className="text-red-500">*</span>
            </Label>
            <Input
              id="first_name"
              value={profileForm.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              placeholder="Votre prénom"
              className={errors.first_name ? 'border-red-500' : ''}
            />
            {errors.first_name && (
              <p className="text-sm text-red-500">{errors.first_name}</p>
            )}
          </div>
        </div>

        {/* Sexe/Civilité et Date de naissance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Sexe / Civilité</Label>
            <Select 
              value={profileForm.gender} 
              onValueChange={(value) => handleInputChange('gender', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre civilité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M.">M. (Monsieur)</SelectItem>
                <SelectItem value="Mme.">Mme. (Madame)</SelectItem>
                <SelectItem value="Autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birth_date">
              Date de naissance <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center space-x-3">
              <Input
                id="birth_date"
                type="date"
                min="1980-01-01"
                max={new Date(Date.now() - 14 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // Minimum 14 ans
                value={profileForm.birth_date}
                onChange={(e) => handleInputChange('birth_date', e.target.value)}
                className={errors.birth_date ? 'border-red-500 flex-1' : 'flex-1'}
              />
              {profileForm.birth_date && (
                <div className="bg-blue-50 px-3 py-2 rounded-md border border-blue-200 min-w-[80px]">
                  <p className="text-sm font-medium text-blue-800">
                    {(() => {
                      const today = new Date();
                      const birthDate = new Date(profileForm.birth_date);
                      let age = today.getFullYear() - birthDate.getFullYear();
                      const monthDiff = today.getMonth() - birthDate.getMonth();
                      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                      }
                      return `${age} ans`;
                    })()}
                  </p>
                </div>
              )}
            </div>
            {errors.birth_date && (
              <p className="text-sm text-red-500">{errors.birth_date}</p>
            )}
            {profileForm.birth_date && (() => {
              const today = new Date();
              const birthDate = new Date(profileForm.birth_date);
              let age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
              }
              if (age < 14) {
                return <p className="text-sm text-orange-600">⚠️ Âge minimum requis : 14 ans</p>;
              }
              if (age > 65) {
                return <p className="text-sm text-orange-600">⚠️ Âge inhabituel pour un profil étudiant</p>;
              }
              return null;
            })()}
          </div>
        </div>

        {/* Nationalité avec auto-suggestion */}
        <div className="space-y-2">
          <Label htmlFor="nationality">Nationalité</Label>
          <div className="relative">
            <Input
              id="nationality"
              value={profileForm.nationality}
              onChange={(e) => {
                const value = e.target.value;
                handleInputChange('nationality', value);
                setShowNationalitySuggestions(value.length > 0);
              }}
              placeholder="Ex: Française, Belge, Marocaine..."
              onFocus={() => profileForm.nationality && setShowNationalitySuggestions(true)}
              onBlur={() => setTimeout(() => setShowNationalitySuggestions(false), 200)}
            />
            
            {/* Suggestions de nationalités */}
            {showNationalitySuggestions && profileForm.nationality && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                {(() => {
                  const nationalities = [
                    'Afghane', 'Albanaise', 'Algérienne', 'Allemande', 'Américaine', 'Andorrane', 'Angolaise', 'Antiguaise', 'Argentine', 'Arménienne', 'Australienne', 'Autrichienne', 'Azerbaïdjanaise',
                    'Bahaméenne', 'Bahreïnienne', 'Bangladaise', 'Barbadienne', 'Belge', 'Bélizienne', 'Béninoise', 'Bhoutanaise', 'Biélorusse', 'Birmane', 'Bolivienne', 'Bosnienne', 'Botswanaise', 'Brésilienne', 'Britannique', 'Brunéienne', 'Bulgare', 'Burkinabè', 'Burundaise',
                    'Cambodgienne', 'Camerounaise', 'Canadienne', 'Cap-verdienne', 'Centrafricaine', 'Chilienne', 'Chinoise', 'Chypriote', 'Colombienne', 'Comorienne', 'Congolaise', 'Coréenne', 'Costaricienne', 'Croate', 'Cubaine',
                    'Danoise', 'Djiboutienne', 'Dominicaine', 'Dominiquaise',
                    'Égyptienne', 'Émirienne', 'Équatorienne', 'Érythréenne', 'Espagnole', 'Estonienne', 'Éthiopienne',
                    'Fidjienne', 'Finlandaise', 'Française',
                    'Gabonaise', 'Gambienne', 'Géorgienne', 'Ghanéenne', 'Grecque', 'Grenadienne', 'Guatémaltèque', 'Guinéenne', 'Guyanienne',
                    'Haïtienne', 'Hondurienne', 'Hongroise',
                    'Indienne', 'Indonésienne', 'Irakienne', 'Iranienne', 'Irlandaise', 'Islandaise', 'Israélienne', 'Italienne', 'Ivoirienne',
                    'Jamaïcaine', 'Japonaise', 'Jordanienne',
                    'Kazakhe', 'Kényane', 'Kirghize', 'Koweïtienne',
                    'Laotienne', 'Lesothane', 'Lettone', 'Libanaise', 'Libérienne', 'Libyenne', 'Liechtensteinoise', 'Lituanienne', 'Luxembourgeoise',
                    'Macédonienne', 'Malgache', 'Malaisienne', 'Malawienne', 'Maldivienne', 'Malienne', 'Maltaise', 'Marocaine', 'Marshallaise', 'Mauricienne', 'Mauritanienne', 'Mexicaine', 'Micronésienne', 'Moldave', 'Monégasque', 'Mongole', 'Monténégrine', 'Mozambicaine',
                    'Namibienne', 'Nauruane', 'Népalaise', 'Nicaraguayenne', 'Nigériane', 'Nigérienne', 'Norvégienne', 'Néo-zélandaise',
                    'Omanaise', 'Ougandaise', 'Ouzbèke',
                    'Pakistanaise', 'Palaosienne', 'Panamérienne', 'Papouane', 'Paraguayenne', 'Péruvienne', 'Philippine', 'Polonaise', 'Portugaise',
                    'Qatarienne',
                    'Roumaine', 'Russe', 'Rwandaise',
                    'Saint-marinaise', 'Salomonaise', 'Salvadorienne', 'Samoane', 'Sao-toméenne', 'Saoudienne', 'Sénégalaise', 'Serbe', 'Seychelloise', 'Sierra-léonaise', 'Singapourienne', 'Slovaque', 'Slovène', 'Somalienne', 'Soudanaise', 'Sri-lankaise', 'Sud-africaine', 'Sud-soudanaise', 'Suédoise', 'Suisse', 'Surinamaise', 'Syrienne',
                    'Tadjike', 'Tanzanienne', 'Tchadienne', 'Tchèque', 'Thaïlandaise', 'Timoraise', 'Togolaise', 'Tongienne', 'Trinidadienne', 'Tunisienne', 'Turque', 'Turkmène', 'Tuvaluane',
                    'Ukrainienne', 'Uruguayenne',
                    'Vanuatuane', 'Vénézuélienne', 'Vietnamienne',
                    'Yéménite',
                    'Zambienne', 'Zimbabwéenne'
                  ];
                  
                  return nationalities
                    .filter(nationality => 
                      nationality.toLowerCase().startsWith(profileForm.nationality.toLowerCase())
                    )
                    .slice(0, 8)
                    .map(nationality => (
                      <button
                        key={nationality}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          handleInputChange('nationality', nationality);
                          setShowNationalitySuggestions(false);
                        }}
                      >
                        {nationality}
                      </button>
                    ));
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Adresse postale */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <Label className="text-sm font-medium">Adresse postale</Label>
          </div>
          
          <div className="space-y-3">
            <Input
              placeholder="Numéro et nom de rue"
              value={profileForm.address_street}
              onChange={(e) => handleInputChange('address_street', e.target.value)}
            />
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {/* Code postal avec suggestions */}
              <div className="relative">
                <Input
                  placeholder="Code postal"
                  value={profileForm.postal_code}
                  onChange={(e) => {
                    const postalCode = e.target.value;
                    handleInputChange('postal_code', postalCode);
                    
                    // Base élargie d'auto-suggestion de ville pour codes postaux français
                    const cityMap = {
                      // Paris
                      '75001': 'Paris 1er', '75002': 'Paris 2e', '75003': 'Paris 3e', '75004': 'Paris 4e',
                      '75005': 'Paris 5e', '75006': 'Paris 6e', '75007': 'Paris 7e', '75008': 'Paris 8e',
                      '75009': 'Paris 9e', '75010': 'Paris 10e', '75011': 'Paris 11e', '75012': 'Paris 12e',
                      '75013': 'Paris 13e', '75014': 'Paris 14e', '75015': 'Paris 15e', '75016': 'Paris 16e',
                      '75017': 'Paris 17e', '75018': 'Paris 18e', '75019': 'Paris 19e', '75020': 'Paris 20e',
                      
                      // Lyon  
                      '69001': 'Lyon 1er', '69002': 'Lyon 2e', '69003': 'Lyon 3e', '69004': 'Lyon 4e',
                      '69005': 'Lyon 5e', '69006': 'Lyon 6e', '69007': 'Lyon 7e', '69008': 'Lyon 8e', 
                      '69009': 'Lyon 9e', '69100': 'Villeurbanne', '69200': 'Vénissieux', '69300': 'Caluire-et-Cuire',
                      
                      // Marseille
                      '13001': 'Marseille 1er', '13002': 'Marseille 2e', '13003': 'Marseille 3e', '13004': 'Marseille 4e',
                      '13005': 'Marseille 5e', '13006': 'Marseille 6e', '13007': 'Marseille 7e', '13008': 'Marseille 8e',
                      '13009': 'Marseille 9e', '13010': 'Marseille 10e', '13011': 'Marseille 11e', '13012': 'Marseille 12e',
                      '13013': 'Marseille 13e', '13014': 'Marseille 14e', '13015': 'Marseille 15e', '13016': 'Marseille 16e',
                      '13100': 'Aix-en-Provence', '13200': 'Arles', '13300': 'Salon-de-Provence',
                      
                      // Pas-de-Calais (62) - Région 622 demandée par l'utilisateur
                      '62000': 'Arras', '62100': 'Calais', '62200': 'Boulogne-sur-Mer', '62230': 'Outreau',
                      '62300': 'Lens', '62400': 'Béthune', '62500': 'Saint-Venant', '62600': 'Berck',
                      '62700': 'Bruay-la-Buissière', '62800': 'Liévin', '62900': 'Anguères',
                      '62140': 'Hesdin', '62160': 'Bully-les-Mines', '62170': 'Montreuil',
                      '62180': 'Verton', '62190': 'Lillers', '62210': 'Avion', '62220': 'Carvin',
                      '62240': 'Desvres', '62250': 'Marquise', '62260': 'Auchel', '62270': 'Frevent',
                      '62280': 'Saint-Martin-Boulogne', '62290': 'Noeux-les-Mines', '62310': 'Fruges',
                      '62320': 'Rouvroy', '62330': 'Isbergues', '62340': 'Guines', '62350': 'Calonne-Ricouart',
                      '62360': 'La Capelle-lès-Boulogne', '62370': 'Audruicq', '62380': 'Lumbres',
                      '62390': 'Auxi-le-Château', '62410': 'Wingles', '62420': 'Billy-Montigny',
                      '62430': 'Sallaumines', '62440': 'Harnes', '62450': 'Bapaume', '62460': 'Divion',
                      '62470': 'Calonne-sur-la-Lys', '62480': 'Le Portel', '62490': 'Fresnes-lès-Montauban',
                      '62510': 'Arques', '62520': 'Le Touquet-Paris-Plage', '62530': 'Hersin-Coupigny',
                      '62540': 'Marles-les-Mines', '62550': 'Marest-sur-Matz', '62560': 'Fauquembergues',
                      '62570': 'Wizernes', '62580': 'Vimy', '62590': 'Oignies', '62610': 'Ardres',
                      '62620': 'Barlin', '62630': 'Étaples', '62640': 'Montigny-en-Gohelle', '62650': 'Étaples',
                      '62660': 'Beuvry', '62670': 'Mazingarbe', '62680': 'Méricourt', '62690': 'Estréés-Cauchie',
                      '62710': 'Courrières', '62720': 'Rinxent', '62730': 'Marck', '62740': 'Fouquières-lès-Lens',
                      '62750': 'Loos-en-Gohelle', '62760': 'Pas-en-Artois', '62770': 'Willerval',
                      '62780': 'Cucq', '62790': 'Leforest', '62810': 'Avesnes-le-Comte', '62820': 'Libercourt',
                      '62830': 'Samer', '62840': 'Laventie', '62850': 'Licques', '62860': 'Bourlon',
                      '62870': 'Campagne-lès-Hesdin', '62880': 'Pont-à-Vendin', '62890': 'Tournehem-sur-la-Hem',
                      '62910': 'Éperlecques', '62920': 'Chocques', '62930': 'Wimereux', '62940': 'Haillicourt',
                      '62950': 'Noyelles-Godault', '62960': 'Flines-lez-Raches', '62970': 'Courcelles-lès-Lens',
                      '62980': 'Vermelles', '62990': 'Beaurainville',
                      
                      // Grandes villes
                      '33000': 'Bordeaux', '33100': 'Arcachon', '33200': 'Bordeaux', '33300': 'Bordeaux',
                      '31000': 'Toulouse', '31100': 'Toulouse', '31200': 'Toulouse', '31300': 'Toulouse',
                      '59000': 'Lille', '59100': 'Roubaix', '59200': 'Tourcoing', '59300': 'Valenciennes',
                      '67000': 'Strasbourg', '67100': 'Strasbourg', '67200': 'Strasbourg',
                      '44000': 'Nantes', '44100': 'Nantes', '44200': 'Nantes', '44300': 'Nantes',
                      '34000': 'Montpellier', '34100': 'Montpellier', '34200': 'Sète', '34300': 'Agde',
                      '35000': 'Rennes', '35100': 'Rennes', '35200': 'Rennes', '35300': 'Fougères',
                      '06000': 'Nice', '06100': 'Nice', '06200': 'Nice', '06300': 'Nice', '06400': 'Cannes',
                      '54000': 'Nancy', '57000': 'Metz', '21000': 'Dijon', '87000': 'Limoges',
                      '51000': 'Reims', '76000': 'Rouen', '80000': 'Amiens', '25000': 'Besançon',
                      '68000': 'Colmar', '68100': 'Mulhouse', '29000': 'Quimper', '29200': 'Brest',
                      '56000': 'Vannes', '22000': 'Saint-Brieuc', '14000': 'Caen', '50000': 'Saint-Lô',
                      '72000': 'Le Mans', '49000': 'Angers', '37000': 'Tours', '45000': 'Orléans',
                      '86000': 'Poitiers', '17000': 'La Rochelle', '64000': 'Pau', '65000': 'Tarbes',
                      '63000': 'Clermont-Ferrand', '42000': 'Saint-Étienne', '38000': 'Grenoble',
                      '73000': 'Chambéry', '74000': 'Annecy', '26000': 'Valence',
                      
                      // DOM-TOM
                      '97100': 'Basse-Terre', '97110': 'Pointe-à-Pitre', '97200': 'Fort-de-France',
                      '97300': 'Cayenne', '97400': 'Saint-Denis', '98800': 'Nouméa', '98700': 'Papeete'
                    };
                    
                    // Auto-complétion automatique dès que le code postal exact est trouvé
                    if (cityMap[postalCode]) {
                      handleInputChange('city', cityMap[postalCode]);
                    }
                    
                    // Suggestions pour codes partiels (2+ chiffres)
                    if (postalCode.length >= 2) {
                      // Recherche des suggestions basées sur le début du code postal
                      const matchingCities = [];
                      Object.entries(cityMap).forEach(([code, city]) => {
                        if (code.startsWith(postalCode)) {
                          matchingCities.push({ code, city });
                        }
                      });
                      
                      // Trier les résultats pour avoir les codes exacts en premier, et limiter à 10 résultats
                      const sortedCities = matchingCities
                        .sort((a, b) => {
                          // Priorité aux codes postaux exacts (longueur complète)
                          if (a.code.length === 5 && b.code.length !== 5) return -1;
                          if (b.code.length === 5 && a.code.length !== 5) return 1;
                          // Sinon tri alphabétique par ville
                          return a.city.localeCompare(b.city);
                        })
                        .slice(0, 10);
                      
                      setSuggestedCities(sortedCities);
                      setShowCitySuggestions(sortedCities.length > 0);
                      
                    } else {
                      setShowCitySuggestions(false);
                      setSuggestedCities([]);
                      // Vider le champ ville si le code postal n'est pas assez long
                      if (postalCode.length === 0) {
                        handleInputChange('city', '');
                      }
                    }
                  }}
                  onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                />
                
                {/* Suggestions de villes - remplit code postal ET ville */}
                {showCitySuggestions && suggestedCities.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                    {suggestedCities.map(({ code, city }, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex justify-between items-center"
                        onClick={() => {
                          // Complète le code postal ET remplit la ville
                          handleInputChange('postal_code', code);
                          handleInputChange('city', city);
                          setShowCitySuggestions(false);
                        }}
                      >
                        <span className="font-medium">{city}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Ville - Champ séparé et modifiable */}
              <Input
                placeholder="Ville"
                value={profileForm.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
              
              {/* Pays */}
              <Input
                placeholder="Pays"
                value={profileForm.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Téléphone <span className="text-red-500">*</span></span>
            </Label>
            <div className="flex space-x-2">
              {/* Sélecteur de préfixe pays */}
              <Select 
                value={phonePrefix} 
                onValueChange={setPhonePrefix}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+33">🇫🇷 +33</SelectItem>
                  <SelectItem value="+1">🇺🇸 +1</SelectItem>
                  <SelectItem value="+44">🇬🇧 +44</SelectItem>
                  <SelectItem value="+49">🇩🇪 +49</SelectItem>
                  <SelectItem value="+39">🇮🇹 +39</SelectItem>
                  <SelectItem value="+34">🇪🇸 +34</SelectItem>
                  <SelectItem value="+351">🇵🇹 +351</SelectItem>
                  <SelectItem value="+32">🇧🇪 +32</SelectItem>
                  <SelectItem value="+41">🇨🇭 +41</SelectItem>
                  <SelectItem value="+43">🇦🇹 +43</SelectItem>
                  <SelectItem value="+31">🇳🇱 +31</SelectItem>
                  <SelectItem value="+45">🇩🇰 +45</SelectItem>
                  <SelectItem value="+46">🇸🇪 +46</SelectItem>
                  <SelectItem value="+47">🇳🇴 +47</SelectItem>
                  <SelectItem value="+212">🇲🇦 +212</SelectItem>
                  <SelectItem value="+213">🇩🇿 +213</SelectItem>
                  <SelectItem value="+216">🇹🇳 +216</SelectItem>
                  <SelectItem value="+225">🇨🇮 +225</SelectItem>
                  <SelectItem value="+221">🇸🇳 +221</SelectItem>
                  <SelectItem value="+237">🇨🇲 +237</SelectItem>
                  <SelectItem value="+86">🇨🇳 +86</SelectItem>
                  <SelectItem value="+81">🇯🇵 +81</SelectItem>
                  <SelectItem value="+91">🇮🇳 +91</SelectItem>
                  <SelectItem value="+55">🇧🇷 +55</SelectItem>
                  <SelectItem value="+52">🇲🇽 +52</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Saisie du numéro */}
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9\s]/g, ''); // Garder que chiffres et espaces
                  setPhoneNumber(value);
                  handleInputChange('phone', phonePrefix + ' ' + value);
                }}
                placeholder={(() => {
                  const patterns = {
                    '+33': '6 12 34 56 78',
                    '+1': '555 123 4567',
                    '+44': '7123 456789',
                    '+49': '30 12345678',
                    '+39': '320 1234567',
                    '+34': '612 345 678',
                    '+212': '6 12 34 56 78',
                    '+86': '138 0013 8000'
                  };
                  return patterns[phonePrefix] || '123456789';
                })()}
                className={`flex-1 ${errors.phone ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
            <p className="text-xs text-gray-500">
              Numéro complet : {profileForm.phone || phonePrefix + ' ...'}
            </p>
          </div>
          
          {/* Email - Lecture seule avec possibilité de modification */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Email <span className="text-red-500">*</span></span>
            </Label>
            
            {!emailEditMode ? (
              // Mode lecture seule
              <div className="flex items-center space-x-2">
                <div className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-sm text-gray-800">{profileForm.email || 'Non renseigné'}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEmailEditStart}
                  className="flex items-center space-x-1"
                >
                  <Edit className="h-3 w-3" />
                  <span className="hidden sm:inline">Modifier</span>
                </Button>
              </div>
            ) : (
              // Mode édition
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    type="email"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    className={errors.email ? 'border-red-500 flex-1' : 'flex-1'}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEmailEditConfirm}
                    disabled={!tempEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempEmail)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEmailEditCancel}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <div className="space-y-1">
                    <p className="text-xs text-orange-800 font-medium">
                      ⚠️ ATTENTION : Modification de l'identifiant de connexion
                    </p>
                    <p className="text-xs text-orange-700">
                      En confirmant, vous devrez utiliser ce nouvel email pour vous connecter à ÉMÉRÉS
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
            
            {/* Note explicative selon le type de compte */}
            {!emailEditMode && (
              <div className="space-y-1">
                {profileForm.created_by_institution ? (
                  <p className="text-xs text-gray-500">
                    📧 Email de connexion créé par votre établissement
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    📧 Email de connexion défini lors de votre inscription
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Photo de profil avec affichage */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Photo de profil</Label>
          <p className="text-sm text-gray-600">
            Ajoutez une photo de profil professionnelle (facultatif)
          </p>
          
          <div className="flex items-start space-x-6">
            {/* Affichage de la photo actuelle */}
            <div className="flex-shrink-0">
              {profileForm.profile_photo && profileForm.profile_photo.uploaded ? (
                <div className="relative group">
                  <img
                    src={profileForm.profile_photo.url}
                    alt="Photo de profil"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange('profile_photo', null)}
                      className="text-white hover:text-red-500 bg-white/20 hover:bg-white/30 border-white/30"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Zone d'upload */}
            <div className="flex-1">
              <UniversalFileUpload
                label=""
                description="JPG ou PNG, max 2MB"
                acceptedTypes={['image/jpeg', 'image/png']}
                maxSize={2 * 1024 * 1024} // 2MB
                value={profileForm.profile_photo}
                onChange={(file) => handleInputChange('profile_photo', file)}
                required={false}
              />
            </div>
          </div>
        </div>

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
      
      {/* Modal de confirmation changement d'email */}
      <EmailChangeConfirmation
        isOpen={showEmailConfirmation}
        oldEmail={profileForm.email}
        newEmail={tempEmail}
        onConfirm={handleEmailChangeConfirm}
        onCancel={handleEmailChangeCancel}
      />
    </Card>
  );
};

export default PersonalInfoSection;