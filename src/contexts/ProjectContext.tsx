"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project } from '../types/Project';
import { useUser } from './UserContext';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  addProject: (name: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateProjectName: (id: string, name: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  addImageToProject: (projectId: string, imagePath: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load projects from the server when user changes
  useEffect(() => {
    if (user) {
      loadProjects();
    } else {
      setProjects([]);
      setCurrentProject(null);
    }
  }, [user]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to load projects');
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (name: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error('Failed to create project');
      const newProject = await response.json();
      setProjects([...projects, newProject]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete project');
      setProjects(projects.filter(project => project.id !== id));
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  const updateProjectName = async (id: string, name: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error('Failed to update project');
      const updatedProject = await response.json();
      setProjects(projects.map(project => 
        project.id === id ? updatedProject : project
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  const addImageToProject = async (projectId: string, imagePath: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePath }),
      });
      if (!response.ok) throw new Error('Failed to add image to project');
      const updatedProject = await response.json();
      setProjects(projects.map(project =>
        project.id === projectId ? updatedProject : project
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add image to project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      addProject,
      deleteProject,
      updateProjectName,
      setCurrentProject,
      addImageToProject,
      loading,
      error
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
} 