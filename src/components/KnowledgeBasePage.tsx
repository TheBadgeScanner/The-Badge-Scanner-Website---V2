// File: components/KnowledgeBasePage.tsx
import { useState } from "react";
import { Navigation } from "./Navigation";
import { useSelectedScope } from "../contexts/SelectedScopeContext";
import { Copy, Check, ArrowLeft, Edit, Save, X, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { DeveloperLabel } from "./DeveloperLabel";

const initialKnowledgeBaseContent = `# Badge Scanner Application Knowledge Base

## IMPORTANT: User-Specific Responses
When answering user questions, ONLY provide information relevant to their specific user role. Do not share features or functionality that their role cannot access.

## Application Overview
Badge Scanner is a lead capture and management platform for trade shows and business events. The system supports different user roles with role-specific functionality.

## User Roles and Permissions

### User
- Individual booth staff role for lead capture
- Can view and manage only their own captured leads
- Access to personal dashboard with lead statistics and performance metrics
- Can export their leads to Excel
- Has access to lead details including AI-generated summaries, voice memos, and photos
- Sees team ranking compared to other Users

### Admin
- Team management role for company booth managers
- Can view and manage all leads captured by their team
- Access to team dashboard with aggregated statistics
- Can add/remove team members and manage user licenses
- Can set up products of interest for the company booth
- Has filtering and sorting capabilities across all team data
- Can export team leads to Excel

### Event Organiser
- Basic event management role with limited permissions
- Can view leads for specific events they're assigned to
- Access restricted to events specifically assigned by Super Admin
- Dashboard shows event-wide statistics for their assigned events

## Key Features

### Lead Capture and Management
- Digital business card scanning and data extraction
- AI-powered lead qualification with Sales Intel Scores (1-10)
- AI-generated Conversion Scores (1-10) based on interest level
- Voice memo recording and transcription
- Meeting photo capture and organization
- Product interest tracking
- Priority assignment (High, Medium, Low)

### AI-Generated Insights
- **Sales Intel Score**: AI analyzes conversation quality and qualifying information captured (company size, decision-making authority, timeline, budget, etc.)
- **Conversion Score**: AI evaluates prospect interest level based on engagement, questions asked, and enthusiasm
- **Lead Summary**: Automated summary of key conversation points and next steps
- **Lead Type Classification**: Automatically categorizes leads as Hot, Warm, Cold, or Information Only

### Analytics and Reporting
- Real-time lead capture analytics by hour
- Lead type distribution with interactive charts
- Team performance rankings and comparisons (Admin only)
- Export capabilities to Excel for all user types
- Filtering and sorting across multiple dimensions

### Event Management (Event Organisers only)
- Multi-event support with event selection
- Event-specific dashboards and analytics
- Company participation tracking
- Real-time activity monitoring

## Dashboard Functionality

### Personal Dashboard (User)
- Total leads captured with team ranking
- Personal Sales Intel and Conversion scores
- Interactive charts showing lead capture by hour and type
- Clickable chart segments for filtering
- Full lead details dialog with business card view
- Voice memo playback and transcript viewing
- Meeting photo gallery with lightbox

### Team Dashboard (Admin)
- Team-wide lead aggregation and statistics
- User license management (active/total)
- Team member performance tracking
- Product management for booth interests
- Advanced filtering and sorting options
- Team lead assignment and follow-up tracking

### Event Dashboard (Event Organisers)
- Event-wide lead capture statistics
- Company performance rankings
- Leader boards with star performers
- Interactive filtering by company, time, and lead type
- Export capabilities for event data

## Technical Features

### Data Export
- Excel export functionality for all user levels
- Customized export formats based on user permissions
- Real-time data synchronization

### Interactive Charts
- Clickable chart elements for instant filtering
- Responsive design for mobile and desktop
- Real-time data updates

### Search and Filtering
- Multi-dimensional filtering (time, company, lead type, user, etc.)
- Active filter badges with easy removal
- Persistent filter states across navigation

### User Interface
- Help system for new users
- Contextual help tooltips throughout the application
- Responsive design for all screen sizes

## Data Structure

### Lead Information Captured
- Contact details (name, email, phone, job title)
- Company information (name, industry, size, language)
- Conversation notes and AI summary
- Voice memos with timestamps and transcriptions
- Meeting photos with metadata
- Product interests from predefined company list
- Lead qualification scores and priority levels
- Capture timestamp and user attribution

### Company Structure (Admin access)
- Hierarchical organization (Company > Users)
- License management and user activation
- Product catalog management
- Team performance tracking
- Cross-event lead aggregation

### Event Structure (Event Organiser access)
- Event metadata (name, dates, location)
- Participating company management
- Real-time activity tracking
- Cross-company analytics

## Security and Permissions
- Role-based access control (RBAC)
- Data isolation between companies
- Secure lead data handling
- User authentication and session management

## Mobile Experience
- Touch-optimized interface for lead capture
- Voice memo recording capabilities
- Photo capture and upload
- Offline functionality for lead capture
- Sync when connectivity restored

## Integration Capabilities
- Excel export for CRM systems
- Custom integrations possible

## Support and Training
- Built-in help system for all user types
- Contextual help system with tooltips
- Role-specific training materials

This knowledge base covers the core functionality that users might have questions about when using the Badge Scanner application.`;

export function KnowledgeBasePage({ user, onLogout, onNavigate }) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(initialKnowledgeBaseContent);
  const [currentContent, setCurrentContent] = useState(initialKnowledgeBaseContent);

  const fallbackCopyToClipboard = (text) => {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      // Use the older execCommand method as fallback
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  };

  const handleCopyToClipboard = async () => {
    // Reset states
    setCopyError(false);
    setCopySuccess(false);

    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentContent);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        return;
      }
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback method:', err);
    }

    // Fallback to older method
    try {
      const successful = fallbackCopyToClipboard(currentContent);
      if (successful) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        setCopyError(true);
        setTimeout(() => setCopyError(false), 3000);
      }
    } catch (err) {
      console.error('All copy methods failed:', err);
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  const handleSave = () => {
    setCurrentContent(editableContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableContent(currentContent);
    setIsEditing(false);
  };

  const getCopyButtonContent = () => {
    if (copySuccess) {
      return (
        <>
          <Check className="h-4 w-4 text-green-600" />
          <span>Copied!</span>
        </>
      );
    }
    if (copyError) {
      return (
        <>
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span>Copy Failed</span>
        </>
      );
    }
    return (
      <>
        <Copy className="h-4 w-4" />
        <span>Copy to Clipboard</span>
      </>
    );
  };

  const { selectedEvent, selectedOrganiser, selectedCompany, selectedUser } = useSelectedScope();

  return (
    <div className="min-h-screen bg-muted/30">
      <DeveloperLabel pageName="KnowledgeBasePage" />

      <Navigation 
        user={user} 
        currentPage="knowledge-base" 
        onNavigate={onNavigate} 
        onLogout={onLogout} 
      />

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate && onNavigate("super-admin-dashboard", { event: selectedEvent, organiser: selectedOrganiser, company: selectedCompany, user: selectedUser })}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
          </div>
          
          <div>
            <h1 className="text-4xl">Knowledge Base</h1>
            <h2 className="text-muted-foreground text-xl">
              Complete application documentation for AI chatbot training
            </h2>
            <p className="text-sm text-amber-600 mt-2">
              ⚠️ Note: Edits are not persistent across application updates. Copy your changes before updating.
            </p>
          </div>
        </div>

        {/* Content Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Application Knowledge Base</CardTitle>
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <>
                    <Button 
                      variant="outline"
                      onClick={handleCancel}
                      className="flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </Button>
                    <Button 
                      onClick={handleSave}
                      className="flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                    <Button 
                      onClick={handleCopyToClipboard}
                      className="flex items-center space-x-2"
                      disabled={copyError}
                    >
                      {getCopyButtonContent()}
                    </Button>
                  </>
                )}
              </div>
            </div>
            {copyError && (
              <div className="text-sm text-red-600 mt-2">
                Copy failed. Please select the text manually and use Ctrl+C (or Cmd+C on Mac).
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                className="min-h-[600px] font-mono text-sm leading-relaxed resize-none"
                style={{ 
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", monospace'
                }}
              />
            ) : (
              <Textarea
                value={currentContent}
                readOnly
                className={`min-h-[600px] font-mono text-sm leading-relaxed resize-none bg-muted/30 ${copyError ? 'select-all' : ''}`}
                style={{ 
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", monospace'
                }}
              />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
