import { axiosClient, handleApiError } from "./axiosClient";

export const getAnimals = async () => {
  try {
    const { data } = await axiosClient.get(`/animals`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateAnimal = async (id:number, data:{
  "name": string,
  "arrivalDate": string,
  "dateOfBirth": string,
  "height": number,
  "weight": number,
  "description": string,
  "status": true,
  "speciesId": string | null,
  "dietId": string | null,
  "cageId": string | null,
  "trainingPlanId": string | null
}) => {
  try {
    const response = await axiosClient.put(`/animals/${id}`, {
      "name": data.name,
      "arrivalDate": data.arrivalDate,
      "dateOfBirth": data.dateOfBirth,
      "height": data.height,
      "weight": data.weight,
      "description": data.description,
      "status": data.status,
      "speciesId": data?.speciesId !== null ? +data.speciesId : null,
      "dietId": data?.dietId !== null ? +data.dietId : null,
      "cageId": data?.cageId !== null ? +data.cageId : null,
      "trainingPlanId": data?.trainingPlanId !== null ? +data.trainingPlanId : null,
    });
    return { error: null, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
}

export const createAnimal = async (data:{
  "name": string,
  "arrivalDate": string,
  "dateOfBirth": string,
  "height": number,
  "weight": number,
  "description": string,
  "status": true,
  "speciesId": string | null,
  "dietId": string | null,
  "cageId": string | null,
  "trainingPlanId": string | null
}) => {
  try {
    const response = await axiosClient.post(`/animals`, {
      "name": data.name,
      "arrivalDate": data.arrivalDate,
      "dateOfBirth": data.dateOfBirth,
      "height": data.height,
      "weight": data.weight,
      "description": data.description,
      "status": data.status,
      "speciesId": data?.speciesId !== null ? +data.speciesId : null,
      "dietId": data?.dietId !== null ? +data.dietId : null,
      "cageId": data?.cageId !== null ? +data.cageId : null,
      "trainingPlanId": data?.trainingPlanId !== null ? +data.trainingPlanId : null,
    });
    return { error: null, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
}

export const deleteAnimal = async (id:number) => {
  try {
    const response = await axiosClient.delete(`/animals/${id}`);
    return { error: null, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
}

export const getAnimalWithNoCage = async () => {
  try {
    const { data } = await axiosClient.get(`/animals/cageless`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
}

export const getAnimalWithCageId = async (id: number) => {
  try {
    const { data } = await axiosClient.get(`/animals/cage/${id}`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
}

export const assignAnimalsIntoCage = async (id: number, values: any[]) => {
  try {
    const { data } = await axiosClient.put(`/animals/cage/${id}`, values);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
}

export const unassignAnimalsIntoCage = async (values: any[]) => {
  try {
    const { data } = await axiosClient.put(`/animals/id`, values);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
}