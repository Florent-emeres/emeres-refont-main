import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';
import { 
  Video, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle,
  AlertCircle,
  Brain,
  Target,
  Clock,
  Star,
  TrendingUp,
  Volume2,
  Eye,
  MessageSquare,
  Award,
  Zap,
  Coffee,
  Sparkles
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const InterviewSimulator = ({ profile, user }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes par question
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [simulationCompleted, setSimulationCompleted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedJobType, setSelectedJobType] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const jobTypes = [
    { value: 'tech', label: 'Technologie / IT', icon: '💻' },
    { value: 'marketing', label: 'Marketing / Communication', icon: '📢' },
    { value: 'finance', label: 'Finance / Comptabilité', icon: '💰' },
    { value: 'hr', label: 'Ressources Humaines', icon: '👥' },
    { value: 'sales', label: 'Commercial / Vente', icon: '📈' },
    { value: 'design', label: 'Design / Créatif', icon: '🎨' },
    { value: 'engineering', label: 'Ingénierie', icon: '⚙️' },
    { value: 'healthcare', label: 'Santé / Médical', icon: '🏥' },
    { value: 'education', label: 'Éducation / Formation', icon: '📚' },
    { value: 'consulting', label: 'Conseil / Stratégie', icon: '🧠' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Débutant', description: 'Questions générales et accueillantes' },
    { value: 'medium', label: 'Intermédiaire', description: 'Questions approfondies avec mises en situation' },
    { value: 'hard', label: 'Avancé', description: 'Questions challengeantes et cas complexes' }
  ];

  const questionSets = {
    tech: {
      easy: [
        "Pouvez-vous vous présenter en quelques mots ?",
        "Qu'est-ce qui vous attire dans le domaine de la technologie ?",
        "Quelle est votre expérience avec la programmation ?",
        "Comment restez-vous à jour avec les nouvelles technologies ?",
        "Décrivez un projet technique dont vous êtes fier."
      ],
      medium: [
        "Comment approcheriez-vous le debugging d'une application qui plante ?",
        "Expliquez la différence entre une base de données relationnelle et NoSQL.",
        "Comment gérez-vous les conflits de versions dans un projet en équipe ?",
        "Décrivez votre processus de résolution d'un problème technique complexe.",
        "Quelle est votre approche pour apprendre une nouvelle technologie ?"
      ],
      hard: [
        "Concevez l'architecture d'une application web scalable pour 1 million d'utilisateurs.",
        "Comment optimiseriez-vous une requête SQL qui prend 30 secondes à s'exécuter ?",
        "Expliquez les principes SOLID et donnez un exemple d'implémentation.",
        "Comment gérez-vous la sécurité dans une API REST ?",
        "Décrivez votre approche pour migrer une application legacy vers une architecture microservices."
      ]
    },
    marketing: {
      easy: [
        "Qu'est-ce qui vous passionne dans le marketing ?",
        "Comment définiriez-vous votre cible marketing ?",
        "Quels sont vos réseaux sociaux préférés et pourquoi ?",
        "Décrivez une campagne marketing qui vous a marqué.",
        "Comment mesurez-vous le succès d'une action marketing ?"
      ],
      medium: [
        "Comment lanceriez-vous un nouveau produit sur le marché ?",
        "Quelle stratégie adopteriez-vous pour augmenter l'engagement sur Instagram ?",
        "Comment réagiriez-vous face à une crise de réputation en ligne ?",
        "Expliquez la différence entre marketing B2B et B2C.",
        "Comment optimiseriez-vous le ROI d'une campagne publicitaire ?"
      ],
      hard: [
        "Développez une stratégie marketing omnicanale pour une startup dans un marché saturé.",
        "Comment utiliseriez-vous le data marketing pour personnaliser l'expérience client ?",
        "Concevez une campagne de growth hacking pour tripler les inscriptions.",
        "Analysez l'impact du RGPD sur les stratégies de marketing digital.",
        "Comment intégreriez-vous l'IA dans votre stratégie marketing ?"
      ]
    }
  };

  const generateQuestions = (jobType, difficulty) => {
    const baseQuestions = questionSets[jobType]?.[difficulty] || questionSets.tech.medium;
    return baseQuestions.slice(0, 5); // Limiter à 5 questions
  };

  const startSimulation = () => {
    if (!selectedJobType) {
      toast.error('Veuillez sélectionner un domaine d\'activité');
      return;
    }

    const generatedQuestions = generateQuestions(selectedJobType, difficulty);
    setQuestions(generatedQuestions);
    setAnswers(new Array(generatedQuestions.length).fill(''));
    setCurrentQuestion(0);
    setTimeLeft(120);
    setSimulationStarted(true);
    setSimulationCompleted(false);
    setFeedback(null);
    
    toast.success('Simulation d\'entretien démarrée !');
    startTimer();
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNextQuestion();
          return 120;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleNextQuestion = () => {
    // Save current answer
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = currentAnswer;
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(120);
    } else {
      // Simulation completed
      completeSimulation(newAnswers);
    }
  };

  const completeSimulation = async (finalAnswers) => {
    stopTimer();
    setSimulationCompleted(true);
    setIsAnalyzing(true);

    try {
      // Analyze answers with AI
      const analysisData = {
        profile: {
          firstName: profile?.first_name || user?.first_name || '',
          lastName: profile?.last_name || user?.last_name || '',
          field: profile?.field_of_study || '',
          experience: profile?.experience_level || '',
          skills: profile?.skills || []
        },
        interview: {
          jobType: selectedJobType,
          difficulty: difficulty,
          questions: questions,
          answers: finalAnswers
        }
      };

      const response = await axios.post(`${API}/ai/analyze-interview`, analysisData);
      setFeedback(response.data);
      
    } catch (error) {
      console.error('Error analyzing interview:', error);
      // Fallback analysis
      const fallbackFeedback = generateFallbackFeedback(finalAnswers);
      setFeedback(fallbackFeedback);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateFallbackFeedback = (answers) => {
    const avgLength = answers.reduce((sum, answer) => sum + answer.length, 0) / answers.length;
    const completedAnswers = answers.filter(answer => answer.trim().length > 20).length;
    
    let overallScore = Math.min(100, (completedAnswers / questions.length) * 70 + (avgLength > 100 ? 30 : 15));
    
    return {
      overallScore: Math.round(overallScore),
      strengths: [
        completedAnswers === questions.length ? "Toutes les questions ont été répondues" : "Bonne participation",
        avgLength > 150 ? "Réponses détaillées et complètes" : "Réponses concises",
        "Simulation terminée avec succès"
      ],
      improvements: [
        avgLength < 100 ? "Développer davantage les réponses" : "Maintenir le niveau de détail",
        "Pratiquer régulièrement pour gagner en fluidité",
        "Préparer des exemples concrets"
      ],
      detailedFeedback: answers.map((answer, index) => ({
        question: questions[index],
        score: Math.min(100, answer.length > 50 ? 80 + Math.random() * 20 : 40 + Math.random() * 30),
        feedback: answer.length > 100 ? "Réponse bien développée" : "Réponse à enrichir avec plus d'exemples"
      }))
    };
  };

  const resetSimulation = () => {
    stopTimer();
    setSimulationStarted(false);
    setSimulationCompleted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setCurrentAnswer('');
    setTimeLeft(120);
    setFeedback(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 80) return { label: 'Très bien', color: 'bg-blue-100 text-blue-800' };
    if (score >= 70) return { label: 'Bien', color: 'bg-blue-100 text-amber-800' };
    if (score >= 60) return { label: 'Correct', color: 'bg-orange-100 text-orange-800' };
    return { label: 'À améliorer', color: 'bg-red-100 text-red-800' };
  };

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);

  if (!simulationStarted) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <Video className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl">Simulateur d'Entretien IA</span>
                <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Alimenté par IA
                </Badge>
              </div>
            </CardTitle>
            <CardDescription className="text-lg">
              Entraînez-vous avec des entretiens personnalisés et recevez des feedbacks détaillés
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Configuration de l'entretien</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="jobType">Domaine d'activité</Label>
                  <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un domaine" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map(job => (
                        <SelectItem key={job.value} value={job.value}>
                          <div className="flex items-center space-x-2">
                            <span>{job.icon}</span>
                            <span>{job.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Niveau de difficulté</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map(diff => (
                        <SelectItem key={diff.value} value={diff.value}>
                          <div>
                            <div className="font-medium">{diff.label}</div>
                            <div className="text-xs text-gray-500">{diff.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Comment ça marche ?</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-blue-100 rounded-full">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">5 questions personnalisées</p>
                      <p className="text-gray-600">Adaptées à votre domaine et niveau</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-green-100 rounded-full">
                      <span className="text-green-600 font-bold text-sm">2</span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">2 minutes par question</p>
                      <p className="text-gray-600">Temps réaliste d'entretien</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-purple-100 rounded-full">
                      <span className="text-purple-600 font-bold text-sm">3</span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Analyse IA détaillée</p>
                      <p className="text-gray-600">Feedback et conseils personnalisés</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button
                onClick={startSimulation}
                disabled={!selectedJobType}
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-3 text-lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Commencer la simulation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-amber-600" />
              <span>Conseils pour réussir</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Installez-vous dans un endroit calme</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Préparez des exemples concrets</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Parlez clairement et avec assurance</span>
                </li>
              </ul>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Structurez vos réponses (situation, action, résultat)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Montrez votre motivation et curiosité</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Restez authentique et naturel</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (simulationCompleted && feedback) {
    const scoreBadge = getScoreBadge(feedback.overallScore);
    
    return (
      <div className="space-y-6">
        {/* Overall Results */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-green-600" />
                <span>Résultats de votre entretien</span>
              </div>
              <Badge className={scoreBadge.color}>
                {scoreBadge.label}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-6xl font-bold ${getScoreColor(feedback.overallScore)} mb-2`}>
                {feedback.overallScore}/100
              </div>
              <p className="text-gray-600">Score global de performance</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-green-800 mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Points forts
                </h3>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-green-700 flex items-start space-x-2">
                      <Star className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-blue-800 mb-3 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Axes d'amélioration
                </h3>
                <ul className="space-y-2">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index} className="text-sm text-blue-700 flex items-start space-x-2">
                      <Target className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Question Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Analyse détaillée par question</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedback.detailedFeedback?.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-800">Question {index + 1}</h4>
                    <Badge variant="outline">
                      {item.score}/100
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 italic">"{item.question}"</p>
                  <p className="text-sm text-gray-700">{item.feedback}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={resetSimulation}
            variant="outline"
            className="px-6"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Nouvelle simulation
          </Button>
          <Button
            onClick={() => {
              // Save results to localStorage or profile
              const results = {
                date: new Date().toISOString(),
                jobType: selectedJobType,
                difficulty: difficulty,
                score: feedback.overallScore,
                strengths: feedback.strengths,
                improvements: feedback.improvements
              };
              
              const saved = JSON.parse(localStorage.getItem('emeres_interview_history') || '[]');
              saved.push(results);
              localStorage.setItem('emeres_interview_history', JSON.stringify(saved));
              
              toast.success('Résultats sauvegardés !');
            }}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 px-6"
          >
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder les résultats
          </Button>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Brain className="h-12 w-12 text-purple-500 animate-pulse mb-4" />
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            Analyse IA en cours...
          </h3>
          <p className="text-gray-600 text-center">
            L'IA analyse vos réponses et prépare un feedback détaillé
          </p>
          <div className="mt-4">
            <Progress value={75} className="w-64" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Video className="h-5 w-5" />
                <span>Entretien en cours</span>
              </CardTitle>
              <CardDescription>
                Question {currentQuestion + 1} sur {questions.length}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${timeLeft <= 30 ? 'text-red-600' : 'text-blue-600'}`}>
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-gray-600">Temps restant</p>
            </div>
          </div>
          <Progress value={((currentQuestion) / questions.length) * 100} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center text-gray-800">
            {questions[currentQuestion]}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Tapez votre réponse ici... Prenez votre temps pour développer."
            rows={8}
            className="text-base"
          />
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {currentAnswer.split(' ').filter(word => word.length > 0).length} mots
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentAnswer('');
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Recommencer
              </Button>
              
              <Button
                onClick={handleNextQuestion}
                disabled={currentAnswer.trim().length < 10}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {currentQuestion === questions.length - 1 ? 'Terminer' : 'Question suivante'}
                <span className="ml-2">→</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Coffee className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Conseil pour cette question</h4>
              <p className="text-sm text-blue-700 mt-1">
                Structurez votre réponse : présentez le contexte, expliquez vos actions, et concluez par les résultats obtenus.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Save = ({ className, ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17,21 17,13 7,13 7,21"/>
    <polyline points="7,3 7,8 15,8"/>
  </svg>
);

export default InterviewSimulator;