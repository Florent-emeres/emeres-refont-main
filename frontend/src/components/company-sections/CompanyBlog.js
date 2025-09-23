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
  FileText, 
  Plus, 
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Camera,
  Video,
  Star,
  MessageCircle,
  Share2,
  Save,
  X
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CompanyBlog = ({ user, companyProfile }) => {
  const { toast } = useToast();
  const [articles, setArticles] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState('articles');
  
  const [articleForm, setArticleForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'actualite',
    tags: [],
    featured_image: null,
    status: 'draft'
  });

  const [testimonialForm, setTestimonialForm] = useState({
    author_name: '',
    author_role: '',
    author_photo: null,
    content: '',
    rating: 5,
    period: '',
    status: 'published'
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Charger articles
      const articlesResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/blog`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Charger témoignages
      const testimonialsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/testimonials`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json();
        setArticles(articlesData);
      }
      
      if (testimonialsResponse.ok) {
        const testimonialsData = await testimonialsResponse.json();
        setTestimonials(testimonialsData);
      }
      
      // Données simulées pour la démo
      setArticles([
        {
          id: '1',
          title: 'Notre équipe s\'agrandit !',
          excerpt: 'Nous sommes fiers d\'accueillir 5 nouveaux talents dans nos équipes de développement.',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
          category: 'actualite',
          status: 'published',
          created_at: '2024-01-15',
          author: user.first_name + ' ' + user.last_name,
          views: 234,
          tags: ['Recrutement', 'Équipe']
        },
        {
          id: '2',
          title: 'Innovation dans nos processus RH',
          excerpt: 'Découvrez comment nous révolutionnons notre approche du recrutement.',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
          category: 'innovation',
          status: 'published',
          created_at: '2024-01-10',
          author: user.first_name + ' ' + user.last_name,
          views: 156,
          tags: ['Innovation', 'RH']
        }
      ]);
      
      setTestimonials([
        {
          id: '1',
          author_name: 'Marie Dubois',
          author_role: 'Ex-stagiaire développeuse',
          content: 'Une expérience incroyable ! L\'équipe m\'a accompagnée tout au long de mon stage et j\'ai énormément appris.',
          rating: 5,
          period: 'Stage 6 mois - 2023',
          status: 'published',
          created_at: '2024-01-12'
        },
        {
          id: '2',
          author_name: 'Thomas Martin',
          author_role: 'Alternant Data Analyst',
          content: 'Environnement de travail exceptionnel, projets stimulants et une vraie montée en compétences.',
          rating: 5,
          period: 'Alternance 2 ans - 2022-2024',  
          status: 'published',
          created_at: '2024-01-08'
        }
      ]);
      
    } catch (error) {
      console.error('Erreur chargement contenu:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetArticleForm = () => {
    setArticleForm({
      title: '',
      content: '',
      excerpt: '',
      category: 'actualite',
      tags: [],
      featured_image: null,
      status: 'draft'
    });
    setEditingItem(null);
  };

  const resetTestimonialForm = () => {
    setTestimonialForm({
      author_name: '',
      author_role: '',
      author_photo: null,
      content: '',
      rating: 5,
      period: '',
      status: 'published'
    });
    setEditingItem(null);
  };

  const handleArticleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/company/blog/${editingItem.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/company/blog`;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...articleForm,
          author: user.first_name + ' ' + user.last_name,
          company_id: companyProfile.id
        })
      });

      if (response.ok) {
        toast.success(editingItem ? 'Article mis à jour !' : 'Article créé avec succès !');
        setShowArticleModal(false);
        resetArticleForm();
        loadContent();
      }
    } catch (error) {
      console.error('Erreur sauvegarde article:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleTestimonialSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/company/testimonials/${editingItem.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/company/testimonials`;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...testimonialForm,
          company_id: companyProfile.id
        })
      });

      if (response.ok) {
        toast.success(editingItem ? 'Témoignage mis à jour !' : 'Témoignage ajouté avec succès !');
        setShowTestimonialModal(false);
        resetTestimonialForm();
        loadContent();
      }
    } catch (error) {
      console.error('Erreur sauvegarde témoignage:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'draft': { color: 'bg-gray-100 text-gray-800', text: 'Brouillon' },
      'published': { color: 'bg-green-100 text-green-800', text: 'Publié' },
      'archived': { color: 'bg-red-100 text-red-800', text: 'Archivé' }
    };
    const badge = badges[status] || badges['draft'];
    return <Badge className={badge.color}>{badge.text}</Badge>;
  };

  const getCategoryBadge = (category) => {
    const categories = {
      'actualite': { color: 'bg-blue-100 text-blue-800', text: 'Actualité' },
      'innovation': { color: 'bg-purple-100 text-purple-800', text: 'Innovation' },
      'culture': { color: 'bg-green-100 text-green-800', text: 'Culture' },
      'recrutement': { color: 'bg-orange-100 text-orange-800', text: 'Recrutement' }
    };
    const cat = categories[category] || categories['actualite'];
    return <Badge className={cat.color}>{cat.text}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Image Employeur</h2>
          <p className="text-gray-600">Gérez votre contenu et témoignages</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="articles">Articles & Actualités</TabsTrigger>
          <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
          <TabsTrigger value="videos">Vidéos Métiers</TabsTrigger>
        </TabsList>

        {/* Onglet Articles */}
        <TabsContent value="articles" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={showArticleModal} onOpenChange={setShowArticleModal}>
              <DialogTrigger asChild>
                <Button onClick={resetArticleForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel article
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {articles.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article publié</h3>
                  <p className="text-gray-500 mb-4">Partagez vos actualités et renforcez votre image employeur</p>
                  <Button onClick={() => { resetArticleForm(); setShowArticleModal(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer le premier article
                  </Button>
                </CardContent>
              </Card>
            ) : (
              articles.map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                          {getStatusBadge(article.status)}
                          {getCategoryBadge(article.category)}
                        </div>
                        <p className="text-gray-600 mb-3">{article.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {article.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(article.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {article.views} vues
                          </div>
                        </div>
                        
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {article.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Onglet Témoignages */}
        <TabsContent value="testimonials" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={showTestimonialModal} onOpenChange={setShowTestimonialModal}>
              <DialogTrigger asChild>
                <Button onClick={resetTestimonialForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau témoignage
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {testimonials.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun témoignage</h3>
                  <p className="text-gray-500 mb-4">Collectez les retours de vos anciens stagiaires et collaborateurs</p>
                  <Button onClick={() => { resetTestimonialForm(); setShowTestimonialModal(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter le premier témoignage
                  </Button>
                </CardContent>
              </Card>
            ) : (
              testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{testimonial.author_name}</h3>
                            <div className="flex items-center">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-blue-400 fill-current" />
                              ))}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{testimonial.author_role}</p>
                          <p className="text-gray-800 mb-3 italic">"{testimonial.content}"</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{testimonial.period}</span>
                            <span>•</span>
                            <span>{new Date(testimonial.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Onglet Vidéos */}
        <TabsContent value="videos" className="space-y-6">
          <Card>
            <CardContent className="p-8 text-center">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Vidéos métiers</h3>
              <p className="text-gray-500 mb-4">Fonctionnalité en cours de développement</p>
              <p className="text-sm text-gray-400">Bientôt disponible : upload et gestion de vos vidéos de présentation métiers</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Article */}
      <Dialog open={showArticleModal} onOpenChange={setShowArticleModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Modifier l\'article' : 'Créer un nouvel article'}
            </DialogTitle>
            <DialogDescription>
              Partagez vos actualités et renforcez votre image employeur
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={articleForm.title}
                  onChange={(e) => setArticleForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre de votre article"
                />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <select
                  id="category"
                  value={articleForm.category}
                  onChange={(e) => setArticleForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="actualite">Actualité</option>
                  <option value="innovation">Innovation</option>
                  <option value="culture">Culture d'entreprise</option>
                  <option value="recrutement">Recrutement</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Résumé</Label>
              <Textarea
                id="excerpt"
                value={articleForm.excerpt}
                onChange={(e) => setArticleForm(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Résumé de votre article (affiché dans la liste)"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="content">Contenu *</Label>
              <Textarea
                id="content"
                value={articleForm.content}
                onChange={(e) => setArticleForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Contenu complet de votre article"
                rows={8}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Statut</Label>
                <select
                  id="status"
                  value={articleForm.status}
                  onChange={(e) => setArticleForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                  <option value="archived">Archivé</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowArticleModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleArticleSubmit}>
                <Save className="h-4 w-4 mr-2" />
                {editingItem ? 'Mettre à jour' : 'Créer l\'article'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Témoignage */}
      <Dialog open={showTestimonialModal} onOpenChange={setShowTestimonialModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Modifier le témoignage' : 'Ajouter un témoignage'}
            </DialogTitle>
            <DialogDescription>
              Mettez en valeur les retours positifs de vos anciens collaborateurs
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author_name">Nom *</Label>
                <Input
                  id="author_name"
                  value={testimonialForm.author_name}
                  onChange={(e) => setTestimonialForm(prev => ({ ...prev, author_name: e.target.value }))}
                  placeholder="Marie Dupont"
                />
              </div>
              <div>
                <Label htmlFor="author_role">Rôle *</Label>
                <Input
                  id="author_role"
                  value={testimonialForm.author_role}
                  onChange={(e) => setTestimonialForm(prev => ({ ...prev, author_role: e.target.value }))}
                  placeholder="Ex-stagiaire développeuse"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="content">Témoignage *</Label>
              <Textarea
                id="content"
                value={testimonialForm.content}
                onChange={(e) => setTestimonialForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Le témoignage complet..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rating">Note</Label>
                <select
                  id="rating"
                  value={testimonialForm.rating}
                  onChange={(e) => setTestimonialForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 étoiles)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 étoiles)</option>
                  <option value={3}>⭐⭐⭐ (3 étoiles)</option>
                  <option value={2}>⭐⭐ (2 étoiles)</option>
                  <option value={1}>⭐ (1 étoile)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="period">Période</Label>
                <Input
                  id="period"
                  value={testimonialForm.period}
                  onChange={(e) => setTestimonialForm(prev => ({ ...prev, period: e.target.value }))}
                  placeholder="Stage 6 mois - 2023"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowTestimonialModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleTestimonialSubmit}>
                <Save className="h-4 w-4 mr-2" />
                {editingItem ? 'Mettre à jour' : 'Ajouter le témoignage'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyBlog;