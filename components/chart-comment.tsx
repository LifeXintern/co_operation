
"use client";

import { useState, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Edit3, Save, X, MessageSquare, Trash2 } from 'lucide-react';
import { useChartComments } from '@/hooks/use-chart-comments';

interface ChartCommentProps {
  chartId: string;
  chartTitle: string;
  children?: ReactNode;
}

export function ChartComment({ chartId, chartTitle, children }: ChartCommentProps) {
  const { getComment, updateComment, deleteComment } = useChartComments();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const comment = getComment(chartId);
  const hasComment = comment && comment.content.trim().length > 0;

  const handleStartEdit = () => {
    setEditContent(comment?.content || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editContent.trim()) {
      updateComment(chartId, editContent.trim());
    } else if (comment) {
      deleteComment(chartId);
    }
    setIsEditing(false);
    setEditContent('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent('');
  };

  const handleDelete = () => {
    deleteComment(chartId);
  };

  const renderCommentContent = () => {
    if (!hasComment && !isEditing) {
      return (
        <Card className={children ? "border-dashed border-gray-300 bg-white w-[400px] max-w-[90vw]" : "mt-4 border-dashed border-gray-300 bg-white"}>
          <CardContent className="p-4 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-gray-500">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">Add analysis comment for {chartTitle}</span>
              </div>
            </div>
            <Button
              variant={children ? "outline" : "ghost"}
              size="sm"
              onClick={handleStartEdit}
              className={children ? "w-full" : "text-gray-500 hover:text-gray-700"}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {children ? "Add Comment" : ""}
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (isEditing) {
      return (
        <Card className={children ? "border-blue-200 bg-blue-50 w-[400px] max-w-[90vw]" : "mt-4 border-blue-200 bg-blue-50"}>
          <CardContent className="p-4 pt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-700">
                <Edit3 className="h-4 w-4" />
                <span className="font-medium text-sm">Editing analysis for {chartTitle}</span>
              </div>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Add your analysis and insights about this chart..."
                className="min-h-[150px] resize-none border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white text-black"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className={children ? "border-green-200 bg-green-50 w-[400px] max-w-[90vw] max-h-[80vh] overflow-auto" : "mt-4 border-green-200 bg-green-50"}>
        <CardContent className="p-4 pt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-700">
                <MessageSquare className="h-4 w-4" />
                <span className="font-medium text-sm">Analysis for {chartTitle}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStartEdit}
                  className="text-green-600 hover:text-green-700 h-8 w-8 p-0"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {comment?.content}
            </div>
            {comment?.updatedAt && (
              <div className="text-xs text-gray-500">
                Last updated: {new Date(comment.updatedAt).toLocaleString()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // If children are provided, use the floating popover mode
  if (children) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="cursor-pointer hover:opacity-80 transition-opacity">
            {children}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 border-0 shadow-lg"
          side="top"
          align="center"
          sideOffset={10}
        >
          {renderCommentContent()}
        </PopoverContent>
      </Popover>
    );
  }

  // Otherwise, use the old inline mode
  return renderCommentContent();
}