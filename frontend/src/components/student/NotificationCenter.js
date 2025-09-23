import React, { useState, useEffect } from 'react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import { 
  Bell,
  BellOff,
  Check,
  CheckCheck,
  X,
  MessageSquare,
  User,
  Clock,
  Filter,
  Archive,
  Trash2,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Heart,
  Award,
  BookOpen,
  Calendar,
  Target,
  Users,
  Briefcase
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, responses, messages
  const [markingAsRead, setMarkingAsRead] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, filter]);

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/student/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = [...notifications];

    switch (filter) {
      case 'unread':
        filtered = filtered.filter(notif => !notif.is_read);
        break;
      case 'responses':
        filtered = filtered.filter(notif => 
          notif.type === 'ad_response' || 
          notif.type === 'response_accepted' || 
          notif.type === 'response_rejected'
        );
        break;
      case 'messages':
        filtered = filtered.filter(notif => notif.type === 'new_message');
        break;
      default:
        // Show all
        break;
    }

    setFilteredNotifications(filtered);
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const markAllAsRead = async () => {
    setMarkingAsRead(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
    } catch (error) {
      console.error('Erreur lors du marquage global:', error);
    } finally {
      setMarkingAsRead(false);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Update local state
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ad_response':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'response_accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'response_rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'new_message':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'session_reminder':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      case 'objective_completed':
        return <Target className="h-5 w-5 text-green-500" />;
      case 'mentor_evaluation':
        return <Award className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'ad_response':
        return 'border-l-blue-500 bg-blue-50';
      case 'response_accepted':
        return 'border-l-green-500 bg-green-50';
      case 'response_rejected':
        return 'border-l-red-500 bg-red-50';
      case 'new_message':
        return 'border-l-purple-500 bg-purple-50';
      case 'session_reminder':
        return 'border-l-orange-500 bg-orange-50';
      case 'objective_completed':
        return 'border-l-green-500 bg-green-50';
      case 'mentor_evaluation':
        return 'border-l-yellow-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5;

    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)}h`;
    } else if (diffInHours < 168) { // 7 days
      return `Il y a ${Math.floor(diffInHours / 24)} jour${Math.floor(diffInHours / 24) > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Centre de Notifications
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Restez informé de toutes vos interactions de mentorat
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">
            {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
          </div>
          {unreadCount > 0 && (
            <EmeresButton
              variant="outline"
              size="sm"
              icon={<CheckCheck />}
              onClick={markAllAsRead}
              disabled={markingAsRead}
            >
              {markingAsRead ? 'Marquage...' : 'Tout marquer comme lu'}
            </EmeresButton>
          )}
        </div>
      </div>

      {/* Filters */}
      <EmeresCard>
        <EmeresCardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <EmeresButton
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Toutes ({notifications.length})
            </EmeresButton>
            <EmeresButton
              variant={filter === 'unread' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Non lues ({unreadCount})
            </EmeresButton>
            <EmeresButton
              variant={filter === 'responses' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('responses')}
            >
              Réponses mentors
            </EmeresButton>
            <EmeresButton
              variant={filter === 'messages' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('messages')}
            >
              Messages
            </EmeresButton>
          </div>
        </EmeresCardContent>
      </EmeresCard>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`border-l-4 p-4 rounded-lg transition-all duration-200 ${
              !notification.is_read 
                ? `${getNotificationColor(notification.type)} border-opacity-100`
                : 'bg-white border-l-gray-200 border-opacity-50'
            } hover:shadow-md`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {/* Icon */}
                <div className={`p-2 rounded-full ${
                  !notification.is_read ? 'bg-white shadow-sm' : 'bg-gray-100'
                }`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h3 className={`font-medium mb-1 ${
                    !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {notification.title}
                  </h3>
                  
                  {/* Message */}
                  <p className={`text-sm mb-2 ${
                    !notification.is_read ? 'text-gray-700' : 'text-gray-600'
                  }`}>
                    {notification.message}
                  </p>
                  
                  {/* Data preview for certain types */}
                  {notification.data && notification.type === 'ad_response' && (
                    <div className="text-xs text-gray-600 bg-white/50 p-2 rounded border">
                      <div className="font-medium">Mentor: {notification.data.mentor_name}</div>
                      {notification.data.mentor_specializations && (
                        <div className="mt-1">
                          Spécialisations: {notification.data.mentor_specializations.slice(0, 2).join(', ')}
                          {notification.data.mentor_specializations.length > 2 && '...'}
                        </div>
                      )}
                      {notification.data.matching_score && (
                        <div className="mt-1">
                          Compatibilité: {notification.data.matching_score}%
                        </div>
                      )}
                    </div>
                  )}
                  
                  {notification.data && notification.type === 'new_message' && (
                    <div className="text-xs text-gray-600 bg-white/50 p-2 rounded border">
                      <div className="font-medium">De: {notification.data.sender_name}</div>
                      <div className="mt-1 italic">
                        "{notification.data.message_preview}"
                      </div>
                    </div>
                  )}
                  
                  {/* Time */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(notification.created_at)}</span>
                    {!notification.is_read && (
                      <EmeresBadge variant="primary" size="sm">
                        Nouveau
                      </EmeresBadge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                {!notification.is_read && (
                  <EmeresButton
                    variant="ghost"
                    size="sm"
                    icon={<Check />}
                    onClick={() => markAsRead(notification.id)}
                    title="Marquer comme lu"
                  />
                )}
                
                <EmeresButton
                  variant="ghost"
                  size="sm"
                  icon={<X />}
                  onClick={() => deleteNotification(notification.id)}
                  title="Supprimer"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                />
              </div>
            </div>
            
            {/* Action buttons for specific notification types */}
            {notification.type === 'ad_response' && !notification.is_read && (
              <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                <EmeresButton
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    // Navigate to response center
                    window.location.hash = '#responses';
                  }}
                >
                  Voir la réponse
                </EmeresButton>
              </div>
            )}
            
            {notification.type === 'new_message' && (
              <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                <EmeresButton
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    // Navigate to messaging center
                    window.location.hash = '#messages';
                  }}
                >
                  Répondre
                </EmeresButton>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <div className="relative">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {filter === 'unread' && unreadCount === 0 && (
              <CheckCircle className="h-6 w-6 text-green-500 absolute -top-1 -right-1" />
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' && notifications.length === 0 && 'Aucune notification'}
            {filter === 'all' && notifications.length > 0 && 'Aucune notification trouvée'}
            {filter === 'unread' && 'Aucune notification non lue'}
            {filter === 'responses' && 'Aucune réponse de mentor'}
            {filter === 'messages' && 'Aucun nouveau message'}
          </h3>
          <p className="text-gray-600">
            {filter === 'all' && notifications.length === 0 && 
              'Vous recevrez ici toutes vos notifications de mentorat.'
            }
            {filter === 'unread' && 
              'Parfait ! Vous êtes à jour avec toutes vos notifications.'
            }
            {filter === 'responses' && 
              'Les réponses des mentors à vos annonces apparaîtront ici.'
            }
            {filter === 'messages' && 
              'Les nouveaux messages de vos conversations apparaîtront ici.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;