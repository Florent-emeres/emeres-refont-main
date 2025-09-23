import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { 
  Download, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Link as LinkIcon,
  Palette,
  Eye
} from 'lucide-react';

const CVGenerator = ({ profile, user }) => {
  const [generating, setGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  const templates = [
    {
      id: 'modern',
      name: 'Moderne',
      description: 'Design épuré et contemporain',
      color: 'from-blue-500 to-purple-600',
      preview: '🎨'
    },
    {
      id: 'professional',
      name: 'Professionnel',
      description: 'Style classique et sobre',
      color: 'from-gray-700 to-gray-900',
      preview: '💼'
    },
    {
      id: 'creative',
      name: 'Créatif',
      description: 'Coloré et original',
      color: 'from-pink-500 to-orange-500',
      preview: '🎭'
    },
    {
      id: 'tech',
      name: 'Tech',
      description: 'Minimaliste et technique',
      color: 'from-green-500 to-blue-500',
      preview: '⚡'
    }
  ];

  const [showPreview, setShowPreview] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);
    try {
      // Vérifier que nous sommes côté client
      if (typeof window === 'undefined') {
        toast.error('Fonction disponible uniquement côté client');
        return;
      }

      // Créer le contenu HTML du CV
      const cvData = {
        personalInfo: {
          firstName: profile?.first_name || user?.first_name || '',
          lastName: profile?.last_name || user?.last_name || '',
          email: user?.email || '',
          phone: profile?.phone || '',
          location: profile?.current_city || profile?.city || '',
          bio: profile?.bio || profile?.personal_presentation || ''
        },
        education: {
          level: profile?.education_level || '',
          field: profile?.field_of_study || '',
          school: profile?.school_name || '',
          year: profile?.graduation_year || ''
        },
        skills: {
          hard: profile?.hard_skills || [],
          soft: profile?.soft_skills || []
        },
        languages: profile?.languages || [],
        interests: profile?.interests || [],
        experience: profile?.work_experiences || [],
        template: selectedTemplate
      };

      // Générer le HTML
      const htmlContent = generateHTMLCV(cvData);
      
      // Créer une fenêtre pour l'impression (qui génère un PDF)
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Popup bloquée ! Autorisez les popups pour générer le CV.');
        return;
      }
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Attendre que le contenu soit chargé puis lancer l'impression
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          // La fenêtre se fermera automatiquement après impression
        }, 500);
      };

      toast.success('CV généré ! Une fenêtre d\'impression va s\'ouvrir.');
      
    } catch (error) {
      console.error('Error generating CV:', error);
      toast.error('Erreur lors de la génération du CV');
    } finally {
      setGenerating(false);
    }
  };

  const openPreview = () => {
    const cvData = {
      personalInfo: {
        firstName: profile?.first_name || user?.first_name || 'Prénom',
        lastName: profile?.last_name || user?.last_name || 'Nom',
        email: user?.email || 'email@exemple.com',
        phone: profile?.phone || '06 XX XX XX XX',
        location: profile?.current_city || profile?.city || 'Ville',
        bio: profile?.bio || profile?.personal_presentation || 'Description professionnelle à compléter'
      },
      education: {
        level: profile?.education_level || 'Niveau d\'études',
        field: profile?.field_of_study || 'Domaine d\'études',
        school: profile?.school_name || 'École/Université',
        year: profile?.graduation_year || new Date().getFullYear()
      },
      skills: {
        hard: profile?.hard_skills || ['Compétence 1', 'Compétence 2'],
        soft: profile?.soft_skills || ['Communication', 'Travail en équipe']
      },
      languages: profile?.languages || [],
      interests: profile?.interests || ['Centre d\'intérêt 1', 'Centre d\'intérêt 2'],
      experience: profile?.work_experiences || [],
      template: selectedTemplate
    };

    const htmlContent = generateHTMLCV(cvData);
    setShowPreview(true);
    
    // Ouvrir dans une nouvelle fenêtre pour la preview
    const previewWindow = window.open('', '_blank', 'width=800,height=1000');
    if (!previewWindow) {
      toast.error('Popup bloquée ! Autorisez les popups pour prévisualiser le CV.');
      return;
    }
    
    previewWindow.document.write(htmlContent);
    previewWindow.document.close();
  };

  const generateHTMLCV = (data) => {
    const templateColors = {
      modern: '#4F46E5',
      professional: '#374151',
      creative: '#EC4899',
      tech: '#10B981'
    };

    const primaryColor = templateColors[data.template] || '#4F46E5';

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - ${data.personalInfo.firstName} ${data.personalInfo.lastName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333;
            background: #f8fafc;
        }
        .cv-container { 
            max-width: 800px; 
            margin: 20px auto; 
            background: white;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            border-radius: 12px;
            overflow: hidden;
        }
        .header { 
            background: linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd);
            color: white; 
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 { 
            font-size: 2.5rem; 
            margin-bottom: 10px;
            font-weight: 700;
        }
        .header p { 
            font-size: 1.1rem; 
            opacity: 0.9;
            margin-bottom: 20px;
        }
        .contact-info { 
            display: flex; 
            justify-content: center; 
            flex-wrap: wrap; 
            gap: 20px;
            font-size: 0.9rem;
        }
        .contact-item { 
            display: flex; 
            align-items: center; 
            gap: 5px;
        }
        .content { 
            padding: 40px 30px;
        }
        .section { 
            margin-bottom: 35px;
        }
        .section h2 { 
            color: ${primaryColor}; 
            font-size: 1.4rem; 
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid ${primaryColor}22;
        }
        .bio { 
            font-size: 1rem; 
            color: #555;
            line-height: 1.7;
            text-align: justify;
        }
        .education-item, .experience-item { 
            margin-bottom: 20px;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
        }
        .education-item h3, .experience-item h3 { 
            color: ${primaryColor}; 
            margin-bottom: 5px;
        }
        .skills-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
            gap: 10px;
        }
        .skill-tag { 
            background: ${primaryColor}15; 
            color: ${primaryColor}; 
            padding: 8px 12px; 
            border-radius: 20px; 
            text-align: center;
            font-size: 0.85rem;
            font-weight: 500;
        }
        .interests { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 10px;
        }
        .interest-tag { 
            background: #e5e7eb; 
            color: #374151; 
            padding: 6px 12px; 
            border-radius: 15px;
            font-size: 0.8rem;
        }
        .footer { 
            background: #f8fafc; 
            padding: 20px; 
            text-align: center; 
            color: #666;
            border-top: 1px solid #e5e7eb;
        }
        .generated-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 0.75rem;
            color: ${primaryColor};
        }
        @media print {
            body { background: white; }
            .cv-container { box-shadow: none; margin: 0; }
        }
    </style>
</head>
<body>
    <div class="cv-container">
        <div class="header">
            <h1>${data.personalInfo.firstName} ${data.personalInfo.lastName}</h1>
            <p>${data.education.level} en ${data.education.field}</p>
            <div class="contact-info">
                <div class="contact-item">📧 ${data.personalInfo.email}</div>
                ${data.personalInfo.phone ? `<div class="contact-item">📱 ${data.personalInfo.phone}</div>` : ''}
                ${data.personalInfo.location ? `<div class="contact-item">📍 ${data.personalInfo.location}</div>` : ''}
            </div>
        </div>
        
        <div class="content">
            ${data.personalInfo.bio ? `
            <div class="section">
                <h2>À propos</h2>
                <p class="bio">${data.personalInfo.bio}</p>
            </div>
            ` : ''}
            
            <div class="section">
                <h2>Formation</h2>
                <div class="education-item">
                    <h3>${data.education.level}</h3>
                    <p><strong>Domaine :</strong> ${data.education.field}</p>
                    <p><strong>Établissement :</strong> ${data.education.school}</p>
                    <p><strong>Niveau d'expérience :</strong> ${data.experience}</p>
                </div>
            </div>
            
            ${(data.skills.hard.length > 0 || data.skills.soft.length > 0) ? `
            <div class="section">
                <h2>Compétences</h2>
                ${data.skills.hard.length > 0 ? `
                <div class="subsection">
                    <h3 style="color: ${primaryColor}; font-size: 1rem; margin-bottom: 10px;">Compétences techniques</h3>
                    <div class="skills-grid">
                        ${data.skills.hard.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}
                    </div>
                </div>
                ` : ''}
                ${data.skills.soft.length > 0 ? `
                <div class="subsection" style="margin-top: 15px;">
                    <h3 style="color: ${primaryColor}; font-size: 1rem; margin-bottom: 10px;">Compétences comportementales</h3>
                    <div class="skills-grid">
                        ${data.skills.soft.map(skill => `<div class="skill-tag" style="background: ${primaryColor}10; border: 1px solid ${primaryColor}30;">${skill}</div>`).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
            ` : ''}

            ${data.languages.length > 0 ? `
            <div class="section">
                <h2>Langues</h2>
                <div class="skills-grid">
                    ${data.languages.map(lang => `<div class="skill-tag">${lang.language} - ${lang.level}</div>`).join('')}
                </div>
            </div>
            ` : ''}

            ${data.experience.length > 0 ? `
            <div class="section">
                <h2>Expériences</h2>
                ${data.experience.map(exp => `
                <div class="experience-item">
                    <h3>${exp.title}</h3>
                    <p><strong>${exp.company}</strong> - ${exp.location || ''}</p>
                    <p><em>${exp.start_date} - ${exp.end_date || 'Présent'}</em></p>
                    <p>${exp.description || ''}</p>
                </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${data.interests.length > 0 ? `
            <div class="section">
                <h2>Centres d'intérêt</h2>
                <div class="interests">
                    ${data.interests.map(interest => `<div class="interest-tag">${interest}</div>`).join('')}
                </div>
            </div>
            ` : ''}
        </div>
        
        <div class="footer">
            <div class="generated-badge">
                🤖 CV généré automatiquement par ÉMÉRÉS - Template ${data.template}
            </div>
        </div>
    </div>
</body>
</html>`;
  };

  const previewCV = () => {
    if (!profile?.first_name) {
      toast.error('Veuillez compléter votre profil avant de prévisualiser');
      return;
    }

    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined') {
      toast.error('Prévisualisation disponible uniquement côté client');
      return;
    }

    const cvData = {
      personalInfo: {
        firstName: profile?.first_name || user?.first_name || '',
        lastName: profile?.last_name || user?.last_name || '',
        email: user?.email || '',
        phone: profile?.phone || '',
        location: profile?.preferred_locations?.[0] || '',
        bio: profile?.bio || ''
      },
      education: {
        level: profile?.education_level || '',
        field: profile?.field_of_study || '',
        school: profile?.school_name || ''
      },
      skills: profile?.skills || [],
      interests: profile?.interests || [],
      experience: profile?.experience_level || '',
      template: selectedTemplate
    };

    const htmlContent = generateHTMLCV(cvData);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  };

  const completionPercentage = () => {
    const fields = [
      profile?.first_name,
      profile?.last_name,
      profile?.education_level,
      profile?.field_of_study,
      profile?.school_name,
      profile?.bio,
      profile?.skills?.length > 0,
      profile?.interests?.length > 0
    ];
    const completed = fields.filter(field => field).length;
    return Math.round((completed / fields.length) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Générateur de CV Intelligent</span>
        </CardTitle>
        <CardDescription>
          Créez votre CV professionnel automatiquement à partir de votre profil
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Completion Status */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Profil complété
            </span>
            <span className="text-sm font-bold text-blue-600">
              {completionPercentage()}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage()}%` }}
            ></div>
          </div>
          {completionPercentage() < 100 && (
            <p className="text-xs text-gray-600 mt-2">
              Complétez votre profil pour un CV plus détaillé
            </p>
          )}
        </div>

        {/* Template Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <Palette className="h-4 w-4 mr-2" />
            Choisissez un modèle
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center text-2xl`}>
                    {template.preview}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Preview */}
        {profile && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-3 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Aperçu des informations
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Nom :</strong> {profile.first_name} {profile.last_name}</p>
                <p><strong>Email :</strong> {user?.email}</p>
                {profile.phone && <p><strong>Téléphone :</strong> {profile.phone}</p>}
              </div>
              <div>
                <p><strong>Formation :</strong> {profile.education_level} en {profile.field_of_study}</p>
                <p><strong>École :</strong> {profile.school_name}</p>
                <p><strong>Expérience :</strong> {profile.experience_level}</p>
              </div>
            </div>
            {profile.skills && profile.skills.length > 0 && (
              <div className="mt-3">
                <p className="font-medium mb-2">Compétences :</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.slice(0, 6).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {profile.skills.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{profile.skills.length - 6} autres
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={openPreview}
            variant="outline"
            disabled={!profile?.first_name}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            Prévisualiser
          </Button>
          
          <Button
            onClick={generatePDF}
            disabled={generating || !profile?.first_name}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {generating ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Génération...</span>
              </div>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Télécharger CV
              </>
            )}
          </Button>
        </div>

        {!profile?.first_name && (
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
            <FileText className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-amber-800 mb-2">
              Profil incomplet
            </h3>
            <p className="text-amber-700">
              Complétez votre profil dans l'onglet "Mon profil" pour générer votre CV.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CVGenerator;