import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';
import {
  FileText,
  Brain,
  Wand2,
  Copy,
  Download,
  Edit,
  Sparkles,
  Target,
  User,
  Building,
  CheckCircle,
  RefreshCw,
  Eye,
  Save
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CoverLetterGenerator = ({ profile, user }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [editedLetter, setEditedLetter] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [savedLetters, setSavedLetters] = useState([]);
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    contactPerson: '',
    jobDescription: '',
    tone: 'professional',
    length: 'medium',
    emphasize: []
  });

  const tones = [
    { value: 'professional', label: 'Professionnel', description: 'Ton formel et respectueux' },
    { value: 'enthusiastic', label: 'Enthousiaste', description: 'Dynamique et motivé' },
    { value: 'confident', label: 'Confiant', description: 'Assertif et déterminé' },
    { value: 'creative', label: 'Créatif', description: 'Original et innovant' }
  ];

  const lengths = [
    { value: 'short', label: 'Courte', description: '200-300 mots' },
    { value: 'medium', label: 'Moyenne', description: '300-500 mots' },
    { value: 'long', label: 'Détaillée', description: '500-700 mots' }
  ];

  const emphasisOptions = [
    'Compétences techniques',
    'Expérience pratique',
    'Formation académique',
    'Projets personnels',
    'Soft skills',
    'Motivation pour l\'entreprise',
    'Objectifs de carrière',
    'Adaptation culturelle'
  ];

  const generateCoverLetter = async () => {
    if (!formData.companyName || !formData.jobTitle) {
      toast.error('Veuillez remplir au moins le nom de l\'entreprise et le poste');
      return;
    }

    setIsGenerating(true);
    try {
      // Prepare data for AI generation
      const generationData = {
        studentProfile: {
          firstName: profile?.first_name || user?.first_name || '',
          lastName: profile?.last_name || user?.last_name || '',
          email: user?.email || '',
          education: profile?.education_level || '',
          field: profile?.field_of_study || '',
          school: profile?.school_name || '',
          skills: profile?.skills || [],
          experience: profile?.experience_level || '',
          bio: profile?.bio || ''
        },
        jobInfo: formData,
        preferences: {
          tone: formData.tone,
          length: formData.length,
          emphasize: formData.emphasize
        }
      };

      // Call backend API for cover letter generation
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API}/ai/generate-cover-letter`, generationData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const letter = response.data.coverLetter || generateFallbackLetter(generationData);
      setGeneratedLetter(letter);
      setEditedLetter(letter);
      toast.success('Lettre de motivation générée avec succès !');

    } catch (error) {
      console.error('Error generating cover letter:', error);
      // Fallback to client-side generation
      const fallbackLetter = generateFallbackLetter({
        studentProfile: {
          firstName: profile?.first_name || user?.first_name || '',
          lastName: profile?.last_name || user?.last_name || '',
          email: user?.email || '',
          education: profile?.education_level || '',
          field: profile?.field_of_study || '',
          school: profile?.school_name || '',
          skills: profile?.skills || [],
          experience: profile?.experience_level || '',
          bio: profile?.bio || ''
        },
        jobInfo: formData,
        preferences: {
          tone: formData.tone,
          length: formData.length,
          emphasize: formData.emphasize
        }
      });

      setGeneratedLetter(fallbackLetter);
      setEditedLetter(fallbackLetter);
      toast.success('Lettre de motivation générée (mode local) !');

    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackLetter = (data) => {
    const { studentProfile, jobInfo } = data;

    const greeting = jobInfo.contactPerson
      ? `Madame, Monsieur ${jobInfo.contactPerson},`
      : 'Madame, Monsieur,';

    const intro = `Je me permets de vous adresser ma candidature pour le poste de ${jobInfo.jobTitle} au sein de ${jobInfo.companyName}.`;

    const education = studentProfile.education && studentProfile.field
      ? `Actuellement en ${studentProfile.education} en ${studentProfile.field} à ${studentProfile.school || 'mon établissement'}, `
      : '';

    const skills = studentProfile.skills.length > 0
      ? `j'ai développé des compétences en ${studentProfile.skills.slice(0, 3).join(', ')}.`
      : 'je développe continuellement mes compétences professionnelles.';

    const motivation = jobInfo.companyName
      ? `Votre entreprise ${jobInfo.companyName} attire particulièrement mon attention par son positionnement et ses valeurs.`
      : 'Cette opportunité correspond parfaitement à mes objectifs professionnels.';

    const closing = `Je serais ravi(e) de pouvoir échanger avec vous sur ma candidature et ma motivation à rejoindre vos équipes.`;

    return `${greeting}

${intro}

${education}${skills} ${motivation}

${studentProfile.bio ? `${studentProfile.bio}` : 'Mon parcours et ma motivation me permettront de contribuer efficacement à vos projets.'}

${closing}

Dans l'attente de votre retour, je vous prie d'agréer, ${greeting.includes('Monsieur') ? 'Monsieur' : 'Madame'}, l'expression de mes salutations distinguées.

${studentProfile.firstName} ${studentProfile.lastName}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editedLetter);
    toast.success('Lettre copiée dans le presse-papiers !');
  };

  const downloadLetter = () => {
    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined') return;

    const blob = new Blob([editedLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `Lettre_Motivation_${formData.companyName}_${formData.jobTitle}.txt`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Lettre téléchargée !');
  };

  const saveLetter = () => {
    const newLetter = {
      id: Date.now().toString(),
      companyName: formData.companyName,
      jobTitle: formData.jobTitle,
      letter: editedLetter,
      createdAt: new Date().toISOString()
    };

    const updated = [...savedLetters, newLetter];
    setSavedLetters(updated);
    localStorage.setItem('emeres_cover_letters', JSON.stringify(updated));
    toast.success('Lettre sauvegardée !');
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('emeres_cover_letters');
    if (saved) {
      setSavedLetters(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Wand2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <span>Générateur de Lettres de Motivation IA</span>
              <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                Alimenté par IA
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>
            Créez des lettres de motivation personnalisées et professionnelles en quelques clics
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Form Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Informations sur l'offre
              </h3>

              <div className="space-y-2">
                <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="ex: TechCorp Solutions"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Intitulé du poste *</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  placeholder="ex: Stage Développeur Web"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Personne de contact</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="ex: M. Martin (optionnel)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobDescription">Description du poste</Label>
                <Textarea
                  id="jobDescription"
                  value={formData.jobDescription}
                  onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                  placeholder="Copiez la description de l'offre ici pour une personnalisation optimale..."
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Personnalisation
              </h3>

              <div className="space-y-2">
                <Label htmlFor="tone">Ton de la lettre</Label>
                <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map(tone => (
                      <SelectItem key={tone.value} value={tone.value}>
                        <div>
                          <div className="font-medium">{tone.label}</div>
                          <div className="text-xs text-gray-500">{tone.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="length">Longueur</Label>
                <Select value={formData.length} onValueChange={(value) => setFormData({ ...formData, length: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lengths.map(length => (
                      <SelectItem key={length.value} value={length.value}>
                        <div>
                          <div className="font-medium">{length.label}</div>
                          <div className="text-xs text-gray-500">{length.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Points à mettre en avant</Label>
                <div className="grid grid-cols-2 gap-2">
                  {emphasisOptions.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={option}
                        checked={formData.emphasize.includes(option)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, emphasize: [...formData.emphasize, option] });
                          } else {
                            setFormData({ ...formData, emphasize: formData.emphasize.filter(item => item !== option) });
                          }
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={option} className="text-xs">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={generateCoverLetter}
              disabled={isGenerating || !formData.companyName || !formData.jobTitle}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-3"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Génération IA en cours...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>Générer ma lettre de motivation</span>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Letter Display */}
      {generatedLetter && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Lettre de motivation générée</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                  <Eye className="h-4 w-4 mr-1" />
                  {showPreview ? 'Éditer' : 'Prévisualiser'}
                </Button>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copier
                </Button>
                <Button variant="outline" size="sm" onClick={downloadLetter}>
                  <Download className="h-4 w-4 mr-1" />
                  Télécharger
                </Button>
                <Button variant="outline" size="sm" onClick={saveLetter}>
                  <Save className="h-4 w-4 mr-1" />
                  Sauvegarder
                </Button>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {showPreview ? (
              <div className="bg-white p-6 border rounded-lg font-serif leading-relaxed whitespace-pre-line">
                {editedLetter}
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea
                  value={editedLetter}
                  onChange={(e) => setEditedLetter(e.target.value)}
                  rows={20}
                  className="font-serif leading-relaxed"
                  placeholder="Votre lettre de motivation apparaîtra ici..."
                />
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{editedLetter.split(' ').length} mots • {editedLetter.length} caractères</span>
                  <Badge variant="outline">
                    <Edit className="h-3 w-3 mr-1" />
                    Éditable
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Saved Letters */}
      {savedLetters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Lettres sauvegardées ({savedLetters.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedLetters.map((letter) => (
                <div key={letter.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{letter.jobTitle}</h4>
                      <p className="text-sm text-gray-600">{letter.companyName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(letter.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditedLetter(letter.letter);
                        setGeneratedLetter(letter.letter);
                        setFormData({
                          ...formData,
                          companyName: letter.companyName,
                          jobTitle: letter.jobTitle
                        });
                      }}
                    >
                      Charger
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">
            💡 Conseils pour une lettre efficace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Personnalisez toujours avec le nom de l'entreprise et du poste</li>
            <li>• Mentionnez des éléments spécifiques de l'offre d'emploi</li>
            <li>• Reliez vos compétences aux besoins de l'entreprise</li>
            <li>• Gardez un ton professionnel mais montrez votre personnalité</li>
            <li>• Relisez attentivement avant d'envoyer</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoverLetterGenerator;
