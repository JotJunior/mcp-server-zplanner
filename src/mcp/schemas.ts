import { z } from 'zod';

export const CreateProjectSchema = z.object({
    name: z.string().describe('Name of the project')
});

export const AddPhaseSchema = z.object({
    phaseId: z.string().describe('Unique identifier for the phase'),
    name: z.string().describe('Name of the phase')
});

export const AddTaskSchema = z.object({
    phaseId: z.string().describe('ID of the phase to add the task to'),
    taskId: z.string().describe('Unique identifier for the task'),
    name: z.string().describe('Name of the task')
});

export const CompleteTaskSchema = z.object({
    phaseId: z.string().describe('ID of the phase containing the task'),
    taskId: z.string().describe('ID of the task to complete')
});

export const ListTasksSchema = z.object({}).describe('No parameters needed');

export const GetProgressSchema = z.object({}).describe('No parameters needed');

export const ExportHTMLSchema = z.object({}).describe('No parameters needed');
