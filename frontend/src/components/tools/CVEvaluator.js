import React, { useState } from 'react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import { 
  FileText, 
  Upload, 
  Brain, 
  Target, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Star,
  Download,
  Eye,
  Zap
} from 'lucide-react';

const CVEvaluator = ({ user }) => {
  const [uploadedCV, setUploadedCV] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedCV({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2),
        uploadDate: new Date().toISOString()
      });
      
      // Simuler l'analyse
      setTimeout(() => {
        analyzeCV();
      }, 1000);
    }
  };

  const analyzeCV = () => {
    setIsAnalyzing(true);
    
    // Simulation d'analyse IA
    setTimeout(() => {
      setAnalysis({
        overallScore: 78,
        scores: {
          structure: 85,
          content: 72,
          keywords: 68,
          formatting: 90,
          experience: 75,
          skills: 80
        },
        strengths: [
          "Présentation claire et professionnelle",
          "Expériences bien détaillées avec résultats quantifiés",
          "Compétences techniques bien organisées",
          "Formatage cohérent et lisible"
        ],
        improvements: [
          "Ajouter plus de mots-clés spécifiques au secteur",
          "Développer la section des réalisations",
          "Optimiser la longueur de certaines descriptions",
          "Inclure des certifications récentes"
        ],
        recommendations: [
          {
            category: "Contenu",
            priority: "Haute",
            suggestion: "Ajouter une section 'Projets' pour mettre en valeur vos réalisations concrètes"
          },
          {
            category: "SEO",
            priority: "Moyenne", 
            suggestion: "Intégrer plus de mots-clés du secteur pour améliorer la visibilité ATS"
          },
          {
            category: "Structure",
            priority: "Basse",
            suggestion: "Réorganiser l'ordre des sections pour mettre l'expérience en avant"
          }
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-blue-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Background Image pour CV Evaluator */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-8"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      {/* Overlay pour maintenir le contraste */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-50/90 via-teal-50/90 to-cyan-50/90" />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Évaluateur CV IA</h1>
              <p className="text-gray-600">Analyse intelligente de votre CV avec recommandations personnalisées</p>
            </div>
            <EmeresBadge variant="primary" className="ml-auto">
              <Star className="w-4 h-4 mr-1" />
              IA Premium
            </EmeresBadge>
          </div>
        </div>

        {!uploadedCV ? (
          // Zone d'upload
          <div className="max-w-4xl mx-auto">
            <EmeresCard>
              <EmeresCardContent className="p-12">
                <div className="text-center">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Upload className="h-12 w-12 text-emerald-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Téléchargez votre CV pour analyse
                  </h2>
                  
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Notre IA analysera votre CV en quelques secondes et vous fournira des recommandations 
                    détaillées pour améliorer vos chances d'être recruté.
                  </p>
                  
                  <div className="space-y-4">
                    <label className="inline-block">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <EmeresButton
                        as="span"
                        size="lg"
                        icon={<Upload />}
                        className="cursor-pointer px-8"
                      >
                        Choisir un fichier PDF
                      </EmeresButton>
                    </label>
                    
                    <div className="text-sm text-gray-500">
                      Format accepté: PDF • Taille max: 5MB
                    </div>
                  </div>
                  
                  {/* Fonctionnalités */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Target className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Analyse Multi-critères</h3>
                      <p className="text-sm text-gray-600">Structure, contenu, mots-clés, formatage</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Score Détaillé</h3>
                      <p className="text-sm text-gray-600">Note globale et par catégorie</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Zap className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Conseils Personnalisés</h3>
                      <p className="text-sm text-gray-600">Recommandations d'amélioration</p>
                    </div>
                  </div>
                </div>
              </EmeresCardContent>
            </EmeresCard>
          </div>
        ) : (
          // Résultats d'analyse
          <div className="space-y-6">
            
            {/* Info du fichier */}
            <EmeresCard>
              <EmeresCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-emerald-600" />
                    <div>
                      <div className="font-medium text-gray-900">{uploadedCV.name}</div>
                      <div className="text-sm text-gray-600">{uploadedCV.size} MB • Analysé le {new Date(uploadedCV.uploadDate).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <EmeresButton variant="outline" size="sm" icon={<Eye />}>
                      Voir le CV
                    </EmeresButton>
                    <EmeresButton variant="outline" size="sm" icon={<Upload />} onClick={() => {
                      setUploadedCV(null);
                      setAnalysis(null);
                    }}>
                      Nouveau CV
                    </EmeresButton>
                  </div>
                </div>
              </EmeresCardContent>
            </EmeresCard>

            {isAnalyzing ? (
              // État de chargement
              <EmeresCard>
                <EmeresCardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Brain className="h-8 w-8 text-emerald-600 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Analyse en cours...</h3>
                  <p className="text-gray-600 mb-6">Notre IA examine votre CV sous tous les angles</p>
                  
                  <div className="max-w-md mx-auto">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progression</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full w-3/4 transition-all duration-1000"></div>
                    </div>
                  </div>
                </EmeresCardContent>
              </EmeresCard>
            ) : analysis && (
              // Résultats d'analyse
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Score global */}
                <div className="lg:col-span-1">
                  <EmeresCard>
                    <EmeresCardHeader>
                      <EmeresCardTitle>Score Global</EmeresCardTitle>
                    </EmeresCardHeader>
                    <EmeresCardContent className="text-center">
                      <div className={`text-6xl font-bold mb-4 ${getScoreColor(analysis.overallScore)}`}>
                        {analysis.overallScore}
                      </div>
                      <div className="text-gray-600 mb-6">/ 100</div>
                      
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getScoreBgColor(analysis.overallScore)}`}>
                        {analysis.overallScore >= 80 ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                        )}
                        <span className={`font-medium ${getScoreColor(analysis.overallScore)}`}>
                          {analysis.overallScore >= 80 ? 'Excellent CV' : 
                           analysis.overallScore >= 60 ? 'Bon CV' : 'À améliorer'}
                        </span>
                      </div>
                    </EmeresCardContent>
                  </EmeresCard>
                  
                  {/* Scores détaillés */}
                  <EmeresCard className="mt-6">
                    <EmeresCardHeader>
                      <EmeresCardTitle>Scores par Catégorie</EmeresCardTitle>
                    </EmeresCardHeader>
                    <EmeresCardContent>
                      <div className="space-y-4">
                        {Object.entries(analysis.scores).map(([category, score]) => (
                          <div key={category} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {category === 'structure' ? 'Structure' :
                               category === 'content' ? 'Contenu' :
                               category === 'keywords' ? 'Mots-clés' :
                               category === 'formatting' ? 'Formatage' :
                               category === 'experience' ? 'Expérience' : 'Compétences'}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-blue-500' : 'bg-red-500'}`}
                                  style={{width: `${score}%`}}
                                />
                              </div>
                              <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                                {score}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </EmeresCardContent>
                  </EmeresCard>
                </div>

                {/* Recommandations */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Points forts */}
                  <EmeresCard>
                    <EmeresCardHeader>
                      <EmeresCardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Points Forts
                      </EmeresCardTitle>
                    </EmeresCardHeader>
                    <EmeresCardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analysis.strengths.map((strength, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-green-800">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </EmeresCardContent>
                  </EmeresCard>

                  {/* Améliorations */}
                  <EmeresCard>
                    <EmeresCardHeader>
                      <EmeresCardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Améliorations Suggérées
                      </EmeresCardTitle>
                    </EmeresCardHeader>
                    <EmeresCardContent>
                      <div className="space-y-3">
                        {analysis.improvements.map((improvement, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-blue-800">{improvement}</span>
                          </div>
                        ))}
                      </div>
                    </EmeresCardContent>
                  </EmeresCard>

                  {/* Recommandations détaillées */}
                  <EmeresCard>
                    <EmeresCardHeader>
                      <EmeresCardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        Recommandations IA
                      </EmeresCardTitle>
                    </EmeresCardHeader>
                    <EmeresCardContent>
                      <div className="space-y-4">
                        {analysis.recommendations.map((rec, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{rec.category}</span>
                                <EmeresBadge 
                                  size="sm" 
                                  variant={rec.priority === 'Haute' ? 'destructive' : 
                                          rec.priority === 'Moyenne' ? 'default' : 'secondary'}
                                >
                                  {rec.priority}
                                </EmeresBadge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700">{rec.suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </EmeresCardContent>
                  </EmeresCard>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <EmeresButton icon={<Download />} className="flex-1">
                      Télécharger le rapport
                    </EmeresButton>
                    <EmeresButton variant="outline" icon={<Upload />} className="flex-1">
                      Analyser un nouveau CV
                    </EmeresButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CVEvaluator;