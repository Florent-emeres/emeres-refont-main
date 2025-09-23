/**
 * Menu d'actions pour les threads
 * Archive, épingle, marque lu/non lu, paramètres, export, etc.
 */

import React, { useState } from 'react';
import { 
  MoreVertical,
  Archive,
  Pin,
  PinOff,
  CheckCircle,
  Circle,
  Download,
  Settings,
  UserPlus,
  UserMinus,
  Trash2,
  Flag,
  Copy,
  Bell,
  BellOff
} from 'lucide-react';
import EmeresButton from '../ui/EmeresButton';
import { Thread } from '../../types/messaging';
import { cn } from '../../lib/utils';

const ThreadActionsMenu = ({
  thread,
  onArchive,
  onPin,
  onMarkAsRead,
  onMarkAsUnread,
  onExport,
  onAddParticipant,
  onRemoveParticipant,
  onDelete,
  onMute,
  onReport,
  onSettings,
  userRole = 'student',
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState({});

  const handleAction = async (actionName, actionFunction, ...args) => {
    if (!actionFunction) return;
    
    setLoading(prev => ({ ...prev, [actionName]: true }));
    try {
      await actionFunction(...args);
      setIsOpen(false);
    } catch (error) {
      console.error(`Erreur ${actionName}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [actionName]: false }));
    }
  };

  // Permissions selon le rôle et le contexte
  const canPerformAction = (action) => {
    if (!thread) return false;

    const userPermissions = thread.participants?.find(p => p.userId === 'current-user')?.permissions || [];
    
    const permissionMap = {
      archive: userPermissions.includes('write'),
      pin: userPermissions.includes('write'),
      export: userPermissions.includes('export') || userRole === 'company' || userRole === 'school',
      addParticipant: userPermissions.includes('admin') || userRole === 'school',
      removeParticipant: userPermissions.includes('admin') || userRole === 'school',
      delete: userPermissions.includes('admin') && userRole !== 'student',
      settings: userPermissions.includes('admin')
    };

    return permissionMap[action] !== false;
  };

  if (!thread) return null;

  const menuItems = [
    // Lecture/Non-lu
    {
      id: 'markRead',
      label: thread.unreadCount > 0 ? 'Marquer comme lu' : 'Marquer comme non lu',
      icon: thread.unreadCount > 0 ? CheckCircle : Circle,
      action: () => handleAction(
        'markRead', 
        thread.unreadCount > 0 ? onMarkAsRead : onMarkAsUnread, 
        thread.id
      ),
      show: true
    },
    
    // Épingler/Désépingler
    {
      id: 'pin',
      label: thread.pinned ? 'Désépingler' : 'Épingler',
      icon: thread.pinned ? PinOff : Pin,
      action: () => handleAction('pin', onPin, thread.id, !thread.pinned),
      show: canPerformAction('pin')
    },

    // Notifications
    {
      id: 'mute',
      label: thread.muted ? 'Réactiver les notifications' : 'Désactiver les notifications',
      icon: thread.muted ? Bell : BellOff,
      action: () => handleAction('mute', onMute, thread.id, !thread.muted),
      show: true
    },

    { type: 'separator', show: true },

    // Ajouter participant
    {
      id: 'addParticipant',
      label: 'Ajouter un participant',
      icon: UserPlus,
      action: () => handleAction('addParticipant', onAddParticipant, thread.id),
      show: canPerformAction('addParticipant')
    },

    // Paramètres
    {
      id: 'settings',
      label: 'Paramètres de la conversation',
      icon: Settings,
      action: () => handleAction('settings', onSettings, thread.id),
      show: canPerformAction('settings')
    },

    { type: 'separator', show: true },

    // Export
    {
      id: 'export',
      label: 'Exporter la conversation',
      icon: Download,
      action: () => handleAction('export', onExport, thread.id),
      show: canPerformAction('export')
    },

    // Copier lien
    {
      id: 'copyLink',
      label: 'Copier le lien',
      icon: Copy,
      action: () => {
        navigator.clipboard.writeText(`${window.location.origin}/messagerie/${thread.id}`);
        setIsOpen(false);
      },
      show: true
    },

    { type: 'separator', show: true },

    // Archiver
    {
      id: 'archive',
      label: thread.status === 'archived' ? 'Désarchiver' : 'Archiver',
      icon: Archive,
      action: () => handleAction('archive', onArchive, thread.id),
      show: canPerformAction('archive'),
      className: 'text-orange-600 hover:bg-orange-50'
    },

    // Signaler
    {
      id: 'report',
      label: 'Signaler la conversation',
      icon: Flag,
      action: () => handleAction('report', onReport, thread.id),
      show: thread.context !== 'support',
      className: 'text-red-600 hover:bg-red-50'
    },

    // Supprimer (seulement pour certains rôles)
    {
      id: 'delete', 
      label: 'Supprimer la conversation',
      icon: Trash2,
      action: () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible.')) {
          handleAction('delete', onDelete, thread.id);
        }
      },
      show: canPerformAction('delete'),
      className: 'text-red-600 hover:bg-red-50'
    }
  ];

  const visibleItems = menuItems.filter(item => item.show);

  return (
    <div className={cn("relative", className)}>
      <EmeresButton
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0"
      >
        <MoreVertical className="h-4 w-4" />
      </EmeresButton>

      {isOpen && (
        <>
          {/* Overlay pour fermer */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Menu dropdown */}
          <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
            {visibleItems.map((item, index) => {
              if (item.type === 'separator') {
                return <div key={index} className="border-t border-gray-100 my-1" />;
              }

              const Icon = item.icon;
              const isLoading = loading[item.id];

              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  disabled={isLoading}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors",
                    item.className,
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {isLoading && (
                    <div className="animate-spin rounded-full h-3 w-3 border border-gray-300 border-t-gray-600" />
                  )}
                </button>
              );
            })}

            {/* Informations du thread en bas */}
            <div className="border-t border-gray-100 mt-1 px-4 py-2 text-xs text-gray-500">
              <div>ID: {thread.id.slice(0, 8)}...</div>
              <div>Créé: {new Date(thread.createdAt).toLocaleDateString()}</div>
              <div className="capitalize">Status: {thread.status}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThreadActionsMenu;