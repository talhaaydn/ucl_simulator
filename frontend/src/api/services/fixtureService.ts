import { Fixture, Game,Group } from "../../types/response.types";
import apiClient from "../config/axios.config";

export const createFixture = async () => {
    try {
        const response = await apiClient.post('/fixtures');
        return response?.data;
    } catch (error) {
        throw new Error('Error occurred while creating fixture');
    }
}

export const getActiveFixture = async (): Promise<Fixture|null> => {
    try {
        const response = await apiClient.get<{ data: Fixture|null }>('/fixtures');
        return response?.data?.data;
    } catch (error) {
        throw new Error('Error occurred while fetching fixture');
    }
}

export const getFixtureGroups = async (fixtureId : number): Promise<Group[]> => {
    try {
        const response = await apiClient.get<{ data: Group[] }>(`/fixtures/${fixtureId}/groups`);
        return response?.data?.data;
    } catch (error) {
        throw new Error('Error occurred while fetching fixture');
    }
}

export const getFixtureGames = async (fixtureId : number): Promise<Game[]> => {
    try {
        const response = await apiClient.get<{ data: Game[] }>(`/fixtures/${fixtureId}/games`);
        return response?.data?.data;
    } catch (error) {
        throw new Error('Error occurred while fetching games');
    }
}

export const playActiveWeek = async (fixtureId : number) => {
    try {
        const response = await apiClient.get(`/fixtures/${fixtureId}/play-active-week`);
        return response?.data;
    } catch (error) {
        throw new Error('Error occurred while playing active week');
    }
}

export const playAllWeeks = async (fixtureId : number) => {
    try {
        const response = await apiClient.post(`/fixtures/${fixtureId}/play-all-weeks`);
        return response?.data;
    } catch (error) {
        throw new Error('Error occurred while playing all weeks');
    }
}

export const resetFixture = async (fixtureId: number) => {
    try {
        const response = await apiClient.delete(`/fixtures/${fixtureId}/reset`);
        return response?.data;
    } catch (error) {
        throw new Error('Error occurred while resetting fixture');
    }
}