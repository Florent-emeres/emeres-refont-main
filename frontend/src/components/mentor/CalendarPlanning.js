import React, { useState, useEffect } from 'react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import EmeresInput from '../ui/EmeresInput';
import { 
  Calendar, 
  Plus,
  Clock,
  Video,
  Phone,
  MapPin,
  User,
  Users,
  PlayCircle,
  PauseCircle,
  StopCircle,
  CheckCircle,
  X,
  Edit,
  Trash2,
  Eye,
  Save,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Download,
  Upload,
  Link,
  Bell,
  Settings,
  CalendarDays,
  Target,
  FileText,
  MessageSquare,
  AlertCircle,
  Info,
  ExternalLink
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CalendarPlanning = ({ sessions, setSessions, students, activeSession, setActiveSession }) => {
  const [viewMode, setViewMode] = useState('week'); // week, month, day
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Formulaire de session
  const [sessionForm, setSessionForm] = useState({
    student_id: '',
    title: '',
    description: '',
    scheduled_start: '',
    scheduled_end: '',
    meeting_link: '',
    meeting_platform: 'google_meet',
    location: '',
    session_type: 'one_on_one'
  });

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionForm)
      });

      if (response.ok) {
        const newSession = await response.json();
        setSessions([...sessions, newSession]);
        setShowSessionForm(false);
        resetSessionForm();
      }
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
    } finally {
      setLoading(false);
    }
  };

  const startSession = async (sessionId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/sessions/${sessionId}/checkin`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        setActiveSession(sessionId);
        await loadSessions(); // Recharger pour avoir le statut mis à jour
      }
    } catch (error) {
      console.error('Erreur lors du démarrage de la session:', error);
    } finally {
      setLoading(false);
    }
  };

  const endSession = async (sessionId, sessionNotes = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/sessions/${sessionId}/checkout`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionNotes)
      });

      if (response.ok) {
        const result = await response.json();
        setActiveSession(null);
        await loadSessions(); // Recharger pour avoir le statut mis à jour
      }
    } catch (error) {
      console.error('Erreur lors de la fin de la session:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetSessionForm = () => {
    setSessionForm({
      student_id: '',
      title: '',
      description: '',
      scheduled_start: '',
      scheduled_end: '',
      meeting_link: '',
      meeting_platform: 'google_meet',
      location: '',
      session_type: 'one_on_one'
    });
    setEditingSession(null);
  };

  const generateMeetingLink = () => {
    if (sessionForm.meeting_platform === 'google_meet') {
      const meetingId = Math.random().toString(36).substr(2, 10);
      setSessionForm(prev => ({
        ...prev,
        meeting_link: `https://meet.google.com/${meetingId}`
      }));
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesStudent = selectedStudent === '' || session.student_id === selectedStudent;
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    return matchesStudent && matchesStatus;
  });

  // Fonctions pour la navigation du calendrier
  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const getDateRangeText = () => {
    if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString('fr-FR')} - ${endOfWeek.toLocaleDateString('fr-FR')}`;
    } else if (viewMode === 'month') {
      return currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    } else {
      return currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
  };

  const getSessionsForDate = (date) => {
    return filteredSessions.filter(session => {
      const sessionDate = new Date(session.scheduled_start);
      return sessionDate.toDateString() === date.toDateString();
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'scheduled': { variant: 'primary', label: 'Programmé', icon: Clock },
      'in_progress': { variant: 'secondary', label: 'En cours', icon: PlayCircle },
      'completed': { variant: 'success', label: 'Terminé', icon: CheckCircle },
      'cancelled': { variant: 'error', label: 'Annulé', icon: X },
      'no_show': { variant: 'error', label: 'Absent', icon: AlertCircle }
    };
    return statusConfig[status] || { variant: 'secondary', label: status, icon: Clock };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Planning & Sessions
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Gestion de l'agenda et des sessions de mentorat
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <EmeresButton
            variant="secondary"
            icon={<Download />}
            size="sm"
          >
            Exporter .ics
          </EmeresButton>
          <EmeresButton
            variant="primary"
            icon={<Plus />}
            onClick={() => setShowSessionForm(true)}
          >
            Nouvelle Session
          </EmeresButton>
        </div>
      </div>

      {/* Contrôles du calendrier */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Navigation temporelle */}
          <div className="flex items-center gap-2">
            <EmeresButton
              variant="outline"
              size="sm"
              icon={<ChevronLeft />}
              onClick={() => navigateDate(-1)}
            />
            <div className="text-lg font-semibold text-gray-900 min-w-48 text-center">
              {getDateRangeText()}
            </div>
            <EmeresButton
              variant="outline"
              size="sm"
              icon={<ChevronRight />}
              onClick={() => navigateDate(1)}
            />
          </div>

          <EmeresButton
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Aujourd'hui
          </EmeresButton>
        </div>

        <div className="flex items-center gap-2">
          {/* Modes d'affichage */}
          {['day', 'week', 'month'].map((mode) => (
            <EmeresButton
              key={mode}
              variant={viewMode === mode ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode(mode)}
            >
              {mode === 'day' ? 'Jour' : mode === 'week' ? 'Semaine' : 'Mois'}
            </EmeresButton>
          ))}
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">Tous les étudiants</option>
            {students.map((studentData) => (
              <option key={studentData.relation.student_id} value={studentData.relation.student_id}>
                {studentData.student.first_name} {studentData.student.last_name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          {['all', 'scheduled', 'completed', 'cancelled'].map((status) => (
            <EmeresButton
              key={status}
              variant={filterStatus === status ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'Toutes' : 
               status === 'scheduled' ? 'Programmées' :
               status === 'completed' ? 'Terminées' : 'Annulées'}
            </EmeresButton>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Vue calendrier */}
        <div className="lg:col-span-3">
          <EmeresCard>
            <EmeresCardHeader>
              <EmeresCardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-teal-600" />
                {viewMode === 'day' ? 'Vue Journalière' : 
                 viewMode === 'week' ? 'Vue Hebdomadaire' : 'Vue Mensuelle'}
              </EmeresCardTitle>
            </EmeresCardHeader>
            <EmeresCardContent>
              {viewMode === 'week' ? (
                <WeekView 
                  currentDate={currentDate}
                  sessions={filteredSessions}
                  onSessionClick={setEditingSession}
                  onStartSession={startSession}
                  onEndSession={endSession}
                  activeSession={activeSession}
                />
              ) : viewMode === 'day' ? (
                <DayView 
                  currentDate={currentDate}
                  sessions={getSessionsForDate(currentDate)}
                  onSessionClick={setEditingSession}
                  onStartSession={startSession}
                  onEndSession={endSession}
                  activeSession={activeSession}
                />
              ) : (
                <MonthView 
                  currentDate={currentDate}
                  sessions={filteredSessions}
                  onSessionClick={setEditingSession}
                />
              )}
            </EmeresCardContent>
          </EmeresCard>
        </div>

        {/* Panel latéral - Sessions du jour */}
        <div className="lg:col-span-1">
          <EmeresCard>
            <EmeresCardHeader>
              <EmeresCardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                Sessions Aujourd'hui
              </EmeresCardTitle>
            </EmeresCardHeader>
            <EmeresCardContent className="space-y-3">
              {getSessionsForDate(new Date()).map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  students={students}
                  onStart={() => startSession(session.id)}
                  onEnd={() => endSession(session.id)}
                  isActive={activeSession === session.id}
                  compact={true}
                />
              ))}
              {getSessionsForDate(new Date()).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">Aucune session aujourd'hui</p>
                </div>
              )}
            </EmeresCardContent>
          </EmeresCard>

          {/* Session active */}
          {activeSession && (
            <EmeresCard className="mt-4">
              <EmeresCardHeader>
                <EmeresCardTitle className="flex items-center gap-2 text-green-600">
                  <PlayCircle className="h-5 w-5" />
                  Session en cours
                </EmeresCardTitle>
              </EmeresCardHeader>
              <EmeresCardContent>
                <ActiveSessionPanel
                  sessionId={activeSession}
                  sessions={sessions}
                  students={students}
                  onEnd={endSession}
                />
              </EmeresCardContent>
            </EmeresCard>
          )}
        </div>
      </div>

      {/* Modal de création/édition de session */}
      {showSessionForm && (
        <SessionFormModal
          session={editingSession}
          sessionForm={sessionForm}
          setSessionForm={setSessionForm}
          students={students}
          onSubmit={createSession}
          onClose={() => {
            setShowSessionForm(false);
            resetSessionForm();
          }}
          onGenerateLink={generateMeetingLink}
          loading={loading}
        />
      )}
    </div>
  );
};

// Vue semaine
const WeekView = ({ currentDate, sessions, onSessionClick, onStartSession, onEndSession, activeSession }) => {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
  
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day);
  }

  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8h à 21h

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        {/* En-têtes des jours */}
        <div className="grid grid-cols-8 gap-px bg-gray-200 rounded-t-lg overflow-hidden">
          <div className="bg-white p-4"></div>
          {weekDays.map((day, index) => (
            <div key={index} className="bg-white p-4 text-center">
              <div className="font-semibold text-gray-900">
                {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
              </div>
              <div className={`text-2xl font-bold mt-1 ${
                day.toDateString() === new Date().toDateString() ? 'text-teal-600' : 'text-gray-600'
              }`}>
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Grille horaire */}
        <div className="grid grid-cols-8 gap-px bg-gray-200">
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="bg-white p-2 text-right text-sm text-gray-500 border-r">
                {hour}:00
              </div>
              {weekDays.map((day, dayIndex) => {
                const daySessions = sessions.filter(session => {
                  const sessionDate = new Date(session.scheduled_start);
                  return sessionDate.toDateString() === day.toDateString() &&
                         sessionDate.getHours() === hour;
                });

                return (
                  <div key={`${hour}-${dayIndex}`} className="bg-white p-1 min-h-[60px] relative">
                    {daySessions.map((session, sessionIndex) => (
                      <div
                        key={session.id}
                        className={`
                          absolute inset-x-1 p-2 rounded text-xs cursor-pointer
                          ${session.status === 'in_progress' ? 'bg-green-100 border-l-4 border-green-500' :
                            session.status === 'completed' ? 'bg-blue-100 border-l-4 border-blue-500' :
                            'bg-teal-100 border-l-4 border-teal-500'}
                        `}
                        style={{ 
                          top: `${sessionIndex * 25}px`,
                          height: '60px'
                        }}
                        onClick={() => onSessionClick(session)}
                      >
                        <div className="font-medium truncate">{session.title}</div>
                        <div className="text-gray-600 truncate">
                          {new Date(session.scheduled_start).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

// Vue jour
const DayView = ({ currentDate, sessions, onSessionClick, onStartSession, onEndSession, activeSession }) => {
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8h à 21h

  return (
    <div className="space-y-2">
      {hours.map((hour) => {
        const hourSessions = sessions.filter(session => {
          const sessionDate = new Date(session.scheduled_start);
          return sessionDate.getHours() === hour;
        });

        return (
          <div key={hour} className="flex items-start gap-4 p-4 border-b border-gray-100">
            <div className="w-16 text-right text-sm text-gray-500 pt-2">
              {hour}:00
            </div>
            <div className="flex-1 min-h-[60px]">
              {hourSessions.length > 0 ? (
                <div className="space-y-2">
                  {hourSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onStart={() => onStartSession(session.id)}
                      onEnd={() => endSession(session.id)}
                      isActive={activeSession === session.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-gray-300 text-sm pt-4">Libre</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Vue mois
const MonthView = ({ currentDate, sessions, onSessionClick }) => {
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays = [];
  
  // Jours du mois précédent
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = new Date(firstDayOfMonth);
    day.setDate(day.getDate() - i - 1);
    calendarDays.push({ date: day, isCurrentMonth: false });
  }
  
  // Jours du mois actuel
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    calendarDays.push({ date, isCurrentMonth: true });
  }
  
  // Jours du mois suivant pour compléter
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
    calendarDays.push({ date, isCurrentMonth: false });
  }

  const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div>
      {/* En-têtes des jours de la semaine */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-t-lg overflow-hidden">
        {weekdays.map((day) => (
          <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {calendarDays.map((dayInfo, index) => {
          const daySessions = sessions.filter(session => {
            const sessionDate = new Date(session.scheduled_start);
            return sessionDate.toDateString() === dayInfo.date.toDateString();
          });

          return (
            <div
              key={index}
              className={`
                bg-white p-2 min-h-[100px] relative
                ${!dayInfo.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                ${dayInfo.date.toDateString() === new Date().toDateString() ? 'bg-teal-50' : ''}
              `}
            >
              <div className="text-sm font-medium mb-1">
                {dayInfo.date.getDate()}
              </div>
              <div className="space-y-1">
                {daySessions.slice(0, 3).map((session) => (
                  <div
                    key={session.id}
                    className="text-xs p-1 bg-teal-100 text-teal-800 rounded truncate cursor-pointer"
                    onClick={() => onSessionClick(session)}
                  >
                    {session.title}
                  </div>
                ))}
                {daySessions.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{daySessions.length - 3} autres
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Carte de session
const SessionCard = ({ session, students, onStart, onEnd, isActive, compact = false }) => {
  const statusBadge = {
    'scheduled': { variant: 'primary', label: 'Programmé', icon: Clock },
    'in_progress': { variant: 'secondary', label: 'En cours', icon: PlayCircle },
    'completed': { variant: 'success', label: 'Terminé', icon: CheckCircle },
    'cancelled': { variant: 'error', label: 'Annulé', icon: X },
    'no_show': { variant: 'error', label: 'Absent', icon: AlertCircle }
  }[session.status] || { variant: 'secondary', label: session.status, icon: Clock };

  const StatusIcon = statusBadge.icon;
  
  const student = students.find(s => s.relation.student_id === session.student_id);
  const studentName = student ? `${student.student.first_name} ${student.student.last_name}` : 'Étudiant';

  return (
    <div className={`
      p-4 border rounded-lg transition-all
      ${isActive ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}
      ${compact ? 'p-3' : ''}
    `}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className={`font-medium text-gray-900 ${compact ? 'text-sm' : ''}`}>
            {session.title}
          </h4>
          <p className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'}`}>
            avec {studentName}
          </p>
        </div>
        <EmeresBadge variant={statusBadge.variant} size="sm">
          <StatusIcon className="h-3 w-3 mr-1" />
          {statusBadge.label}
        </EmeresBadge>
      </div>

      <div className={`text-gray-600 mb-3 ${compact ? 'text-xs' : 'text-sm'}`}>
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-4 w-4" />
          {new Date(session.scheduled_start).toLocaleString('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })}
          {' - '}
          {new Date(session.scheduled_end).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
        
        {session.meeting_link && (
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <a 
              href={session.meeting_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-teal-700 underline"
            >
              Rejoindre la visio
            </a>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {session.status === 'scheduled' && (
          <EmeresButton
            variant="primary"
            size="sm"
            icon={<PlayCircle />}
            onClick={onStart}
          >
            Démarrer
          </EmeresButton>
        )}
        
        {session.status === 'in_progress' && (
          <EmeresButton
            variant="error"
            size="sm"
            icon={<StopCircle />}
            onClick={onEnd}
          >
            Terminer
          </EmeresButton>
        )}
        
        <EmeresButton
          variant="ghost"
          size="sm"
          icon={<Edit />}
        >
          Modifier
        </EmeresButton>
        
        {session.meeting_link && (
          <EmeresButton
            variant="ghost"
            size="sm"
            icon={<ExternalLink />}
            onClick={() => window.open(session.meeting_link, '_blank')}
          />
        )}
      </div>
    </div>
  );
};

// Panel de session active
const ActiveSessionPanel = ({ sessionId, sessions, students, onEnd }) => {
  const [sessionNotes, setSessionNotes] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const session = sessions.find(s => s.id === sessionId);
  const student = students.find(s => s.relation.student_id === session?.student_id);

  useEffect(() => {
    if (session?.actual_start) {
      setStartTime(new Date(session.actual_start));
    }
  }, [session]);

  useEffect(() => {
    let interval;
    if (startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((new Date() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime]);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!session) return null;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600 mb-1">
          {formatDuration(elapsedTime)}
        </div>
        <div className="text-sm text-gray-600">Temps écoulé</div>
      </div>

      <div className="text-center">
        <div className="font-medium text-gray-900">{session.title}</div>
        <div className="text-sm text-gray-600">
          avec {student ? `${student.student.first_name} ${student.student.last_name}` : 'Étudiant'}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes de session
        </label>
        <textarea
          value={sessionNotes}
          onChange={(e) => setSessionNotes(e.target.value)}
          placeholder="Notez ici les points importants de la session..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      <EmeresButton
        variant="error"
        fullWidth
        icon={<StopCircle />}
        onClick={() => onEnd(sessionId, { notes: sessionNotes })}
      >
        Terminer la session
      </EmeresButton>
    </div>
  );
};

// Modal de formulaire de session
const SessionFormModal = ({ session, sessionForm, setSessionForm, students, onSubmit, onClose, onGenerateLink, loading }) => {
  const isEditing = !!session;

  const handleInputChange = (field, value) => {
    setSessionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Modifier la session' : 'Nouvelle Session'}
            </h2>
            <EmeresButton variant="ghost" size="sm" icon={<X />} onClick={onClose} />
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Étudiant *
              </label>
              <select
                value={sessionForm.student_id}
                onChange={(e) => handleInputChange('student_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionner un étudiant</option>
                {students.map((studentData) => (
                  <option key={studentData.relation.student_id} value={studentData.relation.student_id}>
                    {studentData.student.first_name} {studentData.student.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de session
              </label>
              <select
                value={sessionForm.session_type}
                onChange={(e) => handleInputChange('session_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="one_on_one">Individuelle</option>
                <option value="group">Groupe</option>
                <option value="workshop">Atelier</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la session *
            </label>
            <EmeresInput
              value={sessionForm.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ex: Session de suivi hebdomadaire"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={sessionForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description de la session..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Début *
              </label>
              <input
                type="datetime-local"
                value={sessionForm.scheduled_start}
                onChange={(e) => handleInputChange('scheduled_start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fin *
              </label>
              <input
                type="datetime-local"
                value={sessionForm.scheduled_end}
                onChange={(e) => handleInputChange('scheduled_end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plateforme
                </label>
                <select
                  value={sessionForm.meeting_platform}
                  onChange={(e) => handleInputChange('meeting_platform', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="google_meet">Google Meet</option>
                  <option value="zoom">Zoom</option>
                  <option value="teams">Microsoft Teams</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div className="flex items-end">
                <EmeresButton
                  type="button"
                  variant="outline"
                  icon={<Link />}
                  onClick={onGenerateLink}
                >
                  Générer lien
                </EmeresButton>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lien de réunion
              </label>
              <EmeresInput
                value={sessionForm.meeting_link}
                onChange={(e) => handleInputChange('meeting_link', e.target.value)}
                placeholder="https://meet.google.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lieu (si présentiel)
              </label>
              <EmeresInput
                value={sessionForm.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Adresse ou salle de réunion"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <EmeresButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </EmeresButton>
            <EmeresButton
              type="submit"
              variant="primary"
              icon={<Save />}
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : (isEditing ? 'Modifier' : 'Créer la session')}
            </EmeresButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarPlanning;