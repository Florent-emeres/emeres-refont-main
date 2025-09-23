import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Edit,
  Eye,
  Trash2,
  Copy,
  Calendar,
  MapPin,
  Euro,
  Users,
  Clock,
  FileText,
  Save,
  X,
  Plus,
  Briefcase,
  Target,
  Star,
  Sparkles
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import OptimizedOfferCreation from './OptimizedOfferCreation';

// Listes prédéfinies pour les offres
const PREDEFINED_MISSIONS = [
  "Développer des applications web/mobile",
  "Analyser les besoins clients",
  "Participer aux réunions d'équipe",
  "Rédiger de la documentation technique",
  "Effectuer des tests et débuggage",
  "Maintenir et optimiser le code existant",
  "Collaborer avec l'équipe de design",
  "Gérer les bases de données",
  "Assurer la veille technologique",
  "Former les utilisateurs finaux",
  "Gérer les projets clients",
  "Réaliser des audits qualité",
  "Créer des présentations",
  "Animer des ateliers",
  "Superviser des stagiaires"
];

const PREDEFINED_REQUIREMENTS = [
  "Bac+2/3 en informatique",
  "Bac+4/5 en ingénierie",
  "Première expérience en entreprise",
  "Stage précédent dans le domaine",
  "Maîtrise de l'anglais technique",
  "Capacité de travail en équipe",
  "Autonomie et prise d'initiative",
  "Rigueur et organisation",
  "Créativité et innovation",
  "Capacité d'adaptation",
  "Sens du service client",
  "Esprit analytique",
  "Leadership et management",
  "Gestion du stress",
  "Mobilité géographique"
];

const PREDEFINED_SKILLS = [
  "JavaScript", "Python", "Java", "React", "Vue.js", "Angular",
  "Node.js", "PHP", "C#", "SQL", "MongoDB", "PostgreSQL",
  "HTML/CSS", "Git", "Docker", "AWS", "Azure", "Linux",
  "Photoshop", "Figma", "Adobe Creative Suite", "AutoCAD",
  "Excel avancé", "PowerBI", "Tableau", "Google Analytics",
  "SEO/SEA", "Réseaux sociaux", "Content Marketing",
  "Gestion de projet", "Scrum/Agile", "ITIL", "SAP"
];

const DURATION_OPTIONS = [
  "2 mois",
  "3 mois", 
  "4 mois",
  "5 mois",
  "6 mois",
  "12 mois",
  "24 mois",
  "CDI",
  "CDD 6 mois",
  "CDD 12 mois",
  "Freelance",
  "À définir"
];

const PREDEFINED_BENEFITS = [
  "Tickets restaurant",
  "Mutuelle d'entreprise",
  "Participation aux bénéfices",
  "13ème mois",
  "Primes sur objectifs",
  "Télétravail partiel",
  "Télétravail complet",
  "Horaires flexibles",
  "Formation continue",
  "Congés supplémentaires",
  "Comité d'entreprise",
  "Parking gratuit",
  "Remboursement transport",
  "Véhicule de fonction",
  "Ordinateur portable",
  "Téléphone professionnel"
];

const OfferManagement = ({ user, companyProfile }) => {
  const { toast } = useToast();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // États pour la nouvelle interface optimisée
  const [showOptimizedDialog, setShowOptimizedDialog] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  // Anciens états pour compatibilité (si besoin de l'ancienne interface)
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // État du formulaire d'offre
  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    missions: [],
    requirements: [],
    skills_required: [],
    soft_skills: [],
    offer_type: 'stage',
    duration: '',
    start_date: '',
    salary_min: '',
    salary_max: '',
    benefits: [],
    location: '',
    is_remote: false,
    remote_percentage: 0,
    target_level: 'bac+3',
    visibility: 'public',
    application_deadline: ''
  });

  // États pour les listes dynamiques (conservé pour les soft skills)
  // const [newMission, setNewMission] = useState('');
  // const [newRequirement, setNewRequirement] = useState('');
  // const [newSkill, setNewSkill] = useState('');  
  const [newSoftSkill, setNewSoftSkill] = useState('');
  // const [newBenefit, setNewBenefit] = useState('');

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/offers/my`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    } catch (error) {
      console.error('Erreur chargement offres:', error);
      toast.error('Erreur lors du chargement des offres');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setOfferForm({
      title: '',
      description: '',
      missions: [],
      requirements: [],
      skills_required: [],
      soft_skills: [],
      offer_type: 'stage',
      duration: '',
      start_date: '',
      salary_min: '',
      salary_max: '',
      benefits: [],
      location: '',
      is_remote: false,
      remote_percentage: 0,
      target_level: 'bac+3',
      visibility: 'public',
      application_deadline: ''
    });
    setEditingOffer(null);
  };

  // Ouvrir la création d'offre optimisée
  const handleNewOffer = () => {
    setEditingOffer(null);
    setShowOptimizedDialog(true);
  };

  // Ouvrir l'édition d'offre optimisée
  const handleEditOfferOptimized = (offer) => {
    setEditingOffer(offer);
    setShowOptimizedDialog(true);
  };

  // Callback après succès de création/modification
  const handleOfferSuccess = () => {
    loadOffers(); // Recharger la liste des offres
    setShowOptimizedDialog(false);
    setEditingOffer(null);
  };

  const handleInputChange = (field, value) => {
    setOfferForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayAdd = (field, value, setter) => {
    if (value.trim()) {
      handleInputChange(field, [...offerForm[field], value.trim()]);
      setter('');
    }
  };

  const handleArrayRemove = (field, index) => {
    const newArray = [...offerForm[field]];
    newArray.splice(index, 1);
    handleInputChange(field, newArray);
  };

  const handleSubmitOffer = async () => {
    try {
      const token = localStorage.getItem('token');
      const method = editingOffer ? 'PUT' : 'POST';
      const url = editingOffer 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/offers/${editingOffer.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/offers`;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(offerForm)
      });

      if (response.ok) {
        toast.success(editingOffer ? 'Offre mise à jour !' : 'Offre créée avec succès !');
        setShowCreateDialog(false);
        resetForm();
        loadOffers();
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur sauvegarde offre:', error);
      toast.error('Erreur lors de la sauvegarde de l\'offre');
    }
  };

  const handleEditOffer = (offer) => {
    setOfferForm({
      title: offer.title || '',
      description: offer.description || '',
      missions: offer.missions || [],
      requirements: offer.requirements || [],
      skills_required: offer.skills_required || [],
      soft_skills: offer.soft_skills || [],
      offer_type: offer.offer_type || 'stage',
      duration: offer.duration || '',
      start_date: offer.start_date || '',
      salary_min: offer.salary_min || '',
      salary_max: offer.salary_max || '',
      benefits: offer.benefits || [],
      location: offer.location || '',
      is_remote: offer.is_remote || false,
      remote_percentage: offer.remote_percentage || 0,
      target_level: offer.target_level || 'bac+3',
      visibility: offer.visibility || 'public',
      application_deadline: offer.application_deadline || ''
    });
    setEditingOffer(offer);
    setShowCreateDialog(true);
  };

  const handleDeleteOffer = async (offerId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/offers/${offerId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          toast.success('Offre supprimée avec succès');
          loadOffers();
        }
      } catch (error) {
        console.error('Erreur suppression offre:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'draft': { color: 'bg-gray-100 text-gray-800', text: 'Brouillon' },
      'active': { color: 'bg-green-100 text-green-800', text: 'Active' },
      'closed': { color: 'bg-red-100 text-red-800', text: 'Fermée' },
      'archived': { color: 'bg-blue-100 text-blue-800', text: 'Archivée' }
    };
    const badge = badges[status] || badges['draft'];
    return <Badge className={badge.color}>{badge.text}</Badge>;
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || offer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions principales */}
      <div className="flex justify-end mb-6">
        {/* Nouveau bouton optimisé */}
        <Button 
          onClick={handleNewOffer}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Créer une offre
        </Button>
      </div>

      {/* Interface de création optimisée */}
      <OptimizedOfferCreation 
        isOpen={showOptimizedDialog}
        onClose={() => setShowOptimizedDialog(false)}
        editingOffer={editingOffer}
        onSuccess={handleOfferSuccess}
      />

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une offre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">Tous les statuts</option>
                <option value="draft">Brouillons</option>
                <option value="active">Actives</option>
                <option value="closed">Fermées</option>
                <option value="archived">Archivées</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des offres */}
      <div className="grid gap-4">
        {filteredOffers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {offers.length === 0 ? 'Aucune offre créée' : 'Aucune offre trouvée'}
              </h3>
              <p className="text-gray-500 mb-4">
                {offers.length === 0 
                  ? 'Créez votre première offre pour commencer à recruter'
                  : 'Essayez de modifier vos filtres de recherche'
                }
              </p>
              {offers.length === 0 && (
                <Button onClick={() => setShowCreateDialog(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Créer ma première offre
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredOffers.map((offer) => (
            <Card key={offer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
                      {getStatusBadge(offer.status)}
                    </div>
                    <p className="text-gray-600 mb-2 line-clamp-2">{offer.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {offer.offer_type || 'Stage'}
                      </div>
                      {offer.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {offer.location}
                        </div>
                      )}
                      {offer.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {offer.duration}
                        </div>
                      )}
                      {(offer.salary_min || offer.salary_max) && (
                        <div className="flex items-center gap-1">
                          <Euro className="h-4 w-4" />
                          {offer.salary_min && offer.salary_max 
                            ? `${offer.salary_min}-${offer.salary_max}€`
                            : `${offer.salary_min || offer.salary_max}€`
                          }
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditOfferOptimized(offer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteOffer(offer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Compétences requises */}
                {offer.skills_required && offer.skills_required.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {offer.skills_required.slice(0, 5).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {offer.skills_required.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{offer.skills_required.length - 5} autres
                      </Badge>
                    )}
                  </div>
                )}

                {/* Statistiques */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>👁 {offer.views_count || 0} vues</span>
                    <span>📄 {offer.applications_count || 0} candidatures</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Créée le {new Date(offer.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default OfferManagement;