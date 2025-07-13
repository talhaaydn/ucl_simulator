import { Team } from "../../types/response.types";
import apiClient from "../config/axios.config";

export const getAllTeams = async (): Promise<Team[]> => {
    try {
        const response = await apiClient.get<{ data: Team[] }>('/teams');
        return response?.data?.data;
    } catch (error) {
        throw new Error('Error occurred while fetching teams');
    }
}