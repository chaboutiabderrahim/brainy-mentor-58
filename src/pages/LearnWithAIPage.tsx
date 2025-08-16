/**
 * LearnWithAIPage Component
 * 
 * Purpose: AI-powered learning assistant for personalized education
 * Features:
 * - Subject selection with visual curriculum overview
 * - AI-generated summaries based on successful student data
 * - Interactive chat interface for detailed explanations
 * - Topic-specific learning paths and recommendations
 * - Previous exam analysis integration for targeted learning
 */

import { useState } from "react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calculator, 
  Zap, 
  BookOpen, 
  Send, 
  Lightbulb,
  TrendingUp,
  FileText,
  MessageCircle
} from "lucide-react";

// Mock subjects and topics
const subjects = [
  {
    id: "math",
    name: "Mathematics",
    icon: Calculator,
    color: "bg-blue-500",
    topics: [
      { id: "functions", name: "Functions", difficulty: "Medium", completion: 75 },
      { id: "limits", name: "Limits", difficulty: "Hard", completion: 60 },
      { id: "derivatives", name: "Derivatives", difficulty: "Medium", completion: 85 },
      { id: "integrals", name: "Integrals", difficulty: "Hard", completion: 45 }
    ]
  },
  {
    id: "physics", 
    name: "Physics",
    icon: Zap,
    color: "bg-purple-500",
    topics: [
      { id: "mechanics", name: "Mechanics", difficulty: "Medium", completion: 70 },
      { id: "thermodynamics", name: "Thermodynamics", difficulty: "Hard", completion: 55 },
      { id: "waves", name: "Waves", difficulty: "Medium", completion: 80 },
      { id: "optics", name: "Optics", difficulty: "Easy", completion: 90 }
    ]
  }
];

// Mock AI responses
const mockAIResponses = {
  functions: {
    summary: "Functions are fundamental mathematical relationships between inputs and outputs. Based on analysis of top BAC students, mastering domain/range concepts and graphical transformations are crucial for success. Previous exam patterns show 80% of function questions focus on composite functions and inverse relationships.",
    tips: ["Practice graphing transformations daily", "Master composite function notation", "Understand domain restrictions"]
  },
  limits: {
    summary: "Limits describe function behavior as inputs approach specific values. Successful students emphasize L'Hôpital's rule and epsilon-delta definitions. BAC exams frequently test indeterminate forms and continuity concepts.",
    tips: ["Memorize standard limit forms", "Practice L'Hôpital's rule applications", "Study continuity at boundary points"]
  }
};

export default function LearnWithAIPage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'ai', message: string}>>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setShowChat(true);
    
    // Simulate AI generating initial summary
    const mockResponse = mockAIResponses[topicId as keyof typeof mockAIResponses];
    if (mockResponse) {
      setChatMessages([
        {
          type: 'ai',
          message: `📚 **AI-Generated Summary for ${topicId.charAt(0).toUpperCase() + topicId.slice(1)}**\n\n${mockResponse.summary}\n\n**Study Tips from Top Students:**\n${mockResponse.tips.map(tip => `• ${tip}`).join('\n')}`
        }
      ]);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = newMessage;
    setChatMessages(prev => [...prev, { type: 'user', message: userMessage }]);
    setNewMessage("");

    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        type: 'ai',
        message: `Great question! Let me explain this concept step by step...\n\n1. First, understand the fundamental principle\n2. Apply the theoretical framework\n3. Practice with real BAC exam examples\n\nWould you like me to show you a specific example problem?`
      }]);
    }, 1000);
  };

  if (showChat && selectedTopic) {
    return (
      <div className="min-h-screen bg-gradient-bg pb-20">
        <MobileHeader userName="Ahmed" userScore={2450} />
        
        <div className="p-4 max-w-md mx-auto space-y-4">
          {/* Chat Header */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageCircle size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold capitalize">{selectedTopic}</h2>
                  <p className="text-sm text-muted-foreground">AI Learning Assistant</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowChat(false)}
              >
                Back
              </Button>
            </div>
          </Card>

          {/* Chat Messages */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {chatMessages.map((msg, index) => (
              <Card 
                key={index} 
                className={`p-4 ${msg.type === 'user' ? 'ml-8 bg-primary text-primary-foreground' : 'mr-8'}`}
              >
                <div className="flex items-start space-x-3">
                  {msg.type === 'ai' && (
                    <div className="p-1 bg-primary/10 rounded-full flex-shrink-0">
                      <Lightbulb size={16} className="text-primary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {msg.message}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Chat Input */}
          <Card className="p-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask me anything about this topic..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send size={16} />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedSubject) {
    const subject = subjects.find(s => s.id === selectedSubject)!;
    
    return (
      <div className="min-h-screen bg-gradient-bg pb-20">
        <MobileHeader userName="Ahmed" userScore={2450} />
        
        <div className="p-4 max-w-md mx-auto space-y-6">
          {/* Subject Header */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 ${subject.color} rounded-lg`}>
                  <subject.icon size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{subject.name}</h2>
                  <p className="text-sm text-muted-foreground">Choose a topic to learn</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedSubject(null)}
              >
                Back
              </Button>
            </div>
          </Card>

          {/* Topics List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Available Topics</h3>
            {subject.topics.map((topic) => (
              <Card 
                key={topic.id}
                className="p-4 cursor-pointer hover:shadow-elevated transition-all duration-200"
                onClick={() => handleTopicSelect(topic.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium">{topic.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        topic.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        topic.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {topic.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${topic.completion}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {topic.completion}%
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TrendingUp size={16} className="text-primary" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* AI Learning Features */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <Lightbulb size={18} className="text-primary" />
              <span>AI Learning Features</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <FileText size={16} className="text-accent" />
                <div>
                  <p className="text-sm font-medium">Smart Summaries</p>
                  <p className="text-xs text-muted-foreground">Based on successful student data</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <BookOpen size={16} className="text-accent" />
                <div>
                  <p className="text-sm font-medium">Exam Analysis</p>
                  <p className="text-xs text-muted-foreground">Previous BAC exam patterns</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <MessageCircle size={16} className="text-accent" />
                <div>
                  <p className="text-sm font-medium">Interactive Chat</p>
                  <p className="text-xs text-muted-foreground">Ask questions anytime</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      <MobileHeader userName="Ahmed" userScore={2450} />
      
      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Welcome Section */}
        <Card className="p-6 text-center bg-gradient-primary text-primary-foreground">
          <div className="p-4 bg-white/20 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
            <Lightbulb size={28} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Learn with AI</h1>
          <p className="opacity-90">
            Get personalized explanations and summaries based on successful student strategies
          </p>
        </Card>

        {/* Subject Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Choose Your Subject</h2>
          <div className="grid gap-4">
            {subjects.map((subject) => (
              <Card 
                key={subject.id}
                className="p-6 cursor-pointer hover:shadow-elevated transition-all duration-200 hover:scale-105"
                onClick={() => setSelectedSubject(subject.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-4 ${subject.color} rounded-xl`}>
                    <subject.icon size={28} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {subject.topics.length} topics available
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ 
                            width: `${subject.topics.reduce((acc, topic) => acc + topic.completion, 0) / subject.topics.length}%` 
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(subject.topics.reduce((acc, topic) => acc + topic.completion, 0) / subject.topics.length)}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">How AI Learning Works</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-primary/10 rounded-full mt-1">
                <div className="w-2 h-2 bg-primary rounded-full" />
              </div>
              <div>
                <p className="text-sm font-medium">Smart Analysis</p>
                <p className="text-xs text-muted-foreground">AI analyzes successful student patterns and exam data</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-primary/10 rounded-full mt-1">
                <div className="w-2 h-2 bg-primary rounded-full" />
              </div>
              <div>
                <p className="text-sm font-medium">Personalized Content</p>
                <p className="text-xs text-muted-foreground">Get summaries tailored to your learning progress</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-primary/10 rounded-full mt-1">
                <div className="w-2 h-2 bg-primary rounded-full" />
              </div>
              <div>
                <p className="text-sm font-medium">Interactive Help</p>
                <p className="text-xs text-muted-foreground">Chat with AI for instant explanations</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}