import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, FileText, Upload, X } from 'lucide-react';
import { QuizCreationData } from '@/types/quiz';

interface QuizCreationFormProps {
  onSubmit: (data: QuizCreationData) => void;
  isLoading?: boolean;
  error?: string;
}

export function QuizCreationForm({ onSubmit, isLoading = false, error }: QuizCreationFormProps) {
  const [formData, setFormData] = useState<QuizCreationData>({
    title: '', // Will be auto-generated
    description: '', // Will be auto-generated
    source: '',
    sourceType: 'pdf'
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
                Generating Quiz...
              </>
            ) : (
              'Generate Quiz'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
