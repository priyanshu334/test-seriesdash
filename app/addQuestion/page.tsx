"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, Plus, Trash2, Edit2, Save, Copy, FileText, Download, Image as ImageIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// Define types
interface MCQOption {
  id: string;
  text: string;
}

interface MCQQuestion {
  id: string;
  text: string;
  options: MCQOption[];
  correctOptionId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
  tags: string[];
  imageUrl?: string;
}

const AddQuestionPage = () => {
  // Form state
  const [question, setQuestion] = useState<string>('');
  const [options, setOptions] = useState<MCQOption[]>([{ id: '1', text: '' }]);
  const [correctOptionId, setCorrectOptionId] = useState<string>('1');
  const [explanation, setExplanation] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [tag, setTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [questionsList, setQuestionsList] = useState<MCQQuestion[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredQuestions, setFilteredQuestions] = useState<MCQQuestion[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate unique IDs
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Filter questions based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredQuestions(questionsList);
      return;
    }
    
    const filtered = questionsList.filter(q => 
      q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      q.options.some(opt => opt.text.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredQuestions(filtered);
  }, [searchTerm, questionsList]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      setFormError('Please upload an image file (JPEG, PNG, etc.)');
      setTimeout(() => setFormError(null), 3000);
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setFormError('Image size should be less than 2MB');
      setTimeout(() => setFormError(null), 3000);
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle option text change
  const handleOptionChange = (id: string, value: string) => {
    setOptions(options.map(opt => 
      opt.id === id ? { ...opt, text: value } : opt
    ));
  };

  // Add new option
  const addOption = () => {
    if (options.length >= 8) {
      setFormError("Maximum 8 options allowed per question.");
      setTimeout(() => setFormError(null), 3000);
      return;
    }
    const newOption = { id: generateId(), text: '' };
    setOptions([...options, newOption]);
  };

  // Remove an option
  const removeOption = (id: string) => {
    if (options.length <= 1) {
      setFormError("Question must have at least one option.");
      setTimeout(() => setFormError(null), 3000);
      return;
    }
    
    const newOptions = options.filter(opt => opt.id !== id);
    setOptions(newOptions);
    
    // If we're removing the correct option, set the first option as correct
    if (id === correctOptionId && newOptions.length > 0) {
      setCorrectOptionId(newOptions[0].id);
    }
  };

  // Add tag
  const addTag = () => {
    if (!tag.trim()) return;
    if (tags.includes(tag.trim())) {
      setFormError("Tag already exists.");
      setTimeout(() => setFormError(null), 3000);
      return;
    }
    if (tags.length >= 5) {
      setFormError("Maximum 5 tags allowed per question.");
      setTimeout(() => setFormError(null), 3000);
      return;
    }
    setTags([...tags, tag.trim()]);
    setTag('');
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Reset form
  const resetForm = () => {
    setQuestion('');
    setOptions([{ id: '1', text: '' }]);
    setCorrectOptionId('1');
    setExplanation('');
    setDifficulty('medium');
    setTags([]);
    setTag('');
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!question.trim()) {
      setFormError("Question text is required.");
      return false;
    }
    
    if (options.some(opt => !opt.text.trim())) {
      setFormError("All options must have text.");
      return false;
    }
    
    // Check for duplicate options
    const optionTexts = options.map(opt => opt.text.trim());
    if (new Set(optionTexts).size !== optionTexts.length) {
      setFormError("Duplicate options are not allowed.");
      return false;
    }
    
    return true;
  };

  // Show success message temporarily
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Submit new question or update existing one
  const handleSubmit = () => {
    setFormError(null);
    
    if (!validateForm()) {
      setTimeout(() => setFormError(null), 3000);
      return;
    }
    
    const questionData: MCQQuestion = {
      id: editingId || generateId(),
      text: question,
      options: [...options],
      correctOptionId,
      difficulty,
      explanation: explanation.trim() || undefined,
      tags: [...tags],
      imageUrl: imagePreview || undefined
    };
    
    if (editingId) {
      // Update existing question
      setQuestionsList(questionsList.map(q => 
        q.id === editingId ? questionData : q
      ));
      showSuccess("Question updated successfully!");
    } else {
      // Add new question
      setQuestionsList([...questionsList, questionData]);
      showSuccess("Question added successfully!");
    }
    
    resetForm();
    setCurrentTab('view');
  };

  // Load question data for editing
  const editQuestion = (id: string) => {
    const questionToEdit = questionsList.find(q => q.id === id);
    if (!questionToEdit) return;
    
    setQuestion(questionToEdit.text);
    setOptions([...questionToEdit.options]);
    setCorrectOptionId(questionToEdit.correctOptionId);
    setExplanation(questionToEdit.explanation || '');
    setDifficulty(questionToEdit.difficulty);
    setTags([...questionToEdit.tags]);
    setEditingId(id);
    setImagePreview(questionToEdit.imageUrl || null);
    setCurrentTab('create');
  };

  // Delete question
  const deleteQuestion = (id: string) => {
    setQuestionsList(questionsList.filter(q => q.id !== id));
    showSuccess("Question deleted successfully!");
  };

  // Duplicate question
  const duplicateQuestion = (id: string) => {
    const questionToDuplicate = questionsList.find(q => q.id === id);
    if (!questionToDuplicate) return;
    
    const duplicatedQuestion: MCQQuestion = {
      ...questionToDuplicate,
      id: generateId(),
      text: `${questionToDuplicate.text} (Copy)`
    };
    
    setQuestionsList([...questionsList, duplicatedQuestion]);
    showSuccess("Question duplicated successfully!");
  };

  // Export questions to JSON
  const exportQuestions = () => {
    const dataStr = JSON.stringify(questionsList, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `mcq_questions_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Tabs defaultValue="create" value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">MCQ Question Manager</h1>
          <TabsList>
            <TabsTrigger value="create" className="flex items-center gap-1">
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </TabsTrigger>
            <TabsTrigger value="view" className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>View All ({questionsList.length})</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Create/Edit Question Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Question' : 'Create New MCQ Question'}</CardTitle>
              <CardDescription>
                {editingId ? 'Update the existing question' : 'Fill in the details to create a multiple choice question'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Success message */}
              {successMessage && (
                <Alert className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}
              
              {/* Error message */}
              {formError && (
                <Alert className="bg-red-50 text-red-700 border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              
              {/* Question Text */}
              <div className="space-y-2">
                <Label htmlFor="question" className="text-sm font-medium">
                  Question Text <span className="text-red-500">*</span>
                </Label>
                <Textarea 
                  id="question"
                  placeholder="Enter your question here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-20"
                />
              </div>
              
              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Question Image (Optional)
                </Label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                  </Button>
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={removeImage}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove Image
                    </Button>
                  )}
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <div className="relative max-w-xs">
                      <img
                        src={imagePreview}
                        alt="Question preview"
                        className="rounded-md border border-gray-200 max-h-40 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Difficulty Level */}
              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-sm font-medium">
                  Difficulty Level
                </Label>
                <Select value={difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}>
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Answer Options <span className="text-red-500">*</span>
                  </Label>
                  <Button 
                    onClick={addOption} 
                    size="sm" 
                    variant="outline" 
                    className="h-8 px-2 flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add Option
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroup 
                        value={correctOptionId} 
                        onValueChange={setCorrectOptionId}
                        className="flex items-center"
                      >
                        <div className="flex items-center h-10 space-x-2">
                          <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                          <Label htmlFor={`option-${option.id}`} className="text-xs text-green-600">
                            Correct
                          </Label>
                        </div>
                      </RadioGroup>
                      
                      <div className="flex-1">
                        <Input
                          placeholder="Enter option text"
                          value={option.text}
                          onChange={(e) => handleOptionChange(option.id, e.target.value)}
                        />
                      </div>
                      
                      <Button 
                        onClick={() => removeOption(option.id)} 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Explanation */}
              <div className="space-y-2">
                <Label htmlFor="explanation" className="text-sm font-medium">
                  Explanation (Optional)
                </Label>
                <Textarea 
                  id="explanation"
                  placeholder="Explain why the correct answer is right..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="min-h-16"
                />
              </div>
              
              {/* Tags */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Tags (Optional)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((t) => (
                    <Badge key={t} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                      {t}
                      <Button 
                        onClick={() => removeTag(t)} 
                        size="icon" 
                        variant="ghost" 
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} size="sm" className="w-20">Add</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6">
              <Button 
                variant="outline" 
                onClick={resetForm}
              >
                {editingId ? 'Cancel' : 'Reset'}
              </Button>
              <Button 
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {editingId ? 'Update Question' : 'Save Question'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* View Questions Tab */}
        <TabsContent value="view" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>All Questions ({questionsList.length})</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="Search questions and tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                  />
                  {questionsList.length > 0 && (
                    <Button
                      onClick={exportQuestions}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Export JSON
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredQuestions.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    {questionsList.length === 0 
                      ? "No questions added yet. Create your first question to get started!" 
                      : "No questions match your search."}
                  </p>
                </div>
              )}
              
              <ScrollArea className="max-h-96">
                <div className="space-y-4">
                  {filteredQuestions.map((q, index) => (
                    <Card key={q.id} className="border border-gray-200">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                            <Badge variant={
                              q.difficulty === 'easy' ? 'outline' : 
                              q.difficulty === 'medium' ? 'secondary' : 'default'
                            } className={
                              q.difficulty === 'easy' ? 'text-green-600 border-green-200' : 
                              q.difficulty === 'medium' ? 'text-orange-600 bg-orange-100' : 
                              'bg-red-500'
                            }>
                              {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              onClick={() => editQuestion(q.id)} 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              onClick={() => duplicateQuestion(q.id)} 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button 
                              onClick={() => deleteQuestion(q.id)} 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardTitle className="text-base font-medium">
                          {q.text}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {/* Display question image if exists */}
                        {q.imageUrl && (
                          <div className="mb-3">
                            <img
                              src={q.imageUrl}
                              alt="Question illustration"
                              className="rounded-md border border-gray-200 max-h-40 object-contain"
                            />
                          </div>
                        )}
                        
                        <ul className="space-y-1 mt-2">
                          {q.options.map((opt) => (
                            <li key={opt.id} className={`flex items-center space-x-2 p-2 rounded ${
                              opt.id === q.correctOptionId 
                                ? 'bg-green-50 text-green-800 border border-green-200' 
                                : ''
                            }`}>
                              {opt.id === q.correctOptionId && (
                                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                              )}
                              <span className={opt.id === q.correctOptionId ? 'font-medium' : ''}>
                                {opt.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                        
                        {q.explanation && (
                          <>
                            <Separator className="my-3" />
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-700">Explanation:</p>
                              <p className="text-sm text-gray-600 mt-1">{q.explanation}</p>
                            </div>
                          </>
                        )}
                        
                        {q.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {q.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddQuestionPage;