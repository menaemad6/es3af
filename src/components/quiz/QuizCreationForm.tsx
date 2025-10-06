import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Loader2, FileText, Upload, X, Brain, Zap, Target, Clock, CheckCircle } from 'lucide-react';
import { QuizCreationData } from '@/types/quiz';

interface QuizCreationFormProps {
  onSubmit: (data: QuizCreationData) => void;
  isLoading?: boolean;
  error?: string;
  loadingProgress?: {
    stage: 'extracting' | 'analyzing' | 'generating' | 'finalizing';
    message: string;
    progress: number;
  };
}

export function QuizCreationForm({ onSubmit, isLoading = false, error, loadingProgress }: QuizCreationFormProps) {
  const [formData, setFormData] = useState<QuizCreationData>({
    title: '', // Will be auto-generated
    description: '', // Will be auto-generated
    source: '',
    sourceType: 'pdf',
    isNonMedical: false
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof QuizCreationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSwitchChange = (field: keyof QuizCreationData, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSourceTypeChange = (value: string) => {
    const sourceType = value as 'text' | 'pdf';
    setFormData(prev => ({
      ...prev,
      sourceType
    }));
    
    // Clear source text when switching to PDF
    if (sourceType === 'pdf') {
      setFormData(prev => ({
        ...prev,
        source: ''
      }));
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type === 'application/pdf') {
      setPdfFile(file);
      setFormData(prev => ({
        ...prev,
        source: file.name // Use filename as source identifier
      }));
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removePdfFile = () => {
    setPdfFile(null);
    setFormData(prev => ({
      ...prev,
      source: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.sourceType === 'text' && !formData.source.trim()) {
      alert('Please enter source text');
      return;
    }

    if (formData.sourceType === 'pdf' && !pdfFile) {
      alert('Please select a PDF file');
      return;
    }

    onSubmit({
      ...formData,
      pdfFile: pdfFile || undefined
    });
  };

  // Enhanced loading component for quiz generation
  const renderLoadingState = () => {
    if (!isLoading) return null;

    const isPdfProcessing = formData.sourceType === 'pdf' && pdfFile;
    const isNonMedical = formData.isNonMedical || false;
    
    // Show enhanced loading for PDF with progress, or for any processing with progress data
    if ((isPdfProcessing && loadingProgress) || (!isPdfProcessing && loadingProgress)) {
      const { stage, message, progress } = loadingProgress;
      
      const stageIcons = {
        extracting: isPdfProcessing ? <FileText className="h-5 w-5" /> : <Brain className="h-5 w-5" />,
        analyzing: <Brain className="h-5 w-5" />,
        generating: <Zap className="h-5 w-5" />,
        finalizing: <Target className="h-5 w-5" />
      };

      const stageColors = {
        extracting: isPdfProcessing ? 'text-blue-600' : 'text-purple-600',
        analyzing: 'text-purple-600',
        generating: 'text-green-600',
        finalizing: 'text-orange-600'
      };

      const stageDescriptions = {
        extracting: isPdfProcessing 
          ? 'Extracting text from your PDF using advanced OCR technology...'
          : 'Processing your source text and preparing for analysis...',
        analyzing: 'Analyzing content structure and identifying key concepts...',
        generating: isNonMedical 
          ? 'Generating comprehensive questions using AI...'
          : 'Generating medically accurate questions using AI...',
        finalizing: 'Finalizing quiz details and optimizing question quality...'
      };

      const stageTips = {
        extracting: isPdfProcessing 
          ? 'OCR processing ensures accurate text extraction from scanned documents'
          : 'Text analysis helps identify the most important concepts to test',
        analyzing: 'Content analysis ensures questions cover all important topics',
        generating: isNonMedical 
          ? 'AI generates questions tailored to your subject matter'
          : 'AI generates medically accurate questions with proper terminology',
        finalizing: 'Quality checks ensure all questions are clear and relevant'
      };

      return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center space-y-6">
              {/* Animated Icon */}
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <div className={`${stageColors[stage]} animate-pulse`}>
                    {stageIcons[stage]}
                  </div>
                </div>
                <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-primary/20 rounded-full animate-spin">
                  <div className="w-full h-full border-t-2 border-primary rounded-full"></div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{isPdfProcessing ? 'Processing PDF...' : 'Processing Content...'}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Stage Message */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">
                  {isNonMedical ? 'Creating Your Knowledge Quiz' : 'Creating Your Medical Quiz'}
                </h3>
                <p className="text-muted-foreground text-sm font-medium">{message}</p>
                <p className="text-xs text-muted-foreground">{stageDescriptions[stage]}</p>
              </div>

              {/* Processing Steps */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    stage === 'extracting' ? 'bg-primary text-primary-foreground animate-pulse' : 
                    ['analyzing', 'generating', 'finalizing'].includes(stage) ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {['analyzing', 'generating', 'finalizing'].includes(stage) ? <CheckCircle className="h-4 w-4" /> : '1'}
                  </div>
                  <div className="flex-1">
                    <span className={stage === 'extracting' ? 'font-medium text-primary' : ''}>
                      {isPdfProcessing ? 'Extracting text from PDF' : 'Processing source text'}
                    </span>
                    {stage === 'extracting' && (
                      <p className="text-xs text-muted-foreground mt-1">{stageTips.extracting}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    stage === 'analyzing' ? 'bg-primary text-primary-foreground animate-pulse' : 
                    ['generating', 'finalizing'].includes(stage) ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {['generating', 'finalizing'].includes(stage) ? <CheckCircle className="h-4 w-4" /> : '2'}
                  </div>
                  <div className="flex-1">
                    <span className={stage === 'analyzing' ? 'font-medium text-primary' : ''}>Analyzing content structure</span>
                    {stage === 'analyzing' && (
                      <p className="text-xs text-muted-foreground mt-1">{stageTips.analyzing}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    stage === 'generating' ? 'bg-primary text-primary-foreground animate-pulse' : 
                    stage === 'finalizing' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {stage === 'finalizing' ? <CheckCircle className="h-4 w-4" /> : '3'}
                  </div>
                  <div className="flex-1">
                    <span className={stage === 'generating' ? 'font-medium text-primary' : ''}>
                      {isNonMedical ? 'Generating questions with AI' : 'Generating medical questions with AI'}
                    </span>
                    {stage === 'generating' && (
                      <p className="text-xs text-muted-foreground mt-1">{stageTips.generating}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    stage === 'finalizing' ? 'bg-primary text-primary-foreground animate-pulse' : 'bg-muted text-muted-foreground'
                  }`}>
                    4
                  </div>
                  <div className="flex-1">
                    <span className={stage === 'finalizing' ? 'font-medium text-primary' : ''}>Finalizing quiz details</span>
                    {stage === 'finalizing' && (
                      <p className="text-xs text-muted-foreground mt-1">{stageTips.finalizing}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Message */}
              <div className="bg-muted/50 border rounded-lg p-4 text-left">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium mb-1">
                      {stage === 'extracting' ? 'Why does extraction take time?' :
                       stage === 'analyzing' ? 'Why does analysis take time?' :
                       stage === 'generating' ? 'Why does generation take time?' :
                       'Why does finalization take time?'}
                    </p>
                    <p>
                      {stage === 'extracting' && isPdfProcessing 
                        ? "We're using advanced OCR technology to extract text from your PDF with high accuracy. This ensures we capture all the important content for your quiz."
                        : stage === 'extracting' 
                        ? "We're processing your text to identify key concepts and prepare them for analysis. This helps us create more targeted questions."
                        : stage === 'analyzing'
                        ? "We're analyzing your content structure to identify the most important concepts and topics. This ensures comprehensive question coverage."
                        : stage === 'generating'
                        ? isNonMedical 
                          ? "We're generating comprehensive questions tailored to your subject matter using advanced AI. This ensures high-quality, relevant questions."
                          : "We're generating medically accurate questions with proper terminology using advanced AI. This ensures clinical relevance and accuracy."
                        : "We're performing final quality checks and optimizing your quiz for the best learning experience. This ensures all questions are clear and relevant."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Fallback loading state when no progress data is available
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center space-y-6">
            {/* Animated Icon */}
            <div className="relative">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <div className="text-primary animate-pulse">
                  <Brain className="h-8 w-8" />
                </div>
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-primary/20 rounded-full animate-spin">
                <div className="w-full h-full border-t-2 border-primary rounded-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                {isNonMedical ? 'Creating Your Knowledge Quiz' : 'Creating Your Medical Quiz'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {isPdfProcessing 
                  ? "Processing your PDF and generating high-quality questions..." 
                  : "Analyzing your content and generating high-quality questions..."
                }
              </p>
            </div>

            {/* Info Message */}
            <div className="bg-muted/50 border rounded-lg p-4 text-left">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Why does this take time?</p>
                  <p>
                    {isPdfProcessing 
                      ? isNonMedical
                        ? "We're carefully processing your PDF to extract the best content and generate high-quality questions tailored to your subject matter. This ensures you get the most comprehensive and relevant quiz possible."
                        : "We're carefully processing your PDF to extract the best content and generate high-quality, medically accurate questions. This ensures you get the most comprehensive and relevant quiz possible."
                      : isNonMedical
                        ? "We're analyzing your content to understand the key concepts and generate high-quality questions tailored to your subject matter. This ensures you get the most comprehensive and relevant quiz possible."
                        : "We're analyzing your content to understand the key concepts and generate high-quality, medically accurate questions. This ensures you get the most comprehensive and relevant quiz possible."
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Create New Quiz
        </CardTitle>
        <CardDescription>
          Generate quiz questions, title, and description from your source material using AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Source Type Selection */}
          <div className="space-y-3">
            <Label>Source Type *</Label>
            <Tabs
              value={formData.sourceType}
              onValueChange={handleSourceTypeChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pdf">PDF Upload</TabsTrigger>
                <TabsTrigger value="text">Text Input</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pdf" className="space-y-2 mt-4">
                <Label>PDF File *</Label>
                {!pdfFile ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-muted-foreground/25 hover:border-primary/50 bg-muted/30'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className={`h-8 w-8 mx-auto mb-2 ${
                      dragActive ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <p className={`text-sm mb-2 ${
                      dragActive ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      Drag and drop a PDF file here, or click to select
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                    >
                      Select PDF
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium text-foreground">{pdfFile.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removePdfFile}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="text" className="space-y-2 mt-4">
                <Label htmlFor="source">Source Text *</Label>
                <Textarea
                  id="source"
                  placeholder="Paste your source material here..."
                  value={formData.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  disabled={isLoading}
                  rows={8}
                  className="resize-none"
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Non-Medical Switch */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
            <div className="space-y-1">
              <Label htmlFor="non-medical" className="text-sm font-medium">
                Non-Medical Quiz
              </Label>
              <p className="text-xs text-muted-foreground">
                Enable this to create general knowledge quizzes (e.g., computer science, history, etc.)
              </p>
            </div>
            <Switch
              id="non-medical"
              checked={formData.isNonMedical || false}
              onCheckedChange={(checked) => handleSwitchChange('isNonMedical', checked)}
              disabled={isLoading}
            />
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {loadingProgress ? (
                  <>
                    {loadingProgress.stage === 'extracting' && (formData.sourceType === 'pdf' ? 'Extracting PDF...' : 'Processing Text...')}
                    {loadingProgress.stage === 'analyzing' && 'Analyzing Content...'}
                    {loadingProgress.stage === 'generating' && (formData.isNonMedical ? 'Generating Questions...' : 'Generating Medical Questions...')}
                    {loadingProgress.stage === 'finalizing' && 'Finalizing Quiz...'}
                  </>
                ) : (
                  formData.sourceType === 'pdf' ? 'Processing PDF...' : 'Generating Quiz...'
                )}
              </>
            ) : (
              'Generate Quiz'
            )}
          </Button>
        </form>
      </CardContent>
      
      {/* Enhanced Loading Overlay */}
      {renderLoadingState()}
    </Card>
  );
}
