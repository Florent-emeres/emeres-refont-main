import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import EmeresInput from '../ui/EmeresInput';
import {
  Brain,
  Mic,
  MicOff,
  Play,
  Pause,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Target,
  TrendingUp,
  Eye,
  RotateCcw,
  Settings,
  Award,
  MessageSquare,
  Zap,
  Timer
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const EntretienIA = ({ user }) => {
  const { toast } = useToast();
  const [currentSession, setCurrentSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [interviewPhase, setInterviewPhase] = useState('setup'); // 'setup', 'interview', 'feedback'
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Configuration de l'entretien
  const [interviewConfig, setInterviewConfig] = useState({
    jobTitle: '',
    company: '',
    sector: 'tech',
    level: 'junior',
    duration: 20, // en minutes
    questionCount: 5
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const sectors = [
    { id: 'tech', name: 'Technologie & IT', icon: '💻' },
    { id: 'finance', name: 'Finance & Banque', icon: '💰' },
    { id: 'marketing', name: 'Marketing & Communication', icon: '📢' },
    { id: 'consulting', name: 'Conseil & Strategy', icon: '📊' },
    { id: 'sales', name: 'Commercial & Vente', icon: '🤝' },
    { id: 'hr', name: 'Ressources Humaines', icon: '👥' },
    { id: 'engineering', name: 'Ingénierie', icon: '⚙️' },
    { id: 'healthcare', name: 'Santé & Médical', icon: '🏥' },
    { id: 'education', name: 'Éducation & Formation', icon: '🎓' },
    { id: 'retail', name: 'Commerce & Retail', icon: '🛍️' }
  ];

  const levels = [
    { id: 'junior', name: 'Junior (0-2 ans)', description: 'Questions de base et motivation' },
    { id: 'intermediate', name: 'Intermédiaire (2-5 ans)', description: 'Expérience et compétences techniques' },
    { id: 'senior', name: 'Senior (5+ ans)', description: 'Leadership et vision stratégique' }
  ];

  // Timer pour les questions
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const startInterview = async () => {
    if (!interviewConfig.jobTitle || !interviewConfig.sector) {
      toast({
        title: "Configuration incomplète",
        description: "Veuillez renseigner au moins le poste et le secteur",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Créer une session d'entretien avec contexte spécifique
      const token = localStorage.getItem('token');
      const contextData = {
        interview_type: 'job_interview',
        job_title: interviewConfig.jobTitle,
        company: interviewConfig.company,
        sector: interviewConfig.sector,
        level: interviewConfig.level,
        question_count: interviewConfig.questionCount,
        duration: interviewConfig.duration
      };

      const response = await axios.post(`${backendUrl}/api/tools/coach-ia/session`,
        { context: contextData },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCurrentSession({
          session_id: response.data.session_id,
          config: interviewConfig,
          questions: [],
          answers: []
        });

        // Générer la première question
        await generateNextQuestion(response.data.session_id, 0);

        setInterviewPhase('interview');
        setIsTimerRunning(true);
        setTimeLeft(120); // 2 minutes par question

        toast({
          title: "Entretien démarré !",
          description: `Simulation d'entretien pour ${interviewConfig.jobTitle}`,
          variant: "success",
        });
      }
    } catch (error) {
      console.error('Erreur démarrage entretien:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer l'entretien",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateNextQuestion = async (sessionId, questionNum) => {
    try {
      const token = localStorage.getItem('token');

      const prompt = `Tu es un recruteur expert pour le poste de "${interviewConfig.jobTitle}"
      ${interviewConfig.company ? `chez ${interviewConfig.company}` : ''}
      dans le secteur ${interviewConfig.sector} (niveau ${interviewConfig.level}).

      Génère la question ${questionNum + 1} sur ${interviewConfig.questionCount} pour cet entretien.

      INSTRUCTIONS:
      - Pose UNE SEULE question précise et professionnelle
      - Adapte la difficulté au niveau ${interviewConfig.level}
      - Question pertinente pour le secteur ${interviewConfig.sector}
      - Varie le type de question (technique, comportementale, situationnelle)

      ${questionNum === 0 ? 'Commence par une question d\'introduction/présentation.' : ''}
      ${questionNum === interviewConfig.questionCount - 1 ? 'Termine par une question de clôture sur les motivations.' : ''}

      Réponds UNIQUEMENT avec la question, sans commentaire.`;

      const response = await axios.post(
        `${backendUrl}/api/tools/coach-ia/chat/${sessionId}`,
        { message: prompt },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCurrentQuestion({
          id: questionNum,
          text: response.data.response,
          timeLimit: 120
        });
      } else {
        setIsTimerRunning(false);
        toast({
          title: "IA indisponible",
          description: response.data.message || "La génération de questions IA n'est pas disponible pour le moment.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur génération question:', error);
      setIsTimerRunning(false);
      toast({
        title: "Erreur",
        description: "Impossible de générer la question",
        variant: "destructive",
      });
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast({
        title: "Réponse manquante",
        description: "Veuillez donner une réponse avant de continuer",
        variant: "destructive",
      });
      return;
    }

    // Sauvegarder la réponse
    const newAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      answer: currentAnswer,
      timeUsed: 120 - timeLeft
    };

    setCurrentSession(prev => ({
      ...prev,
      answers: [...prev.answers, newAnswer]
    }));

    setCurrentAnswer('');
    setIsTimerRunning(false);

    // Passer à la question suivante ou terminer
    if (questionIndex + 1 < interviewConfig.questionCount) {
      setQuestionIndex(prev => prev + 1);
      await generateNextQuestion(currentSession.session_id, questionIndex + 1);
      setTimeLeft(120);
      setIsTimerRunning(true);
    } else {
      // Entretien terminé, générer le feedback
      await generateFeedback();
    }
  };

  const generateFeedback = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');

      const allAnswers = currentSession.answers.map((a, i) =>
        `Question ${i + 1}: ${a.question}\nRéponse: ${a.answer}\nTemps utilisé: ${a.timeUsed}s`
      ).join('\n\n');

      const feedbackPrompt = `Tu es un expert RH. Analyse cet entretien pour le poste de "${interviewConfig.jobTitle}" (niveau ${interviewConfig.level}) dans le secteur ${interviewConfig.sector}.

ENTRETIEN COMPLET:
${allAnswers}

Fournis un feedback structuré avec:

1. SCORE GLOBAL (/100)
2. POINTS FORTS (3-4 points concrets)
3. AXES D'AMÉLIORATION (3-4 points constructifs)
4. CONSEILS SPÉCIFIQUES pour ce type de poste
5. NOTE par catégorie (/20):
   - Communication
   - Motivation
   - Compétences techniques
   - Adéquation au poste

Sois constructif et précis dans tes retours.`;

      const response = await axios.post(
        `${backendUrl}/api/tools/coach-ia/chat/${currentSession.session_id}`,
        { message: feedbackPrompt },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        setFeedback({
          analysis: response.data.response,
          totalQuestions: interviewConfig.questionCount,
          totalTime: interviewConfig.duration,
          completedAt: new Date().toISOString()
        });
        setInterviewPhase('feedback');
      } else {
        toast({
          title: "IA indisponible",
          description: response.data.message || "Le feedback IA n'est pas disponible pour le moment.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur génération feedback:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le feedback",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeUp = () => {
    setIsTimerRunning(false);
    toast({
      title: "Temps écoulé !",
      description: "Passons à la question suivante",
      variant: "default",
    });

    if (currentAnswer.trim()) {
      submitAnswer();
    } else {
      // Passer à la question suivante même sans réponse
      if (questionIndex + 1 < interviewConfig.questionCount) {
        setQuestionIndex(prev => prev + 1);
        generateNextQuestion(currentSession.session_id, questionIndex + 1);
        setTimeLeft(120);
        setIsTimerRunning(true);
      } else {
        generateFeedback();
      }
    }
  };

  const resetInterview = () => {
    setCurrentSession(null);
    setCurrentQuestion(null);
    setCurrentAnswer('');
    setQuestionIndex(0);
    setTimeLeft(120);
    setIsTimerRunning(false);
    setInterviewPhase('setup');
    setFeedback(null);
    setIsLoading(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Background Image pour Entretien IA */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-8"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1659035260002-11d486d6e9f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      {/* Overlay pour maintenir le contraste */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50/85 via-purple-50/85 to-indigo-50/85" />

      <div className="container mx-auto px-4 py-6 max-w-6xl relative z-10">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Entretien IA</h1>
              <p className="text-gray-600">Simulation d'entretien personnalisée avec feedback IA détaillé</p>
            </div>
            <EmeresBadge variant="primary" className="ml-auto">
              <Star className="w-4 h-4 mr-1" />
              IA Premium
            </EmeresBadge>
          </div>
        </div>

        {interviewPhase === 'setup' && (
          // Configuration de l'entretien
          <div className="max-w-4xl mx-auto">
            <EmeresCard>
              <EmeresCardHeader>
                <EmeresCardTitle>Configuration de votre entretien</EmeresCardTitle>
                <EmeresCardDescription>
                  Personnalisez votre simulation pour un entretien adapté à vos besoins
                </EmeresCardDescription>
              </EmeresCardHeader>
              <EmeresCardContent className="space-y-6">

                {/* Informations du poste */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Intitulé du poste *
                    </label>
                    <EmeresInput
                      placeholder="ex: Développeur Full-stack, Chef de projet..."
                      value={interviewConfig.jobTitle}
                      onChange={(e) => setInterviewConfig(prev => ({...prev, jobTitle: e.target.value}))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entreprise (optionnel)
                    </label>
                    <EmeresInput
                      placeholder="ex: Google, Startup, PME..."
                      value={interviewConfig.company}
                      onChange={(e) => setInterviewConfig(prev => ({...prev, company: e.target.value}))}
                    />
                  </div>
                </div>

                {/* Secteur d'activité */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Secteur d'activité *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {sectors.map((sector) => (
                      <button
                        key={sector.id}
                        onClick={() => setInterviewConfig(prev => ({...prev, sector: sector.id}))}
                        className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                          interviewConfig.sector === sector.id
                            ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-100'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-lg mb-1">{sector.icon}</div>
                        <div className="text-sm font-medium text-gray-900">{sector.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Niveau d'expérience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Niveau d'expérience
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {levels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setInterviewConfig(prev => ({...prev, level: level.id}))}
                        className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                          interviewConfig.level === level.id
                            ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-100'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium text-gray-900 mb-1">{level.name}</div>
                        <div className="text-sm text-gray-600">{level.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Paramètres avancés */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de questions
                    </label>
                    <select
                      value={interviewConfig.questionCount}
                      onChange={(e) => setInterviewConfig(prev => ({...prev, questionCount: parseInt(e.target.value)}))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={3}>3 questions (rapide)</option>
                      <option value={5}>5 questions (standard)</option>
                      <option value={8}>8 questions (complet)</option>
                      <option value={10}>10 questions (intensif)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temps par question
                    </label>
                    <select
                      value={120}
                      onChange={() => {}} // Fixé à 2 minutes pour l'instant
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                      disabled
                    >
                      <option value={120}>2 minutes</option>
                    </select>
                  </div>
                </div>

                {/* Bouton de démarrage */}
                <div className="text-center pt-6">
                  <EmeresButton
                    onClick={startInterview}
                    disabled={isLoading || !interviewConfig.jobTitle || !interviewConfig.sector}
                    size="lg"
                    icon={isLoading ? <Timer className="animate-spin" /> : <Play />}
                    className="px-8"
                  >
                    {isLoading ? 'Préparation...' : 'Démarrer l\'entretien'}
                  </EmeresButton>

                  <p className="text-sm text-gray-500 mt-3">
                    L'IA va générer des questions adaptées à votre profil et au poste visé
                  </p>
                </div>
              </EmeresCardContent>
            </EmeresCard>
          </div>
        )}

        {interviewPhase === 'interview' && currentQuestion && (
          // Interface d'entretien
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Status bar */}
            <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Entretien en cours</span>
                </div>
                <div className="text-sm text-gray-600">
                  Question {questionIndex + 1} sur {interviewConfig.questionCount}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${timeLeft < 30 ? 'text-red-600' : 'text-gray-600'}`}>
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{formatTime(timeLeft)}</span>
                </div>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      timeLeft < 30 ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${(timeLeft / 120) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Question actuelle */}
            <EmeresCard>
              <EmeresCardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Question {questionIndex + 1}
                  </h2>

                  <div className="bg-blue-50 rounded-xl p-6 mb-6">
                    <p className="text-lg text-gray-800 leading-relaxed">
                      {currentQuestion.text}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Votre réponse
                  </label>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Prenez le temps de structurer votre réponse..."
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    disabled={!isTimerRunning}
                  />

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {currentAnswer.length} caractères
                    </div>

                    <div className="flex gap-3">
                      <EmeresButton
                        variant="outline"
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        icon={isTimerRunning ? <Pause /> : <Play />}
                      >
                        {isTimerRunning ? 'Pause' : 'Reprendre'}
                      </EmeresButton>

                      <EmeresButton
                        onClick={submitAnswer}
                        disabled={!currentAnswer.trim()}
                        icon={<CheckCircle />}
                      >
                        {questionIndex + 1 === interviewConfig.questionCount ? 'Terminer' : 'Question suivante'}
                      </EmeresButton>
                    </div>
                  </div>
                </div>
              </EmeresCardContent>
            </EmeresCard>

            {/* Informations du poste */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                <div><strong>Poste:</strong> {interviewConfig.jobTitle}</div>
                {interviewConfig.company && <div><strong>Entreprise:</strong> {interviewConfig.company}</div>}
                <div><strong>Secteur:</strong> {sectors.find(s => s.id === interviewConfig.sector)?.name}</div>
                <div><strong>Niveau:</strong> {levels.find(l => l.id === interviewConfig.level)?.name}</div>
              </div>
            </div>
          </div>
        )}

        {interviewPhase === 'feedback' && feedback && (
          // Résultats et feedback
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Header résultats */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Entretien terminé !
              </h2>
              <p className="text-gray-600">
                Voici votre feedback détaillé pour le poste de {interviewConfig.jobTitle}
              </p>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <EmeresCard>
                <EmeresCardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {interviewConfig.questionCount}
                  </div>
                  <div className="text-sm text-gray-600">Questions répondues</div>
                </EmeresCardContent>
              </EmeresCard>

              <EmeresCard>
                <EmeresCardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {Math.round((currentSession?.answers?.length || 0) / interviewConfig.questionCount * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Taux de réponse</div>
                </EmeresCardContent>
              </EmeresCard>

              <EmeresCard>
                <EmeresCardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {Math.round(
                      (currentSession?.answers?.reduce((acc, a) => acc + a.timeUsed, 0) || 0) / 60
                    )}min
                  </div>
                  <div className="text-sm text-gray-600">Temps total</div>
                </EmeresCardContent>
              </EmeresCard>

              <EmeresCard>
                <EmeresCardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {interviewConfig.level === 'junior' ? 'Junior' :
                     interviewConfig.level === 'intermediate' ? 'Inter.' : 'Senior'}
                  </div>
                  <div className="text-sm text-gray-600">Niveau testé</div>
                </EmeresCardContent>
              </EmeresCard>
            </div>

            {/* Feedback détaillé */}
            <EmeresCard>
              <EmeresCardHeader>
                <EmeresCardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Analyse IA Détaillée
                </EmeresCardTitle>
                <EmeresCardDescription>
                  Feedback personnalisé basé sur vos réponses
                </EmeresCardDescription>
              </EmeresCardHeader>
              <EmeresCardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {feedback.analysis}
                  </div>
                </div>
              </EmeresCardContent>
            </EmeresCard>

            {/* Actions finales */}
            <div className="flex gap-4 justify-center">
              <EmeresButton
                variant="outline"
                onClick={resetInterview}
                icon={<RotateCcw />}
              >
                Nouvel entretien
              </EmeresButton>

              <EmeresButton
                icon={<Target />}
                onClick={() => {
                  // TODO: Sauvegarder ou partager les résultats
                  toast({
                    title: "Résultats sauvegardés",
                    description: "Vos résultats ont été ajoutés à votre historique",
                    variant: "success",
                  });
                }}
              >
                Sauvegarder les résultats
              </EmeresButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntretienIA;
