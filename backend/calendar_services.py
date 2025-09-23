"""
ÉMÉRÉS Calendar Integration Services
Google Calendar and Outlook Calendar integration for mentorship system
"""

import os
import asyncio
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass
import uuid
import json

# Google Calendar imports
try:
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import Flow
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
except ImportError:
    print("⚠️ Google Calendar dependencies not installed. Run: pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib")

# Microsoft Graph imports  
try:
    from O365 import Account, FileSystemTokenBackend
    from O365.utils import ImportanceLevel
    from msal import ConfidentialClientApplication
except ImportError:
    print("⚠️ Microsoft Graph dependencies not installed. Run: pip install O365 msal")

@dataclass
class CalendarEvent:
    """Unified calendar event model"""
    id: Optional[str] = None
    title: str = ""
    description: str = ""
    start_time: datetime = None
    end_time: datetime = None
    location: str = ""
    attendees: List[str] = None
    provider: str = ""
    external_id: str = ""
    is_recurring: bool = False
    recurrence_pattern: Optional[Dict] = None
    reminder_minutes: int = 15
    created_at: datetime = None
    updated_at: datetime = None

    def __post_init__(self):
        if self.attendees is None:
            self.attendees = []
        if self.id is None:
            self.id = str(uuid.uuid4())
        if self.created_at is None:
            self.created_at = datetime.now(timezone.utc)
        if self.updated_at is None:
            self.updated_at = datetime.now(timezone.utc)

class GoogleCalendarService:
    """Google Calendar integration service"""
    
    def __init__(self):
        self.SCOPES = [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events'
        ]
        self.service = None
        self.credentials = None
        
    async def authenticate(self, user_id: str, credentials_data: Optional[Dict] = None) -> bool:
        """Authenticate with Google Calendar API"""
        try:
            if credentials_data:
                # Use provided credentials (from database)
                self.credentials = Credentials.from_authorized_user_info(credentials_data)
                
                # Refresh if expired
                if self.credentials.expired and self.credentials.refresh_token:
                    self.credentials.refresh(Request())
                    
            if self.credentials and self.credentials.valid:
                self.service = build('calendar', 'v3', credentials=self.credentials)
                return True
                
            return False
            
        except Exception as e:
            print(f"❌ Google Calendar authentication failed: {e}")
            return False
    
    def get_auth_url(self, redirect_uri: str) -> tuple[str, str]:
        """Get Google OAuth authorization URL"""
        try:
            client_config = {
                "web": {
                    "client_id": os.environ.get('GOOGLE_CLIENT_ID'),
                    "client_secret": os.environ.get('GOOGLE_CLIENT_SECRET'),
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [redirect_uri]
                }
            }
            
            flow = Flow.from_client_config(client_config, scopes=self.SCOPES)
            flow.redirect_uri = redirect_uri
            
            authorization_url, state = flow.authorization_url(
                access_type='offline',
                include_granted_scopes='true'
            )
            
            return authorization_url, state
            
        except Exception as e:
            print(f"❌ Error generating Google auth URL: {e}")
            return None, None
    
    async def exchange_code_for_tokens(self, code: str, redirect_uri: str) -> Optional[Dict]:
        """Exchange authorization code for access tokens"""
        try:
            client_config = {
                "web": {
                    "client_id": os.environ.get('GOOGLE_CLIENT_ID'),
                    "client_secret": os.environ.get('GOOGLE_CLIENT_SECRET'),
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [redirect_uri]
                }
            }
            
            flow = Flow.from_client_config(client_config, scopes=self.SCOPES)
            flow.redirect_uri = redirect_uri
            flow.fetch_token(code=code)
            
            self.credentials = flow.credentials
            self.service = build('calendar', 'v3', credentials=self.credentials)
            
            # Return credentials data for storage
            return {
                'token': self.credentials.token,
                'refresh_token': self.credentials.refresh_token,
                'token_uri': self.credentials.token_uri,
                'client_id': self.credentials.client_id,
                'client_secret': self.credentials.client_secret,
                'scopes': self.credentials.scopes
            }
            
        except Exception as e:
            print(f"❌ Error exchanging Google code for tokens: {e}")
            return None
    
    async def create_event(self, event: CalendarEvent) -> Optional[CalendarEvent]:
        """Create a new calendar event in Google Calendar"""
        if not self.service:
            return None
        
        try:
            google_event = {
                'summary': event.title,
                'description': event.description,
                'location': event.location,
                'start': {
                    'dateTime': event.start_time.isoformat(),
                    'timeZone': 'UTC'
                },
                'end': {
                    'dateTime': event.end_time.isoformat(),
                    'timeZone': 'UTC'
                },
                'attendees': [{'email': email} for email in event.attendees],
                'reminders': {
                    'useDefault': False,
                    'overrides': [
                        {'method': 'email', 'minutes': event.reminder_minutes},
                        {'method': 'popup', 'minutes': event.reminder_minutes}
                    ]
                }
            }
            
            # Add recurrence if specified
            if event.is_recurring and event.recurrence_pattern:
                google_event['recurrence'] = [event.recurrence_pattern.get('rrule', '')]
            
            created_event = self.service.events().insert(
                calendarId='primary',
                body=google_event
            ).execute()
            
            # Update event with Google's ID
            event.external_id = created_event['id']
            event.provider = 'google'
            event.updated_at = datetime.now(timezone.utc)
            
            return event
            
        except HttpError as e:
            print(f"❌ Google Calendar API error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error creating Google Calendar event: {e}")
            return None
    
    async def get_events(self, start_date: datetime, end_date: datetime, max_results: int = 50) -> List[CalendarEvent]:
        """Retrieve calendar events from Google Calendar"""
        if not self.service:
            return []
        
        try:
            events_result = self.service.events().list(
                calendarId='primary',
                timeMin=start_date.isoformat(),
                timeMax=end_date.isoformat(),
                maxResults=max_results,
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            events = []
            for google_event in events_result.get('items', []):
                event = CalendarEvent(
                    external_id=google_event['id'],
                    title=google_event.get('summary', ''),
                    description=google_event.get('description', ''),
                    location=google_event.get('location', ''),
                    provider='google'
                )
                
                # Parse start/end times
                start = google_event.get('start', {})
                end = google_event.get('end', {})
                
                if 'dateTime' in start:
                    event.start_time = datetime.fromisoformat(start['dateTime'].replace('Z', '+00:00'))
                if 'dateTime' in end:
                    event.end_time = datetime.fromisoformat(end['dateTime'].replace('Z', '+00:00'))
                
                # Parse attendees
                attendees = google_event.get('attendees', [])
                event.attendees = [att.get('email', '') for att in attendees]
                
                events.append(event)
            
            return events
            
        except HttpError as e:
            print(f"❌ Google Calendar API error: {e}")
            return []
        except Exception as e:
            print(f"❌ Error retrieving Google Calendar events: {e}")
            return []
    
    async def update_event(self, event: CalendarEvent) -> Optional[CalendarEvent]:
        """Update an existing Google Calendar event"""
        if not self.service or not event.external_id:
            return None
        
        try:
            google_event = {
                'summary': event.title,
                'description': event.description,
                'location': event.location,
                'start': {
                    'dateTime': event.start_time.isoformat(),
                    'timeZone': 'UTC'
                },
                'end': {
                    'dateTime': event.end_time.isoformat(),
                    'timeZone': 'UTC'
                },
                'attendees': [{'email': email} for email in event.attendees]
            }
            
            updated_event = self.service.events().update(
                calendarId='primary',
                eventId=event.external_id,
                body=google_event
            ).execute()
            
            event.updated_at = datetime.now(timezone.utc)
            return event
            
        except HttpError as e:
            print(f"❌ Google Calendar API error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error updating Google Calendar event: {e}")
            return None
    
    async def delete_event(self, event_id: str) -> bool:
        """Delete a Google Calendar event"""
        if not self.service:
            return False
        
        try:
            self.service.events().delete(
                calendarId='primary',
                eventId=event_id
            ).execute()
            return True
            
        except HttpError as e:
            print(f"❌ Google Calendar API error: {e}")
            return False
        except Exception as e:
            print(f"❌ Error deleting Google Calendar event: {e}")
            return False

class OutlookCalendarService:
    """Microsoft Outlook Calendar integration service"""
    
    def __init__(self):
        self.client_id = os.environ.get('MICROSOFT_CLIENT_ID')
        self.client_secret = os.environ.get('MICROSOFT_CLIENT_SECRET')
        self.tenant_id = os.environ.get('MICROSOFT_TENANT_ID', 'common')
        self.account = None
        self.calendar = None
    
    async def authenticate(self, user_id: str, token_data: Optional[Dict] = None) -> bool:
        """Authenticate with Microsoft Graph API"""
        try:
            credentials = (self.client_id, self.client_secret)
            
            # Create account with token backend
            token_backend = FileSystemTokenBackend(token_path=f'tokens/outlook_{user_id}.txt')
            
            self.account = Account(
                credentials,
                token_backend=token_backend,
                scopes=['https://graph.microsoft.com/Calendars.ReadWrite']
            )
            
            if token_data:
                # Use provided token data
                token_backend.save_token(token_data)
            
            if not self.account.is_authenticated:
                return False
            
            self.calendar = self.account.calendar()
            return True
            
        except Exception as e:
            print(f"❌ Outlook Calendar authentication failed: {e}")
            return False
    
    def get_auth_url(self, redirect_uri: str) -> str:
        """Get Microsoft OAuth authorization URL"""
        try:
            app = ConfidentialClientApplication(
                self.client_id,
                authority=f"https://login.microsoftonline.com/{self.tenant_id}",
                client_credential=self.client_secret
            )
            
            auth_url = app.get_authorization_request_url(
                scopes=['https://graph.microsoft.com/Calendars.ReadWrite', 'openid', 'profile', 'email'],
                redirect_uri=redirect_uri
            )
            
            return auth_url
            
        except Exception as e:
            print(f"❌ Error generating Outlook auth URL: {e}")
            return None
    
    async def exchange_code_for_tokens(self, code: str, redirect_uri: str) -> Optional[Dict]:
        """Exchange authorization code for access tokens"""
        try:
            app = ConfidentialClientApplication(
                self.client_id,
                authority=f"https://login.microsoftonline.com/{self.tenant_id}",
                client_credential=self.client_secret
            )
            
            result = app.acquire_token_by_authorization_code(
                code,
                scopes=['https://graph.microsoft.com/Calendars.ReadWrite', 'openid', 'profile', 'email'],
                redirect_uri=redirect_uri
            )
            
            if "error" in result:
                print(f"❌ Microsoft token exchange error: {result['error_description']}")
                return None
            
            return result
            
        except Exception as e:
            print(f"❌ Error exchanging Outlook code for tokens: {e}")
            return None
    
    async def create_event(self, event: CalendarEvent) -> Optional[CalendarEvent]:
        """Create a new calendar event in Outlook"""
        if not self.calendar:
            return None
        
        try:
            new_event = self.calendar.new_event()
            
            new_event.subject = event.title
            new_event.body = event.description
            new_event.location = event.location
            new_event.start = event.start_time
            new_event.end = event.end_time
            
            # Add attendees
            for attendee_email in event.attendees:
                new_event.attendees.add(attendee_email)
            
            # Set reminder
            new_event.reminder_minutes_before_start = event.reminder_minutes
            
            new_event.save()
            
            # Update event with Outlook's ID
            event.external_id = new_event.object_id
            event.provider = 'outlook'
            event.updated_at = datetime.now(timezone.utc)
            
            return event
            
        except Exception as e:
            print(f"❌ Error creating Outlook Calendar event: {e}")
            return None
    
    async def get_events(self, start_date: datetime, end_date: datetime, max_results: int = 50) -> List[CalendarEvent]:
        """Retrieve calendar events from Outlook"""
        if not self.calendar:
            return []
        
        try:
            query = self.calendar.events()
            query = query.filter(f"start/dateTime ge '{start_date.isoformat()}'")
            query = query.filter(f"end/dateTime le '{end_date.isoformat()}'")
            
            outlook_events = list(query.order_by('start/dateTime').top(max_results))
            
            events = []
            for outlook_event in outlook_events:
                event = CalendarEvent(
                    external_id=outlook_event.object_id,
                    title=outlook_event.subject or '',
                    description=outlook_event.body or '',
                    location=outlook_event.location or '',
                    start_time=outlook_event.start,
                    end_time=outlook_event.end,
                    provider='outlook'
                )
                
                # Parse attendees
                event.attendees = [att.address for att in outlook_event.attendees]
                
                events.append(event)
            
            return events
            
        except Exception as e:
            print(f"❌ Error retrieving Outlook Calendar events: {e}")
            return []
    
    async def update_event(self, event: CalendarEvent) -> Optional[CalendarEvent]:
        """Update an existing Outlook Calendar event"""
        if not self.calendar or not event.external_id:
            return None
        
        try:
            outlook_event = self.calendar.get_event(event.external_id)
            
            if outlook_event:
                outlook_event.subject = event.title
                outlook_event.body = event.description
                outlook_event.location = event.location
                outlook_event.start = event.start_time
                outlook_event.end = event.end_time
                
                outlook_event.save()
                event.updated_at = datetime.now(timezone.utc)
                return event
            
            return None
            
        except Exception as e:
            print(f"❌ Error updating Outlook Calendar event: {e}")
            return None
    
    async def delete_event(self, event_id: str) -> bool:
        """Delete an Outlook Calendar event"""
        if not self.calendar:
            return False
        
        try:
            outlook_event = self.calendar.get_event(event_id)
            if outlook_event:
                outlook_event.delete()
                return True
            return False
            
        except Exception as e:
            print(f"❌ Error deleting Outlook Calendar event: {e}")
            return False

class MentorshipCalendarManager:
    """High-level calendar manager for ÉMÉRÉS mentorship system"""
    
    def __init__(self):
        self.google_service = GoogleCalendarService()
        self.outlook_service = OutlookCalendarService()
    
    async def initialize_user_calendars(self, user_id: str, google_creds: Optional[Dict] = None, outlook_creds: Optional[Dict] = None):
        """Initialize calendar services for a user"""
        results = {}
        
        if google_creds:
            google_auth = await self.google_service.authenticate(user_id, google_creds)
            results['google'] = google_auth
        
        if outlook_creds:
            outlook_auth = await self.outlook_service.authenticate(user_id, outlook_creds)
            results['outlook'] = outlook_auth
        
        return results
    
    async def create_mentorship_session(self, mentor_id: str, student_id: str, session_data: Dict) -> Optional[str]:
        """Create a mentorship session in connected calendars"""
        try:
            # Create calendar event
            event = CalendarEvent(
                title=f"Session Mentorat - {session_data.get('title', 'Session')}",
                description=f"Session de mentorat entre mentor et étudiant.\n\nObjectifs: {session_data.get('objectives', 'À définir')}",
                start_time=datetime.fromisoformat(session_data['start_time']),
                end_time=datetime.fromisoformat(session_data['end_time']),
                location=session_data.get('location', 'Visioconférence'),
                attendees=[session_data.get('mentor_email', ''), session_data.get('student_email', '')],
                reminder_minutes=30
            )
            
            # Try to create in both calendars
            results = {}
            
            # Create in mentor's calendar
            if self.google_service.service:
                google_event = await self.google_service.create_event(event)
                if google_event:
                    results['google'] = google_event.external_id
            
            if self.outlook_service.calendar:
                outlook_event = await self.outlook_service.create_event(event)
                if outlook_event:
                    results['outlook'] = outlook_event.external_id
            
            return event.id if results else None
            
        except Exception as e:
            print(f"❌ Error creating mentorship session: {e}")
            return None
    
    async def get_availability(self, user_id: str, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        """Get user's calendar availability for scheduling"""
        try:
            all_events = []
            
            # Get events from Google Calendar
            if self.google_service.service:
                google_events = await self.google_service.get_events(start_date, end_date)
                all_events.extend(google_events)
            
            # Get events from Outlook Calendar
            if self.outlook_service.calendar:
                outlook_events = await self.outlook_service.get_events(start_date, end_date)
                all_events.extend(outlook_events)
            
            # Calculate free/busy slots
            busy_slots = []
            for event in all_events:
                if event.start_time and event.end_time:
                    busy_slots.append({
                        'start': event.start_time.isoformat(),
                        'end': event.end_time.isoformat(),
                        'title': event.title
                    })
            
            return {
                'user_id': user_id,
                'period': {
                    'start': start_date.isoformat(),
                    'end': end_date.isoformat()
                },
                'busy_slots': busy_slots,
                'total_events': len(all_events)
            }
            
        except Exception as e:
            print(f"❌ Error getting availability: {e}")
            return {'busy_slots': [], 'total_events': 0}
    
    async def suggest_meeting_times(self, mentor_id: str, student_id: str, duration_minutes: int = 60, 
                                 preferred_days: List[str] = None, preferred_hours: tuple = (9, 18)) -> List[Dict]:
        """Suggest optimal meeting times based on both participants' availability"""
        try:
            # Get next 2 weeks
            start_date = datetime.now(timezone.utc)
            end_date = start_date + timedelta(days=14)
            
            # Get availability for both participants
            mentor_availability = await self.get_availability(mentor_id, start_date, end_date)
            student_availability = await self.get_availability(student_id, start_date, end_date)
            
            # Find free slots (simplified algorithm)
            suggestions = []
            current_date = start_date.replace(hour=preferred_hours[0], minute=0, second=0, microsecond=0)
            
            while current_date < end_date and len(suggestions) < 10:
                # Skip weekends if not in preferred days
                if preferred_days and current_date.strftime('%A').lower() not in [day.lower() for day in preferred_days]:
                    current_date += timedelta(days=1)
                    continue
                
                # Check if slot is free for both participants
                slot_end = current_date + timedelta(minutes=duration_minutes)
                
                if self._is_slot_free(current_date, slot_end, mentor_availability['busy_slots']) and \
                   self._is_slot_free(current_date, slot_end, student_availability['busy_slots']):
                    
                    suggestions.append({
                        'start_time': current_date.isoformat(),
                        'end_time': slot_end.isoformat(),
                        'duration_minutes': duration_minutes,
                        'confidence': 'high'  # Could implement more sophisticated scoring
                    })
                
                # Move to next hour
                current_date += timedelta(hours=1)
                
                # Reset to next day at preferred start hour if past preferred end hour
                if current_date.hour >= preferred_hours[1]:
                    current_date = current_date.replace(hour=preferred_hours[0], minute=0) + timedelta(days=1)
            
            return suggestions
            
        except Exception as e:
            print(f"❌ Error suggesting meeting times: {e}")
            return []
    
    def _is_slot_free(self, start_time: datetime, end_time: datetime, busy_slots: List[Dict]) -> bool:
        """Check if a time slot is free from conflicts"""
        for busy_slot in busy_slots:
            busy_start = datetime.fromisoformat(busy_slot['start'].replace('Z', '+00:00'))
            busy_end = datetime.fromisoformat(busy_slot['end'].replace('Z', '+00:00'))
            
            # Check for overlap
            if (start_time < busy_end and end_time > busy_start):
                return False
        
        return True