"use client"

import React, { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

export function ProjectList() {
  const { 
    projects, 
    addProject, 
    deleteProject, 
    updateProjectName, 
    setCurrentProject, 
    currentProject,
    loading,
    error 
  } = useProject();
  
  const [newProjectName, setNewProjectName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      await addProject(newProjectName.trim());
      setNewProjectName('');
    }
  };

  const handleStartEdit = (project: Project) => {
    setEditingId(project.id);
    setEditName(project.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (editName.trim()) {
      await updateProjectName(id, editName.trim());
    }
    setEditingId(null);
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4 p-4">
      <form onSubmit={handleAddProject} className="flex gap-2">
        <Input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="New Project Name"
          className="flex-1"
        />
        <Button type="submit">Add Project</Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => (
          <Card 
            key={project.id} 
            className={`p-4 ${currentProject?.id === project.id ? 'border-primary' : ''}`}
          >
            <div className="flex flex-col space-y-2">
              {editingId === project.id ? (
                <Input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => handleSaveEdit(project.id)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(project.id)}
                  autoFocus
                />
              ) : (
                <div className="flex items-center justify-between">
                  <h3 
                    className="text-lg font-semibold cursor-pointer hover:text-primary"
                    onClick={() => setCurrentProject(project)}
                  >
                    {project.name}
                  </h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStartEdit(project)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteProject(project.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
              <div className="text-sm text-gray-500">
                {project.images.length} images
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 