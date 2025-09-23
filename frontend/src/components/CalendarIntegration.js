import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Settings,
  Plus,
  ExternalLink,
  Google,
  Microsoft,
  RefreshCw,
  User,
  MapPin,
  Video
} from 'lucide-react';
import EmeresButton from './ui/EmeresButton';
import EmeresBadge from './ui/EmeresBadge';
import { useAuth } from '../App';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CalendarIntegration = () => {
  const { user } = useAuth();
  const [calendarStatus, setCalendarStatus] = useState({
    google: false,
    outlook: false
  });
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    attendees: ''
  });

  useEffect(() => {
    loadCalendarStatus();
    loadUpcomingEvents();
  }, []);

  const loadCalendarStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/calendar/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCalendarStatus(data.connected_calendars);
      }
    } catch (error) {
      console.error('Error loading calendar status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUpcomingEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const now = new Date();
      const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      
      const response = await fetch(
        `${API}/calendar/events?start_date=${now.toISOString()}&end_date=${twoWeeksLater.toISOString()}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const connectCalendar = async (provider) => {
    try {
      const token = localStorage.getItem('token');
      const redirectUri = `${window.location.origin}/calendar/callback`;
      
      const response = await fetch(
        `${API}/calendar/auth/${provider}/url?redirect_uri=${encodeURIComponent(redirectUri)}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.authorization_url;
      }
    } catch (error) {
      console.error(`Error connecting ${provider} calendar:`, error);
    }
  };

  const createEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const eventData = {
        ...eventForm,
        attendees: eventForm.attendees.split(',').map(email => email.trim()).filter(email => email)
      };

      const response = await fetch(`${API}/calendar/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });

      if (response.ok) {
        setShowCreateEvent(false);
        setEventForm({
          title: '',
          description: '',
          start_time: '',
          end_time: '',
          location: '',
          attendees: ''
        });
        loadUpcomingEvents();
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Date non définie';
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleSpecificFeatures = () => {
    switch (user?.role) {
      case 'mentor':
        return {
          title: 'Calendrier Mentor',
          description: 'Gérez vos sessions de mentorat et disponibilités',
          features: [
            'Planifier des sessions avec vos étudiants',
            'Bloquer vos créneaux de disponibilité',
            'Recevoir des demandes de rendez-vous'
          ]
        };
      case 'student':
        return {
          title: 'Calendrier Étudiant',
          description: 'Planifiez vos sessions et suivez votre planning',
          features: [
            'Voir les créneaux disponibles des mentors',
            'Programmer des sessions de mentorat',
            'Synchroniser avec votre calendrier personnel'
          ]
        };
      case 'company':
        return {
          title: 'Calendrier Entreprise',
          description: 'Gérez les entretiens et suivis de stagiaires',
          features: [
            'Programmer des entretiens candidats',
            'Suivre les stages en cours',
            'Coordonner avec les équipes RH'
          ]
        };
      default:
        return {
          title: 'Calendrier ÉMÉRÉS',
          description: 'Synchronisez vos calendriers externes',
          features: ['Synchronisation Google Calendar et Outlook']
        };
    }
  };

  const roleFeatures = getRoleSpecificFeatures();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2">Chargement du calendrier...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
          <Calendar className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{roleFeatures.title}</h2>
          <p className="text-gray-600">{roleFeatures.description}</p>
        </div>
      </div>

      {/* Calendar Connections Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Connexions Calendrier
          </CardTitle>
          <CardDescription>
            Connectez vos calendriers externes pour une synchronisation automatique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Google Calendar */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <div className="w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Google Calendar</h4>
                    <p className="text-sm text-gray-600">Gmail, Google Workspace</p>
                  </div>
                </div>
                <EmeresBadge variant={calendarStatus.google ? 'success' : 'secondary'}>
                  {calendarStatus.google ? 'Connecté' : 'Non connecté'}
                </EmeresBadge>
              </div>
              
              {calendarStatus.google ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Synchronisation active</span>
                </div>
              ) : (
                <EmeresButton
                  onClick={() => connectCalendar('google')}
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Se connecter à Google
                </EmeresButton>
              )}
            </div>

            {/* Outlook Calendar */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Outlook Calendar</h4>
                    <p className="text-sm text-gray-600">Microsoft 365, Outlook</p>
                  </div>
                </div>
                <EmeresBadge variant={calendarStatus.outlook ? 'success' : 'secondary'}>
                  {calendarStatus.outlook ? 'Connecté' : 'Non connecté'}
                </EmeresBadge>
              </div>
              
              {calendarStatus.outlook ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Synchronisation active</span>
                </div>
              ) : (
                <EmeresButton
                  onClick={() => connectCalendar('outlook')}
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Se connecter à Outlook
                </EmeresButton>
              )}
            </div>
          </div>

          {/* Connection Alert */}
          {!calendarStatus.google && !calendarStatus.outlook && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Connectez au moins un calendrier pour commencer à synchroniser vos événements.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Role-specific Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Fonctionnalités {user?.role}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {roleFeatures.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {(calendarStatus.google || calendarStatus.outlook) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <EmeresButton
                onClick={() => setShowCreateEvent(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Créer un événement
              </EmeresButton>
              
              <EmeresButton
                variant="outline"
                onClick={loadUpcomingEvents}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Actualiser
              </EmeresButton>

              {user?.role === 'mentor' && (
                <EmeresButton
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Video className="h-4 w-4" />
                  Créer session mentorat
                </EmeresButton>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events */}
      {events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Événements à venir
            </CardTitle>
            <CardDescription>
              Vos prochains événements synchronisés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.slice(0, 5).map((event, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDateTime(event.start_time)}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        )}
                        {event.attendees.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.attendees.length} participant{event.attendees.length > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                    <EmeresBadge variant="outline">
                      {event.provider}
                    </EmeresBadge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Event Modal */}
      {showCreateEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Créer un événement</CardTitle>
              <CardDescription>
                L'événement sera synchronisé avec vos calendriers connectés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre</label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    rows="2"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Début</label>
                    <input
                      type="datetime-local"
                      value={eventForm.start_time}
                      onChange={(e) => setEventForm(prev => ({ ...prev, start_time: e.target.value }))}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Fin</label>
                    <input
                      type="datetime-local"
                      value={eventForm.end_time}
                      onChange={(e) => setEventForm(prev => ({ ...prev, end_time: e.target.value }))}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Lieu</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Bureau, visioconférence..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Participants (emails séparés par des virgules)</label>
                  <input
                    type="text"
                    value={eventForm.attendees}
                    onChange={(e) => setEventForm(prev => ({ ...prev, attendees: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    placeholder="email1@example.com, email2@example.com"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <EmeresButton type="submit" className="flex-1">
                    Créer l'événement
                  </EmeresButton>
                  <EmeresButton
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateEvent(false)}
                  >
                    Annuler
                  </EmeresButton>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CalendarIntegration;