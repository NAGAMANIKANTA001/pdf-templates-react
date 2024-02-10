import { API_URL } from "../constants";
import axios from "axios";
import { Template, TemplatePost, TemplateUpdate } from "../models/template";

const apiService = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAllTemplates = async () => {
    try {
        const response = await apiService.get<Template[]>('/templates');
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error fetching templates:', error);
        throw error;
    }
};

export const getTemplateById = async (id: string) => {
    try {
        const response = await apiService.get<Template>(`/templates/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching template with ID ${id}:`, error);
        throw error;
    }
};

export const createTemplate = async (templateData: TemplatePost) => {
    try {
        const response = await apiService.post<Template>('/templates', templateData);
        return response.data;
    } catch (error) {
        console.error('Error creating template:', error);
        throw error;
    }
};

export const updateTemplate = async (id: string, updatedData: TemplateUpdate) => {
    try {
        const response = await apiService.patch<Template>(`/templates/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error(`Error updating template with ID ${id}:`, error);
        throw error;
    }
};

export const deleteTemplate = async (id: string) => {
    try {
        const response = await apiService.delete<{ message: string }>(`/templates/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting template with ID ${id}:`, error);
        throw error;
    }
};