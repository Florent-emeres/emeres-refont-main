import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  ArrowLeft, 
  ExternalLink, 
  Shield, 
  Users, 
  Award, 
  Calendar,
  Share2,
  Edit,
  Trash2,
  CheckCircle,
  GraduationCap
} from 'lucide-react';
import { ValidationBadges, ValidationLevels } from './ValidationBadges';
import ProjectTracker from './ProjectTracker';
import { toast } from 'sonner';

const ProjectDetailView = ({ 
  project, 
  onBack, 
  onUpdate, 
  onDelete, 
  onRequestValidation 
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleRequestValidation = (type) => {
    onRequestValidation(project.id, type);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/portfolio/${project.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Lien du projet copié dans le presse-papiers');
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <ValidationBadges validationStatus={project.validation_status} />
              <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                {project.status === 'completed' ? 'Terminé' : 'En cours'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Annuler
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    onDelete(project.id);
                    setShowDeleteDialog(false);
                  }}
                >
                  Supprimer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Contenu principal */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="proofs">Preuves</TabsTrigger>
          <TabsTrigger value="tracking">Suivi</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description du projet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
                </CardContent>
              </Card>

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Technologies utilisées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline">{tech}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Liens externes */}
              {project.links && project.links.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Liens du projet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {project.links.map((link) => (
                        <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <ExternalLink className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">{link.label || 'Lien externe'}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(link.url, '_blank')}
                          >
                            Ouvrir
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Informations du projet */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">Créé le</div>
                      <div className="text-sm text-gray-600">
                        {formatDate(project.created_at)}
                      </div>
                    </div>
                  </div>
                  
                  {project.updated_at !== project.created_at && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">Mis à jour le</div>
                        <div className="text-sm text-gray-600">
                          {formatDate(project.updated_at)}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">Preuves</div>
                      <div className="text-sm text-gray-600">
                        {project.proofs?.length || 0} fichier(s)
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions de validation */}
              <Card>
                <CardHeader>
                  <CardTitle>Demander une validation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Augmentez la crédibilité de votre projet
                  </p>
                  
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleRequestValidation('mentor')}
                      disabled={project.validation_status === ValidationLevels.MENTOR_VALIDATED}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Validation par mentor
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleRequestValidation('school')}
                      disabled={project.validation_status === ValidationLevels.SCHOOL_VALIDATED}
                    >
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Validation par école
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Preuves */}
        <TabsContent value="proofs" className="space-y-6">
          {project.proofs && project.proofs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.proofs.map((proof) => (
                <Card key={proof.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm truncate">{proof.name}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(proof.url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    {proof.type.startsWith('image/') && (
                      <img 
                        src={proof.url} 
                        alt={proof.name}
                        className="w-full h-32 object-cover rounded"
                      />
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Ajouté le {formatDate(proof.uploadedAt)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Aucune preuve ajoutée
                </h3>
                <p className="text-gray-600">
                  Ajoutez des fichiers pour crédibiliser votre projet
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Suivi */}
        <TabsContent value="tracking">
          <ProjectTracker 
            project={project}
            onProjectUpdate={onUpdate}
          />
        </TabsContent>

        {/* Validation */}
        <TabsContent value="validation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statut de validation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <ValidationBadges validationStatus={project.validation_status} />
                <div>
                  <div className="text-sm font-medium">
                    {project.validation_status === ValidationLevels.SELF_DECLARED && 'Projet auto-déclaré'}
                    {project.validation_status === ValidationLevels.MENTOR_VALIDATED && 'Validé par un mentor'}
                    {project.validation_status === ValidationLevels.SCHOOL_VALIDATED && 'Validé par votre école'}
                    {project.validation_status === ValidationLevels.PENDING && 'Validation en cours'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {project.validation_status === ValidationLevels.SELF_DECLARED && 'Demandez une validation pour plus de crédibilité'}
                    {project.validation_status === ValidationLevels.MENTOR_VALIDATED && 'Ce projet a été vérifié par un professionnel'}
                    {project.validation_status === ValidationLevels.SCHOOL_VALIDATED && 'Ce projet fait partie de votre parcours académique certifié'}
                    {project.validation_status === ValidationLevels.PENDING && 'Votre demande de validation est en cours de traitement'}
                  </div>
                </div>
              </div>

              {project.validation_status === ValidationLevels.SELF_DECLARED && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Améliorer la crédibilité</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Les projets validés par un tiers ont plus d'impact auprès des recruteurs.
                  </p>
                  <div className="space-y-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleRequestValidation('mentor')}
                    >
                      Demander validation mentor
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRequestValidation('school')}
                    >
                      Demander validation école
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetailView;